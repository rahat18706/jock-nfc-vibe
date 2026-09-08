import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Smartphone, Wifi, Star, TrendingUp, Shield, Zap, 
  ChevronRight, ArrowRight, Check, QrCode, BarChart3,
  Globe, Users, CreditCard, Settings, Menu, X,
  Sparkles, MousePointer2
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">TapReview</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors">Log In</Link>
              <Link to="/order" className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-full transition-all hover:shadow-lg">
                Order Now
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white border-t border-gray-100 p-4">
            <div className="flex flex-col gap-3">
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 py-2">How It Works</a>
              <a href="#features" className="text-sm font-medium text-gray-600 py-2">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 py-2">Pricing</a>
              <Link to="/login" className="text-sm font-medium text-gray-600 py-2">Log In</Link>
              <Link to="/order" className="text-sm font-medium text-white bg-gray-900 px-5 py-2.5 rounded-full text-center mt-2">Order Now</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-brand-50 via-brand-100/30 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-purple-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Trusted by 500+ businesses
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                Get more Google reviews with{' '}
                <span className="gradient-text-dark">one simple tap</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Place our premium NFC card at your business. Customers tap their phone — instantly redirected to leave a review. Change the destination anytime, no card replacement needed.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/order" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-base hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5">
                  Order Your Card
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  See How It Works
                  <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['🍽️', '💇', '☕', '🏋️'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">4.9/5</span> from 200+ reviews
                </div>
              </motion.div>
            </div>

            {/* Right - 3D Card + Scene */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative flex items-center justify-center lg:justify-end">
              <HeroScene />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Bar */}
      <section className="relative py-16 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Businesses' },
              { value: '124K+', label: 'Reviews Generated' },
              { value: '98%', label: 'Redirect Success' },
              { value: '< 0.3s', label: 'Avg. Tap Speed' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start collecting more reviews today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '01', icon: <CreditCard className="w-6 h-6" />, title: 'Place the card', desc: 'Put your TapReview NFC card at your counter, table, or checkout. It blends beautifully with any environment.' },
              { step: '02', icon: <MousePointer2 className="w-6 h-6" />, title: 'Customer taps', desc: 'Customers tap their phone on the card. Instantly redirected to your Google review page. No app needed.' },
              { step: '03', icon: <TrendingUp className="w-6 h-6" />, title: 'Watch reviews grow', desc: 'Track every tap in your analytics dashboard. Change the destination URL anytime without replacing the card.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 hover:shadow-lg hover:shadow-brand-50 transition-all duration-300">
                  <div className="text-6xl font-bold text-gray-100 absolute top-4 right-6">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                One card.{' '}
                <span className="text-gray-400">Infinite flexibility.</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Your NFC card uses a dynamic URL on our platform. Change where it points anytime from your dashboard — without touching the physical card. Switch from Google reviews to your menu, social media, or anything else.
              </p>
              <div className="space-y-4">
                {[
                  'Change destination URL instantly from dashboard',
                  'Track every tap with detailed analytics',
                  'Works on any NFC-enabled smartphone',
                  'QR code fallback for non-NFC devices',
                  'Premium materials — built to last',
                  'Custom branding available'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Card */}
            <div className="relative flex justify-center">
              <InteractiveCard />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete review collection system, not just a card
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-5 h-5" />, title: 'Instant Redirect', desc: 'Sub-300ms redirect speed. Customers never wait.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Real-time Analytics', desc: 'See every tap, every device, every location.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Enterprise Security', desc: 'URL validation, rate limiting, bot protection.' },
              { icon: <Globe className="w-5 h-5" />, title: 'Dynamic URLs', desc: 'Change destination without replacing the card.' },
              { icon: <QrCode className="w-5 h-5" />, title: 'QR Fallback', desc: 'Every card includes a scannable QR code backup.' },
              { icon: <Users className="w-5 h-5" />, title: 'Multi-location', desc: 'Manage cards across all your locations.' },
              { icon: <Settings className="w-5 h-5" />, title: 'Full Dashboard', desc: 'Complete control from a beautiful interface.' },
              { icon: <Star className="w-5 h-5" />, title: 'Custom Branding', desc: 'Your logo, your colors, your identity.' },
              { icon: <Smartphone className="w-5 h-5" />, title: 'Works Everywhere', desc: 'iPhone & Android. No app required.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center text-gray-600 group-hover:text-brand-600 transition-colors mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-24 lg:py-32 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Analytics that{' '}
                <span className="text-brand-400">actually help</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Know exactly when, where, and how customers interact with your cards. Make data-driven decisions to maximize your review collection.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '12,482', label: 'Total Scans' },
                  { value: '+18.4%', label: 'This Month' },
                  { value: '847', label: 'Today' },
                  { value: '94%', label: 'Mobile' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Dashboard Preview */}
            <div className="relative">
              <div className="rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs text-gray-400">Dashboard — Analytics</span>
                </div>
                
                {/* Mini chart */}
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-2">Scans this week</div>
                  <div className="flex items-end gap-1.5 h-24">
                    {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-600 to-brand-400 opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                  </div>
                </div>

                {/* Card performance */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">Card Performance</div>
                  {[
                    { name: 'Main Counter', scans: 5420, pct: 85 },
                    { name: 'Table 1', scans: 1240, pct: 45 },
                    { name: 'Table 2', scans: 921, pct: 35 },
                  ].map((card, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300">{card.name}</span>
                          <span className="text-gray-400">{card.scans.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${card.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Built for every business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From restaurants to clinics, TapReview works wherever you need more reviews
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: '🍽️', name: 'Restaurants' },
              { emoji: '💇', name: 'Salons' },
              { emoji: '☕', name: 'Cafes' },
              { emoji: '🏨', name: 'Hotels' },
              { emoji: '🏋️', name: 'Gyms' },
              { emoji: '🏥', name: 'Clinics' },
              { emoji: '🛍️', name: 'Shops' },
              { emoji: '💈', name: 'Barbers' },
              { emoji: '🍕', name: 'Food Trucks' },
              { emoji: '🏠', name: 'Real Estate' },
              { emoji: '🚗', name: 'Auto Shops' },
              { emoji: '📸', name: 'Studios' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="p-4 rounded-xl border border-gray-100 text-center hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{item.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              One-time purchase. Free dashboard forever. No subscriptions required.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', cards: 4, price: 29.99, popular: false },
              { name: 'Business', cards: 10, price: 49.99, popular: true },
              { name: 'Premium', cards: 25, price: 99.99, popular: false },
              { name: 'Enterprise', cards: 50, price: 199.99, popular: false }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border ${plan.popular ? 'border-brand-300 bg-white shadow-xl shadow-brand-100/50 ring-1 ring-brand-200' : 'border-gray-200 bg-white hover:border-gray-300'} transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold">${plan.price}</div>
                  <div className="text-sm text-gray-500">{plan.cards} NFC cards</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {['Free dashboard', 'Unlimited scans', 'Analytics included', 'Dynamic URLs', 'QR code backup'].map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/order"
                  className={`block text-center py-3 rounded-full font-medium text-sm transition-all ${plan.popular ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How does the NFC card work?', a: 'When a customer taps their NFC-enabled phone on the card, it opens a URL in their browser that instantly redirects them to your configured destination (e.g., Google review page). No app needed.' },
              { q: 'Can I change the destination URL later?', a: 'Absolutely! Log into your dashboard and change the destination URL at any time. The physical card stays the same — it always points to our platform, which then redirects to your current URL.' },
              { q: 'What if a customer\'s phone doesn\'t have NFC?', a: 'Every card includes a printed QR code as a fallback. Scanning the QR code takes them to the same destination.' },
              { q: 'Do I need a subscription?', a: 'No. The cards are a one-time purchase. Your analytics dashboard and URL management are free forever.' },
              { q: 'How fast is the redirect?', a: 'Our redirect system is optimized for speed — typically under 300ms. Customers see an instant transition to your review page.' },
              { q: 'Can I track which card location gets the most taps?', a: 'Yes! Each card has a unique identifier. Your analytics dashboard shows performance per card, so you know exactly which location drives the most engagement.' }
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to collect more reviews?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 500+ businesses already using TapReview to grow their online presence.
          </p>
          <Link to="/order" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-base hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5">
            Order Your Cards Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Wifi className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-lg font-bold">TapReview</span>
              </div>
              <p className="text-sm text-gray-500">NFC-powered review cards for modern businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-gray-500 hover:text-gray-700">Features</a>
                <a href="#pricing" className="block text-sm text-gray-500 hover:text-gray-700">Pricing</a>
                <Link to="/order" className="block text-sm text-gray-500 hover:text-gray-700">Order</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-gray-500 hover:text-gray-700">About</a>
                <a href="#" className="block text-sm text-gray-500 hover:text-gray-700">Contact</a>
                <a href="#" className="block text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Dashboard</h4>
              <div className="space-y-2">
                <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-700">Log In</Link>
                <Link to="/dashboard" className="block text-sm text-gray-500 hover:text-gray-700">Business Dashboard</Link>
                <Link to="/admin" className="block text-sm text-gray-500 hover:text-gray-700">Admin Panel</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2024 TapReview. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Hero Scene Component
function HeroScene() {
  return (
    <div className="relative w-full max-w-md lg:max-w-lg">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-200/30 via-brand-100/20 to-purple-100/20 rounded-full blur-3xl scale-110" />
      
      {/* Main card */}
      <div className="relative card-3d">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* NFC Card */}
          <div className="relative w-72 h-44 sm:w-80 sm:h-48 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 nfc-card-shadow overflow-hidden mx-auto">
            {/* Card content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center">
                    <Wifi className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-medium">TapReview</span>
                </div>
                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                </div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-1">Leave us a review</div>
                <div className="text-white text-lg font-semibold">Tap your phone here</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-white/30 text-xs font-mono">NFC</div>
              </div>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-shimmer" />
            
            {/* QR Code area */}
            <div className="absolute bottom-4 right-4 w-10 h-10 rounded bg-white/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white/40" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -top-4 -right-4 sm:top-0 sm:right-0 w-16 h-20 rounded-lg bg-white shadow-xl border border-gray-100 p-2 flex flex-col items-center justify-center"
      >
        <div className="text-lg">📱</div>
        <div className="text-[8px] text-gray-400 mt-1">Tap to review</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -left-4 sm:bottom-4 sm:left-0 px-3 py-2 rounded-xl bg-white shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-900">Review submitted!</div>
            <div className="text-[10px] text-gray-400">Just now</div>
          </div>
        </div>
      </motion.div>

      {/* Scan lines animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-52 pointer-events-none">
        <div className="absolute inset-0 border-2 border-dashed border-brand-200/30 rounded-3xl" />
      </div>
    </div>
  );
}

// Interactive Card Component
function InteractiveCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        animate={{ 
          rotateY: isHovered ? 8 : 0,
          rotateX: isHovered ? -5 : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-72 sm:w-80 h-44 sm:h-48 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 nfc-card-shadow overflow-hidden cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/90 text-sm font-semibold">TapReview</span>
            </div>
            <div className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-medium">NFC</div>
          </div>

          <div className="space-y-1">
            <div className="text-white/60 text-xs">Scan to review</div>
            <div className="text-white text-xl font-bold">ABC Restaurant</div>
            <div className="text-white/50 text-xs">tapreview.com/s/abc-restaurant</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              ))}
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white/60" />
            </div>
          </div>
        </div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </motion.div>

      {/* URL change indicator */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <div className="px-4 py-2 rounded-full bg-gray-900 text-white text-xs font-medium shadow-lg">
          ✨ Destination URL changes instantly from dashboard
        </div>
      </motion.div>
    </div>
  );
}

// FAQ Item
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-5 pb-5"
        >
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}
