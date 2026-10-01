import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, RefreshCw, CheckCircle2, Truck, Scale } from 'lucide-react';
import { formatStepperQuantity } from '../utils/formatters';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isOpen,
    setIsOpen,
    isSyncing,
    subtotal,
    discountAmount,
    discountPercentage,
    promoCode,
    promoDescription,
    shippingFee,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  if (!isOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromoCode(inputCode);
    if (ok) {
      setInputCode('');
      setPromoError('');
    } else {
      setPromoError('Coupon not found. Try BERRYCUTE or FREESHIP');
    }
  };

  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-wood-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-farm-lg border-l-4 border-wood-300 flex flex-col justify-between">
          
          {/* Top Canopy Awning Accent */}
          <div className="h-3 farm-awning" />

          {/* Header */}
          <div className="p-5 sm:p-6 border-b-2 border-wood-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧺</span>
                <div>
                  <h2 className="text-xl font-farm font-black text-wood-900">Your Bushel Basket</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isSyncing ? (
                      <span className="text-[11px] font-bold text-barn-600 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Weighing fresh produce...
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-sage-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-sage-500" />
                        Freshly reserved at farm stand
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-parchment-200 text-wood-600 hover:text-wood-900 hover:bg-parchment-300 flex items-center justify-center transition-colors border border-wood-300 bouncy-click"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Chilled Shipping Progress Meter */}
            <div className="mt-4 bg-parchment-100 p-3.5 rounded-2xl border-2 border-wood-200/90 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-wood-800 mb-1.5">
                <span className="flex items-center gap-1.5 text-wood-900">
                  <Truck className="w-4 h-4 text-barn-600" />
                  {freeShippingRemaining <= 0 ? (
                    <span className="text-sage-700 font-black">🎉 You unlocked FREE Chilled Delivery!</span>
                  ) : (
                    <span>Add <strong className="text-barn-600 font-farm font-bold">${freeShippingRemaining.toFixed(2)}</strong> for Free Delivery</span>
                  )}
                </span>
                <span className="text-barn-600 font-mono font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-wood-200 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-barn-500 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items Scroll Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-24 h-24 rounded-full bg-parchment-200 flex items-center justify-center text-5xl shadow-xs border-2 border-wood-300 animate-bounce-soft">
                  🧺
                </div>
                <div className="max-w-xs space-y-1">
                  <h3 className="font-farm font-bold text-wood-900 text-lg">Your bushel is empty</h3>
                  <p className="text-xs text-wood-600">
                    The morning harvest is ready! Pick strawberries, blueberries, and raspberries weighed by the half-pound.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-barn-600 hover:bg-barn-700 text-white rounded-full font-farm font-bold text-xs shadow-farm bouncy-click"
                >
                  Start Picking 🍓
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className={`bg-white p-3.5 rounded-2xl border-2 border-wood-200/90 shadow-xs flex items-center gap-3 transition-all ${
                    item.pendingSync ? 'opacity-70 ring-2 ring-barn-300' : ''
                  }`}
                >
                  {/* Item Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-wood-200 flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-farm font-bold text-xs text-wood-900 leading-snug break-words">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-wood-500 font-medium flex items-center gap-1 mt-0.5">
                      {item.product.soldByHalfPound && <Scale className="w-3 h-3 text-barn-600" />}
                      <span>
                        {item.product.soldByHalfPound
                          ? `Scale: ${formatStepperQuantity(item.product, item.quantity)}`
                          : item.product.weight}
                      </span>
                    </p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-farm font-black text-sm text-wood-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-wood-400">
                          (${item.product.price.toFixed(2)} {item.product.soldByHalfPound ? '/ 1/2 lb' : 'ea'})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-parchment-100 rounded-xl p-0.5 border border-wood-300">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-6 h-6 rounded-lg bg-white text-wood-700 hover:bg-parchment-200 flex items-center justify-center font-bold text-xs shadow-xs bouncy-click"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 min-w-[36px] text-center font-black text-xs text-wood-900 whitespace-nowrap">
                      {formatStepperQuantity(item.product, item.quantity)}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-6 h-6 rounded-lg bg-barn-600 text-white hover:bg-barn-700 disabled:opacity-40 flex items-center justify-center font-bold text-xs shadow-xs bouncy-click"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Trash */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-wood-300 hover:text-barn-600 rounded-lg transition-colors bouncy-click"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Farm Stand Register Receipt Breakdown */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t-2 border-wood-200 bg-white space-y-4">
              
              {/* Promo Code Section */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-sage-50 border border-sage-300 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-sage-800">
                      <Tag className="w-3.5 h-3.5 text-sage-600" />
                      <span>{promoCode} ({discountPercentage}% OFF)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-sage-700 hover:text-sage-900 font-semibold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    {!showPromoInput ? (
                      <button
                        onClick={() => setShowPromoInput(true)}
                        className="text-xs font-bold text-wood-700 hover:text-barn-600 flex items-center gap-1.5"
                      >
                        <Tag className="w-3.5 h-3.5 text-barn-500" />
                        <span>Have a farm stand discount code?</span>
                      </button>
                    ) : (
                      <form onSubmit={handleApplyCode} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. BERRYCUTE, FREESHIP"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-parchment-100 border border-wood-300 rounded-xl px-3 py-1.5 text-xs uppercase font-bold text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-barn-600 text-white rounded-xl text-xs font-bold hover:bg-barn-700 transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-barn-600 mt-1">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Cost Breakdown Receipt */}
              <div className="kraft-tag p-3.5 rounded-xl space-y-1.5 text-xs text-wood-800">
                <div className="flex justify-between">
                  <span>Harvest Subtotal</span>
                  <span className="font-semibold text-wood-900">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sage-700 font-semibold">
                    <span>Farm Stand Coupon ({discountPercentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Chilled Courier Delivery</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-sage-700 font-bold uppercase">FREE</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t-2 border-dashed border-wood-300 text-base font-farm font-black text-wood-900">
                  <span>Estimated Total</span>
                  <span className="text-barn-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-barn-600 hover:bg-barn-700 text-white rounded-2xl font-farm font-black text-base shadow-farm-lg hover:shadow-farm flex items-center justify-center gap-2 bouncy-click group transition-colors"
              >
                <span>Checkout at Register</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-wood-500 font-medium pt-1">
                <span>🧺 Packed in eco-friendly vented crates & chilled for delivery</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

