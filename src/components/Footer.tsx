import React, { useState } from 'react';
import { Heart, Sparkles, Truck, Clock, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="mt-20 relative overflow-hidden bg-[#FAF6F0] border-t-4 border-wood-300 text-wood-700">
      {/* Top Striped Farm Stand Canopy Awning */}
      <div className="h-4 farm-awning shadow-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b-2 border-dashed border-wood-200">
          
          {/* Brand & Roadside Farm Stand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-parchment-200 border-2 border-wood-300 text-2xl flex items-center justify-center shadow-xs">
                🧺
              </div>
              <div>
                <span className="font-farm font-black text-2xl tracking-tight text-wood-950 block">
                  BerryPatch Farm Stand
                </span>
                <span className="font-hand text-base text-barn-600 block -mt-1 font-bold">
                  Orchards & Roadside Market
                </span>
              </div>
            </div>

            <p className="text-xs text-wood-700 max-w-sm leading-relaxed font-sans font-medium">
              Family-owned heirloom berry farm nestled in the scenic Hood River Valley. Fresh organic strawberries, blueberries, and raspberries weighed fresh on our brass scale by the half-pound, alongside small-batch kettle preserves, craft syrups, and vented fridge storage baskets.
            </p>

            {/* Farm Stand Location & Hours Box */}
            <div className="kraft-tag p-3.5 rounded-xl space-y-1.5 text-xs text-wood-800 max-w-sm">
              <div className="flex items-center gap-2 font-bold text-wood-900">
                <MapPin className="w-3.5 h-3.5 text-barn-600" />
                <span>742 Evergreen Orchard Lane, Hood River Valley, OR</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-wood-700">
                <Clock className="w-3.5 h-3.5 text-wood-500" />
                <span>Stand Hours: 7:00 AM – 6:30 PM (Dawn to Dusk)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-wood-600 pt-1">
              <span className="flex items-center gap-1 text-sage-700">
                <Sparkles className="w-3.5 h-3.5" /> 100% Certified Organic
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-barn-700">
                <Truck className="w-3.5 h-3.5" /> Cold-Pack Chilled Delivery
              </span>
            </div>
          </div>

          {/* Quick Links: The Harvest (Exact 10 products, no 1/2 lb labels) */}
          <div className="space-y-3">
            <h4 className="text-xs font-farm font-bold uppercase tracking-wider text-wood-900">
              Today's Harvest
            </h4>
            <ul className="space-y-1.5 text-xs text-wood-700 font-medium">
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🍓</span> Strawberries</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🫐</span> Blueberries</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🌸</span> Raspberries</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🍯</span> Raspberry Preserves</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🍓</span> Strawberry Preserves</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🫐</span> Blueberry Preserves</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🥞</span> Strawberry Syrup</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🫐</span> Blueberry Syrup</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🍹</span> Raspberry Syrup</a></li>
              <li><a href="#products" className="hover:text-barn-600 transition-colors flex items-center gap-1.5"><span>🧺</span> Berry Fridge Storage Baskets</a></li>
            </ul>
          </div>

          {/* Farm Tradition & Headless Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-farm font-bold uppercase tracking-wider text-wood-900">
              Farm Stand Tech
            </h4>
            <ul className="space-y-2 text-xs text-wood-700">
              <li className="flex items-center gap-1.5"><span className="text-barn-500">🍓</span> React 18 + Vite Headless</li>
              <li className="flex items-center gap-1.5"><span className="text-barn-500">⚖️</span> Half-Pound Weigh Station</li>
              <li className="flex items-center gap-1.5"><span className="text-barn-500">⚡</span> Optimistic Bushel Sync</li>
              <li className="flex items-center gap-1.5"><span className="text-barn-500">💳</span> Stripe Elements Register</li>
              <li className="flex items-center gap-1.5"><span className="text-barn-500">📦</span> Recyclable Produce Baskets</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-farm font-bold uppercase tracking-wider text-wood-900">
              Dawn Harvest Bell 🔔
            </h4>
            <p className="text-xs text-wood-600 leading-snug">
              Hear the bell ring when morning heirloom picking begins and fresh half-pound flats are packed!
            </p>
            {subscribed ? (
              <div className="bg-sage-50 text-sage-800 text-xs font-bold p-3 rounded-xl border border-sage-300">
                🎉 Welcome to the Patch Family! Check your inbox for 15% off at the stand.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-wood-300 rounded-xl px-3 py-2 text-xs text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300 placeholder-wood-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-barn-600 hover:bg-barn-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-wood-500 gap-3">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-barn-600 fill-barn-600" />
            <span>for Courtney Berry & fresh berry lovers everywhere.</span>
          </div>
          <div>
            <span>© 2026 BerryPatch Farm Stand & Orchards. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

