import React, { useEffect } from 'react';
import { OrderConfirmation } from '../types';
import confetti from 'canvas-confetti';
import { Truck, Printer, ArrowRight } from 'lucide-react';
import { formatStepperQuantity } from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: OrderConfirmation | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  useEffect(() => {
    if (order) {
      // Fire celebration confetti!
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#C1292E', '#E63946', '#F4A261', '#2A9D8F', '#E76F51', '#F1FAEE'],
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [order]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-wood-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-farm-lg border-2 border-wood-300 my-8 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Farm Stand Awning Header */}
        <div className="h-4 farm-awning" />

        {/* Celebration Header */}
        <div className="bg-barn-600 text-white p-7 text-center relative overflow-hidden">
          <div className="w-18 h-18 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center text-4xl shadow-xs mb-3 border-2 border-white/30">
            🧺
          </div>
          <h2 className="text-2xl sm:text-3xl font-farm font-black tracking-tight">
            Order Confirmed at the Stand! 🍓
          </h2>
          <p className="text-xs sm:text-sm text-parchment-100 font-medium mt-1 font-sans">
            Thank you for supporting our Hood River Valley family berry farm!
          </p>
          <div className="mt-3 inline-block bg-wood-900/40 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-parchment-100 border border-white/20">
            Harvest Receipt: #{order.orderId}
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-[#FFFDF9]">
          
          {/* Chilled Delivery Guarantee Banner */}
          <div className="bg-sage-50 border-2 border-sage-300 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-200 text-sage-800 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-sage-900 font-farm">
                Estimated Chilled Porch Arrival: {order.estimatedDelivery}
              </div>
              <div className="text-[11px] text-sage-700">
                Packed with eco-friendly frozen coolant bricks directly to: {order.shippingInfo.address}, {order.shippingInfo.city}
              </div>
            </div>
          </div>

          {/* Harvest & Shipping Progress Stepper */}
          <div className="space-y-2">
            <div className="text-xs font-farm font-bold text-wood-700 uppercase tracking-wider">
              Harvest & Stand Fulfillment Progress
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-parchment-100 border border-wood-300 p-2.5 rounded-2xl">
                <div className="text-base">📝</div>
                <div className="text-[10px] font-bold text-wood-800 mt-1">Stand Logged</div>
                <div className="text-[9px] text-sage-700 font-bold">Done ✓</div>
              </div>
              <div className="bg-parchment-100 border border-wood-300 p-2.5 rounded-2xl">
                <div className="text-base">🌅</div>
                <div className="text-[10px] font-bold text-wood-800 mt-1">Sunrise Pick</div>
                <div className="text-[9px] text-amber-700 font-bold">Scheduled</div>
              </div>
              <div className="bg-parchment-100 border border-wood-300 p-2.5 rounded-2xl">
                <div className="text-base">❄️</div>
                <div className="text-[10px] font-bold text-wood-800 mt-1">Cold Pack</div>
                <div className="text-[9px] text-blue-700 font-bold">Queued</div>
              </div>
              <div className="bg-parchment-100 border border-wood-300 p-2.5 rounded-2xl">
                <div className="text-base">🚚</div>
                <div className="text-[10px] font-bold text-wood-800 mt-1">Courier</div>
                <div className="text-[9px] text-purple-700 font-bold">Pending</div>
              </div>
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-farm font-bold text-wood-700 uppercase tracking-wider">
              Harvest Bushel Items
            </div>
            <div className="divide-y divide-wood-200 border-2 border-wood-200 rounded-2xl p-2 bg-white">
              {order.items.map((item) => (
                <div key={item.productId} className="py-2.5 px-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-wood-200"
                    />
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-farm font-bold text-wood-900 leading-snug break-words">{item.product.name}</div>
                      <div className="text-[11px] text-wood-500">
                        {item.product.soldByHalfPound
                          ? `Scale Weight: ${formatStepperQuantity(item.product, item.quantity)}`
                          : `Qty: ${item.quantity} • ${item.product.weight}`}
                      </div>
                    </div>
                  </div>
                  <div className="font-farm font-black text-wood-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals Receipt */}
          <div className="kraft-tag p-4 rounded-2xl space-y-1.5 text-xs">
            <div className="flex justify-between text-wood-800">
              <span>Produce Subtotal</span>
              <span className="font-semibold text-wood-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sage-700 font-semibold">
                <span>Stand Coupon Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-wood-800">
              <span>Chilled Courier Transit</span>
              <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-wood-800">
              <span>Estimated Produce Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-farm font-black text-wood-900 pt-2 border-t-2 border-dashed border-wood-300">
              <span>Paid via Stripe</span>
              <span className="text-barn-600 text-base font-black">${order.total.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-parchment-100 border-t-2 border-wood-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border-2 border-wood-300 hover:bg-parchment-200 rounded-xl text-xs font-bold text-wood-800 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Harvest Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-barn-600 hover:bg-barn-700 text-white rounded-xl text-xs font-farm font-black shadow-farm flex items-center gap-1.5 transition-all bouncy-click"
          >
            <span>Back to Farm Stand</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

