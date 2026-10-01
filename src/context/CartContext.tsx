import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem } from '../types';
import { headlessService } from '../services/headlessApi';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
  undoAction?: () => void;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  promoCode: string | null;
  discountPercentage: number;
  promoDescription: string | null;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  totalQuantity: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'berrypatch_cart_v1';
const FREE_SHIPPING_MINIMUM = 35.00;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((item: any) => item && item.product && typeof item.product.price === 'number');
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [promoDescription, setPromoDescription] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Backup of items for optimistic rollback
  const previousItemsRef = useRef<CartItem[]>(items);

  // Keep localStorage updated
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Background headless sync handler
  const triggerOptimisticSync = useCallback(async (newItems: CartItem[]) => {
    setIsSyncing(true);
    try {
      const res = await headlessService.syncCart(newItems);
      if (res.success) {
        setItems(res.items);
        setLastSyncedAt(new Date());
        previousItemsRef.current = res.items;
      }
    } catch (err: any) {
      console.error('Optimistic cart sync failed, rolling back:', err);
      // Rollback to previous state
      setItems(previousItemsRef.current);
      addToast({
        type: 'error',
        title: 'Inventory Adjustment 🍓',
        message: err.message || 'Could not update cart with the nursery server.',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [addToast]);

  // Optimistic Add to Cart
  const addToCart = useCallback((product: Product, quantity = 1) => {
    previousItemsRef.current = items;

    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.productId === product.id);
      let updated: CartItem[];

      if (existing) {
        updated = prevItems.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity, pendingSync: true }
            : i
        );
      } else {
        const newItem: CartItem = {
          id: `item-${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          pendingSync: true,
        };
        updated = [...prevItems, newItem];
      }

      // Schedule background server sync
      triggerOptimisticSync(updated);
      return updated;
    });

    const qtyText = product.soldByHalfPound
      ? `${(quantity * 0.5).toFixed(1).replace(/\.0$/, '')} lb${quantity > 2 ? 's' : ''}`
      : `${quantity}x`;

    addToast({
      type: 'success',
      title: 'Added to Basket! 🧺✨',
      message: `${qtyText} ${product.name} ready for picking.`,
    });
  }, [items, triggerOptimisticSync, addToast]);

  // Optimistic Update Quantity by Delta
  const updateQuantity = useCallback((productId: string, delta: number) => {
    previousItemsRef.current = items;

    setItems((prev) => {
      let updated = prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty, pendingSync: true } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      triggerOptimisticSync(updated);
      return updated;
    });
  }, [items, triggerOptimisticSync]);

  // Optimistic Set Item Quantity Directly
  const setItemQuantity = useCallback((productId: string, quantity: number) => {
    previousItemsRef.current = items;

    setItems((prev) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prev.filter((i) => i.productId !== productId);
      } else {
        updated = prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity, pendingSync: true }
            : item
        );
      }
      triggerOptimisticSync(updated);
      return updated;
    });
  }, [items, triggerOptimisticSync]);

  // Optimistic Remove with Undo Support
  const removeFromCart = useCallback((productId: string) => {
    const itemToRemove = items.find((i) => i.productId === productId);
    if (!itemToRemove) return;

    previousItemsRef.current = items;
    const updated = items.filter((i) => i.productId !== productId);
    setItems(updated);
    triggerOptimisticSync(updated);

    addToast({
      type: 'info',
      title: 'Item Removed 🍃',
      message: `${itemToRemove.product.name} put back in the patch.`,
      undoAction: () => {
        // Re-insert item
        setItems((current) => {
          const restored = [...current, itemToRemove];
          triggerOptimisticSync(restored);
          return restored;
        });
      },
    });
  }, [items, triggerOptimisticSync, addToast]);

  const clearCart = useCallback(() => {
    previousItemsRef.current = items;
    setItems([]);
    triggerOptimisticSync([]);
  }, [items, triggerOptimisticSync]);

  // Promo code engine
  const applyPromoCode = useCallback((code: string): boolean => {
    const result = headlessService.validatePromoCode(code);
    if (result.valid) {
      setPromoCode(code.trim().toUpperCase());
      setDiscountPercentage(result.discountPercent);
      setPromoDescription(result.description);
      addToast({
        type: 'success',
        title: 'Coupon Applied! 🌸',
        message: `${result.description}`,
      });
      return true;
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Coupon 🍂',
        message: 'Try code BERRYCUTE for 15% off, or FREESHIP for free shipping!',
      });
      return false;
    }
  }, [addToast]);

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
    setDiscountPercentage(0);
    setPromoDescription(null);
    addToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'Discount has been removed from your basket.',
    });
  }, [addToast]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0), 0);
  const discountAmount = Number(((subtotal * discountPercentage) / 100).toFixed(2));
  const isFreeShipping = subtotal >= FREE_SHIPPING_MINIMUM || promoCode === 'FREESHIP';
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 5.50;
  const total = Math.max(0, Number((subtotal - discountAmount + shippingFee).toFixed(2)));
  const totalQuantity = items.reduce((count, item) => count + (item?.quantity || 0), 0);
  const freeShippingThreshold = FREE_SHIPPING_MINIMUM;
  const freeShippingRemaining = Math.max(0, Number((FREE_SHIPPING_MINIMUM - subtotal).toFixed(2)));

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        isSyncing,
        lastSyncedAt,
        promoCode,
        discountPercentage,
        promoDescription,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        totalQuantity,
        freeShippingThreshold,
        freeShippingRemaining,
        toasts,
        removeToast,
        addToCart,
        updateQuantity,
        setItemQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
