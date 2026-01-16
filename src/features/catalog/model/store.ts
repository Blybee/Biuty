import { create } from "zustand";
import type { ProductListItem, ProductFilters, ProductCategory } from "@/entities/product";
import type { LoadingState } from "@/shared/types";

/**
 * Estado del catálogo de productos
 */
interface CatalogState {
  // Productos
  products: ProductListItem[];
  featuredProducts: ProductListItem[];
  newArrivals: ProductListItem[];
  bestSellers: ProductListItem[];
  
  // Estado de carga
  loadingState: LoadingState;
  error: string | null;
  
  // Filtros
  filters: ProductFilters;
  
  // Paginación
  currentPage: number;
  hasMore: boolean;
  
  // Acciones
  setProducts: (products: ProductListItem[]) => void;
  appendProducts: (products: ProductListItem[]) => void;
  setFeaturedProducts: (products: ProductListItem[]) => void;
  setNewArrivals: (products: ProductListItem[]) => void;
  setBestSellers: (products: ProductListItem[]) => void;
  setLoadingState: (state: LoadingState) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  reset: () => void;
}

const initialFilters: ProductFilters = {
  query: "",
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const initialState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  bestSellers: [],
  loadingState: "idle" as LoadingState,
  error: null,
  filters: initialFilters,
  currentPage: 1,
  hasMore: false,
};

export const useCatalogStore = create<CatalogState>((set) => ({
  ...initialState,

  setProducts: (products) =>
    set({ products, currentPage: 1 }),

  appendProducts: (products) =>
    set((state) => ({
      products: [...state.products, ...products],
    })),

  setFeaturedProducts: (featuredProducts) =>
    set({ featuredProducts }),

  setNewArrivals: (newArrivals) =>
    set({ newArrivals }),

  setBestSellers: (bestSellers) =>
    set({ bestSellers }),

  setLoadingState: (loadingState) =>
    set({ loadingState }),

  setError: (error) =>
    set({ error }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
      products: [],
    })),

  resetFilters: () =>
    set({
      filters: initialFilters,
      currentPage: 1,
      products: [],
    }),

  setCurrentPage: (currentPage) =>
    set({ currentPage }),

  setHasMore: (hasMore) =>
    set({ hasMore }),

  reset: () =>
    set(initialState),
}));
