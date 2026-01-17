"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Card, Modal, Spinner } from "@/shared/ui";
import { BlogForm } from "@/widgets/admin/blog-form";
import { useAdminBlog } from "@/features/admin/blog";
import type { BlogCategory, BlogPostStatus, BlogFilters } from "@/entities/blog";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  RefreshCw,
  Send,
  FileText,
  Archive,
  ExternalLink,
} from "lucide-react";

const statusConfig: Record<BlogPostStatus, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-yellow-100 text-yellow-800" },
  published: { label: "Publicado", color: "bg-green-100 text-green-800" },
  archived: { label: "Archivado", color: "bg-gray-100 text-gray-800" },
};

const categoryConfig: Record<BlogCategory, { label: string; color: string }> = {
  nutricion: { label: "Nutrición", color: "bg-green-100 text-green-800" },
  fitness: { label: "Fitness", color: "bg-blue-100 text-blue-800" },
  bienestar: { label: "Bienestar", color: "bg-purple-100 text-purple-800" },
  recetas: { label: "Recetas", color: "bg-orange-100 text-orange-800" },
  consejos: { label: "Consejos", color: "bg-pink-100 text-pink-800" },
};

const categories: { value: BlogCategory | "all"; label: string }[] = [
  { value: "all", label: "Todas las categorías" },
  { value: "nutricion", label: "Nutrición" },
  { value: "fitness", label: "Fitness" },
  { value: "bienestar", label: "Bienestar" },
  { value: "recetas", label: "Recetas" },
  { value: "consejos", label: "Consejos" },
];

const statuses: { value: BlogPostStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos los estados" },
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
];

export default function BlogAdminPage() {
  const {
    posts,
    selectedPost,
    isLoading,
    error,
    loadPosts,
    getPost,
    createPost,
    updatePost,
    publishPost,
    archivePost,
    clearSelectedPost,
    clearError,
  } = useAdminBlog();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<BlogCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | "all">("all");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load posts on mount and when filters change
  useEffect(() => {
    const filters: BlogFilters = {};
    if (categoryFilter !== "all") {
      filters.category = categoryFilter;
    }
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    if (searchQuery) {
      filters.query = searchQuery;
    }
    loadPosts(filters);
  }, [categoryFilter, statusFilter, loadPosts]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: BlogFilters = { query: searchQuery };
      if (categoryFilter !== "all") {
        filters.category = categoryFilter;
      }
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      loadPosts(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handlers
  const handleCreatePost = () => {
    clearSelectedPost();
    setIsFormOpen(true);
  };

  const handleEditPost = async (id: string) => {
    await getPost(id);
    setIsFormOpen(true);
  };

  const handleViewPost = async (id: string) => {
    await getPost(id);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await archivePost(postToDelete);
      setIsDeleteOpen(false);
      setPostToDelete(null);
    }
  };

  const handleFormSubmit = async (
    data: Parameters<typeof createPost>[0],
    imageFile?: File
  ) => {
    setFormSubmitting(true);
    try {
      if (selectedPost) {
        await updatePost(selectedPost.id, data, imageFile);
      } else {
        await createPost(data, imageFile);
      }
      setIsFormOpen(false);
      clearSelectedPost();
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    clearSelectedPost();
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    clearSelectedPost();
  };

  const handlePublish = async (id: string) => {
    await publishPost(id);
  };

  const handleRefresh = () => {
    const filters: BlogFilters = {};
    if (categoryFilter !== "all") {
      filters.category = categoryFilter;
    }
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    if (searchQuery) {
      filters.query = searchQuery;
    }
    loadPosts(filters);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Sin publicar";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500">Gestiona los artículos del blog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button variant="primary" onClick={handleCreatePost}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Artículo
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "border-primary text-primary" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {(categoryFilter !== "all" || statusFilter !== "all") && (
                <span className="ml-2 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as BlogCategory | "all")
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as BlogPostStatus | "all")
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="text-sm"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Posts Grid */}
      <div>
        {isLoading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="bg-white">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay artículos</p>
              <Button variant="primary" onClick={handleCreatePost}>
                <Plus className="w-5 h-5 mr-2" />
                Crear Primer Artículo
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-white overflow-hidden group">
                {/* Image */}
                <div className="aspect-video relative bg-gray-100 overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${categoryConfig[post.category].color}`}
                    >
                      {categoryConfig[post.category].label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[post.publishedAt ? "published" : "draft"].color}`}
                    >
                      {post.publishedAt ? "Publicado" : "Borrador"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.readTime} min lectura
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{post.author.name}</span>
                    <span>{post.publishedAt ? formatDate(post.publishedAt instanceof Date ? post.publishedAt : new Date((post.publishedAt as { seconds: number }).seconds * 1000)) : 'Borrador'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{post.views}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!post.publishedAt && (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Publicar"
                        >
                          <Send className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewPost(post.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(post.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Archivar"
                      >
                        <Archive className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Blog Form Modal */}
      <BlogForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        post={selectedPost}
        isLoading={formSubmitting}
      />

      {/* View Post Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={handleCloseView}
        title="Vista Previa del Artículo"
        size="full"
      >
        {selectedPost && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Featured Image */}
            {selectedPost.featuredImage && (
              <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={selectedPost.featuredImage}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span
                className={`px-2 py-1 rounded-full ${categoryConfig[selectedPost.category].color}`}
              >
                {categoryConfig[selectedPost.category].label}
              </span>
              <span
                className={`px-2 py-1 rounded-full ${statusConfig[selectedPost.status].color}`}
              >
                {statusConfig[selectedPost.status].label}
              </span>
              <span className="text-gray-500">
                {selectedPost.readTime} min lectura
              </span>
              <span className="text-gray-500">{selectedPost.views} vistas</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedPost.title}
            </h2>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {selectedPost.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{selectedPost.author.name}</p>
                {selectedPost.author.bio && (
                  <p className="text-sm text-gray-500">{selectedPost.author.bio}</p>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 italic">{selectedPost.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-sage max-w-none">
              <div className="whitespace-pre-wrap">{selectedPost.content}</div>
            </div>

            {/* Tags */}
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sage/10 text-sage-dark rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCloseView}>
                Cerrar
              </Button>
              <div className="flex gap-3">
                {selectedPost.status === "published" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`/blog/${selectedPost.slug}`, "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en Sitio
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => {
                    handleCloseView();
                    handleEditPost(selectedPost.id);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Archivar Artículo"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            <p>
              ¿Estás seguro de que deseas archivar este artículo? Podrás
              recuperarlo más tarde desde los artículos archivados.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <Archive className="w-4 h-4 mr-2" />
              Archivar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
