"use client";

import { useEffect, useCallback } from "react";
import { useCatalogStore } from "../model/store";
import {
  getProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
} from "../api/get-products";
import type { ProductFilters } from "@/entities/product";

/**
 * Hook para obtener y manejar el catálogo de productos
 */
export function useProducts() {
  const {
    products,
    loadingState,
    error,
    filters,
    currentPage,
    hasMore,
    setProducts,
    appendProducts,
    setLoadingState,
    setError,
    setFilters,
    resetFilters,
    setCurrentPage,
    setHasMore,
  } = useCatalogStore();

  /**
   * Carga productos con los filtros actuales
   */
  const loadProducts = useCallback(
    async (page = 1) => {
      setLoadingState("loading");
      setError(null);

      try {
        const result = await getProducts(filters, page, 12);

        if (page === 1) {
          setProducts(result.data);
        } else {
          appendProducts(result.data);
        }

        setCurrentPage(page);
        setHasMore(result.hasMore);
        setLoadingState("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar productos");
        setLoadingState("error");
      }
    },
    [filters, setProducts, appendProducts, setLoadingState, setError, setCurrentPage, setHasMore]
  );

  /**
   * Carga más productos (paginación infinita)
   */
  const loadMore = useCallback(() => {
    if (hasMore && loadingState !== "loading") {
      loadProducts(currentPage + 1);
    }
  }, [hasMore, loadingState, currentPage, loadProducts]);

  /**
   * Actualiza los filtros y recarga productos
   */
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  /**
   * Limpia los filtros y recarga productos
   */
  const clearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Carga inicial cuando cambian los filtros
  useEffect(() => {
    loadProducts(1);
  }, [filters]);

  return {
    products,
    isLoading: loadingState === "loading",
    error,
    filters,
    hasMore,
    loadProducts,
    loadMore,
    updateFilters,
    clearFilters,
  };
}

/**
 * Hook para obtener productos destacados
 */
export function useFeaturedProducts() {
  const { featuredProducts, setFeaturedProducts, setLoadingState, setError } =
    useCatalogStore();

  const loadFeaturedProducts = useCallback(async () => {
    setLoadingState("loading");
    try {
      const products = await getFeaturedProducts();
      setFeaturedProducts(products);
      setLoadingState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
      setLoadingState("error");
    }
  }, [setFeaturedProducts, setLoadingState, setError]);

  useEffect(() => {
    if (featuredProducts.length === 0) {
      loadFeaturedProducts();
    }
  }, []);

  return { featuredProducts, loadFeaturedProducts };
}

/**
 * Hook para obtener productos nuevos
 */
export function useNewArrivals() {
  const { newArrivals, setNewArrivals, setLoadingState, setError } =
    useCatalogStore();

  const loadNewArrivals = useCallback(async () => {
    setLoadingState("loading");
    try {
      const products = await getNewArrivals();
      setNewArrivals(products);
      setLoadingState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
      setLoadingState("error");
    }
  }, [setNewArrivals, setLoadingState, setError]);

  useEffect(() => {
    if (newArrivals.length === 0) {
      loadNewArrivals();
    }
  }, []);

  return { newArrivals, loadNewArrivals };
}

/**
 * Hook para obtener productos más vendidos
 */
export function useBestSellers() {
  const { bestSellers, setBestSellers, setLoadingState, setError } =
    useCatalogStore();

  const loadBestSellers = useCallback(async () => {
    setLoadingState("loading");
    try {
      const products = await getBestSellers();
      setBestSellers(products);
      setLoadingState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
      setLoadingState("error");
    }
  }, [setBestSellers, setLoadingState, setError]);

  useEffect(() => {
    if (bestSellers.length === 0) {
      loadBestSellers();
    }
  }, []);

  return { bestSellers, loadBestSellers };
}
