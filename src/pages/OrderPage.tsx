import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, Check, ArrowRight, ArrowLeft, CreditCard, Truck,
  Shield, Star, QrCode, Package, ChevronDown
} from 'lucide-react';
import { products } from '../data/mockData';

type Step = 'product' | 'details' | 'shipping' | 'payment' | 'confirmation';

export default function OrderPage() {
  const [step, setStep] = useState<Step>('product');
  const [selectedProduct, setSelectedProduct] = useState(products[1]);
  const [quantity, setQuantity] = useState(1);

  const steps: { id: Step; label: string }[] = [
    { id: 'product', label: 'Choose' },
    { id: 'details', label: 'Details' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Done' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Wifi className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold">TapReview</span>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to site</Link>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= currentStepIndex ? 'text-brand-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                  i < currentStepIndex ? 'bg-brand-600 border-brand-600 text-white' :
                  i === currentStepIndex ? 'border-brand-600 text-brand-600' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-brand-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'product' && (
            <motion.div key="product" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ProductStep
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                quantity={quantity}
                setQuantity={setQuantity}
                onNext={() => setStep('details')}
              />
            </motion.div>
          )}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <DetailsStep onNext={() => setStep('shipping')} onBack={() => setStep('product')} />
            </motion.div>
          )}
          {step === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ShippingStep onNext={() => setStep('payment')} onBack={() => setStep('details')} />
            </motion.div>
          )}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PaymentStep total={selectedProduct.price * quantity} onNext={() => setStep('confirmation')} onBack={() => setStep('shipping')} />
            </motion.div>
          )}
          {step === 'confirmation' && (
            <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <ConfirmationStep />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProductStep({ selectedProduct, setSelectedProduct, quantity, setQuantity, onNext }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your pack</h2>
      <p className="text-gray-500 mb-8">Select the NFC card pack that fits your business</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {products.map(product => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              selectedProduct.id === product.id
                ? 'border-brand-500 bg-brand-50/50 shadow-md'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.description}</div>
              </div>
              {selectedProduct.id === product.id && (
                <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <span className="text-sm text-gray-400">one-time</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <CreditCard className="w-3 h-3" />
              {product.cards} NFC cards included
            </div>
          </button>
        ))}
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 mb-6">
        <div>
          <div className="text-sm font-medium text-gray-900">Quantity</div>
          <div className="text-xs text-gray-500">{selectedProduct.cards} cards per pack</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">-</button>
          <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-brand-50 border border-brand-100 mb-6">
        <div className="text-sm font-medium text-brand-700">Total</div>
        <div className="text-2xl font-bold text-brand-700">${(selectedProduct.price * quantity).toFixed(2)}</div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <Wifi className="w-4 h-4" />, text: 'NFC Enabled' },
          { icon: <QrCode className="w-4 h-4" />, text: 'QR Backup' },
          { icon: <Shield className="w-4 h-4" />, text: 'Premium Material' },
          { icon: <Package className="w-4 h-4" />, text: 'Free Shipping' }
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
            <span className="text-brand-600">{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>

      <button onClick={onNext} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function DetailsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Business details</h2>
      <p className="text-gray-500 mb-8">Tell us about your business — we'll set up your NFC cards</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Business Name *</label>
          <input type="text" placeholder="e.g. ABC Restaurant" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none appearance-none bg-white">
              <option>Restaurant</option>
              <option>Cafe</option>
              <option>Salon</option>
              <option>Gym</option>
              <option>Hotel</option>
              <option>Clinic</option>
              <option>Shop</option>
              <option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Google Review URL *</label>
          <input type="url" placeholder="https://g.page/r/your-business" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          <p className="text-xs text-gray-400 mt-1">We'll redirect NFC taps to this URL. You can change it anytime later.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
            <input type="email" placeholder="you@business.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
            <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
          Continue to Shipping
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ShippingStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping address</h2>
      <p className="text-gray-500 mb-8">Where should we send your NFC cards?</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Full Name *</label>
          <input type="text" placeholder="John Smith" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Street Address *</label>
          <input type="text" placeholder="123 Main Street" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">City *</label>
            <input type="text" placeholder="New York" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">ZIP Code *</label>
            <input type="text" placeholder="10001" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-gray-700 block mb-1">Country *</label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none appearance-none bg-white">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>France</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping info */}
      <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
        <Truck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-green-800">Free standard shipping</div>
          <div className="text-xs text-green-600">Estimated delivery: 5-7 business days</div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
          Continue to Payment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PaymentStep({ total, onNext, onBack }: { total: number; onNext: () => void; onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
      <p className="text-gray-500 mb-8">Complete your order</p>

      {/* Order summary */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Card form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Card Number</label>
          <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Expiry</label>
            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">CVC</label>
            <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Shield className="w-3.5 h-3.5" />
        Your payment info is encrypted and secure. We never store card details.
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all">
          Pay ${total.toFixed(2)}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ConfirmationStep() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-8 h-8 text-green-600" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order confirmed!</h2>
      <p className="text-gray-500 mb-8">Your NFC cards are on their way. We'll send tracking info to your email.</p>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6 text-left max-w-sm mx-auto">
        <div className="text-xs text-gray-500 mb-1">Order Number</div>
        <div className="text-sm font-mono font-semibold text-gray-900">#ORD-2024-0847</div>
        <div className="text-xs text-gray-500 mt-3 mb-1">Estimated Delivery</div>
        <div className="text-sm font-medium text-gray-900">5-7 business days</div>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <Link to="/dashboard" className="block w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
          Go to Dashboard
        </Link>
        <Link to="/" className="block w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
