import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { X, Heart, Star, Sparkles, MapPin, Scale, Check } from 'lucide-react';
import { formatStepperQuantity } from '../utils/formatters';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-wood-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Card */}
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-farm-lg border-2 border-wood-300 animate-pop my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Farm Awning Accent */}
        <div className="h-3 farm-awning" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-5 z-10 w-9 h-9 rounded-full bg-parchment-100/90 backdrop-blur-xs text-wood-700 hover:text-wood-950 hover:bg-white flex items-center justify-center shadow-xs border border-wood-300 transition-all bouncy-click"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Badges */}
          <div className="relative h-72 md:h-full min-h-[340px] bg-parchment-200 overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-wood-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wood-950/50 via-transparent to-transparent md:hidden" />

            <button
              onClick={() => onToggleFavorite(product.id)}
              className="absolute top-4 right-14 md:right-4 w-9 h-9 rounded-full bg-parchment-100/90 backdrop-blur-xs flex items-center justify-center text-wood-400 hover:text-barn-600 hover:bg-white shadow-xs border border-wood-300 transition-all bouncy-click"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-barn-600 fill-barn-600' : ''}`} />
            </button>
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto bg-[#FFFDF9]">
            <div className="space-y-4">
              
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-barn-700 bg-parchment-200 px-3 py-1 rounded-full border border-wood-300">
                  {product.category}
                </span>
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold text-wood-700 bg-parchment-100 px-2 py-0.5 rounded-full border border-wood-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-farm font-black text-wood-900 leading-snug">
                  {product.name}
                </h2>
                
                {/* Rating & Origin */}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-wood-600">
                  <div className="flex items-center text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                    <span>{product.rating}</span>
                    <span className="text-wood-400 ml-1">({product.reviewCount} customer ratings)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-wood-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-barn-600" />
                    <span className="truncate">{product.origin}</span>
                  </div>
                </div>
              </div>

              {/* Price & Weight Unit */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-farm font-black text-wood-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.soldByHalfPound && (
                  <span className="text-sm font-extrabold text-barn-700 bg-parchment-200 px-2 py-0.5 rounded border border-wood-300 font-sans">
                    / 1/2 lb
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-sm text-wood-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-semibold text-wood-700 bg-parchment-100 px-2.5 py-1 rounded-lg border border-wood-200 flex items-center gap-1">
                  {product.soldByHalfPound && <Scale className="w-3 h-3 text-barn-600" />}
                  <span>{product.weight}</span>
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-wood-700 leading-relaxed font-sans font-medium">
                {product.description}
              </p>

              {/* Flavor Profile Box */}
              <div className="bg-parchment-100 border-2 border-wood-200 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-farm font-bold text-wood-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Farm Stand Tasting Notes</span>
                </div>
                <p className="text-xs text-wood-800 italic leading-snug">
                  "{product.flavorNotes}"
                </p>
                {product.sweetness > 0 ? (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-bold text-wood-700">Sweetness Index:</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < product.sweetness ? 'text-amber-500' : 'text-wood-300'}>
                          🍓
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-1 text-xs text-sage-800 font-bold">
                    <span>✨ Food-grade BPA-Free Cedar-Look Produce Keeper</span>
                  </div>
                )}
              </div>

              {/* Nutrition Highlights Grid */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="bg-white p-2 rounded-xl border border-wood-200">
                  <div className="text-[10px] text-wood-400 uppercase font-semibold">Calories</div>
                  <div className="text-xs font-extrabold text-wood-800 mt-0.5">{product.nutrition.calories}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-wood-200">
                  <div className="text-[10px] text-wood-400 uppercase font-semibold">Vitamin C</div>
                  <div className="text-xs font-extrabold text-wood-800 mt-0.5">{product.nutrition.vitaminC}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-wood-200">
                  <div className="text-[10px] text-wood-400 uppercase font-semibold">Fiber</div>
                  <div className="text-xs font-extrabold text-wood-800 mt-0.5">{product.nutrition.fiber}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-wood-200">
                  <div className="text-[10px] text-wood-400 uppercase font-semibold">Antioxidants</div>
                  <div className="text-xs font-extrabold text-wood-800 mt-0.5 truncate" title={product.nutrition.antioxidants}>
                    {product.nutrition.antioxidants}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions: Quantity Stepper & Add to Basket */}
            <div className="pt-6 mt-4 border-t-2 border-dashed border-wood-200 flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-parchment-200 rounded-2xl p-1 border border-wood-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white text-wood-700 hover:bg-parchment-100 flex items-center justify-center font-bold text-sm shadow-xs bouncy-click"
                >
                  -
                </button>
                <span className="px-2 min-w-[50px] text-center font-black text-sm text-wood-900 whitespace-nowrap">
                  {formatStepperQuantity(product, quantity)}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-xl bg-white text-wood-700 hover:bg-parchment-100 flex items-center justify-center font-bold text-sm shadow-xs bouncy-click"
                >
                  +
                </button>
              </div>

              {/* Add to Basket Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 px-6 bg-barn-600 hover:bg-barn-700 text-white rounded-2xl font-farm font-black text-sm shadow-farm hover:shadow-farm-lg transition-all flex items-center justify-center gap-2 bouncy-click"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>Added to Bushel Basket!</span>
                  </>
                ) : (
                  <>
                    <span>Weigh & Add {formatStepperQuantity(product, quantity)}</span>
                    <span>•</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                    <span className="text-base">🧺</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

