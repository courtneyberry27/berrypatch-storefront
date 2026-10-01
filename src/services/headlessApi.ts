import { Product, FilterState, CartItem, CustomerShippingInfo, OrderConfirmation } from '../types';
import { INITIAL_PRODUCTS, PROMO_CODES } from '../data/products';

// Simulated headless database & network latency
const NETWORK_LATENCY_MS = 350;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class HeadlessCommerceService {
  private products: Product[] = [...INITIAL_PRODUCTS];

  // Fetch products with headless query parameters
  async getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
    await delay(150); // Small query latency

    let result = [...this.products];

    if (filters?.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.flavorNotes.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.organicOnly) {
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes('organic'))
      );
    }

    if (filters?.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    if (filters?.maxPrice && filters.maxPrice > 0) {
      const max = filters.maxPrice;
      result = result.filter((p) => p.price <= max);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'sweetness':
          result.sort((a, b) => b.sweetness - a.sweetness);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
        default:
          // Keep default curated order
          break;
      }
    }

    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay(100);
    return this.products.find((p) => p.id === id) || null;
  }

  // Headless Cart Synchronization
  // This validates the items against live inventory and returns updated server cart state
  async syncCart(items: CartItem[]): Promise<{ success: boolean; items: CartItem[]; message?: string }> {
    await delay(NETWORK_LATENCY_MS);

    // Validate inventory
    for (const item of items) {
      const serverProduct = this.products.find((p) => p.id === item.productId);
      if (!serverProduct) {
        throw new Error(`Product ${item.productId} is no longer available.`);
      }
      if (item.quantity > serverProduct.stock) {
        throw new Error(`Only ${serverProduct.stock} units of ${serverProduct.name} remaining in stock!`);
      }
    }

    // Return synchronized cart
    return {
      success: true,
      items: items.map((i) => ({ ...i, pendingSync: false })),
      message: 'Cart synced with BerryPatch Headless Cloud ✨'
    };
  }

  // Validate Promo Code
  validatePromoCode(code: string): { valid: boolean; discountPercent: number; description: string } {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      return {
        valid: true,
        discountPercent: PROMO_CODES[cleanCode].discountPercent,
        description: PROMO_CODES[cleanCode].description
      };
    }
    return { valid: false, discountPercent: 0, description: 'Invalid berry coupon code' };
  }

  // Headless Stripe Checkout Session Creator
  async createStripeCheckoutSession(payload: {
    items: CartItem[];
    shippingInfo: CustomerShippingInfo;
    promoCode?: string;
  }): Promise<{ sessionId: string; clientSecret: string; amount: number }> {
    await delay(NETWORK_LATENCY_MS);

    let subtotal = payload.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let discount = 0;

    if (payload.promoCode && PROMO_CODES[payload.promoCode.toUpperCase()]) {
      const promo = PROMO_CODES[payload.promoCode.toUpperCase()];
      discount = (subtotal * promo.discountPercent) / 100;
    }

    const shipping = subtotal > 35 || payload.promoCode?.toUpperCase() === 'FREESHIP' ? 0 : 5.50;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Math.max(0, Number((subtotal - discount + shipping + tax).toFixed(2)));

    const sessionId = `cs_test_berry_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const clientSecret = `pi_test_secret_${Math.random().toString(36).substring(2, 10)}`;

    return {
      sessionId,
      clientSecret,
      amount: total,
    };
  }

  // Process Stripe Payment Simulator
  async processStripePayment(params: {
    cardNumber: string;
    cardExp: string;
    cardCvc: string;
    cardZip: string;
    items: CartItem[];
    shippingInfo: CustomerShippingInfo;
    promoCode?: string;
  }): Promise<OrderConfirmation> {
    await delay(900); // Simulate authentic Stripe tokenization & 3D verification

    const cleanCard = params.cardNumber.replace(/\s+/g, '');

    // Check for simulated Stripe decline cards
    if (cleanCard.endsWith('0002') || cleanCard.endsWith('0000')) {
      throw new Error('Your card was declined by the issuer (Stripe code: card_declined). Try using test card 4242 4242 4242 4242.');
    }

    if (cleanCard.length < 15) {
      throw new Error('Please enter a valid 16-digit credit card number.');
    }

    let subtotal = params.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let discount = 0;

    if (params.promoCode && PROMO_CODES[params.promoCode.toUpperCase()]) {
      const promo = PROMO_CODES[params.promoCode.toUpperCase()];
      discount = Number(((subtotal * promo.discountPercent) / 100).toFixed(2));
    }

    const isFreeShipping = subtotal > 35 || params.promoCode?.toUpperCase() === 'FREESHIP';
    const shipping = isFreeShipping ? 0 : 5.50;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal - discount + shipping + tax).toFixed(2));

    // Deduct stock optimistically on server
    for (const item of params.items) {
      const p = this.products.find((prod) => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `BERRY-${randomSuffix}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days chilled delivery
    const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    return {
      orderId,
      createdAt: new Date().toISOString(),
      items: params.items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      shippingInfo: params.shippingInfo,
      estimatedDelivery: formattedDelivery,
    };
  }
}

export const headlessService = new HeadlessCommerceService();
