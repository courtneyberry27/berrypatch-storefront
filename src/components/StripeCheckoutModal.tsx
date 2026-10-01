import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CustomerShippingInfo, OrderConfirmation } from '../types';
import { headlessService } from '../services/headlessApi';
import { X, Lock, CreditCard, AlertCircle, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: OrderConfirmation) => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { items, subtotal, discountAmount, shippingFee, total, promoCode, clearCart } = useCart();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState<CustomerShippingInfo>({
    fullName: 'Courtney Berry',
    email: 'courtney@berrypatch.farm',
    address: '742 Evergreen Orchard Lane',
    apartment: 'Cottage #4',
    city: 'Hood River',
    state: 'OR',
    zipCode: '97031',
    deliveryInstructions: 'Please leave in the shaded porch cool box 🍓',
  });

  // Stripe Card state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardZip, setCardZip] = useState('97031');

  if (!isOpen) return null;

  // Format credit card with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiration with slash
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExp(value);
  };

  const handleQuickFillSuccess = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12/28');
    setCardCvc('424');
    setErrorMessage('');
  };

  const handleQuickFillDecline = () => {
    setCardNumber('4000 0000 0000 0002');
    setCardExp('08/27');
    setCardCvc('102');
    setErrorMessage('');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
      setErrorMessage('Please fill in your shipping details.');
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const order = await headlessService.processStripePayment({
        cardNumber,
        cardExp,
        cardCvc,
        cardZip,
        items,
        shippingInfo,
        promoCode: promoCode || undefined,
      });

      // Clear local cart optimistically
      clearCart();
      setIsProcessing(false);
      onSuccess(order);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed. Please verify your card.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-wood-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-farm-lg border-2 border-wood-300 my-6 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Farm Awning Strip */}
        <div className="h-3 farm-awning" />

        {/* Top Stripe Test Mode Banner */}
        <div className="bg-wood-900 text-parchment-100 px-6 py-2.5 flex items-center justify-between text-xs border-b border-wood-700">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Farm Stand Register • Stripe Sandbox</span>
          </div>
          <span className="text-wood-300 text-[11px] font-mono">pk_test_berrypatch_farm</span>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b-2 border-wood-200 flex items-center justify-between bg-parchment-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-parchment-200 border-2 border-wood-300 text-barn-600 flex items-center justify-center font-bold text-xl shadow-xs">
              🧺
            </div>
            <div>
              <h2 className="text-xl font-farm font-black text-wood-900">Farm Stand Register</h2>
              <p className="text-xs text-wood-600">
                Step {step === 'shipping' ? '1 of 2: Cooler Box Delivery Address' : '2 of 2: Card Payment'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-parchment-200 text-wood-600 hover:text-wood-900 hover:bg-parchment-300 flex items-center justify-center transition-colors border border-wood-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          
          {/* Order Snapshot Mini Summary */}
          <div className="kraft-tag p-3.5 rounded-2xl mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧺</span>
              <span className="font-semibold text-wood-800">
                {items.length} variety {items.length > 1 ? 'items' : 'item'} in bushel
              </span>
            </div>
            <div className="font-bold text-sm text-wood-900">
              Total: <span className="text-barn-600 font-farm font-black text-base">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-6 bg-rose-50 border border-rose-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-pop">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Notice:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* STEP 1: Shipping Details */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-wood-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wood-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wood-800 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-wood-800 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3 py-2.5 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wood-800 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3 py-2.5 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-wood-800 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3 py-2.5 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wood-800 mb-1">
                  Delivery Notes <span className="font-normal text-wood-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={shippingInfo.deliveryInstructions}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, deliveryInstructions: e.target.value })}
                  placeholder="e.g. Leave in shaded porch cooler"
                  className="w-full bg-parchment-50 border-2 border-wood-300 rounded-xl px-3.5 py-2 text-xs font-medium text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-barn-600 hover:bg-barn-700 text-white font-farm font-bold text-base rounded-2xl shadow-farm flex items-center justify-center gap-2 bouncy-click transition-colors"
                >
                  <span>Continue to Card Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Stripe Payment */}
          {step === 'payment' && (
            <form onSubmit={handleStripeSubmit} className="space-y-5">
              
              {/* Quick Fill Test Cards */}
              <div className="bg-parchment-100 p-3.5 rounded-2xl border-2 border-wood-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-wood-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Stripe Sandbox Simulator Presets:</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleQuickFillSuccess}
                    className="px-3 py-1.5 bg-white hover:bg-sage-50 text-sage-800 border-2 border-sage-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>✓ Fill Success Card (4242...)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickFillDecline}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-800 border-2 border-rose-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>✕ Test Decline Card</span>
                  </button>
                </div>
              </div>

              {/* Stripe Elements Card Box */}
              <div className="border-2 border-wood-300 rounded-2xl p-4 shadow-xs bg-parchment-50 focus-within:ring-2 focus-within:ring-barn-400 focus-within:border-barn-500 transition-all">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-wood-800">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-barn-600" />
                    <span>Card Information</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-[10px] font-extrabold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">MC</span>
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">AMEX</span>
                  </div>
                </div>

                {/* Card Number Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    required
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full text-sm font-mono tracking-wider text-wood-900 placeholder-wood-400 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-wood-200">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-wood-500 mb-0.5">Expires</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExp}
                      onChange={handleExpChange}
                      className="w-full text-xs font-mono text-wood-900 placeholder-wood-400 bg-transparent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-wood-500 mb-0.5">CVC</label>
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs font-mono text-wood-900 placeholder-wood-400 bg-transparent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-wood-500 mb-0.5">Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="ZIP"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      className="w-full text-xs font-mono text-wood-900 placeholder-wood-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Back to shipping button & Pay button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-barn-600 hover:bg-barn-700 disabled:opacity-60 text-white font-farm font-black text-base rounded-2xl shadow-farm-lg flex items-center justify-center gap-2.5 bouncy-click transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Farm Stand Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${total.toFixed(2)} with Stripe</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-full py-2 text-xs font-bold text-wood-600 hover:text-wood-900"
                >
                  ← Edit Shipping Address
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-wood-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
                <span>Protected by Stripe end-to-end tokenization</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

