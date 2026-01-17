"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { formatPrice } from "@/shared/lib";
import { Button, Input, Card, Modal, Spinner } from "@/shared/ui";
import { ProductForm } from "@/widgets/admin/product-form";
import { useAdminProducts } from "@/features/admin/products";
import type { Product, ProductCategory, ProductStatus, ProductFilters } from "@/entities/product";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Activo", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactivo", color: "bg-gray-100 text-gray-800" },
  out_of_stock: { label: "Agotado", color: "bg-red-100 text-red-800" },
};

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Todas las categorías" },
  { value: "suplementos", label: "Suplementos" },
  { value: "naturales", label: "Naturales" },
  { value: "fitness", label: "Fitness" },
  { value: "bienestar", label: "Bienestar" },
];

const statuses: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "out_of_stock", label: "Sin Stock" },
];

export default function InventoryPage() {
  const {
    products,
    selectedProduct,
    isLoading,
    error,
    loadProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearSelectedProduct,
    clearError,
  } = useAdminProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load products on mount and when filters change
  useEffect(() => {
    const filters: ProductFilters = {};
    if (categoryFilter !== "all") {
      filters.category = categoryFilter;
    }
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    loadProducts(filters);
  }, [categoryFilter, statusFilter, loadProducts]);

  // Filter products by search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
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
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Handlers
  const handleCreateProduct = () => {
    clearSelectedProduct();
    setIsFormOpen(true);
  };

  const handleEditProduct = async (id: string) => {
    await getProduct(id);
    setIsFormOpen(true);
  };

  const handleViewProduct = async (id: string) => {
    await getProduct(id);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setIsDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = async (
    data: Parameters<typeof createProduct>[0],
    imageFiles?: File[]
  ) => {
    setFormSubmitting(true);
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data, imageFiles);
      } else {
        await createProduct(data, imageFiles);
      }
      setIsFormOpen(false);
      clearSelectedProduct();
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    clearSelectedProduct();
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    clearSelectedProduct();
  };

  const handleRefresh = () => {
    const filters: ProductFilters = {};
    if (categoryFilter !== "all") {
      filters.category = categoryFilter;
    }
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    loadProducts(filters);
  };

  // Compute stock status for display
  const getStockStatus = (stock: number): "active" | "low_stock" | "out_of_stock" => {
    if (stock === 0) return "out_of_stock";
    if (stock <= 10) return "low_stock";
    return "active";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-500">Gestiona tus productos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button variant="primary" onClick={handleCreateProduct}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "border-primary text-primary" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {(categoryFilter !== "all" || statusFilter !== "all") && (
                <span className="ml-2 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as ProductCategory | "all")
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ProductStatus | "all")
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="text-sm"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Products Table */}
      <Card className="bg-white overflow-hidden">
        {isLoading && products.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No se encontraron productos</p>
            <Button variant="primary" onClick={handleCreateProduct}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primer Producto
            </Button>
          </div>
        ) : (
          <>
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
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
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
                              {product.thumbnail ? (
                                <Image
                                  src={product.thumbnail}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  Sin imagen
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 block">
                                {product.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {product.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 capitalize">
                          {product.category}
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-medium">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-gray-400 line-through ml-2">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`font-medium ${
                              stockStatus === "out_of_stock"
                                ? "text-red-600"
                                : stockStatus === "low_stock"
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
                              statusConfig[product.status]?.color ||
                              statusConfig.active.color
                            }`}
                          >
                            {statusConfig[product.status]?.label || product.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewProduct(product.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleEditProduct(product.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-gray-500">
                Mostrando {filteredProducts.length} productos
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        isLoading={formSubmitting}
      />

      {/* View Product Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={handleCloseView}
        title="Detalles del Producto"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Images */}
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {selectedProduct.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square relative rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={img}
                      alt={`${selectedProduct.name} - ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Nombre</span>
                <p className="font-medium">{selectedProduct.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">SKU</span>
                <p className="font-medium">{selectedProduct.sku}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Categoría</span>
                <p className="font-medium capitalize">{selectedProduct.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Estado</span>
                <p className="font-medium">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      statusConfig[selectedProduct.status]?.color
                    }`}
                  >
                    {statusConfig[selectedProduct.status]?.label}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Precio</span>
                <p className="font-medium">{formatPrice(selectedProduct.price)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Stock</span>
                <p className="font-medium">{selectedProduct.stock} unidades</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-sm text-gray-500">Descripción</span>
              <p className="mt-1">{selectedProduct.description}</p>
            </div>

            {/* Benefits */}
            {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Beneficios</span>
                <ul className="mt-1 list-disc list-inside">
                  {selectedProduct.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {selectedProduct.tags && selectedProduct.tags.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Etiquetas</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCloseView}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleCloseView();
                  handleEditProduct(selectedProduct.id);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar Producto"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            <p>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción lo
              marcará como inactivo.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
