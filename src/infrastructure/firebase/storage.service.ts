import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  type UploadMetadata,
} from "firebase/storage";
import { getFirebaseStorage } from "./config";

/**
 * Opciones para subir archivos
 */
export interface UploadOptions {
  folder?: string;
  fileName?: string;
  metadata?: UploadMetadata;
}

/**
 * Resultado de subida de archivo
 */
export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

/**
 * Servicio de almacenamiento con Firebase Storage
 */
export class FirebaseStorageService {
  private get storage() {
    return getFirebaseStorage();
  }

  /**
   * Genera un nombre de archivo único
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop();
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Sube un archivo
   */
  async upload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const { folder = "uploads", fileName, metadata } = options;
    const finalFileName = fileName || this.generateFileName(file.name);
    const path = `${folder}/${finalFileName}`;
    const storageRef = ref(this.storage, path);

    const uploadMetadata: UploadMetadata = {
      contentType: file.type,
      ...metadata,
    };

    await uploadBytes(storageRef, file, uploadMetadata);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path,
      fileName: finalFileName,
    };
  }

  /**
   * Sube múltiples archivos
   */
  async uploadMultiple(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.upload(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Sube una imagen de producto
   */
  async uploadProductImage(file: File, productId?: string): Promise<UploadResult> {
    const folder = productId ? `products/${productId}` : "products";
    return this.upload(file, { folder });
  }

  /**
   * Sube una imagen de blog
   */
  async uploadBlogImage(file: File, postId?: string): Promise<UploadResult> {
    const folder = postId ? `blog/${postId}` : "blog";
    return this.upload(file, { folder });
  }

  /**
   * Sube una imagen de avatar
   */
  async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    return this.upload(file, {
      folder: `avatars/${userId}`,
      fileName: "avatar",
    });
  }

  /**
   * Obtiene la URL de un archivo
   */
  async getUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }

  /**
   * Elimina un archivo
   */
  async delete(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Elimina múltiples archivos
   */
  async deleteMultiple(paths: string[]): Promise<void> {
    const deletePromises = paths.map((path) => this.delete(path));
    await Promise.all(deletePromises);
  }

  /**
   * Lista archivos en una carpeta
   */
  async listFiles(folder: string): Promise<string[]> {
    const folderRef = ref(this.storage, folder);
    const result = await listAll(folderRef);
    
    const urlPromises = result.items.map((item) => getDownloadURL(item));
    return Promise.all(urlPromises);
  }
}

// Singleton
let storageService: FirebaseStorageService | null = null;

export function getStorageService(): FirebaseStorageService {
  if (!storageService) {
    storageService = new FirebaseStorageService();
  }
  return storageService;
}
