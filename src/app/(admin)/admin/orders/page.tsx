"use client";

import { useState } from "react";
import { formatPrice, formatDate } from "@/shared/lib";
import { Button, Input, Card, Badge, Modal } from "@/shared/ui";
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
} from "lucide-react";

// Mock orders
const mockOrders = [
  {
    id: "BIU-ABC123",
    customer: { name: "Juan Pérez", email: "juan@email.com", phone: "+51 999 111 222" },
    items: 3,
    total: 289.90,
    status: "pending",
    paymentStatus: "paid",
    shippingAddress: "Av. Principal 123, Miraflores, Lima",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "BIU-DEF456",
    customer: { name: "María García", email: "maria@email.com", phone: "+51 999 333 444" },
    items: 2,
    total: 145.80,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "Jr. Los Pinos 456, San Isidro, Lima",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "BIU-GHI789",
    customer: { name: "Carlos López", email: "carlos@email.com", phone: "+51 999 555 666" },
    items: 1,
    total: 89.90,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "Calle Las Flores 789, Surco, Lima",
    trackingNumber: "PE123456789",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "BIU-JKL012",
    customer: { name: "Ana Torres", email: "ana@email.com", phone: "+51 999 777 888" },
    items: 5,
    total: 520.50,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "Av. Arequipa 1234, Lince, Lima",
    trackingNumber: "PE987654321",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "BIU-MNO345",
    customer: { name: "Pedro Ruiz", email: "pedro@email.com", phone: "+51 999 999 000" },
    items: 2,
    total: 175.80,
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: "Jr. Huancayo 567, Jesús María, Lima",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
];

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Procesando", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Entregado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
};

const paymentStatusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Pagado", color: "bg-green-100 text-green-800" },
  failed: { label: "Fallido", color: "bg-red-100 text-red-800" },
  refunded: { label: "Reembolsado", color: "bg-gray-100 text-gray-800" },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-500">Gestiona los pedidos de tus clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = mockOrders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "" : key)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                statusFilter === key
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-white hover:border-gray-200"
              }`}
            >
              <config.icon className={`w-6 h-6 mb-2 ${
                statusFilter === key ? "text-primary" : "text-gray-400"
              }`} />
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-gray-500">{config.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-white p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por # de pedido, cliente o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Pedido
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Pago
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {order.items} productos
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          statusConfig[order.status as keyof typeof statusConfig].color
                        }`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig].color
                        }`}
                      >
                        {paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig].label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No se encontraron pedidos</p>
          </div>
        )}
      </Card>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Pedido ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ${
                  statusConfig[selectedOrder.status as keyof typeof statusConfig].color
                }`}
              >
  {(() => {
                  const StatusIcon = statusConfig[selectedOrder.status as keyof typeof statusConfig].icon;
                  return <StatusIcon className="w-4 h-4" />;
                })()}
                {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(selectedOrder.createdAt)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Información del Cliente</h4>
              <p className="text-sm text-gray-600">{selectedOrder.customer.name}</p>
              <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
              <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Dirección de Envío</h4>
              <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
              {selectedOrder.trackingNumber && (
                <p className="text-sm text-primary mt-2">
                  Tracking: {selectedOrder.trackingNumber}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            {selectedOrder.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="primary" fullWidth>
                  Confirmar Pedido
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Cancelar
                </Button>
              </div>
            )}
            {selectedOrder.status === "processing" && (
              <Button variant="primary" fullWidth>
                Marcar como Enviado
              </Button>
            )}
            {selectedOrder.status === "shipped" && (
              <Button variant="primary" fullWidth>
                Marcar como Entregado
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
