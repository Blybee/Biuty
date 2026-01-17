import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  Timestamp,
  increment,
  type QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb, COLLECTIONS } from "./config";
import type { PaginatedResponse } from "@/shared/types";
import type {
  IProductRepository,
  Product,
  ProductListItem,
  ProductFilters,
  CreateProductDTO,
  UpdateProductDTO,
  ProductCategory,
} from "@/entities/product";

/**
 * Implementación del repositorio de productos con Firebase
 */
export class FirebaseProductRepository implements IProductRepository {
  private get db() {
    return getFirebaseDb();
  }

  private get collectionRef() {
    return collection(this.db, COLLECTIONS.PRODUCTS);
  }

  /**
   * Convierte Timestamp de Firestore a Date
   */
  private convertTimestamp(timestamp: unknown): Date | undefined {
    if (!timestamp) return undefined;
    // Check if it's a Firestore Timestamp
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      return (timestamp as { toDate: () => Date }).toDate();
    }
    // If it's already a Date
    if (timestamp instanceof Date) return timestamp;
    // If it's a number (milliseconds)
    if (typeof timestamp === 'number') return new Date(timestamp);
    return undefined;
  }

  /**
   * Convierte documento de Firestore a Product
   */
  private docToProduct(doc: { id: string; data: () => Record<string, unknown> }): Product {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as Product;
  }

  /**
   * Convierte Product a ProductListItem
   */
  private toListItem(product: Product): ProductListItem {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      thumbnail: product.thumbnail,
      stock: product.stock,
      status: product.status,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    };
  }

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(this.db, COLLECTIONS.PRODUCTS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return this.docToProduct({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const q = query(this.collectionRef, where("slug", "==", slug), firestoreLimit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const docSnap = snapshot.docs[0];
    return this.docToProduct({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getAll(
    filters?: ProductFilters,
    page = 1,
    pageSize = 12
  ): Promise<PaginatedResponse<ProductListItem>> {
    const constraints: QueryConstraint[] = [];

    // Aplicar filtros
    if (filters?.category) {
      constraints.push(where("category", "==", filters.category));
    }
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.isFeatured !== undefined) {
      constraints.push(where("isFeatured", "==", filters.isFeatured));
    }
    if (filters?.inStock) {
      constraints.push(where("stock", ">", 0));
    }
    if (filters?.minPrice !== undefined) {
      constraints.push(where("price", ">=", filters.minPrice));
    }
    if (filters?.maxPrice !== undefined) {
      constraints.push(where("price", "<=", filters.maxPrice));
    }

    // Ordenamiento
    const sortField = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder || "desc";
    constraints.push(orderBy(sortField, sortOrder));

    // Paginación
    constraints.push(firestoreLimit(pageSize + 1)); // +1 para saber si hay más

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    const products = snapshot.docs.slice(0, pageSize).map((docSnap) =>
      this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
    );

    return {
      data: products,
      total: products.length,
      page,
      pageSize,
      hasMore: snapshot.docs.length > pageSize,
    };
  }

  async getFeatured(limit = 8): Promise<ProductListItem[]> {
    const q = query(
      this.collectionRef,
      where("isFeatured", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async getNewArrivals(limit = 8): Promise<ProductListItem[]> {
    const q = query(
      this.collectionRef,
      where("isNewArrival", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async getBestSellers(limit = 8): Promise<ProductListItem[]> {
    const q = query(
      this.collectionRef,
      where("isBestSeller", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async getByCategory(category: ProductCategory, limit = 12): Promise<ProductListItem[]> {
    const q = query(
      this.collectionRef,
      where("category", "==", category),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async search(queryText: string, limit = 12): Promise<ProductListItem[]> {
    // Firebase no soporta búsqueda de texto completo nativa
    // Esta es una implementación básica - para producción usar Algolia o similar
    const q = query(
      this.collectionRef,
      where("status", "==", "active"),
      orderBy("name"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);
    
    const searchLower = queryText.toLowerCase();
    return snapshot.docs
      .filter((docSnap) => {
        const data = docSnap.data();
        return (
          data.name?.toLowerCase().includes(searchLower) ||
          data.description?.toLowerCase().includes(searchLower) ||
          data.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      })
      .map((docSnap) =>
        this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
      );
  }

  async getRelated(productId: string, limit = 4): Promise<ProductListItem[]> {
    const product = await this.getById(productId);
    if (!product) return [];

    const q = query(
      this.collectionRef,
      where("category", "==", product.category),
      where("status", "==", "active"),
      firestoreLimit(limit + 1)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .filter((docSnap) => docSnap.id !== productId)
      .slice(0, limit)
      .map((docSnap) =>
        this.toListItem(this.docToProduct({ id: docSnap.id, data: () => docSnap.data() }))
      );
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const now = Timestamp.now();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(this.collectionRef, docData);
    
    return {
      id: docRef.id,
      ...docData,
    } as Product;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const docRef = doc(this.db, COLLECTIONS.PRODUCTS, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    
    await updateDoc(docRef, updateData);
    
    const updated = await this.getById(id);
    if (!updated) {
      throw new Error("Product not found after update");
    }
    
    return updated;
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.PRODUCTS, id);
    await updateDoc(docRef, {
      stock: increment(quantity),
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.PRODUCTS, id);
    // Soft delete - cambiar estado a inactivo
    await updateDoc(docRef, {
      status: "inactive",
      updatedAt: Timestamp.now(),
    });
  }
}

// Singleton
let productRepository: FirebaseProductRepository | null = null;

export function getProductRepository(): IProductRepository {
  if (!productRepository) {
    productRepository = new FirebaseProductRepository();
  }
  return productRepository;
}
