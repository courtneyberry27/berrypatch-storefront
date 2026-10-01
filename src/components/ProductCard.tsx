import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Heart, Plus, Minus, Eye, Scale } from 'lucide-react';
import { formatStepperQuantity } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onQuickView,
}) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.productId === product.id);

  return (
    <div className="crate-card p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden bg-[#FFFDF9]">
      
      {/* Top Media Section */}
      <div className="relative">
        {/* Product Image with Wooden Frame - NO IN-IMAGE BADGES */}
        <div 
          className="relative h-56 sm:h-60 w-full rounded-2xl overflow-hidden bg-parchment-200 border-2 border-wood-200/90 cursor-pointer"
          onClick={() => onQuickView(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Quick View Floating Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-parchment-100/95 backdrop-blur-xs text-wood-900 border border-wood-300 text-xs font-bold py-1.5 px-3.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 hover:text-barn-600 hover:border-barn-400"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Examine Crate</span>
          </button>

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-parchment-100/90 backdrop-blur-xs flex items-center justify-center text-wood-400 hover:text-barn-600 hover:bg-white shadow-xs border border-wood-200 transition-all bouncy-click"
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'text-barn-600 fill-barn-600 scale-110' : ''}`} />
          </button>
        </div>

        {/* Sweetness Brix Rating & Scale Specs */}
        <div className="mt-3 flex items-center justify-between text-xs">
          {product.sweetness > 0 ? (
            <div className="flex items-center gap-1 bg-amber-50/90 px-2 py-0.5 rounded-lg border border-amber-200/70" title={`Sweetness: ${product.sweetness}/5`}>
              <span className="font-semibold text-amber-900 text-[11px]">Brix:</span>
              <div className="flex text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < product.sweetness ? 'text-amber-500' : 'text-wood-200'}>
                    🍓
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-sage-50 px-2 py-0.5 rounded-lg border border-sage-200/70">
              <span className="font-bold text-sage-800 text-[11px]">✨ Produce Keeper</span>
            </div>
          )}

          {/* Weight / Scale Indicator */}
          <span className="text-wood-500 text-[11px] font-medium flex items-center gap-1">
            {product.soldByHalfPound && <Scale className="w-3 h-3 text-barn-600" />}
            <span className="truncate max-w-[110px]">{product.weight}</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title - Clean wrapping, no line-clamp */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-farm font-bold text-wood-900 text-base leading-snug hover:text-barn-600 transition-colors cursor-pointer break-words min-h-[2.85rem] flex items-start"
          >
            {product.name}
          </h3>

          {/* Flavor Notes */}
          <p className="text-xs text-wood-600 mt-1 line-clamp-2 leading-relaxed">
            {product.flavorNotes}
          </p>
        </div>

        {/* Bottom Row: Price & Bushel Add */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-wood-200/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-farm font-black text-wood-900">
                ${product.price.toFixed(2)}
              </span>
              {product.soldByHalfPound ? (
                <span className="text-[11px] font-extrabold text-barn-700 bg-parchment-200 px-1.5 py-0.5 rounded border border-wood-300 font-sans">
                  / 1/2 lb
                </span>
              ) : null}
              {product.originalPrice && (
                <span className="text-xs text-wood-400 line-through ml-1">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stand Stock notice */}
            {product.stock <= 8 && (
              <span className="text-[10px] font-bold text-barn-600 block mt-0.5">
                Only {product.stock} {product.soldByHalfPound ? 'half-lbs' : 'units'} left!
              </span>
            )}
          </div>

          {/* Optimistic Cart Action Button */}
          {cartItem ? (
            /* Quantity Stepper when already in cart */
            <div className="flex items-center bg-parchment-200 border-2 border-wood-300 rounded-full p-0.5 shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-7 h-7 rounded-full bg-white text-wood-800 hover:bg-parchment-100 flex items-center justify-center font-bold text-sm shadow-xs bouncy-click"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 font-black text-xs text-wood-900 min-w-[50px] text-center whitespace-nowrap">
                {formatStepperQuantity(product, cartItem.quantity)}
              </span>

              <button
                onClick={() => updateQuantity(product.id, 1)}
                disabled={cartItem.quantity >= product.stock}
                className="w-7 h-7 rounded-full bg-barn-600 text-white hover:bg-barn-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm shadow-xs bouncy-click"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Add to Basket button */
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock === 0}
              className="px-3.5 py-2 bg-barn-600 hover:bg-barn-700 disabled:from-wood-300 disabled:to-wood-400 text-white text-xs font-bold rounded-full shadow-farm hover:shadow-farm-lg transition-all flex items-center gap-1.5 bouncy-click whitespace-nowrap"
            >
              <span>{product.soldByHalfPound ? 'Weigh 1/2 lb' : 'Toss in Basket'}</span>
              <span className="text-sm">🧺</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

