'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wifi, ArrowRight, Check, CreditCard, Truck, Package } from 'lucide-react';

const products = [
  { id: 1, name: 'Starter Pack', price: 29, cards: 1, desc: '1 NFC card + QR code' },
  { id: 2, name: 'Professional Pack', price: 79, cards: 5, desc: '5 NFC cards + QR codes' },
  { id: 3, name: 'Enterprise Pack', price: 199, cards: -1, desc: 'Unlimited NFC cards' },
];

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [shipping, setShipping] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'US' });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">TapReview</span>
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Already have an account? Log in
          </Link>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-2 mb-10">
          {[
            { num: 1, label: 'Product' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Shipping' },
            { num: 4, label: 'Confirm' },
          ].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`ml-2 text-sm ${step >= s.num ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {i < 3 && <div className={`w-12 h-0.5 mx-3 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Choose your plan</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedProduct?.id === product.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-bold text-gray-900">{product.name}</div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">${product.price}</div>
                    <div className="text-sm text-gray-500 mt-1">{product.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!selectedProduct}
                className="mt-6 w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Business details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="ABC Restaurant"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  After purchase, an admin will create your account and share login credentials.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-4 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100">Back</button>
                <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                  <input type="text" value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Street Address</label>
                  <input type="text" value={shipping.street} onChange={(e) => setShipping({...shipping, street: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">City</label>
                    <input type="text" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">State</label>
                    <input type="text" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">ZIP</label>
                    <input type="text" value={shipping.zip} onChange={(e) => setShipping({...shipping, zip: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="px-4 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100">Back</button>
                <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
              <p className="text-gray-500 mb-6">
                Thank you! Your NFC cards will be shipped soon. An admin will create your dashboard account and share login credentials via email.
              </p>
              <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <Package className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{selectedProduct?.name}</div>
                  <div className="text-xs text-gray-500">Order #TR-{Date.now().toString().slice(-6)}</div>
                </div>
                <div className="text-lg font-bold text-gray-900">${selectedProduct?.price}</div>
              </div>
              <div className="mt-6">
                <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                  Go to Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
