"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/widgets";
import { Button, Badge, Input, Spinner } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { ProductListItem, ProductCategory } from "@/entities/product";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

// Mock data
const mockProducts: ProductListItem[] = [
  {
    id: "1",
    name: "Proteína Whey Premium",
    slug: "proteina-whey-premium",
    shortDescription: "Proteína de suero de alta calidad con 25g por porción",
    category: "suplementos",
    price: 149.90,
    compareAtPrice: 189.90,
    thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    stock: 50,
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Miel de Abeja Pura",
    slug: "miel-abeja-pura",
    shortDescription: "Miel 100% natural de apicultores locales",
    category: "naturales",
    price: 35.90,
    thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    stock: 100,
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "3",
    name: "Creatina Monohidratada",
    slug: "creatina-monohidratada",
    shortDescription: "Creatina pura para mayor rendimiento y fuerza",
    category: "fitness",
    price: 89.90,
    thumbnail: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    stock: 30,
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "4",
    name: "Algarrobina Natural",
    slug: "algarrobina-natural",
    shortDescription: "Energizante natural rico en hierro y calcio",
    category: "naturales",
    price: 28.90,
    thumbnail: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400",
    stock: 75,
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "5",
    name: "Pre-Workout Extreme",
    slug: "pre-workout-extreme",
    shortDescription: "Energía explosiva para tus entrenamientos más intensos",
    category: "fitness",
    price: 119.90,
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    stock: 25,
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "6",
    name: "Multivitamínico Daily",
    slug: "multivitaminico-daily",
    shortDescription: "Complejo vitamínico completo para el día a día",
    category: "bienestar",
    price: 59.90,
    thumbnail: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400",
    stock: 60,
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
];

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

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">(
    categoryParam || "all"
  );
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
                      onClick={() => setSelectedCategory(cat.value)}
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
                  {sortedProducts.length} productos
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
                      onClick={() => setSelectedCategory(cat.value)}
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

            {/* Active Filters */}
            {(selectedCategory !== "all" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-sage">Filtros activos:</span>
                {selectedCategory !== "all" && (
                  <Badge
                    variant="primary"
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory("all")}
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
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setPriceRange([0, 500]);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={sortedProducts}
              columns={3}
              emptyMessage="No se encontraron productos con los filtros seleccionados"
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
