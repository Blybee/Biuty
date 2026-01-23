import type { EntityId, Timestamp } from "@/shared/types";

/**
 * Categoría de producto
 */
export type ProductCategory =
  | "suplementos"
  | "naturales"
  | "fitness"
  | "bienestar";

/**
 * Estado del producto
 */
export type ProductStatus = "active" | "inactive" | "out_of_stock";

/**
 * Información nutricional
 */
export interface NutritionalInfo {
  servingSize: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
}

/**
 * Variante de producto (tamaño, sabor, etc.)
 */
export interface ProductVariant {
  id: EntityId;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  attributes: Record<string, string>;
}

/**
 * Entidad Producto
 */
export interface Product {
  id: EntityId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  subcategory?: string | null;

  // Precios
  price: number;
  compareAtPrice?: number | null;

  // Inventario
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;

  // Media
  images: string[];
  thumbnail: string;

  // Detalles
  ingredients?: string[] | null;
  benefits: string[];
  howToUse?: string | null;
  nutritionalInfo?: NutritionalInfo | null;

  // Variantes
  variants?: ProductVariant[] | null;

  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;

  // Tags y filtros
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Producto para listado (versión reducida)
 */
export interface ProductListItem {
  id: EntityId;
  name: string;
  slug: string;
  shortDescription: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number | null;
  thumbnail: string;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

/**
 * Datos para crear un producto
 */
export type CreateProductDTO = Omit<Product, "id" | "createdAt" | "updatedAt">;

/**
 * Datos para actualizar un producto
 */
export type UpdateProductDTO = Partial<CreateProductDTO>;
