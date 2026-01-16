import { formatPrice } from "@/shared/lib";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/shared/ui";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data
const stats = [
  {
    label: "Ventas del Día",
    value: "S/ 2,450.00",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Pedidos Hoy",
    value: "24",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Clientes Nuevos",
    value: "12",
    change: "-3%",
    trend: "down",
    icon: Users,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Productos en Stock",
    value: "156",
    change: "+2",
    trend: "up",
    icon: Package,
    color: "bg-orange-50 text-orange-600",
  },
];

const recentOrders = [
  {
    id: "BIU-ABC123",
    customer: "Juan Pérez",
    email: "juan@email.com",
    total: 189.90,
    status: "pending",
    date: "Hace 5 min",
  },
  {
    id: "BIU-DEF456",
    customer: "María García",
    email: "maria@email.com",
    total: 245.00,
    status: "processing",
    date: "Hace 15 min",
  },
  {
    id: "BIU-GHI789",
    customer: "Carlos López",
    email: "carlos@email.com",
    total: 89.90,
    status: "shipped",
    date: "Hace 1 hora",
  },
  {
    id: "BIU-JKL012",
    customer: "Ana Torres",
    email: "ana@email.com",
    total: 320.50,
    status: "delivered",
    date: "Hace 2 horas",
  },
];

const topProducts = [
  { name: "Proteína Whey Premium", sales: 45, revenue: 6745.50 },
  { name: "Creatina Monohidratada", sales: 38, revenue: 3416.20 },
  { name: "Miel de Abeja Pura", sales: 32, revenue: 1148.80 },
  { name: "Pre-Workout Extreme", sales: 28, revenue: 3357.20 },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen de tu negocio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Pedidos Recientes</CardTitle>
            <a href="/admin/orders" className="text-sm text-primary hover:underline">
              Ver todos
            </a>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Pedido</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[order.status as keyof typeof statusColors]
                          }`}
                        >
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Productos Más Vendidos</CardTitle>
            <a href="/admin/inventory" className="text-sm text-primary hover:underline">
              Ver todos
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4"
                >
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.sales} vendidos
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/inventory/new"
              className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-sm">Nuevo Producto</p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-sm">Ver Pedidos</p>
            </a>
            <a
              href="/admin/blog/new"
              className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-sm">Nuevo Artículo</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="font-medium text-sm">Gestionar Usuarios</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
