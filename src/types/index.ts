export type ProductCategory = 
  | 'all' 
  | 'fresh-berries' 
  | 'preserves' 
  | 'syrups' 
  | 'storage';

export interface NutritionInfo {
  calories: string;
  vitaminC: string;
  fiber: string;
  antioxidants: string;
}

export interface Product {
  id: string;
  name: string;
  japaneseName?: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  sweetness: number; // 1 to 5 scale
  origin: string;
  weight: string;
  stock: number;
  tags: string[];
  description: string;
  flavorNotes: string;
  nutrition: NutritionInfo;
  image: string;
  emoji: string;
  badge?: string;
  accentBg: string;
  accentBorder: string;
  soldByHalfPound?: boolean;
}

export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  product: Product;
  quantity: number;
  pendingSync?: boolean; // Optimistic update flag
  error?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  promoCode: string | null;
  discountPercentage: number;
}

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  sortBy: 'featured' | 'sweetness' | 'price-asc' | 'price-desc' | 'rating';
  organicOnly: boolean;
  inStockOnly: boolean;
  maxPrice: number;
}

export interface CustomerShippingInfo {
  fullName: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryInstructions?: string;
}

export interface StripeCardDetails {
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
  cardZip: string;
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: CustomerShippingInfo;
  estimatedDelivery: string;
}
