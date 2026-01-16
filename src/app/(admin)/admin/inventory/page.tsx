"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/shared/lib";
import { Button, Input, Badge, Card } from "@/shared/ui";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";

// Mock products
const mockProducts = [
  {
    id: "1",
    name: "Proteína Whey Premium",
    sku: "WHEY-001",
    category: "suplementos",
    price: 149.90,
    stock: 50,
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=100",
  },
  {
    id: "2",
    name: "Miel de Abeja Pura",
    sku: "MIEL-001",
    category: "naturales",
    price: 35.90,
    stock: 100,
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100",
  },
  {
    id: "3",
    name: "Creatina Monohidratada",
    sku: "CREA-001",
    category: "fitness",
    price: 89.90,
    stock: 5,
    status: "low_stock",
    thumbnail: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100",
  },
  {
    id: "4",
    name: "Algarrobina Natural",
    sku: "ALG-001",
    category: "naturales",
    price: 28.90,
    stock: 0,
    status: "out_of_stock",
    thumbnail: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=100",
  },
  {
    id: "5",
    name: "Pre-Workout Extreme",
    sku: "PRE-001",
    category: "fitness",
    price: 119.90,
    stock: 25,
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100",
  },
];

const statusConfig = {
  active: { label: "Activo", color: "bg-green-100 text-green-800" },
  low_stock: { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-800" },
  out_of_stock: { label: "Agotado", color: "bg-red-100 text-red-800" },
  inactive: { label: "Inactivo", color: "bg-gray-100 text-gray-800" },
};

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-500">Gestiona tus productos</p>
        </div>
        <Button variant="primary">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm">
              <option value="">Todas las categorías</option>
              <option value="suplementos">Suplementos</option>
              <option value="naturales">Naturales</option>
              <option value="fitness">Fitness</option>
              <option value="bienestar">Bienestar</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 capitalize">
                    {product.category}
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= 10
                          ? "text-yellow-600"
                          : "text-gray-900"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        statusConfig[product.status as keyof typeof statusConfig].color
                      }`}
                    >
                      {statusConfig[product.status as keyof typeof statusConfig].label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-gray-500">
            Mostrando {filteredProducts.length} de {mockProducts.length} productos
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
