import type { PaginatedResponse } from "@/shared/types";
import type {
  BlogPost,
  BlogPostListItem,
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogCategory,
  BlogPostStatus,
} from "./model";

/**
 * Filtros para artículos
 */
export interface BlogFilters {
  category?: BlogCategory;
  status?: BlogPostStatus;
  authorId?: string;
  tags?: string[];
  query?: string;
}

/**
 * Interface del repositorio del blog
 */
export interface IBlogRepository {
  /**
   * Obtiene un artículo por su ID
   */
  getById(id: string): Promise<BlogPost | null>;

  /**
   * Obtiene un artículo por su slug
   */
  getBySlug(slug: string): Promise<BlogPost | null>;

  /**
   * Obtiene lista paginada de artículos
   */
  getAll(
    filters?: BlogFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<BlogPostListItem>>;

  /**
   * Obtiene artículos publicados
   */
  getPublished(
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<BlogPostListItem>>;

  /**
   * Obtiene artículos por categoría
   */
  getByCategory(
    category: BlogCategory,
    limit?: number
  ): Promise<BlogPostListItem[]>;

  /**
   * Obtiene artículos recientes
   */
  getRecent(limit?: number): Promise<BlogPostListItem[]>;

  /**
   * Obtiene artículos populares
   */
  getPopular(limit?: number): Promise<BlogPostListItem[]>;

  /**
   * Obtiene artículos relacionados
   */
  getRelated(postId: string, limit?: number): Promise<BlogPostListItem[]>;

  /**
   * Busca artículos
   */
  search(query: string, limit?: number): Promise<BlogPostListItem[]>;

  /**
   * Crea un nuevo artículo
   */
  create(data: CreateBlogPostDTO): Promise<BlogPost>;

  /**
   * Actualiza un artículo existente
   */
  update(id: string, data: UpdateBlogPostDTO): Promise<BlogPost>;

  /**
   * Publica un artículo
   */
  publish(id: string): Promise<void>;

  /**
   * Archiva un artículo
   */
  archive(id: string): Promise<void>;

  /**
   * Incrementa las vistas
   */
  incrementViews(id: string): Promise<void>;

  /**
   * Elimina un artículo (soft delete)
   */
  delete(id: string): Promise<void>;
}
