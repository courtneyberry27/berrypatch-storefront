import { Product } from '../types';

/**
 * Formats the displayed quantity or weight for a product.
 * If sold by the half-pound (e.g. strawberries, blueberries, raspberries):
 * 1 unit = 0.5 lb
 * 2 units = 1.0 lb
 * 3 units = 1.5 lbs, etc.
 */
export const formatProductWeight = (product: Product, quantity: number): string => {
  if (product.soldByHalfPound) {
    const lbs = quantity * 0.5;
    if (lbs === 0.5) return '0.5 lb (1/2 lb)';
    return lbs % 1 === 0 ? `${lbs.toFixed(0)} lbs` : `${lbs.toFixed(1)} lbs`;
  }
  return `${quantity} ${quantity === 1 ? 'item' : 'items'}`;
};

export const formatStepperQuantity = (product: Product, quantity: number): string => {
  if (product.soldByHalfPound) {
    const lbs = quantity * 0.5;
    return lbs % 1 === 0 ? `${lbs.toFixed(0)} lb${lbs === 1 ? '' : 's'}` : `${lbs.toFixed(1)} lbs`;
  }
  return `${quantity}`;
};

export const formatPriceUnit = (product: Product): string => {
  if (product.soldByHalfPound) {
    return '/ 1/2 lb';
  }
  return '';
};
