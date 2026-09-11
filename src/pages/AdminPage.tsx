import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Wifi, LogOut, Search, Plus, Check, X,
  Shield, Building2, Menu, AlertCircle, Package, Palette
} from 'lucide-react';
import { adminApi, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, Badge, StatusDot, LoadingState, ErrorState, Modal } from '../components/ui';
import QRCardGenerator from '../components/QRCardGenerator';

interface Business {
  _id: string;
  name: string;
  slug: string;
  category: string;
  owner: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
  };
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  cardDesign?: {
    title?: string;
    subtitle?: string;
    colors?: { c1: string; c2: string; c3: string; c4: string };
  };
}

interface Stats {
  totalBusinesses: number;
  totalUsers: number;
  totalCards: number;
  totalOrders: number;
  totalScans: number;
  totalRevenue: number;
}

interface AdminCard {
  _id: string;
  cardId: string;
  label?: string;
  business: { _id: string; name: string } | null;
  destinationUrl: string;
  isActive: boolean;
  stats?: { totalScans: number };
  createdAt: string;
}

interface AdminOrder {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: Array<{ quantity: number; product?: { name: string } }>;
  customer?: { fullName: string; email: string };
  business?: { name: string };
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [search, setSearch] = useState('');
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsRes, businessesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getBusinesses(),
      ]);
      const [cardsRes, ordersRes] = await Promise.all([
        adminApi.getCards(),
        adminApi.getOrders(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data.stats);
      }

      if (businessesRes.success && businessesRes.data) {
        setBusinesses(businessesRes.data.businesses);
      }

      if (cardsRes.success && cardsRes.data) {
        setCards(cardsRes.data.cards);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data.orders);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load admin data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingState message="Loading admin panel..." />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm">Admin Panel</span>
              <p className="text-[10px] text-muted">TapReview</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-3">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'businesses', icon: Building2, label: 'Businesses' },
            { id: 'cards', icon: Wifi, label: 'Cards' },
            { id: 'orders', icon: Package, label: 'Orders' },
            { id: 'design', icon: Palette, label: 'Design & Print' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all ${
                activeSection === item.id 
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
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xs font-semibold text-white">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{user?.fullName || 'Admin'}</p>
              <p className="text-xs text-muted">Super Admin</p>
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
                <span className="font-semibold text-foreground text-sm">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
              <nav className="p-3">
                {[
                  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                  { id: 'businesses', icon: Building2, label: 'Businesses' },
                  { id: 'cards', icon: Wifi, label: 'Cards' },
                  { id: 'orders', icon: Package, label: 'Orders' },
                  { id: 'design', icon: Palette, label: 'Design & Print' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-1 ${
                      activeSection === item.id ? 'bg-accent/10 text-accent font-medium' : 'text-muted'
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
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="font-semibold text-foreground text-sm">Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xs font-semibold text-white">A</span>
          </div>
        </header>

        <div className="p-5 sm:p-8 max-w-7xl mx-auto animate-fade-in">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-error" />
              <p className="text-sm text-error flex-1">{error}</p>
              <button onClick={() => setError('')}>
                <X className="w-4 h-4 text-error" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-muted mb-1">Platform</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground capitalize">
                {activeSection}
              </h1>
            </div>
            {activeSection === 'businesses' && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                New Business
              </Button>
            )}
            {activeSection === 'cards' && (
              <Button
                variant="primary"
                onClick={() => setShowCreateCardModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                New Card
              </Button>
            )}
          </div>

          {/* Overview */}
          {activeSection === 'overview' && stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Businesses', value: stats.totalBusinesses, icon: Building2, color: 'text-info' },
                { label: 'Cards', value: stats.totalCards, icon: Wifi, color: 'text-accent' },
                { label: 'Total Scans', value: stats.totalScans.toLocaleString(), icon: LayoutDashboard, color: 'text-success' },
                { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: LayoutDashboard, color: 'text-warning' },
              ].map((stat, i) => (
                <Card key={i} className="p-5">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Businesses */}
          {activeSection === 'businesses' && (
            <div>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search businesses..."
                    className="input-premium pl-10"
                  />
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="bg-card border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-muted">Business</th>
                        <th className="text-left py-3 px-4 font-medium text-muted hidden sm:table-cell">Owner</th>
                        <th className="text-left py-3 px-4 font-medium text-muted hidden md:table-cell">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-muted">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses
                        .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
                        .map((biz) => (
                          <tr key={biz._id} className="border-b border-border hover:bg-card-hover transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-lg">
                                  {biz.category === 'restaurant' ? '🍽️' : biz.category === 'salon' ? '💇' : '🏪'}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{biz.name}</p>
                                  <p className="text-xs text-muted">/{biz.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <p className="text-foreground">{biz.owner.fullName}</p>
                              <p className="text-xs text-muted">{biz.owner.email}</p>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <Badge>
                                {biz.category}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={biz.isActive && !biz.isSuspended ? 'success' : 'error'}>
                                <StatusDot status={biz.isActive && !biz.isSuspended ? 'active' : 'suspended'} />
                                {biz.isActive && !biz.isSuspended ? 'Active' : 'Suspended'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Cards */}
          {activeSection === 'orders' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="bg-card border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-muted">Request</th>
                      <th className="text-left py-3 px-4 font-medium text-muted">Business</th>
                      <th className="text-left py-3 px-4 font-medium text-muted hidden sm:table-cell">Cards</th>
                      <th className="text-left py-3 px-4 font-medium text-muted">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <OrderRow key={order._id} order={order} onUpdated={fetchData} onError={setError} />
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No card requests</h3>
                    <p className="text-muted">Business card purchase requests will appear here.</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Cards */}
          {activeSection === 'design' && (
            <div>
              {businesses.some((business) => cards.some((card) => card.business?._id === business._id)) ? (
                <QRCardGenerator
                  businesses={businesses.flatMap((business) => {
                    const businessCard = cards.find((card) => card.business?._id === business._id);
                    return businessCard ? [{
                      id: business._id,
                      cardId: businessCard.cardId,
                      name: business.name,
                      slug: business.slug,
                      design: business.cardDesign,
                    }] : [];
                  })}
                  onSaveDesign={async (businessId, design) => {
                    await adminApi.updateBusinessCardDesign(businessId, design);
                    await fetchData();
                  }}
                />
              ) : (
                <Card className="p-12 text-center">
                  <Palette className="w-12 h-12 text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No printable cards yet</h3>
                  <p className="text-muted">Assign a card to a business before creating its QR design.</p>
                </Card>
              )}
            </div>
          )}

          {/* Cards */}
          {activeSection === 'cards' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="bg-card border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-muted">Card</th>
                      <th className="text-left py-3 px-4 font-medium text-muted">Business</th>
                      <th className="text-left py-3 px-4 font-medium text-muted hidden md:table-cell">Destination</th>
                      <th className="text-left py-3 px-4 font-medium text-muted hidden sm:table-cell">Scans</th>
                      <th className="text-left py-3 px-4 font-medium text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card) => (
                      <tr key={card._id} className="border-b border-border hover:bg-card-hover transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{card.label || 'Unlabeled card'}</p>
                          <p className="text-xs text-muted font-mono">{card.cardId}</p>
                        </td>
                        <td className="py-3 px-4 text-foreground">{card.business?.name || 'Unassigned'}</td>
                        <td className="py-3 px-4 hidden md:table-cell max-w-xs truncate text-muted">{card.destinationUrl}</td>
                        <td className="py-3 px-4 hidden sm:table-cell text-foreground">{card.stats?.totalScans || 0}</td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await adminApi.updateCard(card._id, { isActive: !card.isActive });
                                await fetchData();
                              } catch (err) {
                                setError(err instanceof ApiError ? err.message : 'Failed to update card');
                              }
                            }}
                            title={card.isActive ? 'Deactivate card' : 'Activate card'}
                          >
                            <Badge variant={card.isActive ? 'success' : 'error'}>
                              <StatusDot status={card.isActive ? 'active' : 'suspended'} />
                              {card.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cards.length === 0 && (
                  <div className="p-12 text-center">
                    <Wifi className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No cards yet</h3>
                    <p className="text-muted">Create a card and assign it to a business.</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Create Business Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateBusinessModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchData();
            }}
          />
        )}
        {showCreateCardModal && (
          <CreateCardModal
            businesses={businesses}
            onClose={() => setShowCreateCardModal(false)}
            onSuccess={() => {
              setShowCreateCardModal(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Create Business Modal Component
function OrderRow({
  order,
  onUpdated,
  onError,
}: {
  order: AdminOrder;
  onUpdated: () => void;
  onError: (message: string) => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [saving, setSaving] = useState(false);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await adminApi.updateOrderStatus(order._id, { status, trackingNumber: trackingNumber || undefined });
      onUpdated();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="border-b border-border hover:bg-card-hover transition-colors">
      <td className="py-3 px-4">
        <p className="font-medium text-foreground">{order.orderNumber}</p>
        <p className="text-xs text-muted">{order.customer?.email || 'Business request'}</p>
      </td>
      <td className="py-3 px-4 text-foreground">{order.business?.name || 'Unassigned'}</td>
      <td className="py-3 px-4 hidden sm:table-cell text-foreground">
        {order.items.reduce((total, item) => total + item.quantity, 0)}
      </td>
      <td className="py-3 px-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-premium py-1.5 text-xs min-w-30">
          <option value="pending">Pending</option>
          <option value="processing">Approved</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {status === 'shipped' && (
          <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking number" className="input-premium mt-2 py-1.5 text-xs min-w-30" />
        )}
      </td>
      <td className="py-3 px-4">
        <Button type="button" size="sm" variant="secondary" loading={saving} onClick={updateStatus}>Save</Button>
      </td>
    </tr>
  );
}

function CreateBusinessModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    businessName: '',
    category: 'restaurant',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ username: string; password: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminApi.createBusiness(formData);
      
      if (response.success && response.data) {
        setCreated(response.data.credentials);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create business');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Business" size="lg">
      {!created ? (
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="joesrestaurant"
                required
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="TempPass123!"
                required
                minLength={6}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="joe@example.com"
              required
            />

            <Input
              label="Owner Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Joe Smith"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Business Name"
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Joe's Restaurant"
                required
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-premium"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="salon">Salon</option>
                  <option value="hotel">Hotel</option>
                  <option value="shop">Shop</option>
                  <option value="clinic">Clinic</option>
                  <option value="gym">Gym</option>
                  <option value="barber">Barber</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                Create Business
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Business Created!</h2>
          <p className="text-muted mb-5">Share these credentials with the business owner:</p>
          
          <div className="p-4 rounded-xl bg-card border border-border space-y-2.5 text-left mb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Username</span>
              <code className="text-sm font-mono font-semibold text-foreground">{created.username}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Password</span>
              <code className="text-sm font-mono font-semibold text-foreground">{created.password}</code>
            </div>
          </div>

          <p className="text-xs text-muted">
            Closing in 3 seconds...
          </p>
        </div>
      )}
    </Modal>
  );
}

function CreateCardModal({
  businesses,
  onClose,
  onSuccess,
}: {
  businesses: Business[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    cardId: '',
    businessId: businesses[0]?._id || '',
    label: '',
    destinationUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminApi.createCard({
        cardId: formData.cardId,
        businessId: formData.businessId,
        label: formData.label || undefined,
        destinationUrl: formData.destinationUrl,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Card" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        <Input
          label="Card ID"
          value={formData.cardId}
          onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
          placeholder="tap-card-001"
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Business</label>
          <select
            value={formData.businessId}
            onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
            className="input-premium"
            required
          >
            <option value="" disabled>Select a business</option>
            {businesses.map((business) => (
              <option key={business._id} value={business._id}>{business.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="Front counter"
        />

        <Input
          label="Destination URL"
          type="url"
          value={formData.destinationUrl}
          onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
          placeholder="https://g.page/your-business/review"
          required
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="flex-1" disabled={!businesses.length}>
            Create Card
          </Button>
        </div>
        {!businesses.length && (
          <p className="text-xs text-muted">Create a business before assigning a card.</p>
        )}
      </form>
    </Modal>
  );
}
