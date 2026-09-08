'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Wifi, Users, CreditCard, BarChart3, Settings, LogOut, 
  Plus, Search, Eye, Trash2, Ban, CheckCircle, XCircle,
  Building2, Shield
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBusiness, setNewBusiness] = useState({
    username: '', password: '', email: '', fullName: '', businessName: '', category: 'restaurant'
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsed);
      fetchAdminData();
    } else {
      router.push('/login');
    }
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [statsRes, bizRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/businesses`, { headers }),
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (bizRes.ok) setBusinesses((await bizRes.json()).businesses);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBusiness),
      });

      if (res.ok) {
        alert('Business account created! Share credentials with the business owner.');
        setShowCreateModal(false);
        setNewBusiness({ username: '', password: '', email: '', fullName: '', businessName: '', category: 'restaurant' });
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create business');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const handleToggleSuspend = async (businessId, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isSuspended: !currentStatus }),
      });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleDelete = async (businessId) => {
    if (!confirm('Delete this business and all associated data? This cannot be undone.')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/businesses/${businessId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  const filteredBusinesses = businesses.filter(b =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-gray-900 text-white">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 px-3">
          {[
            { icon: BarChart3, label: 'Overview', active: true },
            { icon: Building2, label: 'Businesses' },
            { icon: Wifi, label: 'NFC Cards' },
            { icon: CreditCard, label: 'Orders' },
            { icon: Users, label: 'Users' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                item.active ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Overview</h1>
              <p className="text-sm text-gray-500">Manage your entire platform</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Business
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Businesses', value: stats.totalBusinesses, icon: Building2, color: 'blue' },
                { label: 'Total Cards', value: stats.totalCards, icon: Wifi, color: 'green' },
                { label: 'Total Orders', value: stats.totalOrders, icon: CreditCard, color: 'purple' },
                { label: 'Total Revenue', value: `$${stats.totalRevenue?.toLocaleString() || 0}`, icon: BarChart3, color: 'orange' },
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-gray-100">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500 mb-3`} />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Businesses Table */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">All Businesses</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBusinesses.map((biz) => (
                    <tr key={biz._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{biz.name}</p>
                          <p className="text-xs text-gray-500">/{biz.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{biz.owner?.fullName}</p>
                        <p className="text-xs text-gray-500">{biz.owner?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {biz.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {biz.isSuspended ? (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <Ban className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleSuspend(biz._id, biz.isSuspended)}
                            className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600" 
                            title={biz.isSuspended ? 'Activate' : 'Suspend'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(biz._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" 
                            title="Delete"
                          >
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
      </main>

      {/* Create Business Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Create Business Account</h2>
            <p className="text-sm text-gray-500 mb-6">Set credentials for the business owner. They will use these to log in.</p>
            
            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Username *</label>
                  <input
                    type="text"
                    value={newBusiness.username}
                    onChange={(e) => setNewBusiness({...newBusiness, username: e.target.value})}
                    placeholder="abc-restaurant"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
                  <input
                    type="text"
                    value={newBusiness.password}
                    onChange={(e) => setNewBusiness({...newBusiness, password: e.target.value})}
                    placeholder="Set initial password"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                <input
                  type="email"
                  value={newBusiness.email}
                  onChange={(e) => setNewBusiness({...newBusiness, email: e.target.value})}
                  placeholder="owner@business.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newBusiness.fullName}
                  onChange={(e) => setNewBusiness({...newBusiness, fullName: e.target.value})}
                  placeholder="John Smith"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={newBusiness.businessName}
                    onChange={(e) => setNewBusiness({...newBusiness, businessName: e.target.value})}
                    placeholder="ABC Restaurant"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
                  <select
                    value={newBusiness.category}
                    onChange={(e) => setNewBusiness({...newBusiness, category: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
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
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Create Account
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
