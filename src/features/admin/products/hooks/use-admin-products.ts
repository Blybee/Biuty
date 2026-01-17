"use client";

import { useState, useCallback, useEffect } from "react";
import { getProductRepository, getStorageService } from "@/infrastructure/firebase";
import type {
  Product,
  ProductListItem,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from "@/entities/product";

type LoadingState = "idle" | "loading" | "success" | "error";

interface UseAdminProductsState {
  products: ProductListItem[];
  selectedProduct: Product | null;
  loadingState: LoadingState;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: UseAdminProductsState = {
  products: [],
  selectedProduct: null,
  loadingState: "idle",
  error: null,
  currentPage: 1,
  hasMore: false,
};

/**
 * Hook para manejar CRUD de productos en el panel de administración
 */
export function useAdminProducts() {
  const [state, setState] = useState<UseAdminProductsState>(initialState);
  const repository = getProductRepository();
  const storageService = getStorageService();

  /**
   * Carga lista de productos con filtros y paginación
   */
  const loadProducts = useCallback(
    async (filters?: ProductFilters, page = 1, pageSize = 20) => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        const result = await repository.getAll(filters, page, pageSize);
        setState((prev) => ({
          ...prev,
          products: page === 1 ? result.data : [...prev.products, ...result.data],
          currentPage: page,
          hasMore: result.hasMore,
          loadingState: "success",
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al cargar productos",
        }));
      }
    },
    [repository]
  );

  /**
   * Obtiene un producto por su ID
   */
  const getProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        const product = await repository.getById(id);
        setState((prev) => ({
          ...prev,
          selectedProduct: product,
          loadingState: "success",
        }));
        return product;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al obtener producto",
        }));
        return null;
      }
    },
    [repository]
  );

  /**
   * Sube imágenes a Firebase Storage
   */
  const uploadImages = useCallback(
    async (files: File[], productId?: string): Promise<string[]> => {
      const uploadPromises = files.map((file) =>
        storageService.uploadProductImage(file, productId)
      );
      const results = await Promise.all(uploadPromises);
      return results.map((r) => r.url);
    },
    [storageService]
  );

  /**
   * Crea un nuevo producto
   */
  const createProduct = useCallback(
    async (data: CreateProductDTO, imageFiles?: File[]): Promise<Product | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        // Subir imágenes si hay archivos
        let images = data.images || [];
        let thumbnail = data.thumbnail || "";

        if (imageFiles && imageFiles.length > 0) {
          const uploadedUrls = await uploadImages(imageFiles);
          images = [...images, ...uploadedUrls];
          if (!thumbnail && uploadedUrls.length > 0) {
            thumbnail = uploadedUrls[0];
          }
        }

        const productData: CreateProductDTO = {
          ...data,
          images,
          thumbnail,
        };

        const newProduct = await repository.create(productData);

        // Actualizar lista de productos
        setState((prev) => ({
          ...prev,
          products: [
            {
              id: newProduct.id,
              name: newProduct.name,
              slug: newProduct.slug,
              shortDescription: newProduct.shortDescription,
              category: newProduct.category,
              price: newProduct.price,
              compareAtPrice: newProduct.compareAtPrice,
              thumbnail: newProduct.thumbnail,
              stock: newProduct.stock,
              status: newProduct.status,
              isFeatured: newProduct.isFeatured,
              isNewArrival: newProduct.isNewArrival,
              isBestSeller: newProduct.isBestSeller,
            },
            ...prev.products,
          ],
          loadingState: "success",
        }));

        return newProduct;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al crear producto",
        }));
        return null;
      }
    },
    [repository, uploadImages]
  );

  /**
   * Actualiza un producto existente
   */
  const updateProduct = useCallback(
    async (
      id: string,
      data: UpdateProductDTO,
      imageFiles?: File[]
    ): Promise<Product | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        // Subir nuevas imágenes si hay archivos
        let images = data.images;
        let thumbnail = data.thumbnail;

        if (imageFiles && imageFiles.length > 0) {
          const uploadedUrls = await uploadImages(imageFiles, id);
          images = [...(images || []), ...uploadedUrls];
          if (!thumbnail && uploadedUrls.length > 0) {
            thumbnail = uploadedUrls[0];
          }
        }

        const updateData: UpdateProductDTO = {
          ...data,
          ...(images && { images }),
          ...(thumbnail && { thumbnail }),
        };

        const updatedProduct = await repository.update(id, updateData);

        // Actualizar lista de productos
        setState((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === id
              ? {
                  id: updatedProduct.id,
                  name: updatedProduct.name,
                  slug: updatedProduct.slug,
                  shortDescription: updatedProduct.shortDescription,
                  category: updatedProduct.category,
                  price: updatedProduct.price,
                  compareAtPrice: updatedProduct.compareAtPrice,
                  thumbnail: updatedProduct.thumbnail,
                  stock: updatedProduct.stock,
                  status: updatedProduct.status,
                  isFeatured: updatedProduct.isFeatured,
                  isNewArrival: updatedProduct.isNewArrival,
                  isBestSeller: updatedProduct.isBestSeller,
                }
              : p
          ),
          selectedProduct: updatedProduct,
          loadingState: "success",
        }));

        return updatedProduct;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al actualizar producto",
        }));
        return null;
      }
    },
    [repository, uploadImages]
  );

  /**
   * Elimina un producto (soft delete)
   */
  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        await repository.delete(id);

        // Remover de la lista
        setState((prev) => ({
          ...prev,
          products: prev.products.filter((p) => p.id !== id),
          loadingState: "success",
        }));

        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al eliminar producto",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Actualiza el stock de un producto
   */
  const updateStock = useCallback(
    async (id: string, quantity: number): Promise<boolean> => {
      try {
        await repository.updateStock(id, quantity);

        setState((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === id ? { ...p, stock: p.stock + quantity } : p
          ),
        }));

        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Error al actualizar stock",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Limpia el producto seleccionado
   */
  const clearSelectedProduct = useCallback(() => {
    setState((prev) => ({ ...prev, selectedProduct: null }));
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    products: state.products,
    selectedProduct: state.selectedProduct,
    isLoading: state.loadingState === "loading",
    error: state.error,
    currentPage: state.currentPage,
    hasMore: state.hasMore,

    // Acciones
    loadProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    uploadImages,
    clearSelectedProduct,
    clearError,
  };
}
