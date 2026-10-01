import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { X, Heart, Plus, Trash2 } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteProducts: Product[];
  onToggleFavorite: (id: string) => void;
  onQuickView: (product: Product) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteProducts,
  onToggleFavorite,
  onQuickView,
}) => {
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-wood-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-farm-lg border-2 border-wood-300 my-8 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Farm Awning Accent */}
        <div className="h-3 farm-awning" />

        <div className="p-6 border-b-2 border-wood-200 flex items-center justify-between bg-parchment-50">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-barn-600 fill-barn-600" />
            <h3 className="text-lg font-farm font-black text-wood-900">Saved Patch Favorites</h3>
            <span className="bg-parchment-200 text-wood-800 border border-wood-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {favoriteProducts.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-parchment-200 text-wood-600 hover:text-wood-900 hover:bg-parchment-300 flex items-center justify-center transition-colors border border-wood-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 bg-[#FFFDF9]">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <span className="text-4xl block">🧺</span>
              <p className="text-sm font-farm font-bold text-wood-800">No saved favorites yet!</p>
              <p className="text-xs text-wood-600 max-w-xs mx-auto">
                Tap the heart icon on any crate of strawberries, blueberries, or preserves to save it for your next stand visit.
              </p>
            </div>
          ) : (
            favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="bg-parchment-100 p-3 rounded-2xl border-2 border-wood-200/80 flex items-center justify-between gap-3 shadow-xs"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onClose();
                    onQuickView(product);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-wood-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-farm font-bold text-xs text-wood-900 leading-snug break-words hover:text-barn-600">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-wood-500 font-medium">{product.weight}</p>
                    <span className="text-xs font-farm font-black text-wood-900">
                      ${product.price.toFixed(2)}
                      {product.soldByHalfPound && <span className="text-[10px] text-wood-500 font-semibold ml-1 font-sans">/ 1/2 lb</span>}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-3 py-1.5 bg-barn-600 hover:bg-barn-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs bouncy-click"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{product.soldByHalfPound ? '+ 1/2 lb' : 'Basket'}</span>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className="p-1.5 text-wood-400 hover:text-barn-600 rounded-lg transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

