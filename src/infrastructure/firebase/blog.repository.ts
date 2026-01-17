import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  increment,
  type QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb, COLLECTIONS } from "./config";
import type { PaginatedResponse } from "@/shared/types";
import type {
  IBlogRepository,
  BlogPost,
  BlogPostListItem,
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
  BlogCategory,
  BlogFilters,
} from "@/entities/blog";

/**
 * Implementación del repositorio de blog con Firebase
 */
export class FirebaseBlogRepository implements IBlogRepository {
  private get db() {
    return getFirebaseDb();
  }

  private get collectionRef() {
    return collection(this.db, COLLECTIONS.BLOG_POSTS);
  }

  /**
   * Convierte documento de Firestore a BlogPost
   */
  private docToPost(doc: { id: string; data: () => Record<string, unknown> }): BlogPost {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as BlogPost;
  }

  /**
   * Convierte BlogPost a BlogPostListItem
   */
  private toListItem(post: BlogPost): BlogPostListItem {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      views: post.views,
    };
  }

  async getById(id: string): Promise<BlogPost | null> {
    const docRef = doc(this.db, COLLECTIONS.BLOG_POSTS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.docToPost({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(
      this.collectionRef,
      where("slug", "==", slug),
      firestoreLimit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    return this.docToPost({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getAll(
    filters?: BlogFilters,
    page = 1,
    pageSize = 12
  ): Promise<PaginatedResponse<BlogPostListItem>> {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters?.category) {
      constraints.push(where("category", "==", filters.category));
    }
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.authorId) {
      constraints.push(where("author.id", "==", filters.authorId));
    }

    // Order by creation date
    constraints.push(orderBy("createdAt", "desc"));

    // Pagination
    constraints.push(firestoreLimit(pageSize + 1));

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    let posts = snapshot.docs.slice(0, pageSize).map((docSnap) =>
      this.toListItem(this.docToPost({ id: docSnap.id, data: () => docSnap.data() }))
    );

    // Filter by search query locally
    if (filters?.query) {
      const searchLower = filters.query.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
      );
    }

    return {
      data: posts,
      total: posts.length,
      page,
      pageSize,
      hasMore: snapshot.docs.length > pageSize,
    };
  }

  async getPublished(
    page = 1,
    pageSize = 12
  ): Promise<PaginatedResponse<BlogPostListItem>> {
    return this.getAll({ status: "published" }, page, pageSize);
  }

  async getByCategory(
    category: BlogCategory,
    limit = 12
  ): Promise<BlogPostListItem[]> {
    const q = query(
      this.collectionRef,
      where("category", "==", category),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToPost({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async getRecent(limit = 6): Promise<BlogPostListItem[]> {
    const q = query(
      this.collectionRef,
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToPost({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async getPopular(limit = 6): Promise<BlogPostListItem[]> {
    const q = query(
      this.collectionRef,
      where("status", "==", "published"),
      orderBy("views", "desc"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      this.toListItem(this.docToPost({ id: docSnap.id, data: () => docSnap.data() }))
    );
  }

  async getRelated(postId: string, limit = 4): Promise<BlogPostListItem[]> {
    const post = await this.getById(postId);
    if (!post) return [];

    const q = query(
      this.collectionRef,
      where("category", "==", post.category),
      where("status", "==", "published"),
      firestoreLimit(limit + 1)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .filter((docSnap) => docSnap.id !== postId)
      .slice(0, limit)
      .map((docSnap) =>
        this.toListItem(this.docToPost({ id: docSnap.id, data: () => docSnap.data() }))
      );
  }

  async search(queryText: string, limit = 12): Promise<BlogPostListItem[]> {
    const q = query(
      this.collectionRef,
      where("status", "==", "published"),
      orderBy("title"),
      firestoreLimit(50) // Get more to filter locally
    );
    const snapshot = await getDocs(q);

    const searchLower = queryText.toLowerCase();
    return snapshot.docs
      .filter((docSnap) => {
        const data = docSnap.data();
        return (
          data.title?.toLowerCase().includes(searchLower) ||
          data.excerpt?.toLowerCase().includes(searchLower) ||
          data.content?.toLowerCase().includes(searchLower) ||
          data.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      })
      .slice(0, limit)
      .map((docSnap) =>
        this.toListItem(this.docToPost({ id: docSnap.id, data: () => docSnap.data() }))
      );
  }

  async create(data: CreateBlogPostDTO): Promise<BlogPost> {
    const now = Timestamp.now();

    // Calculate read time (avg 200 words per minute)
    const wordCount = data.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const postData = {
      ...data,
      views: 0,
      readTime,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === "published" ? now : null,
    };

    const docRef = await addDoc(this.collectionRef, postData);

    return {
      id: docRef.id,
      ...postData,
    } as BlogPost;
  }

  async update(id: string, data: UpdateBlogPostDTO): Promise<BlogPost> {
    const docRef = doc(this.db, COLLECTIONS.BLOG_POSTS, id);

    // Recalculate read time if content changed
    let readTime;
    if (data.content) {
      const wordCount = data.content.split(/\s+/).length;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const updateData = {
      ...data,
      ...(readTime && { readTime }),
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error("Blog post not found after update");
    }

    return updated;
  }

  async publish(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.BLOG_POSTS, id);
    await updateDoc(docRef, {
      status: "published",
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  async archive(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.BLOG_POSTS, id);
    await updateDoc(docRef, {
      status: "archived",
      updatedAt: Timestamp.now(),
    });
  }

  async incrementViews(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.BLOG_POSTS, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  }

  async delete(id: string): Promise<void> {
    // Soft delete - archive the post
    await this.archive(id);
  }
}

// Singleton
let blogRepository: FirebaseBlogRepository | null = null;

export function getBlogRepository(): IBlogRepository {
  if (!blogRepository) {
    blogRepository = new FirebaseBlogRepository();
  }
  return blogRepository;
}
