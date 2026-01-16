import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb, COLLECTIONS } from "./config";
import type { PaginatedResponse } from "@/shared/types";
import type {
  IOrderRepository,
  Order,
  OrderListItem,
  OrderFilters,
  OrderStats,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
  PaymentStatus,
} from "@/entities/order";

/**
 * Implementación del repositorio de pedidos con Firebase
 */
export class FirebaseOrderRepository implements IOrderRepository {
  private get db() {
    return getFirebaseDb();
  }

  private get collectionRef() {
    return collection(this.db, COLLECTIONS.ORDERS);
  }

  /**
   * Genera número de pedido único
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BIU-${timestamp}-${random}`;
  }

  /**
   * Convierte documento a Order
   */
  private docToOrder(docSnap: { id: string; data: () => Record<string, unknown> }): Order {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
    } as Order;
  }

  /**
   * Convierte Order a OrderListItem
   */
  private toListItem(order: Order): OrderListItem {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      itemCount: order.items.length,
      total: order.total,
      status: order.status,
      paymentStatus: order.payment.status,
      createdAt: order.createdAt,
    };
  }

  async getById(id: string): Promise<Order | null> {
    const docRef = doc(this.db, COLLECTIONS.ORDERS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.docToOrder({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    const q = query(
      this.collectionRef,
      where("orderNumber", "==", orderNumber),
      firestoreLimit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    return this.docToOrder({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getAll(
    filters?: OrderFilters,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<OrderListItem>> {
    const constraints: QueryConstraint[] = [];

    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.paymentStatus) {
      constraints.push(where("payment.status", "==", filters.paymentStatus));
    }
    if (filters?.userId) {
      constraints.push(where("userId", "==", filters.userId));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(firestoreLimit(pageSize + 1));

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    const orders = snapshot.docs.slice(0, pageSize).map((docSnap) =>
      this.toListItem(this.docToOrder({ id: docSnap.id, data: () => docSnap.data() }))
    );

    return {
      data: orders,
      total: orders.length,
      page,
      pageSize,
      hasMore: snapshot.docs.length > pageSize,
    };
  }

  async getByUserId(
    userId: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<OrderListItem>> {
    return this.getAll({ userId }, page, pageSize);
  }

  async getRecent(limit = 10): Promise<OrderListItem[]> {
    const q = query(
      this.collectionRef,
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToOrder({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async create(data: CreateOrderDTO): Promise<Order> {
    const now = Timestamp.now();
    
    // En producción, aquí se calcularían los totales reales
    // basados en los productos y el cupón aplicado
    const orderData = {
      ...data,
      orderNumber: this.generateOrderNumber(),
      items: [], // Se llenarían con los productos reales
      subtotal: 0,
      discount: 0,
      shippingCost: 0,
      tax: 0,
      total: 0,
      status: "pending" as const,
      payment: {
        method: data.paymentMethod,
        status: "pending" as const,
      },
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(this.collectionRef, orderData);

    return {
      id: docRef.id,
      ...orderData,
    } as unknown as Order;
  }

  async updateStatus(id: string, data: UpdateOrderStatusDTO): Promise<Order> {
    const docRef = doc(this.db, COLLECTIONS.ORDERS, id);
    const updateData: Record<string, unknown> = {
      status: data.status,
      updatedAt: Timestamp.now(),
    };

    if (data.adminNotes) {
      updateData.adminNotes = data.adminNotes;
    }
    if (data.trackingNumber) {
      updateData["shipping.trackingNumber"] = data.trackingNumber;
    }
    if (data.status === "delivered") {
      updateData.completedAt = Timestamp.now();
    }

    await updateDoc(docRef, updateData);

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error("Order not found after update");
    }

    return updated;
  }

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    transactionId?: string
  ): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.ORDERS, id);
    const updateData: Record<string, unknown> = {
      "payment.status": status,
      updatedAt: Timestamp.now(),
    };

    if (transactionId) {
      updateData["payment.transactionId"] = transactionId;
    }
    if (status === "paid") {
      updateData["payment.paidAt"] = Timestamp.now();
    }

    await updateDoc(docRef, updateData);
  }

  async cancel(id: string, reason?: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.ORDERS, id);
    await updateDoc(docRef, {
      status: "cancelled",
      adminNotes: reason || "Pedido cancelado",
      updatedAt: Timestamp.now(),
    });
  }

  async getStats(startDate?: Date, endDate?: Date): Promise<OrderStats> {
    // En producción, esto sería más eficiente con funciones de agregación
    const constraints: QueryConstraint[] = [
      where("status", "!=", "cancelled"),
    ];

    if (startDate) {
      constraints.push(where("createdAt", ">=", Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      constraints.push(where("createdAt", "<=", Timestamp.fromDate(endDate)));
    }

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      totalRevenue += data.total || 0;
      if (data.status === "pending" || data.status === "confirmed" || data.status === "processing") {
        pendingOrders++;
      }
      if (data.status === "delivered") {
        completedOrders++;
      }
    });

    return {
      totalOrders: snapshot.size,
      totalRevenue,
      averageOrderValue: snapshot.size > 0 ? totalRevenue / snapshot.size : 0,
      pendingOrders,
      completedOrders,
    };
  }

  async getDailyStats(
    days = 7
  ): Promise<Array<{ date: string; orders: number; revenue: number }>> {
    const stats: Array<{ date: string; orders: number; revenue: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const q = query(
        this.collectionRef,
        where("createdAt", ">=", Timestamp.fromDate(date)),
        where("createdAt", "<", Timestamp.fromDate(nextDate))
      );
      const snapshot = await getDocs(q);

      let revenue = 0;
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        revenue += data.total || 0;
      });

      stats.push({
        date: date.toISOString().split("T")[0],
        orders: snapshot.size,
        revenue,
      });
    }

    return stats;
  }
}

// Singleton
let orderRepository: FirebaseOrderRepository | null = null;

export function getOrderRepository(): IOrderRepository {
  if (!orderRepository) {
    orderRepository = new FirebaseOrderRepository();
  }
  return orderRepository;
}
