'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Wifi, BarChart3, CreditCard, Settings, LogOut, 
  ExternalLink, Edit3, Check, X, TrendingUp, 
  Smartphone, Globe, Clock, Copy, RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      fetchData();
    } else {
      router.push('/login');
    }
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [businessRes, cardsRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/my`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/my/cards`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/overview`, { headers }),
      ]);

      if (businessRes.ok) setBusiness((await businessRes.json()).business);
      if (cardsRes.ok) setCards((await cardsRes.json()).cards);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleUpdateDestination = async (cardId) => {
    if (!newUrl) return;
    
    // Validate URL
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
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/businesses/cards/${cardId}/destination`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ destinationUrl: newUrl }),
        }
      );

      if (res.ok) {
        setSuccess('Destination URL updated! NFC card now redirects to new URL.');
        setEditingCard(null);
        setNewUrl('');
        fetchData();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update');
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">TapReview</span>
          </Link>
        </div>
        <nav className="flex-1 px-3">
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: Wifi, label: 'My NFC Cards' },
            { icon: CreditCard, label: 'Orders' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                item.active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">{user.fullName?.[0]}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{business?.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user.fullName}</p>
            </div>
            <button onClick={fetchData} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Scans', value: stats.totalScans?.toLocaleString(), icon: BarChart3, color: 'blue' },
                { label: 'Today', value: stats.todayScans, icon: Clock, color: 'green' },
                { label: 'This Week', value: stats.weekScans, icon: TrendingUp, color: 'purple' },
                { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: Smartphone, color: 'orange' },
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* NFC Cards - THE CORE FEATURE */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">My NFC Cards</h2>
              <p className="text-sm text-gray-500 mt-1">Change where your NFC cards redirect. Updates take effect instantly.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {cards.map((card) => (
                <div key={card._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{card.label || 'Main Card'}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${card.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {card.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>Card ID:</span>
                        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{card.cardId}</code>
                        <button 
                          onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/s/${card.cardId}`)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-md">{card.destinationUrl}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span>{card.stats?.totalScans || 0} total scans</span>
                        <span>NFC URL: /s/{card.cardId}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setEditingCard(card.cardId); setNewUrl(card.destinationUrl); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit URL
                    </button>
                  </div>

                  {/* Inline Edit */}
                  {editingCard === card.cardId && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        New Destination URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          placeholder="https://g.page/r/your-review-link"
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                        <button
                          onClick={() => handleUpdateDestination(card.cardId)}
                          disabled={saving}
                          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingCard(null)}
                          className="px-3 py-2.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        The NFC card will immediately redirect to this new URL. No card replacement needed.
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {cards.length === 0 && (
                <div className="p-12 text-center">
                  <Wifi className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No NFC cards yet. Order your first card to get started.</p>
                  <Link href="/order" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Order Card <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
