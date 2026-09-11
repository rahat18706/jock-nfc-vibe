import { Link } from 'react-router-dom';
import { Wifi, ArrowRight, Star, Zap, Shield, Smartphone } from 'lucide-react';
import { Button } from '../components/ui';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-accent" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">TapReview</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How it works</a>
              <Link to="/login" className="text-sm text-muted hover:text-foreground transition-colors">Log in</Link>
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-5 sm:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">The Smart Review Card</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                A tap should be{' '}
                <span className="text-gradient">all it takes</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted leading-relaxed mb-8 max-w-xl">
                NFC + QR review cards for modern businesses. Let customers leave Google reviews with a single tap.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg">
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    See How It Works
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['bg-accent', 'bg-success', 'bg-warning', 'bg-info'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-background`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-0.5">Trusted by 500+ businesses</p>
                </div>
              </div>
            </div>

            {/* Right - NFC Card Visual */}
            <div className="relative animate-fade-in">
              <div className="relative w-full max-w-md mx-auto">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-3xl scale-90" />
                
                {/* Card */}
                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-premium">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Wifi className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-foreground">TapReview</span>
                    </div>
                    <div className="badge badge-info">
                      <span className="text-xs">NFC</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="mb-6">
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">Tap to review</p>
                    <p className="text-2xl font-bold text-foreground mb-3">Your Business</p>
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                      <span className="text-xs text-muted ml-1">Leave a review</span>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="aspect-square bg-background border border-border rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-card border border-border rounded-lg flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-muted" />
                      </div>
                      <p className="text-xs text-muted">Scan QR Code</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium shadow-premium animate-pulse-glow">
                  ✓ Review submitted!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Powerful features to help you collect more reviews and grow your business.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Instant Redirect',
                description: 'Lightning-fast NFC redirect. No loading screens, no delays.',
              },
              {
                icon: Shield,
                title: 'Change Anytime',
                description: 'Update your destination URL without replacing the physical card.',
              },
              {
                icon: Smartphone,
                title: 'Works Everywhere',
                description: 'Compatible with all modern smartphones. iOS and Android.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 card-hover"
              >
                <feature.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-32 px-5 sm:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Three simple steps to start collecting more reviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Place the card',
                description: 'Put the NFC card at your counter, table, or reception.',
              },
              {
                step: '02',
                title: 'Customer taps',
                description: 'They tap their phone on the card. Instant redirect to your Google review page.',
              },
              {
                step: '03',
                title: 'Get more reviews',
                description: 'More reviews, better ratings, more customers. Track everything in real-time.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-accent/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative bg-background border border-border rounded-xl p-6 pt-12">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-5">
            Ready to get more reviews?
          </h2>
          <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
            Join thousands of businesses using TapReview to grow their online presence.
          </p>
          <Button variant="primary" size="lg">
            <span className="flex items-center gap-2">
              Order Your NFC Card
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 sm:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Wifi className="w-3 h-3 text-accent" />
              </div>
              <span className="font-semibold text-foreground">TapReview</span>
            </div>
            <p className="text-sm text-muted">© 2024 TapReview. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
