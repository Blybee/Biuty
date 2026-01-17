"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Modal, Card } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type {
  Product,
  CreateProductDTO,
  ProductCategory,
  ProductStatus,
} from "@/entities/product";
import {
  X,
  Upload,
  Plus,
  Trash2,
  ImageIcon,
  Save,
  Loader2,
} from "lucide-react";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductDTO, imageFiles?: File[]) => Promise<void>;
  product?: Product | null;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
  lowStockThreshold: string;
  status: ProductStatus;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  metaTitle: string;
  metaDescription: string;
}

const initialFormData: FormData = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  category: "suplementos",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: "0",
  lowStockThreshold: "10",
  status: "active",
  benefits: [""],
  ingredients: [""],
  howToUse: "",
  tags: [],
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  metaTitle: "",
  metaDescription: "",
};

const categories: { value: ProductCategory; label: string }[] = [
  { value: "suplementos", label: "Suplementos" },
  { value: "naturales", label: "Naturales" },
  { value: "fitness", label: "Fitness" },
  { value: "bienestar", label: "Bienestar" },
];

const statuses: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "out_of_stock", label: "Sin Stock" },
];

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [tagInput, setTagInput] = useState("");

  // Cargar datos del producto si es edición
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        category: product.category,
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice?.toString() || "",
        sku: product.sku,
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        status: product.status,
        benefits: product.benefits.length > 0 ? product.benefits : [""],
        ingredients: product.ingredients?.length ? product.ingredients : [""],
        howToUse: product.howToUse || "",
        tags: product.tags,
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
      });
      setExistingImages(product.images || []);
    } else {
      setFormData(initialFormData);
      setExistingImages([]);
    }
    setImageFiles([]);
    setImagePreviews([]);
  }, [product, isOpen]);

  // Generar slug automáticamente
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | boolean | string[]) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };

        // Auto-generar slug si se cambia el nombre
        if (field === "name" && typeof value === "string" && !product) {
          newData.slug = generateSlug(value);
        }

        return newData;
      });

      // Limpiar error del campo
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors, generateSlug, product]
  );

  // Manejar lista de beneficios/ingredientes
  const handleListChange = (
    field: "benefits" | "ingredients",
    index: number,
    value: string
  ) => {
    const newList = [...formData[field]];
    newList[index] = value;
    handleInputChange(field, newList);
  };

  const addListItem = (field: "benefits" | "ingredients") => {
    handleInputChange(field, [...formData[field], ""]);
  };

  const removeListItem = (field: "benefits" | "ingredients", index: number) => {
    const newList = formData[field].filter((_, i) => i !== index);
    handleInputChange(field, newList.length > 0 ? newList : [""]);
  };

  // Manejar tags
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

  // Manejar imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    setImageFiles((prev) => [...prev, ...validFiles]);

    // Crear previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validación
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es requerido";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "La descripción corta es requerida";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "El SKU es requerido";
    }
    if (
      existingImages.length === 0 &&
      imageFiles.length === 0 &&
      !product?.thumbnail
    ) {
      // Solo advertencia, no error bloqueante
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const productData: CreateProductDTO = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      shortDescription: formData.shortDescription.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : undefined,
      sku: formData.sku.trim(),
      stock: parseInt(formData.stock) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
      status: formData.status,
      images: existingImages,
      thumbnail: existingImages[0] || "",
      benefits: formData.benefits.filter((b) => b.trim()),
      ingredients: formData.ingredients.filter((i) => i.trim()),
      howToUse: formData.howToUse.trim() || undefined,
      tags: formData.tags,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
      metaTitle: formData.metaTitle.trim() || undefined,
      metaDescription: formData.metaDescription.trim() || undefined,
    };

    await onSubmit(productData, imageFiles.length > 0 ? imageFiles : undefined);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Editar Producto" : "Nuevo Producto"}
      size="full"
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
        {/* Información Básica */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Proteína Whey Premium"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="proteina-whey-premium"
                error={errors.slug}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <Input
                value={formData.sku}
                onChange={(e) =>
                  handleInputChange("sku", e.target.value.toUpperCase())
                }
                placeholder="WHEY-001"
                error={errors.sku}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Corta *
              </label>
              <Input
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                placeholder="Breve descripción del producto"
                error={errors.shortDescription}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Completa *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Descripción detallada del producto..."
                rows={4}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                  errors.description && "border-red-500"
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
        </section>

        {/* Precios y Stock */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">
            Precios y Stock
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                error={errors.price}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Anterior
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) =>
                  handleInputChange("compareAtPrice", e.target.value)
                }
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <Input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Bajo (alerta)
              </label>
              <Input
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  handleInputChange("lowStockThreshold", e.target.value)
                }
                placeholder="10"
              />
            </div>
          </div>
        </section>

        {/* Categoría y Estado */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">
            Categoría y Estado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange("category", e.target.value as ProductCategory)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as ProductStatus)
                }
                className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    handleInputChange("isFeatured", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) =>
                    handleInputChange("isNewArrival", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Nuevo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    handleInputChange("isBestSeller", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Más Vendido</span>
              </label>
            </div>
          </div>
        </section>

        {/* Imágenes */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Imágenes</h3>
          <div className="space-y-4">
            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Nuevas imágenes */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={preview}
                        alt={`Nueva imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      Nueva
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-sage/30 rounded-xl cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-8 h-8 text-sage mb-2" />
              <span className="text-sm text-sage">
                Arrastra imágenes aquí o haz clic para seleccionar
              </span>
              <span className="text-xs text-sage/70 mt-1">
                PNG, JPG hasta 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* Beneficios */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Beneficios</h3>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) =>
                    handleListChange("benefits", index, e.target.value)
                  }
                  placeholder={`Beneficio ${index + 1}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("benefits", index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem("benefits")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Beneficio
            </Button>
          </div>
        </section>

        {/* Ingredientes */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">
            Ingredientes
          </h3>
          <div className="space-y-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) =>
                    handleListChange("ingredients", index, e.target.value)
                  }
                  placeholder={`Ingrediente ${index + 1}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("ingredients", index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem("ingredients")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ingrediente
            </Button>
          </div>
        </section>

        {/* Modo de Uso */}
        <section>
          <h3 className="text-lg font-semibold text-forest mb-4">Modo de Uso</h3>
          <textarea
            value={formData.howToUse}
            onChange={(e) => handleInputChange("howToUse", e.target.value)}
            placeholder="Instrucciones de uso del producto..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
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
                {product ? "Actualizar" : "Crear"} Producto
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
