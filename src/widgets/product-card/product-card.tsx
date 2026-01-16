"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice, formatDiscount, calculateDiscountedPrice } from "@/shared/lib";
import { Badge } from "@/shared/ui";
import { useCart } from "@/features/cart";
import type { ProductListItem } from "@/entities/product";
import { ShoppingBag, Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: ProductListItem;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <article
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden card-hover",
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-background">
        <Image
          src={product.thumbnail || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="error" size="sm">
              {formatDiscount(discountPercent)}
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="primary" size="sm">
              Nuevo
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="secondary" size="sm">
              Top Venta
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
            aria-label="Agregar a favoritos"
          >
            <Heart className="w-4 h-4" />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
            aria-label="Ver producto"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to Cart Button - Mobile visible, Desktop on hover */}
        <div className="absolute bottom-3 left-3 right-3 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "w-full py-3 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all",
              product.stock === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isInCart(product.id)
                ? "bg-forest text-white"
                : "bg-primary text-white hover:bg-primary-hover"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            {product.stock === 0
              ? "Agotado"
              : isInCart(product.id)
              ? "En el carrito"
              : "Agregar"}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-sage uppercase tracking-wider">
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 text-forest font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-1 text-sm text-sage-dark line-clamp-1">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-forest">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-sage line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
