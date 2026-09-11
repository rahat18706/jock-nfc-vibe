import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wifi, Edit3, Check, X, Menu, LogOut,
  TrendingUp, Clock, AlertCircle, Copy, ExternalLink
} from 'lucide-react';
import { businessApi, analyticsApi, ApiError } from '../lib/api';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [businessRes, cardsRes, statsRes] = await Promise.all([
        businessApi.getMyBusiness(),
        businessApi.getMyCards(),
        analyticsApi.getOverview(),
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
