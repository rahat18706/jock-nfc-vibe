import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (username.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else if (username) {
        navigate('/dashboard');
      } else {
        setError('Please enter your credentials');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">
      {/* Top bar */}
      <div className="p-5 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-ink">tapreview</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">
            Welcome back
          </h1>
          <p className="text-stone-500 mb-8">
            Log in with credentials provided by your admin.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="input-premium"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-ink focus:ring-ink/20" />
                <span className="text-sm text-stone-500">Remember me</span>
              </label>
              <button type="button" className="text-sm text-ink font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-medium mt-6 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Log in <ArrowRight className="w-4 h-4" /></>
                )}
              </span>
            </button>
          </form>

          {/* Info box */}
          <div className="mt-8 p-4 rounded-xl bg-stone-100/70 border border-stone-200/50">
            <p className="text-xs font-medium text-ink mb-1">Credentials set by admin</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your username and password were created by your account administrator. 
              Contact them if you need a password reset.
            </p>
          </div>

          {/* Demo shortcuts */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => { setUsername('owner'); setPassword('demo'); }}
              className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-white transition-all text-sm"
            >
              <span className="text-stone-400 text-xs">Demo →</span>
              <p className="text-ink font-medium text-sm">Business Dashboard</p>
            </button>
            <button
              onClick={() => { setUsername('admin'); setPassword('admin'); }}
              className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-white transition-all text-sm"
            >
              <span className="text-stone-400 text-xs">Demo →</span>
              <p className="text-ink font-medium text-sm">Admin Panel</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
