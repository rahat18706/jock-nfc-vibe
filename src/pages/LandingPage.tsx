import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, Star, ArrowRight, ArrowUpRight, Check, Menu, X,
  Zap, Shield, Smartphone, BarChart3, Globe, QrCode
} from 'lucide-react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-ink">tapreview</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how" className="text-sm text-stone-500 hover:text-ink transition-colors">How it works</a>
              <a href="#features" className="text-sm text-stone-500 hover:text-ink transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-stone-500 hover:text-ink transition-colors">Pricing</a>
              <Link to="/login" className="text-sm text-stone-600 hover:text-ink font-medium transition-colors">Log in</Link>
              <Link to="/order" className="btn-primary px-5 py-2.5 rounded-full text-sm font-medium">
                <span className="flex items-center gap-1.5">Get started <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
            </div>

            <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 -mr-2">
              <Menu className="w-5 h-5 text-ink" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] mobile-menu-overlay md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setMenuOpen(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {['How it works', 'Features', 'Pricing'].map((item, i) => (
                  <a key={i} href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-lg font-medium text-ink border-b border-stone-100">
                    {item}
                  </a>
                ))}
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-3 text-lg font-medium text-ink border-b border-stone-100">
                  Log in
                </Link>
                <Link to="/order" onClick={() => setMenuOpen(false)} className="mt-6 btn-primary py-4 rounded-xl text-center font-medium">
                  <span>Get started</span>
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-32 px-5 sm:px-8 overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 mb-6 sm:mb-8 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-stone-600">Now serving 2,000+ businesses</span>
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="display-xl text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] text-ink"
              >
                More reviews.{' '}
                <span className="relative inline-block">
                  <span className="gradient-text-accent">One tap.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="#e85d3a" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 sm:mt-8 text-lg sm:text-xl text-stone-500 leading-relaxed max-w-lg"
              >
                Place our NFC card at your business. Customers tap their phone — instantly directed to leave a Google review. Change destinations anytime.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link to="/order" className="btn-primary px-7 py-4 rounded-full text-base font-medium text-center">
                  <span className="flex items-center justify-center gap-2">
                    Order your card
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <a href="#how" className="px-7 py-4 rounded-full border border-stone-200 text-stone-700 font-medium text-center hover:bg-white hover:border-stone-300 transition-all">
                  See how it works
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 sm:mt-12 flex items-center gap-6"
              >
                <div className="flex -space-x-2">
                  {['bg-orange-400', 'bg-blue-400', 'bg-emerald-400', 'bg-purple-400'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white shadow-sm`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">Loved by restaurants, salons & shops</p>
                </div>
              </motion.div>
            </div>

            {/* Right - 3D Card Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-200/30 rounded-3xl blur-3xl scale-90" />
                
                {/* Main Card */}
                <div className="relative nfc-card">
                  <div className="nfc-card-inner nfc-card-shadow rounded-[24px] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-7 sm:p-8 aspect-[1.6/1] relative overflow-hidden">
                    {/* Card texture */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent rounded-full blur-2xl" />
                    </div>

                    {/* NFC waves animation */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full border border-white/10" style={{ animation: 'nfc-wave 2s ease-out infinite' }} />
                      <div className="absolute inset-0 w-16 h-16 rounded-full border border-white/10" style={{ animation: 'nfc-wave 2s ease-out infinite 0.5s' }} />
                    </div>

                    {/* Card content */}
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                            <Wifi className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-white/60 text-xs font-medium tracking-wide">TAPREVIEW</span>
                        </div>
                        <QrCode className="w-6 h-6 text-white/30" />
                      </div>

                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1.5">Tap to review</p>
                        <p className="text-white text-xl sm:text-2xl font-semibold tracking-tight">Your Business</p>
                        <div className="flex items-center gap-1.5 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-white/40 text-[10px] ml-1">Leave a review</span>
                        </div>
                      </div>
                    </div>

                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Phone mockup */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-4 sm:-right-8 w-20 sm:w-24 h-36 sm:h-44 rounded-2xl bg-white border border-stone-200 shadow-xl rotate-12"
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-stone-200" />
                  <div className="absolute inset-2.5 top-5 rounded-xl bg-gradient-to-b from-stone-50 to-white flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-1.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-[7px] sm:text-[8px] text-stone-500 text-center px-2">Review submitted!</p>
                  </div>
                </motion.div>

                {/* Floating stat card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -left-4 sm:-left-8 px-3 py-2 rounded-xl bg-white border border-stone-100 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink">+284%</p>
                      <p className="text-[9px] text-stone-400">Reviews this month</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee / Social Proof */}
      <section className="py-12 sm:py-16 border-y border-stone-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-stone-400 mb-8">Trusted by businesses worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
            {['Restaurant', 'Café', 'Salon', 'Hotel', 'Gym', 'Clinic', 'Barber', 'Shop'].map((type, i) => (
              <span key={i} className="text-lg sm:text-xl font-semibold text-ink tracking-tight">{type}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16 sm:mb-20"
          >
            <p className="text-sm font-medium text-accent mb-3">How it works</p>
            <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-ink">
              Three steps to more reviews
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                num: '01', 
                title: 'Place the card', 
                desc: 'Put the NFC card at your counter, table, or reception. Customers see the invitation.',
                icon: '📍'
              },
              { 
                num: '02', 
                title: 'Customer taps', 
                desc: 'They tap their phone on the card. Instant redirect to your Google review page.',
                icon: '📱'
              },
              { 
                num: '03', 
                title: 'Get more reviews', 
                desc: 'More reviews, better ratings, more customers. Track everything in real-time.',
                icon: '⭐'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-7 sm:p-8 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-mono text-stone-300">{item.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2 tracking-tight">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 px-5 sm:px-8 bg-ink text-white relative overflow-hidden noise-bg">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16 sm:mb-20"
          >
            <p className="text-sm font-medium text-accent mb-3">Features</p>
            <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em]">
              Everything you need to grow
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {[
              { icon: Zap, title: 'Instant Redirect', desc: 'Lightning-fast NFC redirect. No loading screens, no delays. Under 100ms response time.' },
              { icon: BarChart3, title: 'Live Analytics', desc: 'Track scans, unique visitors, peak hours, and device types. Real-time dashboard.' },
              { icon: Shield, title: 'Change Anytime', desc: 'Update your destination URL without replacing the physical card. Takes effect instantly.' },
              { icon: QrCode, title: 'QR Code Backup', desc: 'Every card includes a QR code for devices without NFC. Same URL, same tracking.' },
              { icon: Smartphone, title: 'Multi-Card', desc: 'Different cards for tables, counters, and locations. Each with its own analytics.' },
              { icon: Globe, title: 'Works Everywhere', desc: 'Compatible with all modern smartphones. iOS and Android. No app required.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-ink p-7 sm:p-8 group hover:bg-ink-light transition-colors"
              >
                <feature.icon className="w-6 h-6 text-accent mb-5" />
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium text-accent mb-3">Analytics</p>
              <h2 className="display-lg text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-ink mb-6">
                Know exactly how your cards perform
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                Beautiful analytics that show you when, where, and how customers interact with your NFC cards. Privacy-respecting by design.
              </p>
              <ul className="space-y-4">
                {['Total & unique visitor tracking', 'Peak hours & day analysis', 'Device & browser breakdown', 'Per-card performance metrics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-stone-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Analytics Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="premium-card p-5 sm:p-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Total Scans', value: '12,482' },
                    { label: 'This Month', value: '+18.4%' },
                    { label: 'Unique', value: '8,291' },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-xl bg-stone-50">
                      <p className="text-lg sm:text-xl font-semibold text-ink">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-stone-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Chart mockup */}
                <div className="h-32 sm:h-40 rounded-xl bg-stone-50 p-4 flex items-end gap-1.5">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-accent to-accent-light opacity-80" style={{ height: `${h}%` }} />
                  ))}
                </div>
                {/* Cards */}
                <div className="mt-4 space-y-2">
                  {[
                    { name: 'Main Counter', scans: 5420 },
                    { name: 'Table 1', scans: 1240 },
                    { name: 'Table 2', scans: 921 },
                  ].map((card, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center">
                          <Wifi className="w-3 h-3 text-stone-400" />
                        </div>
                        <span className="text-sm text-ink">{card.name}</span>
                      </div>
                      <span className="text-sm font-medium text-stone-500">{card.scans.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 sm:py-32 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-sm font-medium text-accent mb-3">Pricing</p>
            <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-ink mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-stone-500 text-lg">One-time purchase. No hidden fees. No monthly subscriptions required.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '29', desc: 'For small businesses', features: ['1 NFC Card', 'QR Code included', 'Basic analytics', '90-day data retention', 'Email support'], popular: false },
              { name: 'Professional', price: '79', desc: 'Most popular choice', features: ['5 NFC Cards', 'QR Codes included', 'Advanced analytics', 'Custom branding', 'Priority support', '1-year data retention'], popular: true },
              { name: 'Enterprise', price: '199', desc: 'Multi-location', features: ['Unlimited Cards', 'Full analytics suite', 'White-label option', 'API access', 'Dedicated support', 'Unlimited retention'], popular: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-7 sm:p-8 rounded-2xl ${
                  plan.popular 
                    ? 'bg-ink text-white ring-1 ring-white/10 shadow-2xl shadow-ink/20 scale-[1.02]' 
                    : 'bg-stone-50 border border-stone-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-ink'}`}>{plan.name}</h3>
                <p className={`text-sm mt-1 ${plan.popular ? 'text-stone-400' : 'text-stone-500'}`}>{plan.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className={`text-4xl font-semibold ${plan.popular ? 'text-white' : 'text-ink'}`}>${plan.price}</span>
                  <span className={plan.popular ? 'text-stone-400' : 'text-stone-500'}>one-time</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5">
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-accent' : 'text-green-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-stone-300' : 'text-stone-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/order" 
                  className={`mt-8 block text-center py-3.5 rounded-xl font-medium transition-all ${
                    plan.popular 
                      ? 'bg-white text-ink hover:bg-stone-100' 
                      : 'bg-ink text-white hover:bg-ink-light'
                  }`}
                >
                  Get started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-ink mb-5">
              Ready to get more reviews?
            </h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto mb-10">
              Join thousands of businesses using TapReview to grow their online presence.
            </p>
            <Link to="/order" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium">
              <span className="flex items-center gap-2">
                Order your NFC card
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-5 sm:px-8 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center">
                  <Wifi className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-ink">tapreview</span>
              </Link>
              <p className="text-sm text-stone-500 leading-relaxed">
                NFC review cards for modern businesses. One tap, instant reviews.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'How it works', 'FAQ'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'GDPR'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-ink mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-stone-500 hover:text-ink transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-400">© 2024 TapReview. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social, i) => (
                <a key={i} href="#" className="text-xs text-stone-400 hover:text-ink transition-colors">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
