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
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

/**
 * Variante de producto (tamaño, sabor, etc.)
 */
export interface ProductVariant {
  id: EntityId;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
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
  subcategory?: string;
  
  // Precios
  price: number;
  compareAtPrice?: number;
  
  // Inventario
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  
  // Media
  images: string[];
  thumbnail: string;
  
  // Detalles
  ingredients?: string[];
  benefits: string[];
  howToUse?: string;
  nutritionalInfo?: NutritionalInfo;
  
  // Variantes
  variants?: ProductVariant[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
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
  compareAtPrice?: number;
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
