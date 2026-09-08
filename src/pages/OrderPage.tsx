import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, ArrowRight, Check, ArrowLeft, Package, Truck, CreditCard } from 'lucide-react';

const products = [
  { id: 1, name: 'Starter', price: 29, cards: 1, desc: '1 NFC card + QR code', features: ['Basic analytics', '90-day retention'] },
  { id: 2, name: 'Professional', price: 79, cards: 5, desc: '5 NFC cards + QR codes', features: ['Advanced analytics', 'Custom branding', 'Priority support'] },
  { id: 3, name: 'Enterprise', price: 199, cards: -1, desc: 'Unlimited NFC cards', features: ['Full analytics suite', 'White-label option', 'API access'] },
];

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [shipping, setShipping] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'US' });

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-ink">tapreview</span>
          </Link>
          <Link to="/login" className="text-sm text-stone-500 hover:text-ink transition-colors">
            Log in
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10 sm:mb-14">
          {[
            { num: 1, label: 'Plan' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Shipping' },
            { num: 4, label: 'Confirm' },
          ].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                step >= s.num ? 'bg-ink text-white' : 'bg-stone-200 text-stone-400'
              }`}>
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`ml-2 text-xs font-medium hidden sm:inline ${step >= s.num ? 'text-ink' : 'text-stone-400'}`}>
                {s.label}
              </span>
              {i < 3 && <div className={`w-8 sm:w-12 h-px mx-2 ${step > s.num ? 'bg-ink' : 'bg-stone-200'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">Choose your plan</h2>
                <p className="text-stone-500 mb-8">One-time purchase. No subscriptions required.</p>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  {products.map((product, i) => (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedProduct(product)}
                      className={`relative p-5 sm:p-6 rounded-2xl text-left transition-all ${
                        selectedProduct?.id === product.id
                          ? 'bg-ink text-white ring-2 ring-ink shadow-xl shadow-ink/10'
                          : 'bg-white border border-stone-200 hover:border-stone-300 hover:shadow-md'
                      }`}
                    >
                      {i === 1 && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-medium">
                          Popular
                        </div>
                      )}
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-semibold">${product.price}</span>
                        <span className={selectedProduct?.id === product.id ? 'text-white/50' : 'text-stone-400'}>one-time</span>
                      </div>
                      <p className={`text-sm mt-2 ${selectedProduct?.id === product.id ? 'text-white/60' : 'text-stone-500'}`}>{product.desc}</p>
                      <ul className="mt-4 space-y-1.5">
                        {product.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-xs">
                            <Check className={`w-3 h-3 ${selectedProduct?.id === product.id ? 'text-accent' : 'text-green-500'}`} />
                            <span className={selectedProduct?.id === product.id ? 'text-white/70' : 'text-stone-500'}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => selectedProduct && setStep(2)}
                  disabled={!selectedProduct}
                  className="w-full mt-8 btn-primary py-4 rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-ink mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">Business details</h2>
                <p className="text-stone-500 mb-8">Tell us about your business.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ink block mb-1.5">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="ABC Restaurant"
                      className="input-premium"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200/50">
                    <p className="text-xs text-stone-500">
                      After purchase, an admin will create your dashboard account and share login credentials via email.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-8 btn-primary py-4 rounded-xl font-medium"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-ink mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">Shipping address</h2>
                <p className="text-stone-500 mb-8">Where should we send your NFC cards?</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ink block mb-1.5">Full Name</label>
                    <input type="text" value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} placeholder="John Smith" className="input-premium" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink block mb-1.5">Street Address</label>
                    <input type="text" value={shipping.street} onChange={(e) => setShipping({...shipping, street: e.target.value})} placeholder="123 Main St" className="input-premium" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-ink block mb-1.5">City</label>
                      <input type="text" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="input-premium" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ink block mb-1.5">State</label>
                      <input type="text" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="input-premium" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ink block mb-1.5">ZIP</label>
                      <input type="text" value={shipping.zip} onChange={(e) => setShipping({...shipping, zip: e.target.value})} className="input-premium" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full mt-8 btn-primary py-4 rounded-xl font-medium"
                >
                  <span className="flex items-center justify-center gap-2">
                    Place Order — ${selectedProduct?.price} <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-2">Order placed!</h2>
                <p className="text-stone-500 mb-8 max-w-md mx-auto">
                  Your NFC cards will be shipped soon. An admin will create your dashboard account and share login credentials.
                </p>
                
                <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 mb-8">
                  <Package className="w-5 h-5 text-stone-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-ink">{selectedProduct?.name} Pack</div>
                    <div className="text-xs text-stone-400">Order #TR-{Date.now().toString().slice(-6)}</div>
                  </div>
                  <div className="text-lg font-semibold text-ink">${selectedProduct?.price}</div>
                </div>

                <div>
                  <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium">
                    <span className="flex items-center gap-2">Go to Login <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
