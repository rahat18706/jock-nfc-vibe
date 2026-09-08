import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, CreditCard, Settings, LogOut,
  Wifi, TrendingUp, Globe, Smartphone, Edit3, Check, X,
  Clock, Copy, Menu, ArrowRight, QrCode, AlertCircle
} from 'lucide-react';
import { mockBusiness, mockCards, mockScans } from '../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState('');

  const stats = {
    totalScans: 12482,
    todayScans: 47,
    weekScans: 892,
    uniqueVisitors: 8291,
  };

  const handleUpdateDestination = (cardId: string) => {
    if (!newUrl) return;
    try {
      const url = new URL(newUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        alert('Only HTTP and HTTPS URLs are allowed');
        return;
      }
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSuccess('Destination URL updated! NFC card now redirects to new URL instantly.');
      setEditingCard(null);
      setNewUrl('');
      setSaving(false);
      setTimeout(() => setSuccess(''), 5000);
    }, 1000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleLogout = () => navigate('/login');

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'cards', icon: Wifi, label: 'NFC Cards' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'orders', icon: CreditCard, label: 'Orders' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar - Desktop */}
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
          {navItems.map((item) => (
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
              <span className="text-xs font-semibold text-accent">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{mockBusiness.name}</p>
              <p className="text-xs text-stone-400 truncate">owner@{mockBusiness.slug}.com</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white"
            >
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <span className="font-semibold text-ink">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
              </div>
              <nav className="p-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-0.5 transition-all ${
                      activeTab === item.id ? 'bg-ink text-white font-medium' : 'text-stone-600 hover:bg-stone-50'
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
          <span className="font-semibold text-ink text-sm">tapreview</span>
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-accent">A</span>
          </div>
        </header>

        <div className="p-5 sm:p-8 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'cards' && 'NFC Cards'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'orders' && 'Orders'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-stone-500 mt-1 text-sm">
              {activeTab === 'overview' && `Welcome back. Here's what's happening with ${mockBusiness.name}.`}
              {activeTab === 'cards' && 'Manage your NFC cards and change destination URLs.'}
              {activeTab === 'analytics' && 'Track scans, visitors, and performance.'}
              {activeTab === 'orders' && 'View your order history and status.'}
              {activeTab === 'settings' && 'Manage your business profile.'}
            </p>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total Scans', value: stats.totalScans.toLocaleString(), icon: BarChart3, trend: '+12%' },
                  { label: 'Today', value: stats.todayScans, icon: Clock, trend: '+8' },
                  { label: 'This Week', value: stats.weekScans.toLocaleString(), icon: TrendingUp, trend: '+24%' },
                  { label: 'Unique Visitors', value: stats.uniqueVisitors.toLocaleString(), icon: Smartphone, trend: '+18%' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="premium-card p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-stone-500" />
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{stat.trend}</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold text-ink">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-stone-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Quick URL Change - THE CORE FEATURE */}
                <div className="lg:col-span-3 premium-card p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-semibold text-ink">Quick URL Change</h3>
                      <p className="text-xs text-stone-400 mt-0.5">Update where your NFC card redirects. Takes effect instantly.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                  
                  {mockCards.slice(0, 2).map((card) => (
                    <div key={card.id} className="p-4 rounded-xl bg-stone-50 border border-stone-100 mb-3 last:mb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Wifi className="w-3.5 h-3.5 text-stone-400" />
                            <span className="text-sm font-medium text-ink">{card.label}</span>
                            <span className="badge bg-green-50 text-green-700 text-[10px]">Active</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2">
                            <Globe className="w-3 h-3" />
                            <span className="truncate">{card.destinationUrl}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-stone-200 text-stone-500 font-mono">
                              /s/{card.cardId}
                            </code>
                            <button 
                              onClick={() => handleCopy(`tapreview.com/s/${card.cardId}`, card.id)}
                              className="text-stone-400 hover:text-ink transition-colors"
                            >
                              {copied === card.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => { setEditingCard(card.id); setNewUrl(card.destinationUrl); setActiveTab('cards'); }}
                          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-ink bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 premium-card p-5 sm:p-6">
                  <h3 className="font-semibold text-ink mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockScans.slice(0, 5).map((scan, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                          {scan.device === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-stone-400" /> : <Globe className="w-3.5 h-3.5 text-stone-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ink truncate">{scan.cardId} scan</p>
                          <p className="text-xs text-stone-400">{scan.timestamp} • {scan.os}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards Tab - THE CORE FEATURE */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              {/* Info banner */}
              <div className="p-4 rounded-xl bg-accent-soft border border-accent/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-ink">How NFC cards work</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Your physical NFC card always points to <code className="px-1 py-0.5 bg-white rounded text-ink font-mono text-[10px]">tapreview.com/s/[cardId]</code>. 
                    You can change the destination URL below — the card itself never needs to be replaced.
                  </p>
                </div>
              </div>

              {mockCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="premium-card p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-ink">{card.label}</h3>
                        <span className={`badge ${card.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${card.active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {card.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-stone-400 text-xs w-20 flex-shrink-0">Card ID</span>
                          <code className="text-xs px-2 py-0.5 bg-stone-100 rounded font-mono text-ink">{card.cardId}</code>
                          <button 
                            onClick={() => handleCopy(card.cardId, `id-${card.id}`)}
                            className="text-stone-400 hover:text-ink transition-colors"
                          >
                            {copied === `id-${card.id}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-stone-400 text-xs w-20 flex-shrink-0">NFC URL</span>
                          <code className="text-xs px-2 py-0.5 bg-stone-100 rounded font-mono text-ink truncate">tapreview.com/s/{card.cardId}</code>
                          <button 
                            onClick={() => handleCopy(`tapreview.com/s/${card.cardId}`, `url-${card.id}`)}
                            className="text-stone-400 hover:text-ink transition-colors"
                          >
                            {copied === `url-${card.id}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-stone-400 text-xs w-20 flex-shrink-0">Destination</span>
                          <span className="text-xs text-ink truncate">{card.destinationUrl}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
                        <span>{card.totalScans.toLocaleString()} scans</span>
                        <span>{Math.round(card.totalScans * 0.66).toLocaleString()} unique</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setEditingCard(editingCard === card.id ? null : card.id); setNewUrl(card.destinationUrl); }}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-ink bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors self-start"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Change URL
                    </button>
                  </div>

                  {/* Inline Edit Form */}
                  <AnimatePresence>
                    {editingCard === card.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-stone-100">
                          <label className="text-sm font-medium text-ink block mb-2">New Destination URL</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="url"
                              value={newUrl}
                              onChange={(e) => setNewUrl(e.target.value)}
                              placeholder="https://g.page/r/your-review-link"
                              className="input-premium flex-1"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateDestination(card.id)}
                                disabled={saving}
                                className="px-5 py-3 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink-light disabled:opacity-50 transition-colors flex items-center gap-1.5"
                              >
                                {saving ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <>Save <ArrowRight className="w-3.5 h-3.5" /></>
                                )}
                              </button>
                              <button
                                onClick={() => setEditingCard(null)}
                                className="px-3 py-3 text-stone-400 hover:text-ink rounded-xl hover:bg-stone-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-stone-400 flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-500" />
                            Changes take effect instantly. No card replacement needed.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total Scans', value: '12,482' },
                  { label: 'This Month', value: '2,847' },
                  { label: 'Unique Visitors', value: '8,291' },
                  { label: 'Avg/Day', value: '142' },
                ].map((stat, i) => (
                  <div key={i} className="premium-card p-4 sm:p-5">
                    <p className="text-xl sm:text-2xl font-semibold text-ink">{stat.value}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="premium-card p-5 sm:p-6">
                <h3 className="font-semibold text-ink mb-4">Scans over time</h3>
                <div className="h-48 sm:h-64 flex items-end gap-1 sm:gap-2">
                  {[35, 45, 38, 62, 55, 78, 65, 82, 70, 90, 75, 88, 92, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full rounded-t bg-gradient-to-t from-accent to-accent-light transition-all hover:opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-stone-400">
                  <span>2 weeks ago</span>
                  <span>Today</span>
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-ink mb-4">Devices</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Mobile', value: 78, color: 'bg-accent' },
                      { label: 'Tablet', value: 12, color: 'bg-blue-500' },
                      { label: 'Desktop', value: 10, color: 'bg-stone-300' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink">{item.label}</span>
                          <span className="text-stone-400">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-ink mb-4">Peak Hours</h3>
                  <div className="grid grid-cols-6 gap-1.5">
                    {Array.from({ length: 24 }, (_, i) => {
                      const intensity = Math.random();
                      return (
                        <div key={i} className="aspect-square rounded" style={{ backgroundColor: `rgba(232, 93, 58, ${intensity * 0.8 + 0.1})` }} />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-stone-400">
                    <span>12am</span>
                    <span>12pm</span>
                    <span>11pm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {[
                { id: 'TR-847291', product: 'Professional Pack', status: 'delivered', date: 'Dec 15, 2024', total: '$79' },
                { id: 'TR-623847', product: 'Starter Pack', status: 'shipped', date: 'Jan 3, 2025', total: '$29' },
              ].map((order, i) => (
                <div key={i} className="premium-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-ink text-sm">{order.id}</span>
                      <span className={`badge text-[10px] ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">{order.product} • {order.date}</p>
                  </div>
                  <span className="font-semibold text-ink">{order.total}</span>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="premium-card p-5 sm:p-6 max-w-2xl">
              <h3 className="font-semibold text-ink mb-5">Business Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink block mb-1.5">Business Name</label>
                  <input type="text" defaultValue={mockBusiness.name} className="input-premium" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink block mb-1.5">Category</label>
                  <input type="text" defaultValue={mockBusiness.category} className="input-premium" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink block mb-1.5">Phone</label>
                  <input type="text" defaultValue={mockBusiness.phone} className="input-premium" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink block mb-1.5">Address</label>
                  <input type="text" defaultValue={mockBusiness.address} className="input-premium" />
                </div>
                <button className="mt-4 px-5 py-2.5 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink-light transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
