"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/widgets";
import { Button, Badge, Input, Spinner } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useProducts } from "@/features/catalog";
import type { ProductCategory } from "@/entities/product";
import { Search, SlidersHorizontal, X, ChevronDown, RefreshCw } from "lucide-react";

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "suplementos", label: "Suplementos" },
  { value: "naturales", label: "Naturales" },
  { value: "fitness", label: "Fitness" },
  { value: "bienestar", label: "Bienestar" },
];

const sortOptions = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Precio: Menor a Mayor" },
  { value: "price-desc", label: "Precio: Mayor a Menor" },
  { value: "popular", label: "Más populares" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as ProductCategory | null;

  const { products, isLoading, error, updateFilters, clearFilters, loadProducts } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">(
    categoryParam || "all"
  );
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Update filters when category changes
  useEffect(() => {
    if (selectedCategory !== "all") {
      updateFilters({ category: selectedCategory, status: "active" });
    } else {
      updateFilters({ category: undefined, status: "active" });
    }
  }, [selectedCategory, updateFilters]);

  // Local filtering for search (since Firebase doesn't support full-text search)
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => product.status === "active");

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query)
      );
    }

    // Price filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    return result;
  }, [products, searchQuery, priceRange]);

  // Sort products locally
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "popular":
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const handleCategoryChange = (category: ProductCategory | "all") => {
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange([0, 500]);
    clearFilters();
  };

  const handleRefresh = () => {
    loadProducts(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-sage/10">
        <div className="container-biuty py-8">
          <h1 className="text-3xl md:text-4xl mb-2">Nuestra Tienda</h1>
          <p className="text-sage-dark">
            Descubre nuestra selección de productos para tu bienestar
          </p>
        </div>
      </div>

      <div className="container-biuty py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <h3 className="font-semibold text-forest mb-4">Buscar</h3>
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-forest mb-4">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-lg transition-colors",
                        selectedCategory === cat.value
                          ? "bg-primary text-white"
                          : "text-sage-dark hover:bg-sage/10"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-forest mb-4">Precio</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="text-sm"
                  />
                  <span className="text-sage">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                fullWidth
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                Actualizar
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Toggle & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-sage/20 rounded-full text-sm font-medium hover:bg-sage/10 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </button>

                <p className="text-sm text-sage">
                  {isLoading ? "Cargando..." : `${sortedProducts.length} productos`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-sage/20 rounded-full px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 bg-white rounded-xl border border-sage/10 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filtros</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-sage/10 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  className="mb-4"
                />

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-colors",
                        selectedCategory === cat.value
                          ? "bg-primary text-white"
                          : "bg-sage/10 text-sage-dark hover:bg-sage/20"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p>{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Intentar de nuevo
                </button>
              </div>
            )}

            {/* Active Filters */}
            {(selectedCategory !== "all" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-sage">Filtros activos:</span>
                {selectedCategory !== "all" && (
                  <Badge
                    variant="primary"
                    className="cursor-pointer"
                    onClick={() => handleCategoryChange("all")}
                  >
                    {categories.find((c) => c.value === selectedCategory)?.label}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  >
                    "{searchQuery}"
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={sortedProducts}
              isLoading={isLoading}
              columns={3}
              emptyMessage={
                products.length === 0 && !isLoading
                  ? "Aún no hay productos disponibles. ¡Vuelve pronto!"
                  : "No se encontraron productos con los filtros seleccionados"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
