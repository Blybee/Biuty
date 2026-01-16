/**
 * Formatea un número como precio en soles peruanos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(price);
}

/**
 * Formatea un número como precio con decimales fijos
 */
export function formatPriceFixed(price: number, decimals = 2): string {
  return `S/ ${price.toFixed(decimals)}`;
}

/**
 * Calcula el precio con descuento
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return originalPrice * (1 - discountPercent / 100);
}

/**
 * Formatea el porcentaje de descuento
 */
export function formatDiscount(discountPercent: number): string {
  return `-${discountPercent}%`;
}
