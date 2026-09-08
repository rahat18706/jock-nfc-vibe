import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, ExternalLink, Shield, Loader2 } from 'lucide-react';
import { mockBusiness, mockCards } from '../data/mockData';

export default function RedirectPage() {
  const { slug } = useParams();
  const [status, setStatus] = useState<'resolving' | 'redirecting' | 'error'>('resolving');
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // Simulate the NFC redirect flow
    // In production: resolve slug → record scan → redirect to destination URL
    
    const timer1 = setTimeout(() => {
      setStatus('redirecting');
    }, 300);

    const timer2 = setTimeout(() => {
      // Simulate redirect countdown
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // In production, this would be: window.location.href = destinationUrl
            setStatus('redirecting');
            return 0;
          }
          return prev - 1;
        });
      }, 500);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [slug]);

  // Error state for invalid slugs
  if (slug && !mockBusiness.slug.includes(slug.split('-')[0]) && slug !== 'abc-restaurant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Card not found</h1>
          <p className="text-gray-500 mb-6">
            This NFC card doesn't seem to be registered or has been deactivated.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Visit TapReview
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Loading State */}
        {status === 'resolving' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1">Connecting...</h1>
              <p className="text-sm text-gray-500">Resolving your destination</p>
            </div>
          </motion.div>
        )}

        {/* Redirecting State */}
        {status === 'redirecting' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto shadow-lg shadow-brand-200">
              <Wifi className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{mockBusiness.name}</h1>
              <p className="text-sm text-gray-500">Redirecting to review page...</p>
            </div>

            {/* Business info card */}
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                  {mockBusiness.logo}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-sm">{mockBusiness.name}</div>
                  <div className="text-xs text-gray-500">{mockBusiness.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 truncate">{mockBusiness.destinationUrl}</span>
              </div>
            </div>

            {/* Redirect button (manual fallback) */}
            <a
              href={mockBusiness.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
            >
              <ExternalLink className="w-4 h-4" />
              Leave a Review
            </a>

            <p className="text-xs text-gray-400">
              If you're not redirected automatically, tap the button above.
            </p>
          </motion.div>
        )}

        {/* Powered by */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Shield className="w-3 h-3" />
          Powered by TapReview
        </div>
      </div>
    </div>
  );
}
