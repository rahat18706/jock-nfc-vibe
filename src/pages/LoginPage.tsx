import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth - in production this calls the API
    if (email.includes('admin')) {
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
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-500 mb-8">
              {isLogin ? 'Log in to manage your NFC cards and analytics' : 'Get started with TapReview in seconds'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
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

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                {isLogin ? 'Log In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>

            {/* Demo links */}
            <div className="mt-8 p-4 rounded-xl bg-brand-50 border border-brand-100">
              <div className="text-xs font-medium text-brand-700 mb-2">Demo Access</div>
              <div className="space-y-1.5">
                <button
                  onClick={() => { setEmail('owner@abcrestaurant.com'); setPassword('demo123'); }}
                  className="block w-full text-left text-xs text-brand-600 hover:text-brand-700"
                >
                  → Business Dashboard: owner@abcrestaurant.com
                </button>
                <button
                  onClick={() => { setEmail('admin@tapreview.com'); setPassword('admin123'); }}
                  className="block w-full text-left text-xs text-brand-600 hover:text-brand-700"
                >
                  → Admin Panel: admin@tapreview.com
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border border-white/30" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10" />
        </div>

        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Wifi className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Manage everything from one place</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Track scans, change destinations, view analytics, and manage your NFC cards — all from your dashboard.
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
