"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Modal } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type {
  BlogPost,
  CreateBlogPostDTO,
  BlogCategory,
  BlogPostStatus,
} from "@/entities/blog";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Loader2,
  Eye,
  Send,
  FileText,
} from "lucide-react";

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBlogPostDTO, imageFile?: File) => Promise<void>;
  post?: BlogPost | null;
  isLoading?: boolean;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  status: BlogPostStatus;
  metaTitle: string;
  metaDescription: string;
  authorName: string;
  authorBio: string;
}

const initialFormData: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "nutricion",
  tags: [],
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  authorName: "Biuty Team",
  authorBio: "Expertos en bienestar y nutrición",
};

const categories: { value: BlogCategory; label: string }[] = [
  { value: "nutricion", label: "Nutrición" },
  { value: "fitness", label: "Fitness" },
  { value: "bienestar", label: "Bienestar" },
  { value: "recetas", label: "Recetas" },
  { value: "consejos", label: "Consejos" },
];

const statuses: { value: BlogPostStatus; label: string; icon: React.ReactNode }[] = [
  { value: "draft", label: "Borrador", icon: <FileText className="w-4 h-4" /> },
  { value: "published", label: "Publicado", icon: <Send className="w-4 h-4" /> },
  { value: "archived", label: "Archivado", icon: <Eye className="w-4 h-4" /> },
];

export function BlogForm({
  isOpen,
  onClose,
  onSubmit,
  post,
  isLoading = false,
}: BlogFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [tagInput, setTagInput] = useState("");

  // Load post data if editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        status: post.status,
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        authorName: post.author.name,
        authorBio: post.author.bio || "",
      });
      setExistingImage(post.featuredImage || null);
    } else {
      setFormData(initialFormData);
      setExistingImage(null);
    }
    setImageFile(null);
    setImagePreview(null);
  }, [post, isOpen]);

  // Generate slug automatically
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | string[] | BlogCategory | BlogPostStatus) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };

        // Auto-generate slug if title changes and no existing post
        if (field === "title" && typeof value === "string" && !post) {
          newData.slug = generateSlug(value);
        }

        return newData;
      });

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors, generateSlug, post]
  );

  // Handle tags
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      handleInputChange("tags", [...formData.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((t) => t !== tagToRemove)
    );
  };

  // Handle image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es requerido";
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "El extracto es requerido";
    }
    if (!formData.content.trim()) {
      newErrors.content = "El contenido es requerido";
    }
    if (!formData.authorName.trim()) {
      newErrors.authorName = "El nombre del autor es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Calcular tiempo de lectura (aprox 200 palabras por minuto)
    const wordCount = formData.content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const postData: CreateBlogPostDTO = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: formData.tags,
      status: formData.status,
      featuredImage: existingImage || "",
      author: {
        id: "admin",
        name: formData.authorName.trim(),
        bio: formData.authorBio.trim() || undefined,
      },
      metaTitle: formData.metaTitle.trim() || undefined,
      metaDescription: formData.metaDescription.trim() || undefined,
      readTime,
    };

    await onSubmit(postData, imageFile || undefined);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={post ? "Editar Artículo" : "Nuevo Artículo"}
      size="full"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Info */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Título del artículo"
                error={errors.title}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="url-del-articulo"
                error={errors.slug}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange("category", e.target.value as BlogCategory)
                }
                className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extracto *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Breve descripción del artículo (aparece en listados)"
                rows={2}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                  errors.excerpt && "border-red-500"
                )}
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">
            Imagen Destacada
          </h3>
          <div className="space-y-4">
            {(existingImage || imagePreview) && (
              <div className="relative w-full max-w-md group">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={imagePreview || existingImage || ""}
                    alt="Imagen destacada"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {!existingImage && !imagePreview && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-sage/30 rounded-xl cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-sage mb-2" />
                <span className="text-sm text-sage">
                  Arrastra una imagen o haz clic para seleccionar
                </span>
                <span className="text-xs text-sage/70 mt-1">
                  PNG, JPG hasta 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        {/* Content */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Contenido *</h3>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Escribe el contenido del artículo aquí...

Puedes usar Markdown para formatear:
- **negrita** para texto en negrita
- *cursiva* para texto en cursiva
- # Título para encabezados
- - elemento para listas

El contenido será renderizado con formato."
            rows={15}
            className={cn(
              "w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm",
              errors.content && "border-red-500"
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
          <p className="mt-2 text-xs text-sage">
            Palabras: {formData.content.split(/\s+/).filter(Boolean).length} | 
            Tiempo de lectura estimado: {Math.max(1, Math.ceil(formData.content.split(/\s+/).filter(Boolean).length / 200))} min
          </p>
        </section>

        {/* Author */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Autor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Autor *
              </label>
              <Input
                value={formData.authorName}
                onChange={(e) => handleInputChange("authorName", e.target.value)}
                placeholder="Nombre del autor"
                error={errors.authorName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio del Autor
              </label>
              <Input
                value={formData.authorBio}
                onChange={(e) => handleInputChange("authorBio", e.target.value)}
                placeholder="Breve descripción del autor"
              />
            </div>
          </div>
        </section>

        {/* Tags */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Etiquetas</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar etiqueta"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-sage-dark rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Status */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Estado</h3>
          <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => handleInputChange("status", status.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors",
                  formData.status === status.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-primary/50"
                )}
              >
                {status.icon}
                {status.label}
              </button>
            ))}
          </div>
        </section>

        {/* SEO */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Título
              </label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                placeholder="Título para buscadores"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Descripción
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                placeholder="Descripción para buscadores (máx. 160 caracteres)"
                rows={2}
                maxLength={160}
                className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-sage/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {post ? "Actualizar" : "Crear"} Artículo
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
