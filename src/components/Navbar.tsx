import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, CheckCircle2, RefreshCw, Sun, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  favoriteCount: number;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchQuery,
  favoriteCount,
  onOpenFavorites,
}) => {
  const { totalQuantity, setIsOpen, isSyncing } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Farm Stand Striped Awning Banner */}
      <div className="w-full h-3 farm-awning" />

      {/* Farm Chalkboard Ticker / Announcement Bar */}
      <div className="bg-[#2A3B2D] text-[#FDFBF7] text-xs py-2 px-4 border-b border-[#3D5240] shadow-inner font-hand tracking-wide text-base">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400">☀️</span>
            <span>
              Today at the Farm Stand: Fresh morning harvest ready! Use coupon <strong className="underline decoration-wavy text-amber-300 font-bold px-1">BERRYCUTE</strong> for 15% off
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs font-sans text-emerald-200">
            <span className="flex items-center gap-1">
              🚚 Chilled Cooler Delivery on orders $35+
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              🌱 Grown Without Synthetic Sprays
            </span>
          </div>
        </div>
      </div>

      {/* Main Farm Stand Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b-2 border-[#EEDBC8] shadow-sm transition-all duration-300 farm-gingham">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 py-3 flex items-center justify-between gap-4">
          
          {/* Farm Stand Logo & Wooden Sign */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#C1292E] to-[#8E1619] p-2.5 flex items-center justify-center shadow-farm text-3xl group-hover:rotate-[-3deg] transition-transform duration-300 border-2 border-[#FAF0E6]">
              <span className="filter drop-shadow">🧺</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-farm font-extrabold text-2xl sm:text-3xl tracking-tight text-[#341E14] group-hover:text-[#C1292E] transition-colors">
                  BerryPatch
                </span>
                <span className="font-hand text-base font-bold text-[#4A7C59] bg-[#E1EDE4] px-2.5 py-0.5 rounded-md border border-[#C3DBC9] transform -rotate-1">
                  Farm Stand
                </span>
              </div>
              <p className="text-[11px] text-[#7A6150] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C1292E]" />
                <span>Hood River Valley, Oregon • Picked Daily</span>
              </p>
            </div>
          </div>

          {/* Desktop Rustic Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <input
              type="text"
              placeholder="Search strawberries, blueberries, syrups, preserves..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-white/90 border-2 border-[#DEC9B2] rounded-full text-xs sm:text-sm text-[#3D2B1F] placeholder-[#A48F7F] focus:outline-none focus:ring-2 focus:ring-[#C1292E] focus:border-[#C1292E] transition-all duration-200 shadow-inner"
            />
            <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-2.5 text-xs text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-[#5C3D2E] hover:bg-[#F2E8DC] rounded-xl transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Farm Stand Scale / Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#FAF6F0] border border-[#DEC9B2] text-[#5C3D2E]" title="Farm Stand Register Status">
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#C1292E] animate-spin" />
                  <span className="text-[#C1292E]">Weighing on scale... ⚖️</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59]" />
                  <span className="text-[#4A7C59] font-hand text-sm">Farm Stand Open Today 🌾</span>
                </>
              )}
            </div>

            {/* Favorites Wishlist */}
            <button
              onClick={onOpenFavorites}
              className="p-2.5 text-[#5C3D2E] hover:text-[#C1292E] hover:bg-[#F2E8DC] rounded-xl transition-colors relative bouncy-click"
              title="Saved Produce"
            >
              <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'text-[#C1292E] fill-[#C1292E]' : ''}`} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C1292E] text-white font-bold text-[11px] rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Rustic Farmstand Produce Basket Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#C1292E] hover:bg-[#A51C20] text-[#FFFDF9] rounded-xl font-bold border-2 border-[#8E1619] shadow-farm transition-all duration-200 bouncy-click relative"
              aria-label="Open Produce Basket"
            >
              <span className="text-lg">🧺</span>
              <span className="hidden sm:inline font-bold text-sm">My Basket</span>
              
              <span className="px-2 py-0.5 rounded-md text-xs font-black bg-[#FFFDF9] text-[#C1292E] shadow-sm">
                {totalQuantity}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#EEDBC8] bg-[#FDFBF7]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search strawberries, blueberries, syrups, preserves..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-white border-2 border-[#DEC9B2] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C1292E]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
