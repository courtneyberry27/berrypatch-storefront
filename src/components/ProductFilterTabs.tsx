import React from 'react';
import { CATEGORIES } from '../data/products';
import { FilterState, ProductCategory } from '../types';
import { SlidersHorizontal, Check, RotateCcw } from 'lucide-react';

interface ProductFilterTabsProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const ProductFilterTabs: React.FC<ProductFilterTabsProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  const isAnyFilterActive =
    filters.category !== 'all' ||
    filters.organicOnly ||
    filters.inStockOnly ||
    filters.sortBy !== 'featured' ||
    filters.searchQuery !== '';

  return (
    <div className="space-y-5">
      {/* Category Wooden Slat Tabs Container */}
      <div className="relative">
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none py-1 px-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.id as ProductCategory })}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-farm font-bold text-sm whitespace-nowrap transition-all duration-200 bouncy-click ${
                  isSelected
                    ? 'bg-barn-600 text-white shadow-farm border-2 border-barn-700 scale-[1.02]'
                    : 'bg-parchment-100 text-wood-900 hover:text-barn-700 hover:bg-parchment-200 border-2 border-wood-300/80 shadow-xs'
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                <span>{cat.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-parchment-200 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls Bar: Filters, Sort, and Stand Status */}
      <div className="bg-parchment-100/90 backdrop-blur-xs p-4 rounded-2xl border-2 border-wood-300/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Quick Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Organic Only toggle */}
          <button
            onClick={() => onFilterChange({ organicOnly: !filters.organicOnly })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bouncy-click border-2 ${
              filters.organicOnly
                ? 'bg-sage-100 text-sage-700 border-sage-500 shadow-xs'
                : 'bg-white text-wood-700 border-wood-300 hover:border-sage-500 hover:text-sage-700'
            }`}
          >
            <span>🌱 100% Organic</span>
            {filters.organicOnly && <Check className="w-3.5 h-3.5" />}
          </button>

          {/* In-Stock Only toggle */}
          <button
            onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bouncy-click border-2 ${
              filters.inStockOnly
                ? 'bg-barn-50 text-barn-700 border-barn-400 shadow-xs'
                : 'bg-white text-wood-700 border-wood-300 hover:border-barn-400 hover:text-barn-700'
            }`}
          >
            <span>🧺 In Stock at Stand</span>
            {filters.inStockOnly && <Check className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Filters */}
          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-barn-600 hover:bg-barn-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Results Count & Sorting Selector */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <span className="text-xs font-medium text-wood-700">
            <strong className="text-barn-600 font-farm font-bold text-sm">{totalFilteredCount}</strong> varieties on display
          </span>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-wood-500" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="bg-white border-2 border-wood-300 rounded-xl px-3 py-1.5 text-xs font-bold text-wood-900 focus:outline-none focus:ring-2 focus:ring-barn-300 cursor-pointer shadow-xs"
            >
              <option value="featured">⭐ Featured Stand Picks</option>
              <option value="sweetness">🍓 Sweetest Brix Rating</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💎 Price: High to Low</option>
              <option value="rating">✨ Highest Rated</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

