// Firebase Infrastructure - Public API
export {
  app,
  getFirebaseAuth,
  getFirebaseDb,
  getFirebaseStorage,
  COLLECTIONS,
} from "./config";

export {
  FirebaseProductRepository,
  getProductRepository,
} from "./product.repository";

export {
  FirebaseOrderRepository,
  getOrderRepository,
} from "./order.repository";

export { FirebaseAuthService, getAuthService } from "./auth.service";

export {
  FirebaseStorageService,
  getStorageService,
  type UploadOptions,
  type UploadResult,
} from "./storage.service";
