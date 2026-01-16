"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice, formatDiscount } from "@/shared/lib";
import { Button, Badge } from "@/shared/ui";
import { ProductGrid } from "@/widgets";
import { useCart } from "@/features/cart";
import type { Product, ProductListItem } from "@/entities/product";
import {
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
  ChevronRight,
} from "lucide-react";

// Mock product data
const mockProduct: Product = {
  id: "1",
  name: "Proteína Whey Premium",
  slug: "proteina-whey-premium",
  description: `
    Nuestra Proteína Whey Premium es el suplemento perfecto para quienes buscan 
    maximizar sus resultados en el gimnasio. Con 25g de proteína de alta calidad 
    por porción, esta fórmula ha sido diseñada para una absorción rápida y eficiente.

    Elaborada con suero de leche de vacas alimentadas con pasto, nuestra proteína 
    ofrece un perfil completo de aminoácidos esenciales para apoyar el crecimiento 
    y recuperación muscular.

    Cada porción contiene BCAAs naturales y glutamina, componentes clave para 
    optimizar tu rendimiento deportivo y acelerar la recuperación post-entrenamiento.
  `,
  shortDescription: "Proteína de suero de alta calidad con 25g por porción",
  category: "suplementos",
  price: 149.90,
  compareAtPrice: 189.90,
  sku: "WHEY-001",
  stock: 50,
  lowStockThreshold: 10,
  status: "active",
  images: [
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800",
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
  ],
  thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
  ingredients: ["Concentrado de Proteína de Suero", "Cocoa", "Lecitina de Soya", "Sucralosa"],
  benefits: [
    "25g de proteína de alta calidad por porción",
    "BCAAs y glutamina naturales",
    "Fácil digestión y absorción rápida",
    "Bajo en grasa y carbohidratos",
    "Ideal para post-entrenamiento",
  ],
  howToUse: "Mezcla 1 scoop (30g) con 250ml de agua o leche. Consumir después del entrenamiento o entre comidas.",
  nutritionalInfo: {
    servingSize: "30g (1 scoop)",
    calories: 120,
    protein: 25,
    carbs: 3,
    fat: 1.5,
  },
  tags: ["proteína", "whey", "post-entreno", "muscular"],
  isFeatured: true,
  isNewArrival: false,
  isBestSeller: true,
  createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
};

const relatedProducts: ProductListItem[] = [
  {
    id: "3",
    name: "Creatina Monohidratada",
    slug: "creatina-monohidratada",
    shortDescription: "Creatina pura para mayor rendimiento",
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
    id: "5",
    name: "Pre-Workout Extreme",
    slug: "pre-workout-extreme",
    shortDescription: "Energía explosiva para entrenamientos",
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
    name: "BCAA Amino Recovery",
    slug: "bcaa-amino-recovery",
    shortDescription: "Aminoácidos para recuperación muscular",
    category: "suplementos",
    price: 79.90,
    thumbnail: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400",
    stock: 45,
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "7",
    name: "Glutamina Pure",
    slug: "glutamina-pure",
    shortDescription: "Recuperación y sistema inmune",
    category: "suplementos",
    price: 69.90,
    thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    stock: 40,
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
];

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "nutrition" | "howto">("description");
  const { addToCart, isInCart } = useCart();

  const product = mockProduct; // En producción: fetch por slug
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    const productListItem: ProductListItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      thumbnail: product.thumbnail,
      stock: product.stock,
      status: product.status,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    };
    addToCart(productListItem, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-sage/10">
        <div className="container-biuty py-4">
          <nav className="flex items-center gap-2 text-sm text-sage">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-primary transition-colors">
              Tienda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-forest font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="container-biuty">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-background rounded-2xl overflow-hidden">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <Badge variant="error" className="absolute top-4 left-4">
                    {formatDiscount(discountPercent)}
                  </Badge>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-sage/30"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.isBestSeller && <Badge variant="secondary">Top Venta</Badge>}
                {product.isNewArrival && <Badge variant="primary">Nuevo</Badge>}
                <Badge variant="outline" className="capitalize">{product.category}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>

              <p className="text-sage-dark mb-6">{product.shortDescription}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-forest">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-sage line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Beneficios:</h3>
                <ul className="space-y-2">
                  {product.benefits.slice(0, 4).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sage-dark">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-sage/20 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-sage/10 rounded-l-full transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-sage/10 rounded-r-full transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {isInCart(product.id) ? "Agregar más" : "Agregar al carrito"}
                </Button>

                <Button variant="outline" size="lg" className="p-3">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-background rounded-xl">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-sage-dark">Envío gratis +S/100</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-sage-dark">Compra segura</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-sage-dark">Devolución fácil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 bg-background">
        <div className="container-biuty">
          <div className="flex gap-4 mb-8 border-b border-sage/20">
            {[
              { key: "description", label: "Descripción" },
              { key: "nutrition", label: "Información Nutricional" },
              { key: "howto", label: "Cómo Usar" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={cn(
                  "pb-4 px-2 font-medium transition-colors relative",
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-sage hover:text-forest"
                )}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8">
            {activeTab === "description" && (
              <div className="prose prose-sage max-w-none">
                <p className="whitespace-pre-line text-sage-dark leading-relaxed">
                  {product.description}
                </p>
                {product.ingredients && (
                  <>
                    <h3 className="text-forest mt-6 mb-3">Ingredientes:</h3>
                    <p className="text-sage-dark">{product.ingredients.join(", ")}</p>
                  </>
                )}
              </div>
            )}

            {activeTab === "nutrition" && product.nutritionalInfo && (
              <div className="max-w-md">
                <h3 className="font-semibold mb-4">
                  Información por porción ({product.nutritionalInfo.servingSize})
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Calorías", value: `${product.nutritionalInfo.calories} kcal` },
                    { label: "Proteína", value: `${product.nutritionalInfo.protein}g` },
                    { label: "Carbohidratos", value: `${product.nutritionalInfo.carbs}g` },
                    { label: "Grasa", value: `${product.nutritionalInfo.fat}g` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 border-b border-sage/10"
                    >
                      <span className="text-sage-dark">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "howto" && (
              <div className="max-w-2xl">
                <h3 className="font-semibold mb-4">Modo de uso:</h3>
                <p className="text-sage-dark">{product.howToUse}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-padding">
        <div className="container-biuty">
          <h2 className="mb-8">Productos Relacionados</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      </section>
    </div>
  );
}
