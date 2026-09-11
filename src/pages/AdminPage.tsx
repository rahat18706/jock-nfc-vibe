import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Wifi, LogOut, Search, Plus, Check, X,
  Shield, Building2, Menu, AlertCircle
} from 'lucide-react';
import { adminApi, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';

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
}

interface Stats {
  totalBusinesses: number;
  totalUsers: number;
  totalCards: number;
  totalOrders: number;
  totalScans: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
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

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data.stats);
      }

      if (businessesRes.success && businessesRes.data) {
        setBusinesses(businessesRes.data.businesses);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-ink text-white sticky top-0 h-screen">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm">Admin Panel</span>
              <p className="text-[10px] text-white/40">tapreview</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-3">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'businesses', icon: Building2, label: 'Businesses' },
            { id: 'cards', icon: Wifi, label: 'NFC Cards' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all ${
                activeSection === item.id 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xs font-semibold text-white">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.fullName || 'Admin'}</p>
              <p className="text-xs text-white/40">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-red-400 rounded-lg hover:bg-white/5"
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-72 bg-ink"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              <nav className="p-3">
                {[
                  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                  { id: 'businesses', icon: Building2, label: 'Businesses' },
                  { id: 'cards', icon: Wifi, label: 'NFC Cards' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-0.5 ${
                      activeSection === item.id ? 'bg-white/10 text-white font-medium' : 'text-white/50'
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
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-ink" />
            <span className="font-semibold text-ink text-sm">Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xs font-semibold text-white">A</span>
          </div>
        </header>

        <div className="p-5 sm:p-8 max-w-7xl mx-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink capitalize">
                {activeSection}
              </h1>
              <p className="text-stone-500 mt-1 text-sm">
                {activeSection === 'overview' && 'Platform overview and key metrics.'}
                {activeSection === 'businesses' && 'Manage all business accounts.'}
                {activeSection === 'cards' && 'View and manage all NFC cards.'}
              </p>
            </div>
            {activeSection === 'businesses' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-xl font-medium hover:bg-ink-light"
              >
                <Plus className="w-4 h-4" />
                New Business
              </button>
            )}
          </div>

          {/* Overview */}
          {activeSection === 'overview' && stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Businesses', value: stats.totalBusinesses, icon: Building2, color: 'bg-blue-50 text-blue-600' },
                { label: 'NFC Cards', value: stats.totalCards, icon: Wifi, color: 'bg-purple-50 text-purple-600' },
                { label: 'Total Scans', value: stats.totalScans.toLocaleString(), icon: LayoutDashboard, color: 'bg-green-50 text-green-600' },
                { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: LayoutDashboard, color: 'bg-accent-soft text-accent' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-5">
                  <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-semibold text-ink">{stat.value}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Businesses */}
          {activeSection === 'businesses' && (
            <div>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search businesses..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:border-ink outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-stone-500">Business</th>
                        <th className="text-left py-3 px-4 font-medium text-stone-500">Owner</th>
                        <th className="text-left py-3 px-4 font-medium text-stone-500">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-stone-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses
                        .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
                        .map((biz) => (
                          <tr key={biz._id} className="border-b border-stone-100 hover:bg-stone-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-lg">
                                  {biz.category === 'restaurant' ? '🍽️' : biz.category === 'salon' ? '💇' : '🏪'}
                                </div>
                                <div>
                                  <p className="font-medium text-ink">{biz.name}</p>
                                  <p className="text-xs text-stone-400">/{biz.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-ink">{biz.owner.fullName}</p>
                              <p className="text-xs text-stone-400">{biz.owner.email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600 capitalize">
                                {biz.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                biz.isActive && !biz.isSuspended
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {biz.isActive && !biz.isSuspended ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Cards */}
          {activeSection === 'cards' && (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
              <Wifi className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">Card Management</h3>
              <p className="text-stone-500">
                Card management interface coming soon.
              </p>
            </div>
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
      </AnimatePresence>
    </div>
  );
}

// Create Business Modal Component
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {!created ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-ink">Create Business</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-500 block mb-1.5">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="joesrestaurant"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 block mb-1.5">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="TempPass123!"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joe@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1.5">Owner Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Joe Smith"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-500 block mb-1.5">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Joe's Restaurant"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 block mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-ink outline-none text-sm"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-ink text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Business'}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-ink mb-1">Business Created!</h2>
            <p className="text-stone-500 mb-5">Share these credentials with the business owner:</p>
            
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-left mb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Username</span>
                <code className="text-sm font-mono font-semibold text-ink">{created.username}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Password</span>
                <code className="text-sm font-mono font-semibold text-ink">{created.password}</code>
              </div>
            </div>

            <p className="text-xs text-stone-400">
              Closing in 3 seconds...
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
