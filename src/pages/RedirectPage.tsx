import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Star } from 'lucide-react';

export default function RedirectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // The backend handles the redirect at /s/:slug
    // This page is just a fallback in case the backend redirect doesn't work
    // In production, the backend will return a 302 redirect before this page loads
    
    // Show a loading state briefly, then redirect to homepage if backend didn't redirect
    const timer = setTimeout(() => {
      // If we're still here after 3 seconds, something went wrong
      // Redirect to homepage
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug, navigate]);

  // This page should rarely be seen because the backend handles redirects
  // It's just a fallback/error page
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-sm"
      >
        {/* NFC Animation */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-white/10 animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Wifi className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">
          Redirecting...
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Please wait while we redirect you
        </p>

        {/* Loading indicator */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
          <div className="flex items-center gap-1 mb-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-white font-medium">Leave a review</p>
          <p className="text-white/40 text-xs mt-1">for our business</p>
        </div>

        {/* Loading spinner */}
        <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      </motion.div>
    </div>
  );
}
