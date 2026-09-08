import Link from 'next/link';
import { Wifi, Star, BarChart3, Zap, Shield, Smartphone, ArrowRight, Check } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TapReview</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Log In</Link>
              <Link href="/order" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">One tap. Instant reviews.</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Get more Google reviews with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  one simple tap
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Place our NFC card at your business. Customers tap their phone and are instantly directed to leave a Google review. Change the destination anytime — no card replacement needed.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/order" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20">
                  Order Your Card
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  See How It Works
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Trusted by 2,000+ businesses</p>
                </div>
              </div>
            </div>

            {/* 3D NFC Card Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-80 h-48" style={{ perspective: '1000px' }}>
                <div 
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <Wifi className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">TapReview</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Tap to Review</p>
                      <p className="text-white text-lg font-semibold">ABC Restaurant</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-white/60 text-xs ml-1">Leave us a review!</span>
                      </div>
                    </div>
                  </div>
                  {/* NFC shimmer effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                </div>
              </div>
              
              {/* Phone mockup */}
              <div className="absolute -bottom-4 -right-4 w-20 h-36 rounded-xl bg-gray-100 border-4 border-gray-300 shadow-lg transform rotate-12">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gray-300" />
                <div className="absolute inset-3 top-6 rounded-lg bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                  <div className="text-center">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 mx-auto" />
                    <p className="text-[8px] text-gray-500 mt-1">Tap to Review</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium shadow-sm">
                ✓ Review submitted!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to more reviews</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Place the card', desc: 'Put the NFC card at your counter, table, or reception. Customers see the review prompt.', icon: '📍' },
              { step: '02', title: 'Customer taps', desc: 'They tap their phone on the card. Instant redirect to your Google review page.', icon: '📱' },
              { step: '03', title: 'Get reviews', desc: 'More reviews, better ratings, more customers. Track everything in your dashboard.', icon: '⭐' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-blue-600 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful features to grow your business</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Instant Redirect', desc: 'Lightning-fast NFC redirect. No loading screens, no delays.' },
              { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track scans, unique visitors, peak hours, and device types.' },
              { icon: Shield, title: 'Change Anytime', desc: 'Update your destination URL without replacing the physical card.' },
              { icon: Smartphone, title: 'QR Code Backup', desc: 'Every card includes a QR code for devices without NFC.' },
              { icon: Star, title: 'Multi-Card Support', desc: 'Different cards for tables, counters, and locations.' },
              { icon: Wifi, title: 'Works Everywhere', desc: 'Compatible with all modern smartphones. iOS and Android.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple pricing</h2>
            <p className="mt-4 text-lg text-gray-600">One-time purchase. No monthly fees for basic plan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '$29', desc: 'Perfect for small businesses', features: ['1 NFC Card', 'QR Code', 'Basic Analytics', '90-day data retention'], popular: false },
              { name: 'Professional', price: '$79', desc: 'For growing businesses', features: ['5 NFC Cards', 'QR Codes', 'Advanced Analytics', 'Custom branding', 'Priority support'], popular: true },
              { name: 'Enterprise', price: '$199', desc: 'Multi-location businesses', features: ['Unlimited Cards', 'Full Analytics Suite', 'White-label option', 'API access', 'Dedicated support'], popular: false },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-2xl ${plan.popular ? 'bg-gray-900 text-white ring-2 ring-blue-500 scale-105' : 'bg-white border border-gray-200'}`}>
                {plan.popular && <div className="text-xs font-bold text-blue-400 mb-2">MOST POPULAR</div>}
                <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={plan.popular ? 'text-gray-400' : 'text-gray-500'}>one-time</span>
                </div>
                <p className={`mt-2 text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-blue-400' : 'text-green-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/order" className={`mt-8 block text-center py-3 rounded-xl font-semibold transition-colors ${plan.popular ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Ready to get more reviews?</h2>
          <p className="mt-4 text-lg text-gray-600">Join thousands of businesses using TapReview to grow their online presence.</p>
          <Link href="/order" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg">
            Order Your NFC Card
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Wifi className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-gray-900">TapReview</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 TapReview. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
