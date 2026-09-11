import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wifi, Edit3, Check, X, Copy, Menu, LogOut,
  TrendingUp, Clock, AlertCircle
} from 'lucide-react';
import { businessApi, analyticsApi, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Business {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
}

interface Card {
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
  const [copied, setCopied] = useState('');
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
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
        setSuccess('Destination URL updated successfully!');
        setEditingCard(null);
        setNewUrl('');
        
        const cardsRes = await businessApi.getMyCards();
        if (cardsRes.success && cardsRes.data) {
          setCards(cardsRes.data.cards);
        }
        
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update destination URL');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink"></div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-ink mb-2">Error Loading Dashboard</h2>
          <p className="text-stone-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-5 py-2.5 bg-ink text-white rounded-xl font-medium hover:bg-ink-light"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-stone-200/50 sticky top-0 h-screen">
        <div className="p-5 border-b border-stone-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-ink">tapreview</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-3">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'cards', icon: Wifi, label: 'NFC Cards' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all ${
                activeTab === item.id 
                  ? 'bg-ink text-white font-medium' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-ink'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-accent">
                {user?.fullName?.[0] || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {business?.name || 'Business'}
              </p>
              <p className="text-xs text-stone-400 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
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
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white"
            >
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <span className="font-semibold text-ink">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3">
                {[
                  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                  { id: 'cards', icon: Wifi, label: 'NFC Cards' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-0.5 ${
                      activeTab === item.id ? 'bg-ink text-white font-medium' : 'text-stone-600'
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
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 px-5 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-ink" />
          </button>
          <span className="font-semibold text-ink text-sm">tapreview</span>
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-accent">
              {user?.fullName?.[0] || 'U'}
            </span>
          </div>
        </header>

        <div className="p-5 sm:p-8 max-w-6xl mx-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          {/* Success Banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">
                Dashboard
              </h1>
              <p className="text-stone-500 mb-8">
                Welcome back. Here's what's happening with {business?.name}.
              </p>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Scans', value: stats.totalScans, icon: TrendingUp },
                    { label: 'Today', value: stats.todayScans, icon: Clock },
                    { label: 'This Week', value: stats.weekScans, icon: TrendingUp },
                    { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: TrendingUp },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-stone-200 p-5">
                      <stat.icon className="w-5 h-5 text-stone-400 mb-3" />
                      <p className="text-2xl font-semibold text-ink">{stat.value}</p>
                      <p className="text-sm text-stone-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-ink mb-4">Quick Actions</h2>
                <button
                  onClick={() => setActiveTab('cards')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-ink transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-ink" />
                    <div className="text-left">
                      <p className="font-medium text-ink">Manage NFC Cards</p>
                      <p className="text-sm text-stone-500">View and update card destinations</p>
                    </div>
                  </div>
                  <span className="text-stone-400">→</span>
                </button>
              </div>
            </div>
          )}

          {/* Cards Tab */}
          {activeTab === 'cards' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">
                NFC Cards
              </h1>
              <p className="text-stone-500 mb-8">
                Manage your NFC cards and change destination URLs.
              </p>

              {cards.length === 0 ? (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                  <Wifi className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-ink mb-2">No Cards Yet</h3>
                  <p className="text-stone-500">
                    Contact admin to get NFC cards assigned to your business.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cards.map((card) => (
                    <div key={card._id} className="bg-white rounded-xl border border-stone-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-ink">{card.label}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              card.isActive 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {card.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <span>Card ID:</span>
                            <code className="px-2 py-0.5 bg-stone-100 rounded text-xs">
                              {card.cardId}
                            </code>
                            <button
                              onClick={() => handleCopy(card.cardId, card._id)}
                              className="text-stone-400 hover:text-ink"
                            >
                              {copied === card._id ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEditingCard(editingCard === card._id ? null : card._id);
                            setNewUrl(card.destinationUrl);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ink bg-stone-100 rounded-lg hover:bg-stone-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit URL
                        </button>
                      </div>

                      <div className="text-sm text-stone-600 mb-3">
                        <span className="text-stone-400">Destination: </span>
                        <span className="break-all">{card.destinationUrl}</span>
                      </div>

                      {card.stats && (
                        <div className="flex items-center gap-4 text-xs text-stone-400">
                          <span>{card.stats.totalScans} total scans</span>
                          <span>{card.stats.todayScans} today</span>
                        </div>
                      )}

                      {/* Edit Form */}
                      <AnimatePresence>
                        {editingCard === card._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-stone-100"
                          >
                            <label className="text-sm font-medium text-ink block mb-2">
                              New Destination URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="https://g.page/r/your-review-link"
                                className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none"
                              />
                              <button
                                onClick={() => handleUpdateDestination(card._id)}
                                disabled={saving}
                                className="px-5 py-2.5 bg-ink text-white rounded-lg font-medium disabled:opacity-50"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={() => setEditingCard(null)}
                                className="px-3 py-2.5 text-stone-400 hover:text-ink"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
