import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, User, Lock, ArrowRight, Eye, EyeOff, Shield, Info } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate authentication
    // In production, this calls POST /api/auth/login on Express backend
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    // Demo routing
    if (username === 'admin' || username.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">TapReview</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Account Created'}
            </h1>
            <p className="text-gray-500 mb-6">
              {isLogin 
                ? 'Log in with the credentials provided by your administrator.' 
                : 'Your account has been created by the admin. Use the credentials below to log in.'}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                {isLogin ? 'Log In' : 'Log In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-brand-800 mb-1">Credentials set by admin</p>
                  <p className="text-xs text-brand-600">
                    Your username and password were created by your account administrator. 
                    Contact them if you need a password reset or have login issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Access */}
            <div className="mt-6 p-4 rounded-xl bg-gray-100 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700 uppercase">Demo Access</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { setUsername('abc-restaurant'); setPassword('demo123'); }}
                  className="block w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-brand-300 transition-colors"
                >
                  <div className="text-xs font-medium text-gray-900">Business Owner</div>
                  <div className="text-xs text-gray-500">Username: abc-restaurant</div>
                </button>
                <button
                  onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                  className="block w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-brand-300 transition-colors"
                >
                  <div className="text-xs font-medium text-gray-900">Administrator</div>
                  <div className="text-xs text-gray-500">Username: admin</div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border border-white/30" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10" />
        </div>

        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Wifi className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Manage your NFC cards</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Change destination URLs, view analytics, and track scans — all from your dashboard. No card replacement needed.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '12.4K', label: 'Scans' },
              { value: '4', label: 'Cards' },
              { value: '+18%', label: 'Growth' }
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
