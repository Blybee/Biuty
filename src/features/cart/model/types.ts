import type { EntityId } from "@/shared/types";
import type { ProductListItem } from "@/entities/product";

/**
 * Item del carrito
 */
export interface CartItem {
  id: EntityId;
  productId: EntityId;
  product: ProductListItem;
  variantId?: EntityId;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Resumen del carrito
 */
export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

/**
 * Cupón aplicado
 */
export interface AppliedCoupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}
