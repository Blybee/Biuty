import { getProductRepository } from "@/infrastructure/firebase";
import type { ProductFilters, ProductListItem, Product, ProductCategory } from "@/entities/product";
import type { PaginatedResponse } from "@/shared/types";

const repository = getProductRepository();

/**
 * Obtiene lista de productos con filtros y paginación
 */
export async function getProducts(
  filters?: ProductFilters,
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<ProductListItem>> {
  return repository.getAll(filters, page, pageSize);
}

/**
 * Obtiene un producto por su ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  return repository.getById(id);
}

/**
 * Obtiene un producto por su slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return repository.getBySlug(slug);
}

/**
 * Obtiene productos destacados
 */
export async function getFeaturedProducts(
  limit = 8
): Promise<ProductListItem[]> {
  return repository.getFeatured(limit);
}

/**
 * Obtiene productos nuevos
 */
export async function getNewArrivals(limit = 8): Promise<ProductListItem[]> {
  return repository.getNewArrivals(limit);
}

/**
 * Obtiene productos más vendidos
 */
export async function getBestSellers(limit = 8): Promise<ProductListItem[]> {
  return repository.getBestSellers(limit);
}

/**
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(
  category: ProductCategory,
  limit = 12
): Promise<ProductListItem[]> {
  return repository.getByCategory(category, limit);
}

/**
 * Busca productos
 */
export async function searchProducts(
  query: string,
  limit = 12
): Promise<ProductListItem[]> {
  return repository.search(query, limit);
}

/**
 * Obtiene productos relacionados
 */
export async function getRelatedProducts(
  productId: string,
  limit = 4
): Promise<ProductListItem[]> {
  return repository.getRelated(productId, limit);
}
