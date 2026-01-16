import type { PaginatedResponse } from "@/shared/types";
import type {
  Order,
  OrderListItem,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
  OrderStatus,
  PaymentStatus,
} from "./model";

/**
 * Filtros para pedidos
 */
export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
  query?: string;
}

/**
 * Estadísticas de pedidos
 */
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
}

/**
 * Interface del repositorio de pedidos
 */
export interface IOrderRepository {
  /**
   * Obtiene un pedido por su ID
   */
  getById(id: string): Promise<Order | null>;

  /**
   * Obtiene un pedido por su número
   */
  getByOrderNumber(orderNumber: string): Promise<Order | null>;

  /**
   * Obtiene lista paginada de pedidos
   */
  getAll(
    filters?: OrderFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<OrderListItem>>;

  /**
   * Obtiene pedidos de un usuario
   */
  getByUserId(
    userId: string,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<OrderListItem>>;

  /**
   * Obtiene pedidos recientes
   */
  getRecent(limit?: number): Promise<OrderListItem[]>;

  /**
   * Crea un nuevo pedido
   */
  create(data: CreateOrderDTO): Promise<Order>;

  /**
   * Actualiza el estado del pedido
   */
  updateStatus(id: string, data: UpdateOrderStatusDTO): Promise<Order>;

  /**
   * Actualiza el estado del pago
   */
  updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    transactionId?: string
  ): Promise<void>;

  /**
   * Cancela un pedido
   */
  cancel(id: string, reason?: string): Promise<void>;

  /**
   * Obtiene estadísticas de pedidos
   */
  getStats(startDate?: Date, endDate?: Date): Promise<OrderStats>;

  /**
   * Obtiene estadísticas diarias
   */
  getDailyStats(days?: number): Promise<Array<{ date: string; orders: number; revenue: number }>>;
}
