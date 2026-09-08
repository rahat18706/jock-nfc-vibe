import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, ShoppingBag, BarChart3,
  Settings, LogOut, Wifi, TrendingUp, ArrowUpRight, Search,
  Globe, Shield, Activity, DollarSign, Package, AlertTriangle,
  CheckCircle, XCircle, Clock, MoreVertical
} from 'lucide-react';
import { adminStats, allBusinesses, mockOrders, mockCards } from '../data/mockData';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'businesses', label: 'Businesses', icon: Globe },
  { id: 'cards', label: 'NFC Cards', icon: CreditCard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPage() {
  const { section = 'overview' } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold">TapReview</span>
              <span className="text-xs text-gray-400 block">Admin Panel</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { navigate(`/admin/${item.id}`); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  section === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div>
              <div className="text-sm font-medium text-white">Admin</div>
              <div className="text-xs text-gray-400">admin@tapreview.com</div>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">Admin — {section}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {section === 'overview' && <AdminOverview />}
          {section === 'businesses' && <AdminBusinesses />}
          {section === 'cards' && <AdminCards />}
          {section === 'orders' && <AdminOrders />}
          {section === 'analytics' && <AdminAnalytics />}
          {section === 'settings' && <AdminSettings />}
        </div>
      </main>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Businesses', value: adminStats.totalBusinesses, change: '+12', icon: Globe, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Cards', value: adminStats.totalCards, change: '+45', icon: CreditCard, color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Revenue', value: `$${adminStats.totalRevenue.toLocaleString()}`, change: '+$2,340', icon: DollarSign, color: 'bg-green-50 text-green-600' },
          { label: 'Total Scans', value: adminStats.totalScans.toLocaleString(), change: '+8,420', icon: Activity, color: 'bg-orange-50 text-orange-600' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500 mb-1">Orders This Month</div>
          <div className="text-xl font-bold text-gray-900">{adminStats.totalOrders}</div>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: '72%' }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500 mb-1">New Signups (Week)</div>
          <div className="text-xl font-bold text-gray-900">{adminStats.newSignupsThisWeek}</div>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500 mb-1">Churn Rate</div>
          <div className="text-xl font-bold text-gray-900">{adminStats.churnRate}%</div>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 rounded-full" style={{ width: '21%' }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New business registered', detail: 'Luxe Salon', time: '2 min ago', icon: Globe, color: 'text-blue-600 bg-blue-50' },
            { action: 'Order shipped', detail: '#order_342 — 10 cards', time: '15 min ago', icon: Package, color: 'text-purple-600 bg-purple-50' },
            { action: 'Card activated', detail: 'card_9K21M — Urban Gym', time: '1 hour ago', icon: CreditCard, color: 'text-green-600 bg-green-50' },
            { action: 'Payment received', detail: '$99.99 — Premium Pack', time: '2 hours ago', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
            { action: 'New signup', detail: 'dr.jones@clinic.com', time: '3 hours ago', icon: Users, color: 'text-orange-600 bg-orange-50' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{item.action}</div>
                <div className="text-xs text-gray-500 truncate">{item.detail}</div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminBusinesses() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newBiz, setNewBiz] = useState({ username: '', password: '', email: '', fullName: '', businessName: '', category: 'restaurant' });
  const [created, setCreated] = useState<{username: string, password: string} | null>(null);

  const filtered = allBusinesses.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    // In production: POST /api/admin/businesses
    // This creates user account with admin-set credentials + business
    setCreated({ username: newBiz.username, password: newBiz.password });
    setNewBiz({ username: '', password: '', email: '', fullName: '', businessName: '', category: 'restaurant' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses..."
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
          />
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Add Business
        </button>
      </div>

      {/* Create Business Modal - Admin sets credentials */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {!created ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Create Business Account</h2>
                <p className="text-sm text-gray-500 mb-6">Set the login credentials for this business owner. They will use these to access their dashboard.</p>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-700">
                      <strong>Important:</strong> You are setting the username and password for this business. Share these credentials securely with the business owner.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Username *</label>
                      <input
                        type="text"
                        value={newBiz.username}
                        onChange={(e) => setNewBiz({...newBiz, username: e.target.value})}
                        placeholder="abc-restaurant"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
                      <input
                        type="text"
                        value={newBiz.password}
                        onChange={(e) => setNewBiz({...newBiz, password: e.target.value})}
                        placeholder="Set initial password"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      value={newBiz.email}
                      onChange={(e) => setNewBiz({...newBiz, email: e.target.value})}
                      placeholder="owner@business.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Owner Full Name *</label>
                    <input
                      type="text"
                      value={newBiz.fullName}
                      onChange={(e) => setNewBiz({...newBiz, fullName: e.target.value})}
                      placeholder="John Smith"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Business Name *</label>
                      <input
                        type="text"
                        value={newBiz.businessName}
                        onChange={(e) => setNewBiz({...newBiz, businessName: e.target.value})}
                        placeholder="ABC Restaurant"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
                      <select
                        value={newBiz.category}
                        onChange={(e) => setNewBiz({...newBiz, category: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                      >
                        <option value="restaurant">Restaurant</option>
                        <option value="cafe">Cafe</option>
                        <option value="salon">Salon</option>
                        <option value="hotel">Hotel</option>
                        <option value="shop">Shop</option>
                        <option value="clinic">Clinic</option>
                        <option value="gym">Gym</option>
                        <option value="barber">Barber</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleCreate}
                      className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Create Account
                    </button>
                    <button 
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2.5 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Account Created!</h2>
                  <p className="text-sm text-gray-500 mt-1">Share these credentials with the business owner:</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Username:</span>
                    <code className="text-sm font-mono font-bold text-gray-900">{created.username}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Password:</span>
                    <code className="text-sm font-mono font-bold text-gray-900">{created.password}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Login URL:</span>
                    <code className="text-sm font-mono text-brand-600">tapreview.com/login</code>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowCreate(false); setCreated(null); }}
                  className="w-full mt-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Business</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Slug</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(biz => (
                <tr key={biz.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                        {biz.logo}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{biz.name}</div>
                        <div className="text-xs text-gray-500">{biz.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 capitalize">{biz.category}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{biz.slug}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${biz.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${biz.active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {biz.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{biz.createdAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminCards() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500">Total Cards</div>
          <div className="text-2xl font-bold text-gray-900">{adminStats.totalCards}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500">Active Cards</div>
          <div className="text-2xl font-bold text-green-600">{adminStats.totalCards - 12}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm text-gray-500">Inactive Cards</div>
          <div className="text-2xl font-bold text-red-600">12</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">All NFC Cards</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Card ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Business</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Label</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Scans</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCards.map(card => (
                <tr key={card.id} className="border-t border-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-700">{card.cardId}</td>
                  <td className="py-3 px-4 text-gray-600">ABC Restaurant</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{card.label}</td>
                  <td className="py-3 px-4 text-right font-semibold">{card.totalScans.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: 8, color: 'text-yellow-600 bg-yellow-50', icon: Clock },
          { label: 'Processing', count: 12, color: 'text-blue-600 bg-blue-50', icon: Package },
          { label: 'Shipped', count: 24, color: 'text-purple-600 bg-purple-50', icon: TrendingUp },
          { label: 'Delivered', count: 297, color: 'text-green-600 bg-green-50', icon: CheckCircle }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{item.count}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">All Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Business</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {[...mockOrders, ...mockOrders].map((order, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-700">#{order.id}</td>
                  <td className="py-3 px-4 text-gray-900">ABC Restaurant</td>
                  <td className="py-3 px-4 text-gray-600">{order.items[0].quantity}× cards</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminAnalytics() {
  const monthData = [420, 380, 510, 620, 580, 720, 850, 790, 920, 880, 1050, 1120];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxVal = Math.max(...monthData);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Platform Scans — 2024</h3>
        <div className="flex items-end gap-2 h-48">
          {monthData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxVal) * 100}%` }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="w-full rounded-t bg-gradient-to-t from-brand-700 to-brand-400 min-h-[4px]"
                style={{ height: `${(val / maxVal) * 100}%` }}
              />
              <span className="text-[10px] text-gray-500">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Businesses by Scans</h3>
          <div className="space-y-3">
            {allBusinesses.slice(0, 5).map((biz, i) => (
              <div key={biz.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{biz.name}</span>
                    <span className="text-gray-500">{(Math.random() * 20000 + 5000).toFixed(0)} scans</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${100 - i * 15}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { label: 'API Response Time', value: '45ms', status: 'good' },
              { label: 'Redirect Speed', value: '120ms', status: 'good' },
              { label: 'Database Load', value: '23%', status: 'good' },
              { label: 'Error Rate', value: '0.02%', status: 'good' },
              { label: 'Uptime (30d)', value: '99.98%', status: 'good' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Platform Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Platform Name</label>
            <input type="text" defaultValue="TapReview" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Default Redirect Domain</label>
            <input type="text" defaultValue="tapreview.com" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Rate Limit (requests/min)</label>
            <input type="number" defaultValue="60" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-3">
          {[
            { label: 'URL Validation (prevent open redirects)', enabled: true },
            { label: 'Rate Limiting on Redirect Endpoint', enabled: true },
            { label: 'Bot Detection & Filtering', enabled: true },
            { label: 'HTTPS Only', enabled: true },
            { label: 'CORS Protection', enabled: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{item.label}</span>
              <div className={`w-10 h-6 rounded-full ${item.enabled ? 'bg-green-500' : 'bg-gray-200'} relative cursor-pointer transition-colors`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.enabled ? 'left-5' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
