import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wifi, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="p-5 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-12">
        <div className="w-full max-w-[400px] animate-slide-up">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">TapReview</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted mb-8">
            Sign in with credentials provided by your admin.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              required
              autoComplete="username"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium pr-11"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm text-muted hover:text-accent transition-colors">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
