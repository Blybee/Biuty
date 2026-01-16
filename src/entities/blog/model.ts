import type { EntityId, Timestamp } from "@/shared/types";

/**
 * Estado del artículo
 */
export type BlogPostStatus = "draft" | "published" | "archived";

/**
 * Categoría del blog
 */
export type BlogCategory =
  | "nutricion"
  | "fitness"
  | "bienestar"
  | "recetas"
  | "consejos";

/**
 * Autor del artículo
 */
export interface BlogAuthor {
  id: EntityId;
  name: string;
  avatar?: string;
  bio?: string;
}

/**
 * Entidad Artículo del Blog
 */
export interface BlogPost {
  id: EntityId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  
  // Media
  featuredImage: string;
  images?: string[];
  
  // Categorización
  category: BlogCategory;
  tags: string[];
  
  // Autor
  author: BlogAuthor;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Estado
  status: BlogPostStatus;
  
  // Métricas
  views: number;
  readTime: number;
  
  // Timestamps
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Artículo para listado
 */
export interface BlogPostListItem {
  id: EntityId;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: BlogCategory;
  author: BlogAuthor;
  publishedAt?: Timestamp;
  readTime: number;
  views: number;
}

/**
 * Datos para crear un artículo
 */
export type CreateBlogPostDTO = Omit<
  BlogPost,
  "id" | "views" | "createdAt" | "updatedAt"
>;

/**
 * Datos para actualizar un artículo
 */
export type UpdateBlogPostDTO = Partial<CreateBlogPostDTO>;
