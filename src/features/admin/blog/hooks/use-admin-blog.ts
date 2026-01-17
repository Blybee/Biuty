"use client";

import { useState, useCallback } from "react";
import { getBlogRepository, getStorageService } from "@/infrastructure/firebase";
import type {
  BlogPost,
  BlogPostListItem,
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogFilters,
} from "@/entities/blog";

type LoadingState = "idle" | "loading" | "success" | "error";

interface UseAdminBlogState {
  posts: BlogPostListItem[];
  selectedPost: BlogPost | null;
  loadingState: LoadingState;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: UseAdminBlogState = {
  posts: [],
  selectedPost: null,
  loadingState: "idle",
  error: null,
  currentPage: 1,
  hasMore: false,
};

/**
 * Hook para manejar CRUD de artículos del blog en el panel de administración
 */
export function useAdminBlog() {
  const [state, setState] = useState<UseAdminBlogState>(initialState);
  const repository = getBlogRepository();
  const storageService = getStorageService();

  /**
   * Carga lista de artículos con filtros y paginación
   */
  const loadPosts = useCallback(
    async (filters?: BlogFilters, page = 1, pageSize = 20) => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        const result = await repository.getAll(filters, page, pageSize);
        setState((prev) => ({
          ...prev,
          posts: page === 1 ? result.data : [...prev.posts, ...result.data],
          currentPage: page,
          hasMore: result.hasMore,
          loadingState: "success",
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al cargar artículos",
        }));
      }
    },
    [repository]
  );

  /**
   * Obtiene un artículo por su ID
   */
  const getPost = useCallback(
    async (id: string): Promise<BlogPost | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        const post = await repository.getById(id);
        setState((prev) => ({
          ...prev,
          selectedPost: post,
          loadingState: "success",
        }));
        return post;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al obtener artículo",
        }));
        return null;
      }
    },
    [repository]
  );

  /**
   * Sube imagen a Firebase Storage
   */
  const uploadImage = useCallback(
    async (file: File, postId?: string): Promise<string> => {
      const result = await storageService.uploadBlogImage(file, postId);
      return result.url;
    },
    [storageService]
  );

  /**
   * Crea un nuevo artículo
   */
  const createPost = useCallback(
    async (data: CreateBlogPostDTO, imageFile?: File): Promise<BlogPost | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        let featuredImage = data.featuredImage;

        // Upload image if provided
        if (imageFile) {
          featuredImage = await uploadImage(imageFile);
        }

        const postData: CreateBlogPostDTO = {
          ...data,
          featuredImage,
        };

        const newPost = await repository.create(postData);

        // Update list
        setState((prev) => ({
          ...prev,
          posts: [
            {
              id: newPost.id,
              title: newPost.title,
              slug: newPost.slug,
              excerpt: newPost.excerpt,
              featuredImage: newPost.featuredImage,
              category: newPost.category,
              author: newPost.author,
              publishedAt: newPost.publishedAt,
              readTime: newPost.readTime,
              views: newPost.views,
            },
            ...prev.posts,
          ],
          loadingState: "success",
        }));

        return newPost;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al crear artículo",
        }));
        return null;
      }
    },
    [repository, uploadImage]
  );

  /**
   * Actualiza un artículo existente
   */
  const updatePost = useCallback(
    async (
      id: string,
      data: UpdateBlogPostDTO,
      imageFile?: File
    ): Promise<BlogPost | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        let featuredImage = data.featuredImage;

        // Upload new image if provided
        if (imageFile) {
          featuredImage = await uploadImage(imageFile, id);
        }

        const updateData: UpdateBlogPostDTO = {
          ...data,
          ...(featuredImage && { featuredImage }),
        };

        const updatedPost = await repository.update(id, updateData);

        // Update list
        setState((prev) => ({
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === id
              ? {
                  id: updatedPost.id,
                  title: updatedPost.title,
                  slug: updatedPost.slug,
                  excerpt: updatedPost.excerpt,
                  featuredImage: updatedPost.featuredImage,
                  category: updatedPost.category,
                  author: updatedPost.author,
                  publishedAt: updatedPost.publishedAt,
                  readTime: updatedPost.readTime,
                  views: updatedPost.views,
                }
              : p
          ),
          selectedPost: updatedPost,
          loadingState: "success",
        }));

        return updatedPost;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al actualizar artículo",
        }));
        return null;
      }
    },
    [repository, uploadImage]
  );

  /**
   * Publica un artículo
   */
  const publishPost = useCallback(
    async (id: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        await repository.publish(id);

        // Refresh the post
        const updatedPost = await repository.getById(id);
        if (updatedPost) {
          setState((prev) => ({
            ...prev,
            posts: prev.posts.map((p) =>
              p.id === id
                ? {
                    ...p,
                    publishedAt: updatedPost.publishedAt,
                  }
                : p
            ),
            loadingState: "success",
          }));
        }

        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al publicar artículo",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Archiva un artículo
   */
  const archivePost = useCallback(
    async (id: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        await repository.archive(id);

        setState((prev) => ({
          ...prev,
          posts: prev.posts.filter((p) => p.id !== id),
          loadingState: "success",
        }));

        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al archivar artículo",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Elimina un artículo (soft delete)
   */
  const deletePost = useCallback(
    async (id: string): Promise<boolean> => {
      return archivePost(id);
    },
    [archivePost]
  );

  /**
   * Limpia el artículo seleccionado
   */
  const clearSelectedPost = useCallback(() => {
    setState((prev) => ({ ...prev, selectedPost: null }));
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    posts: state.posts,
    selectedPost: state.selectedPost,
    isLoading: state.loadingState === "loading",
    error: state.error,
    currentPage: state.currentPage,
    hasMore: state.hasMore,

    // Acciones
    loadPosts,
    getPost,
    createPost,
    updatePost,
    publishPost,
    archivePost,
    deletePost,
    uploadImage,
    clearSelectedPost,
    clearError,
  };
}
