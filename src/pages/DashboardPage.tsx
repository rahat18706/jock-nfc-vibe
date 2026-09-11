import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wifi, Edit3, Check, X, Menu, LogOut,
  TrendingUp, Clock, AlertCircle, Copy, ExternalLink, Package
} from 'lucide-react';
import { businessApi, analyticsApi, orderApi, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, Badge, StatusDot, NFCCard, LoadingState, ErrorState, EmptyState, Modal } from '../components/ui';

interface Business {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
}

interface CardType {
  _id: string;
  cardId: string;
  label: string;
  destinationUrl: string;
  isActive: boolean;
  stats?: {
    totalScans: number;
    todayScans: number;
  };
}

interface Stats {
  totalScans: number;
  todayScans: number;
  weekScans: number;
  uniqueVisitors: number;
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

interface OrderType {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  trackingNumber?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [requestData, setRequestData] = useState({
    productId: '',
    quantity: 1,
    fullName: user?.fullName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [businessRes, cardsRes, statsRes, ordersRes, productsRes] = await Promise.all([
        businessApi.getMyBusiness(),
        businessApi.getMyCards(),
        analyticsApi.getOverview(),
        orderApi.getMyOrders(),
        orderApi.getProducts(),
      ]);

      if (businessRes.success && businessRes.data) {
        setBusiness(businessRes.data.business);
      }

      if (cardsRes.success && cardsRes.data) {
        setCards(cardsRes.data.cards);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data.orders);
      }

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.products);
        if (!requestData.productId && productsRes.data.products[0]) {
          setRequestData((current) => ({ ...current, productId: productsRes.data.products[0]._id }));
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setRequesting(true);
    setError('');
    try {
      await orderApi.createOrder({
        items: [{
          product: requestData.productId,
          quantity: requestData.quantity,
          customization: { businessName: business?.name },
        }],
        shippingAddress: {
          fullName: requestData.fullName,
          street: requestData.street,
          city: requestData.city,
          state: requestData.state,
          zipCode: requestData.zipCode,
          country: 'US',
        },
      });
      setSuccess('Card request sent to admin for approval');
      setActiveTab('requests');
      await fetchData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit card request');
    } finally {
      setRequesting(false);
    }
  };

  const handleUpdateDestination = async (cardId: string) => {
    if (!newUrl) return;
    
    try {
      const url = new URL(newUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setError('Only HTTP and HTTPS URLs are allowed');
        return;
      }
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const response = await businessApi.updateCardDestination(cardId, newUrl);
      
      if (response.success) {
        setSuccess('Destination updated successfully');
        setEditingCard(null);
        setNewUrl('');
        
        const cardsRes = await businessApi.getMyCards();
        if (cardsRes.success && cardsRes.data) {
          setCards(cardsRes.data.cards);
        }
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update destination');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (error && !business) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-accent" />
            </div>
            <span className="font-semibold text-foreground">TapReview</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-3">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'cards', icon: Wifi, label: 'My Cards' },
            { id: 'requests', icon: Package, label: 'Card Requests' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all ${
                activeTab === item.id 
                  ? 'bg-accent/10 text-accent font-medium border border-accent/20' 
                  : 'text-muted hover:bg-card-hover hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-accent">
                {user?.fullName?.[0] || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {business?.name || 'Business'}
              </p>
              <p className="text-xs text-muted truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-error rounded-lg hover:bg-card-hover transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-foreground">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
              <nav className="p-3">
                {[
                  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                  { id: 'cards', icon: Wifi, label: 'My Cards' },
                  { id: 'requests', icon: Package, label: 'Card Requests' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-1 ${
                      activeTab === item.id ? 'bg-accent/10 text-accent font-medium' : 'text-muted'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-5 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-semibold text-foreground text-sm">TapReview</span>
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-accent">
              {user?.fullName?.[0] || 'U'}
            </span>
          </div>
        </header>

        <div className="p-5 sm:p-8 max-w-6xl mx-auto">
          {/* Success Banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-success" />
                <p className="text-sm text-success">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          {error && business && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-error" />
              <p className="text-sm text-error flex-1">{error}</p>
              <button onClick={() => setError('')}>
                <X className="w-4 h-4 text-error" />
              </button>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <p className="text-sm text-muted mb-2">Good morning</p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                  {business?.name}
                </h1>
                <Badge variant={business?.isActive ? 'success' : 'error'}>
                  <StatusDot status={business?.isActive ? 'active' : 'suspended'} />
                  {business?.isActive ? 'Active' : 'Suspended'}
                </Badge>
              </div>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Scans', value: stats.totalScans, icon: TrendingUp },
                    { label: 'Today', value: stats.todayScans, icon: Clock },
                    { label: 'This Week', value: stats.weekScans, icon: TrendingUp },
                    { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: TrendingUp },
                  ].map((stat, i) => (
                    <Card key={i} className="p-5">
                      <stat.icon className="w-5 h-5 text-accent mb-3" />
                      <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                      <p className="text-sm text-muted">{stat.label}</p>
                    </Card>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Your Cards</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('cards')}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-card-hover transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5 text-accent" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">Manage NFC Cards</p>
                        <p className="text-sm text-muted">View and update card destinations</p>
                      </div>
                    </div>
                    <span className="text-muted group-hover:text-accent transition-colors">→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-accent" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">Request NFC Cards</p>
                        <p className="text-sm text-muted">Order cards and track admin approval</p>
                      </div>
                    </div>
                    <span className="text-muted group-hover:text-accent transition-colors">→</span>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Cards Tab */}
          {activeTab === 'cards' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                  Your Cards
                </h1>
                <p className="text-muted">
                  Manage your NFC cards and change destination URLs.
                </p>
              </div>

              {cards.length === 0 ? (
                <EmptyState
                  icon={<Wifi className="w-6 h-6 text-muted" />}
                  title="No cards yet"
                  description="Cards assigned to your business will appear here."
                />
              ) : (
                <div className="grid gap-4">
                  {cards.map((card) => (
                    <NFCCard
                      key={card._id}
                      cardId={card.cardId}
                      label={card.label}
                      status={card.isActive ? 'active' : 'suspended'}
                      destinationUrl={card.destinationUrl}
                      totalScans={card.stats?.totalScans}
                      todayScans={card.stats?.todayScans}
                      onEdit={() => {
                        setEditingCard(card._id);
                        setNewUrl(card.destinationUrl);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                  Card Requests
                </h1>
                <p className="text-muted">Request NFC cards and follow approval and shipping progress.</p>
              </div>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Request new cards</h2>
                {products.length === 0 ? (
                  <p className="text-sm text-muted">No card packages are available yet.</p>
                ) : (
                  <form onSubmit={handleCardRequest} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Package</label>
                        <select
                          value={requestData.productId}
                          onChange={(e) => setRequestData({ ...requestData, productId: e.target.value })}
                          className="input-premium"
                          required
                        >
                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name} - ${product.price}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Quantity"
                        type="number"
                        min={1}
                        value={requestData.quantity}
                        onChange={(e) => setRequestData({ ...requestData, quantity: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Full Name" value={requestData.fullName} onChange={(e) => setRequestData({ ...requestData, fullName: e.target.value })} required />
                      <Input label="Street Address" value={requestData.street} onChange={(e) => setRequestData({ ...requestData, street: e.target.value })} required />
                      <Input label="City" value={requestData.city} onChange={(e) => setRequestData({ ...requestData, city: e.target.value })} required />
                      <Input label="State" value={requestData.state} onChange={(e) => setRequestData({ ...requestData, state: e.target.value })} required />
                      <Input label="ZIP Code" value={requestData.zipCode} onChange={(e) => setRequestData({ ...requestData, zipCode: e.target.value })} required />
                    </div>
                    <Button type="submit" variant="primary" loading={requesting} icon={<Package className="w-4 h-4" />}>
                      Send Request to Admin
                    </Button>
                  </form>
                )}
              </Card>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Request history</h2>
                {orders.length === 0 ? (
                  <EmptyState icon={<Package className="w-6 h-6 text-muted" />} title="No requests yet" description="Your card requests and shipping updates will appear here." />
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Card key={order._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{order.orderNumber}</p>
                          <p className="text-sm text-muted">${order.total.toFixed(2)} - {new Date(order.createdAt).toLocaleDateString()}</p>
                          {order.trackingNumber && <p className="text-xs text-muted mt-1">Tracking: {order.trackingNumber}</p>}
                        </div>
                        <Badge variant={order.status === 'cancelled' ? 'error' : order.status === 'delivered' ? 'success' : 'default'}>
                          {order.status === 'processing' ? 'Approved' : order.status}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Destination Modal */}
      <Modal
        isOpen={!!editingCard}
        onClose={() => {
          setEditingCard(null);
          setNewUrl('');
        }}
        title="Change Destination"
      >
        <div className="p-6">
          <p className="text-sm text-muted mb-4">
            Where should this card send customers?
          </p>
          
          <div className="space-y-4">
            <Input
              label="Destination URL"
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://g.page/r/your-business"
            />
            
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingCard(null);
                  setNewUrl('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => editingCard && handleUpdateDestination(editingCard)}
                loading={saving}
                className="flex-1"
              >
                Save Destination
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
