import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductFilterTabs } from './components/ProductFilterTabs';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { headlessService } from './services/headlessApi';
import { Product, FilterState, OrderConfirmation } from './types';
import { Sparkles, Frown } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  category: 'all',
  searchQuery: '',
  sortBy: 'featured',
  organicOnly: false,
  inStockOnly: false,
  maxPrice: 100,
};

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  
  // Selected product for Quick View modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('berrypatch_favorites');
      if (!saved) return ['prod-strawberries'];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : ['prod-strawberries'];
    } catch {
      return ['prod-strawberries'];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isStripeCheckoutOpen, setIsStripeCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);

  // Load products from headless service
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await headlessService.getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products from headless service', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('berrypatch_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFeaturedProduct = async (id: string) => {
    const product = await headlessService.getProductById(id);
    if (product) {
      setSelectedProduct(product);
    }
  };

  // Resolved list of favorited products
  const favoriteProductObjects = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col selection:bg-berry-200 selection:text-berry-900 font-sans">
      {/* Navigation Header */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => handleFilterChange({ searchQuery: query })}
        favoriteCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Whimsical Hero Section */}
        <HeroBanner
          onScrollToProducts={scrollToProducts}
          onSelectProduct={handleSelectFeaturedProduct}
        />

        {/* Product Catalog & Filter Tabs Section */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-wood-800 font-farm font-bold text-xs uppercase tracking-wider bg-parchment-100 px-3.5 py-1.5 rounded-full border-2 border-wood-300 shadow-xs">
              <span className="text-base">🧺</span>
              <span>Today's Stand Crates & Bushels</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-farm font-black text-wood-900 tracking-tight">
              Pick Fresh From The Patch 🍓
            </h2>
            <p className="text-xs sm:text-sm text-wood-700 font-medium">
              Organic strawberries, blueberries, and raspberries weighed fresh by the half-pound, alongside small-batch preserves, craft syrups, and fridge produce storage baskets.
            </p>
          </div>

          {/* Interactive Filter Tabs & Controls */}
          <ProductFilterTabs
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalFilteredCount={products.length}
          />

          {/* Products Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="crate-card p-5 animate-pulse space-y-4 bg-white">
                    <div className="h-56 bg-parchment-200 rounded-2xl" />
                    <div className="h-5 bg-parchment-300 rounded w-3/4" />
                    <div className="h-4 bg-parchment-200 rounded w-1/2" />
                    <div className="h-9 bg-parchment-300 rounded-full" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Rustic Empty State */
              <div className="crate-card p-12 text-center max-w-md mx-auto my-8 space-y-4 bg-white">
                <div className="w-20 h-20 bg-parchment-200 rounded-full mx-auto flex items-center justify-center text-4xl animate-bounce-soft border-2 border-wood-300">
                  🧺
                </div>
                <div className="space-y-1">
                  <h3 className="font-farm font-bold text-wood-900 text-lg">No Crates Found</h3>
                  <p className="text-xs text-wood-600">
                    We couldn't find any produce matching your current filter. Try resetting your tags or search query!
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-barn-600 hover:bg-barn-700 text-white rounded-full font-bold text-xs shadow-farm bouncy-click"
                >
                  Reset Stand Filters
                </button>
              </div>
            ) : (
              /* Grid of Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductQuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsStripeCheckoutOpen(true)}
      />

      <StripeCheckoutModal
        isOpen={isStripeCheckoutOpen}
        onClose={() => setIsStripeCheckoutOpen(false)}
        onSuccess={(order) => {
          setIsStripeCheckoutOpen(false);
          setConfirmedOrder(order);
        }}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteProducts={favoriteProductObjects}
        onToggleFavorite={toggleFavorite}
        onQuickView={(p) => setSelectedProduct(p)}
      />

      <ToastContainer />
    </div>
  );
};
