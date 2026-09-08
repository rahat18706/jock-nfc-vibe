import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, BarChart3, Settings, LogOut,
  Wifi, Search, Plus, Check, X, Shield, Building2, Eye, Trash2,
  Ban, CheckCircle, Menu, ArrowRight, Copy
} from 'lucide-react';
import { adminStats, allBusinesses } from '../data/mockData';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [created, setCreated] = useState<{username: string, password: string} | null>(null);
  const [newBiz, setNewBiz] = useState({
    username: '', password: '', email: '', fullName: '', businessName: '', category: 'restaurant'
  });

  const handleCreate = () => {
    setCreated({ username: newBiz.username, password: newBiz.password });
    setNewBiz({ username: '', password: '', email: '', fullName: '', businessName: '', category: 'restaurant' });
  };

  const handleLogout = () => navigate('/login');

  const filteredBusinesses = allBusinesses.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'businesses', icon: Building2, label: 'Businesses' },
    { id: 'cards', icon: Wifi, label: 'NFC Cards' },
    { id: 'orders', icon: CreditCard, label: 'Orders' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar - Desktop */}
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
          {navItems.map((item) => (
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
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-white/40">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-72 bg-ink"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-white/60"><X className="w-5 h-5" /></button>
              </div>
              <nav className="p-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-0.5 transition-all ${
                      activeSection === item.id ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5'
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
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink capitalize">
                {activeSection}
              </h1>
              <p className="text-stone-500 mt-1 text-sm">
                {activeSection === 'overview' && 'Platform overview and key metrics.'}
                {activeSection === 'businesses' && 'Manage all business accounts.'}
                {activeSection === 'cards' && 'View and manage all NFC cards.'}
                {activeSection === 'orders' && 'Track all orders and payments.'}
                {activeSection === 'users' && 'Manage user accounts.'}
                {activeSection === 'analytics' && 'Platform-wide analytics.'}
                {activeSection === 'settings' && 'System configuration.'}
              </p>
            </div>
            {activeSection === 'businesses' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium self-start"
              >
                <span className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> New Business
                </span>
              </button>
            )}
          </div>

          {/* Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Businesses', value: adminStats.totalBusinesses, icon: Building2, color: 'bg-blue-50 text-blue-600' },
                  { label: 'NFC Cards', value: adminStats.totalCards, icon: Wifi, color: 'bg-purple-50 text-purple-600' },
                  { label: 'Revenue', value: `$${adminStats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'bg-green-50 text-green-600' },
                  { label: 'Total Scans', value: adminStats.totalScans.toLocaleString(), icon: BarChart3, color: 'bg-accent-soft text-accent' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="premium-card p-4 sm:p-5"
                  >
                    <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold text-ink">{stat.value}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="premium-card p-5 sm:p-6">
                <h3 className="font-semibold text-ink mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {[
                    { id: 'TR-847291', business: 'ABC Restaurant', status: 'delivered', total: '$79' },
                    { id: 'TR-623847', business: 'Sunrise Cafe', status: 'shipped', total: '$29' },
                    { id: 'TR-519283', business: 'Elite Gym', status: 'processing', total: '$199' },
                    { id: 'TR-482917', business: 'Bella Salon', status: 'paid', total: '$79' },
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                          <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{order.id}</p>
                          <p className="text-xs text-stone-400">{order.business}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge text-[10px] ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'processing' ? 'bg-amber-50 text-amber-700' :
                          'bg-stone-100 text-stone-600'
                        }`}>{order.status}</span>
                        <span className="text-sm font-medium text-ink">{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Businesses */}
          {activeSection === 'businesses' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search businesses..."
                  className="input-premium pl-11"
                />
              </div>

              <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-left py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Business</th>
                        <th className="text-left py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider hidden sm:table-cell">Owner</th>
                        <th className="text-left py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBusinesses.map((biz) => (
                        <tr key={biz.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-lg flex-shrink-0">
                                {biz.logo}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-ink truncate">{biz.name}</p>
                                <p className="text-xs text-stone-400 truncate">/{biz.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <p className="text-stone-600 truncate max-w-[150px]">{biz.address}</p>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <span className="badge bg-stone-100 text-stone-600 capitalize">{biz.category}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge ${biz.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${biz.active ? 'bg-green-500' : 'bg-red-500'}`} />
                              {biz.active ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-ink transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors">
                                <Ban className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {!['overview', 'businesses'].includes(activeSection) && (
            <div className="premium-card p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                {activeSection === 'cards' && <Wifi className="w-5 h-5 text-stone-400" />}
                {activeSection === 'orders' && <CreditCard className="w-5 h-5 text-stone-400" />}
                {activeSection === 'users' && <Users className="w-5 h-5 text-stone-400" />}
                {activeSection === 'analytics' && <BarChart3 className="w-5 h-5 text-stone-400" />}
                {activeSection === 'settings' && <Settings className="w-5 h-5 text-stone-400" />}
              </div>
              <h3 className="font-semibold text-ink mb-1">{activeSection}</h3>
              <p className="text-sm text-stone-400">This section is available in the full version.</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Business Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowCreateModal(false); setCreated(null); }}
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
                    <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 mb-5">
                    <p className="text-xs text-amber-700">
                      <strong>Important:</strong> You are setting the username and password. Share these credentials securely with the business owner.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Username</label>
                        <input
                          type="text"
                          value={newBiz.username}
                          onChange={(e) => setNewBiz({...newBiz, username: e.target.value})}
                          placeholder="abc-restaurant"
                          className="input-premium text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Password</label>
                        <input
                          type="text"
                          value={newBiz.password}
                          onChange={(e) => setNewBiz({...newBiz, password: e.target.value})}
                          placeholder="Set password"
                          className="input-premium text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500 block mb-1.5">Email</label>
                      <input
                        type="email"
                        value={newBiz.email}
                        onChange={(e) => setNewBiz({...newBiz, email: e.target.value})}
                        placeholder="owner@business.com"
                        className="input-premium text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500 block mb-1.5">Owner Name</label>
                      <input
                        type="text"
                        value={newBiz.fullName}
                        onChange={(e) => setNewBiz({...newBiz, fullName: e.target.value})}
                        placeholder="John Smith"
                        className="input-premium text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Business Name</label>
                        <input
                          type="text"
                          value={newBiz.businessName}
                          onChange={(e) => setNewBiz({...newBiz, businessName: e.target.value})}
                          placeholder="ABC Restaurant"
                          className="input-premium text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Category</label>
                        <select
                          value={newBiz.category}
                          onChange={(e) => setNewBiz({...newBiz, category: e.target.value})}
                          className="input-premium text-sm"
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
                      onClick={handleCreate}
                      className="w-full btn-primary py-3 rounded-xl font-medium mt-2"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Create Account <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-ink mb-1">Account Created!</h2>
                  <p className="text-sm text-stone-500 mb-5">Share these credentials with the business owner:</p>
                  
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-left mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400">Username</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-semibold text-ink">{created.username}</code>
                        <button onClick={() => navigator.clipboard.writeText(created.username)} className="text-stone-400 hover:text-ink">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400">Password</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-semibold text-ink">{created.password}</code>
                        <button onClick={() => navigator.clipboard.writeText(created.password)} className="text-stone-400 hover:text-ink">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400">Login URL</span>
                      <code className="text-sm font-mono text-accent">tapreview.com/login</code>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowCreateModal(false); setCreated(null); }}
                    className="w-full btn-primary py-3 rounded-xl font-medium"
                  >
                    <span>Done</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
