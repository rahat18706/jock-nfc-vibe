import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, ExternalLink, Star } from 'lucide-react';
import { mockCards } from '../data/mockData';

export default function RedirectPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  
  const card = mockCards.find(c => c.cardId === cardId);

  useEffect(() => {
    if (card?.active && card?.destinationUrl) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // In production, this would redirect to the actual URL
            // window.location.href = card.destinationUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [card]);

  if (!card) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-5">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-6 h-6 text-stone-400" />
          </div>
          <h1 className="text-xl font-semibold text-ink mb-2">Card not found</h1>
          <p className="text-stone-500 text-sm mb-6">
            This NFC card doesn't exist or has been deactivated.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink-light transition-colors"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

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
          Taking you to leave a review for
        </p>

        {/* Business Card */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
          <div className="flex items-center gap-1 mb-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-white font-medium">Leave a review</p>
          <p className="text-white/40 text-xs mt-1">for {card.label}</p>
        </div>

        {/* Countdown */}
        {countdown > 0 ? (
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs">
              {countdown}
            </div>
            <span>Redirecting...</span>
          </div>
        ) : (
          <a 
            href={card.destinationUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink text-sm font-medium rounded-xl hover:bg-white/90 transition-colors"
          >
            Continue <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Powered by */}
        <p className="mt-8 text-white/20 text-xs">
          Powered by tapreview
        </p>
      </motion.div>
    </div>
  );
}
