import type { EntityId, Timestamp } from "@/shared/types";
import type { Address } from "@/entities/user";
import type { ProductListItem } from "@/entities/product";

/**
 * Estado del pedido
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

/**
 * Estado del pago
 */
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

/**
 * Método de pago
 */
export type PaymentMethod =
  | "card"
  | "yape"
  | "plin"
  | "transfer"
  | "cash_on_delivery";

/**
 * Item del pedido
 */
export interface OrderItem {
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
 * Información de envío
 */
export interface ShippingInfo {
  method: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Timestamp;
  cost: number;
  address: Address;
}

/**
 * Información de pago
 */
export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Timestamp;
}

/**
 * Entidad Pedido
 */
export interface Order {
  id: EntityId;
  orderNumber: string;
  
  // Cliente
  userId: EntityId;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  
  // Items
  items: OrderItem[];
  
  // Totales
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  
  // Cupón aplicado
  couponCode?: string;
  couponDiscount?: number;
  
  // Estado
  status: OrderStatus;
  
  // Envío
  shipping: ShippingInfo;
  
  // Pago
  payment: PaymentInfo;
  
  // Notas
  customerNotes?: string;
  adminNotes?: string;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
}

/**
 * Pedido para listado
 */
export interface OrderListItem {
  id: EntityId;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Timestamp;
}

/**
 * Datos para crear un pedido
 */
export interface CreateOrderDTO {
  userId: EntityId;
  items: Array<{
    productId: EntityId;
    variantId?: EntityId;
    quantity: number;
  }>;
  shippingAddressId: EntityId;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNotes?: string;
}

/**
 * Datos para actualizar estado del pedido
 */
export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  adminNotes?: string;
  trackingNumber?: string;
}
