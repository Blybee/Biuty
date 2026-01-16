import type { EntityId } from "@/shared/types";
import type { Address } from "@/entities/user";
import type { PaymentMethod } from "@/entities/order";
import type { CartItem, CartSummary } from "@/features/cart";

/**
 * Paso del checkout
 */
export type CheckoutStep = "shipping" | "payment" | "review" | "complete";

/**
 * Datos de envío
 */
export interface ShippingData {
  addressId?: EntityId;
  address?: Address;
  shippingMethod: string;
}

/**
 * Datos de pago
 */
export interface PaymentData {
  method: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

/**
 * Estado del checkout
 */
export interface CheckoutData {
  step: CheckoutStep;
  shipping: ShippingData | null;
  payment: PaymentData | null;
  items: CartItem[];
  summary: CartSummary;
  orderId?: string;
  orderNumber?: string;
}
