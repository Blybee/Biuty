import type { PaginatedResponse, SearchFilters } from "@/shared/types";
import type {
  Product,
  ProductListItem,
  CreateProductDTO,
  UpdateProductDTO,
  ProductCategory,
} from "./model";

/**
 * Filtros específicos para productos
 */
export interface ProductFilters extends SearchFilters {
  category?: ProductCategory;
  status?: Product["status"];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  inStock?: boolean;
}

/**
 * Interface del repositorio de productos
 * Define el contrato que debe implementar cualquier fuente de datos
 */
export interface IProductRepository {
  /**
   * Obtiene un producto por su ID
   */
  getById(id: string): Promise<Product | null>;

  /**
   * Obtiene un producto por su slug
   */
  getBySlug(slug: string): Promise<Product | null>;

  /**
   * Obtiene lista paginada de productos
   */
  getAll(
    filters?: ProductFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<ProductListItem>>;

  /**
   * Obtiene productos destacados
   */
  getFeatured(limit?: number): Promise<ProductListItem[]>;

  /**
   * Obtiene productos nuevos
   */
  getNewArrivals(limit?: number): Promise<ProductListItem[]>;

  /**
   * Obtiene productos más vendidos
   */
  getBestSellers(limit?: number): Promise<ProductListItem[]>;

  /**
   * Obtiene productos por categoría
   */
  getByCategory(
    category: ProductCategory,
    limit?: number
  ): Promise<ProductListItem[]>;

  /**
   * Busca productos por texto
   */
  search(query: string, limit?: number): Promise<ProductListItem[]>;

  /**
   * Obtiene productos relacionados
   */
  getRelated(productId: string, limit?: number): Promise<ProductListItem[]>;

  /**
   * Crea un nuevo producto
   */
  create(data: CreateProductDTO): Promise<Product>;

  /**
   * Actualiza un producto existente
   */
  update(id: string, data: UpdateProductDTO): Promise<Product>;

  /**
   * Actualiza el stock de un producto
   */
  updateStock(id: string, quantity: number): Promise<void>;

  /**
   * Elimina un producto (soft delete)
   */
  delete(id: string): Promise<void>;
}
