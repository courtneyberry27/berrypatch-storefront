import React from 'react';
import { Sparkles, Sun, ShieldCheck, Truck, ArrowRight, Scale } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { INITIAL_PRODUCTS } from '../data/products';

interface HeroBannerProps {
  onScrollToProducts: () => void;
  onSelectProduct: (productId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToProducts, onSelectProduct }) => {
  const { addToCart } = useCart();
  const featuredProduct = INITIAL_PRODUCTS[0]; // Strawberries

  return (
    <div className="relative overflow-hidden bg-[#FAF6F0] farm-gingham py-12 lg:py-18 border-b-4 border-wood-200/80">
      {/* Decorative soft sunlight glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Roadside Farm Stand Story & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Farm Stand Location & Season Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-parchment-100 border-2 border-wood-300/80 shadow-xs text-xs sm:text-sm font-bold text-wood-800">
              <span className="text-base">🧺</span>
              <span className="font-farm tracking-wide">Roadside Farm Stand • Hood River Valley, OR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-barn-500 animate-ping" />
            </div>

            {/* Headline with rustic Fraunces font */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-farm font-black text-wood-900 tracking-tight leading-[1.15]">
              Fresh From Our Patch, <br />
              <span className="text-barn-600 underline decoration-wood-300 decoration-wavy decoration-2">
                Weighed by the Half-Pound 🍓
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-wood-800/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium">
              Welcome to the family farm stand! Picked at dawn across our sun-drenched rows, our sweet heirloom strawberries, plump blueberries, and wild raspberries are weighed fresh on our brass scale. Enjoy homemade preserves, syrups, and cedar-vented fridge baskets.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToProducts}
                className="px-7 py-3.5 bg-barn-600 hover:bg-barn-700 text-white rounded-full font-farm font-bold text-base shadow-farm-lg hover:shadow-farm transition-all duration-200 flex items-center gap-2.5 bouncy-click group"
              >
                <span>Browse Today's Crates</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectProduct('prod-fridge-storage-baskets')}
                className="px-6 py-3.5 bg-white hover:bg-parchment-200 text-wood-800 rounded-full font-bold border-2 border-wood-300 shadow-xs transition-all duration-200 flex items-center gap-2 bouncy-click"
              >
                <span>Produce Baskets 🧺</span>
              </button>
            </div>

            {/* Farm Guarantees */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t-2 border-dashed border-wood-300/80 max-w-2xl mx-auto lg:mx-0 text-left">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-wood-200">
                <div className="flex items-center gap-1.5 text-barn-600 font-bold text-xs sm:text-sm">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Dawn Picked</span>
                </div>
                <span className="text-[11px] text-wood-700 font-medium block mt-0.5">Harvested 6:00 AM</span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-wood-200">
                <div className="flex items-center gap-1.5 text-wood-800 font-bold text-xs sm:text-sm">
                  <Scale className="w-4 h-4 text-wood-600" />
                  <span>1/2 lb Scale</span>
                </div>
                <span className="text-[11px] text-wood-700 font-medium block mt-0.5">Custom berry portions</span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-wood-200">
                <div className="flex items-center gap-1.5 text-sage-600 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-sage-500" />
                  <span>100% Organic</span>
                </div>
                <span className="text-[11px] text-wood-700 font-medium block mt-0.5">Zero synthetic sprays</span>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-wood-200">
                <div className="flex items-center gap-1.5 text-barn-600 font-bold text-xs sm:text-sm">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Chilled Transit</span>
                </div>
                <span className="text-[11px] text-wood-700 font-medium block mt-0.5">Cold packs keep crisp</span>
              </div>
            </div>
          </div>

          {/* Right Column: Chalkboard & Wooden Fruit Crate Featured Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Rustic Chalkboard Header Pin */}
              <div className="chalkboard text-white px-4 py-2 rounded-2xl mb-3 shadow-farm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  <div>
                    <div className="font-hand text-lg text-amber-200 tracking-wider">Today's Stand Special</div>
                    <div className="text-[10px] uppercase font-bold text-emerald-300">Field No. 4 • Top Sweetness</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                  14.8° Brix
                </span>
              </div>

              {/* Main Visual Crate Card */}
              <div className="crate-card p-4 sm:p-5 relative group overflow-hidden bg-[#FFFDF9]">
                
                {/* Image Container with Wooden Trim */}
                <div className="relative h-72 sm:h-78 w-full rounded-2xl overflow-hidden bg-parchment-200 border-2 border-wood-200">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-950/80 via-transparent to-transparent" />

                  {/* Stamp Badge */}
                  <div className="absolute top-3 left-3 bg-parchment-100/95 text-barn-700 px-3 py-1 rounded-xl text-xs font-farm font-bold border-2 border-dashed border-barn-400 shadow-sm">
                    ⭐ Orchard Certified Fresh
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-farm font-bold text-2xl leading-tight text-parchment-50">
                      {featuredProduct.name}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-amber-300 font-farm">
                          ${featuredProduct.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-parchment-200 bg-wood-900/60 px-2 py-0.5 rounded-full border border-wood-400/40">
                          / 1/2 lb
                        </span>
                      </div>
                      <span className="text-xs font-medium bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full text-white/90">
                        {featuredProduct.weight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Add Button below image */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToCart(featuredProduct, 1)}
                    className="flex-1 py-3 bg-barn-600 hover:bg-barn-700 text-white rounded-2xl font-farm font-bold text-sm shadow-farm flex items-center justify-center gap-2 bouncy-click transition-colors"
                  >
                    <span>Weigh & Add 1/2 lb Strawberries</span>
                    <span className="text-base">🍓</span>
                  </button>
                  <button
                    onClick={() => onSelectProduct(featuredProduct.id)}
                    className="px-4 py-3 bg-parchment-200 hover:bg-parchment-300 text-wood-800 rounded-2xl font-bold text-xs border border-wood-300 bouncy-click transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

