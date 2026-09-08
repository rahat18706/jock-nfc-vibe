import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, Store, CreditCard, ShoppingBag,
  Settings, LogOut, Wifi, TrendingUp, ArrowUpRight, ArrowDownRight,
  Globe, Smartphone, Monitor, Tablet, Edit3, Check, ExternalLink,
  Clock, MapPin, Activity, Users, Zap, AlertTriangle
} from 'lucide-react';
import { mockBusiness, mockCards, mockScans, mockOrders } from '../data/mockData';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'store', label: 'My Store', icon: Store },
  { id: 'cards', label: 'NFC Cards', icon: CreditCard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
  const { section = 'overview' } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">TapReview</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { navigate(`/dashboard/${item.id}`); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  section === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
              MR
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Marco Rossi</div>
              <div className="text-xs text-gray-500">ABC Restaurant</div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">{section}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                All cards active
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {section === 'overview' && <OverviewSection />}
          {section === 'analytics' && <AnalyticsSection />}
          {section === 'store' && <StoreSection />}
          {section === 'cards' && <CardsSection />}
          {section === 'orders' && <OrdersSection />}
          {section === 'settings' && <SettingsSection />}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

function OverviewSection() {
  const totalScans = mockCards.reduce((sum, c) => sum + c.totalScans, 0);
  const todayScans = mockScans.filter(s => {
    const d = new Date(s.timestamp);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: totalScans.toLocaleString(), change: '+12.5%', up: true, icon: Activity },
          { label: 'Today', value: todayScans || 47, change: '+8.2%', up: true, icon: Zap },
          { label: 'Active Cards', value: mockCards.filter(c => c.active).length.toString(), change: '0', up: true, icon: CreditCard },
          { label: 'Unique Visitors', value: '8,942', change: '+15.3%', up: true, icon: Users }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                <stat.icon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick URL Edit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Destination URL</h3>
            <p className="text-sm text-gray-500">Where your NFC cards redirect to</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700 truncate">{mockBusiness.destinationUrl}</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </div>
        <p className="mt-3 text-xs text-gray-400">
          All {mockCards.length} cards point to this URL. Change it anytime — no card replacement needed.
        </p>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Recent Scans</h3>
        <div className="space-y-3">
          {mockScans.slice(0, 5).map((scan, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  scan.device === 'mobile' ? 'bg-blue-50 text-blue-600' : 
                  scan.device === 'tablet' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {scan.device === 'mobile' ? <Smartphone className="w-4 h-4" /> : 
                   scan.device === 'tablet' ? <Tablet className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{scan.os} • {scan.browser}</div>
                  <div className="text-xs text-gray-500">{scan.city}, {scan.country} • {mockCards.find(c => c.cardId === scan.cardId)?.label}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AnalyticsSection() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = [65, 80, 45, 90, 75, 110, 95];
  const maxVal = Math.max(...weekData);

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Scans This Week</h3>
            <p className="text-sm text-gray-500">Daily scan activity</p>
          </div>
          <div className="flex gap-2">
            {['Week', 'Month', 'Year'].map(period => (
              <button key={period} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${period === 'Week' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-3 h-48">
          {weekData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxVal) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 hover:from-brand-700 hover:to-brand-500 transition-colors cursor-pointer min-h-[8px]"
                  style={{ height: `${(val / maxVal) * 100}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {val} scans
                </div>
              </div>
              <span className="text-xs text-gray-500">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Device breakdown */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Device Type</h3>
          <div className="space-y-4">
            {[
              { label: 'Mobile', pct: 78, color: 'bg-brand-500', count: '9,736' },
              { label: 'Desktop', pct: 12, color: 'bg-gray-400', count: '1,498' },
              { label: 'Tablet', pct: 10, color: 'bg-purple-400', count: '1,248' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Operating Systems</h3>
          <div className="space-y-4">
            {[
              { label: 'iOS', pct: 52, count: '6,490' },
              { label: 'Android', pct: 38, count: '4,743' },
              { label: 'Windows', pct: 6, count: '749' },
              { label: 'macOS', pct: 4, count: '500' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card performance */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Card Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-medium text-gray-500">Card</th>
                <th className="text-left py-3 font-medium text-gray-500">Location</th>
                <th className="text-right py-3 font-medium text-gray-500">Scans</th>
                <th className="text-right py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCards.map(card => (
                <tr key={card.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-gray-900">{card.label}</td>
                  <td className="py-3 text-gray-500">{card.location}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">{card.totalScans.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${card.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${card.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {card.active ? 'Active' : 'Inactive'}
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

function StoreSection() {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(mockBusiness.destinationUrl);
  const [saved, setSaved] = useState(false);
  const [urlError, setUrlError] = useState('');

  const handleSave = () => {
    // Validate URL (same validation as backend)
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setUrlError('Only HTTP and HTTPS URLs are allowed');
        return;
      }
    } catch {
      setUrlError('Please enter a valid URL');
      return;
    }
    
    setUrlError('');
    setEditing(false);
    setSaved(true);
    // In production: PUT /api/businesses/cards/:cardId/destination
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Business Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">
            {mockBusiness.logo}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{mockBusiness.name}</h2>
            <p className="text-sm text-gray-500">{mockBusiness.category} • Since {mockBusiness.createdAt}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Slug', value: mockBusiness.slug },
            { label: 'Address', value: mockBusiness.address },
            { label: 'Phone', value: mockBusiness.phone },
            { label: 'Website', value: mockBusiness.website || 'Not set' },
          ].map((field, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">{field.label}</div>
              <div className="text-sm font-medium text-gray-900">{field.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ★ CORE FEATURE: Change NFC Destination URL */}
      <div className="bg-white rounded-xl border-2 border-brand-200 p-6 shadow-sm shadow-brand-50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-600" />
              Change NFC Card Destination
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update where your NFC cards redirect. Takes effect instantly — no card replacement needed.
            </p>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              <Check className="w-4 h-4" /> Updated!
            </span>
          )}
        </div>

        {/* Current URL Display */}
        {!editing && (
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Current Destination</div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900 font-mono truncate">{url}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-900 text-white">
              <div className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Your NFC URL (never changes)</div>
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-sm font-mono text-brand-300">tapreview.com/s/{mockBusiness.slug}</span>
              </div>
            </div>

            <button 
              onClick={() => setEditing(true)} 
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
            >
              <Edit3 className="w-4 h-4" />
              Change Destination URL
            </button>
          </div>
        )}

        {/* Edit Mode */}
        {editing && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">New Destination URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none text-sm font-mono"
                placeholder="https://g.page/r/your-business-review"
              />
              {urlError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {urlError}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Only HTTP and HTTPS URLs are accepted. Your NFC cards will immediately redirect to this new URL.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
                Save & Apply Instantly
              </button>
              <button onClick={() => { setEditing(false); setUrlError(''); }} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
          <p className="text-xs text-brand-700 leading-relaxed">
            <strong>How it works:</strong> Your physical NFC cards are encoded with <code className="bg-brand-100 px-1 py-0.5 rounded">tapreview.com/s/{mockBusiness.slug}</code>. 
            This URL never changes. When someone taps the card, our server looks up the current destination and redirects instantly. 
            Change the destination above anytime — the physical card keeps working.
          </p>
        </div>
      </div>
    </div>
  );
}

function CardsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your NFC Cards</h2>
          <p className="text-sm text-gray-500">{mockCards.length} cards registered</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
          + Add Card
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {mockCards.map(card => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:border-brand-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{card.label}</div>
                  <div className="text-xs text-gray-500 font-mono">{card.cardId}</div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${card.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${card.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                {card.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {card.location}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Total Scans</div>
                <div className="text-sm font-bold text-gray-900">{card.totalScans.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="text-xs text-gray-400 font-mono">
                tapreview.com/s/{mockBusiness.slug}
              </div>
              <button className="text-xs text-brand-600 font-medium hover:text-brand-700">
                Configure →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OrdersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Your Orders</h2>
      <div className="space-y-4">
        {mockOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-sm font-mono text-gray-500">#{order.id}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                  order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</div>
            </div>
            <div className="text-sm text-gray-500">
              {order.items[0].quantity}× NFC Card(s) • Ordered {order.createdAt}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Business Name</label>
            <input type="text" defaultValue={mockBusiness.name} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input type="email" defaultValue="owner@abcrestaurant.com" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
            <input type="tel" defaultValue={mockBusiness.phone} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">NFC Card URL</h3>
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Your permanent NFC URL</div>
          <div className="text-sm font-mono text-gray-900">https://tapreview.com/s/{mockBusiness.slug}</div>
        </div>
        <p className="mt-3 text-xs text-gray-400">This URL is encoded in your NFC cards and never changes, even if you update your destination URL.</p>
      </div>
    </div>
  );
}
