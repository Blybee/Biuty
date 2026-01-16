// ========================================
// Tipos Base Compartidos
// ========================================

/**
 * ID único para entidades
 */
export type EntityId = string;

/**
 * Timestamp de Firebase
 */
export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

/**
 * Estado de carga genérico
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Respuesta genérica con paginación
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Respuesta de API genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Filtros de búsqueda genéricos
 */
export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Props base para componentes
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Navegación - Item del menú
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
