import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Configuración de Firebase
 * Las credenciales se obtienen de variables de entorno
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Inicializa Firebase solo si no existe una instancia previa
 */
function initializeFirebase(): FirebaseApp {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }
  return initializeApp(firebaseConfig);
}

// Instancia de la aplicación Firebase
const app = initializeFirebase();

// Servicios de Firebase
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

/**
 * Obtiene la instancia de Auth
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}

/**
 * Obtiene la instancia de Firestore
 */
export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(app);
  }
  return db;
}

/**
 * Obtiene la instancia de Storage
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(app);
  }
  return storage;
}

// Nombres de las colecciones en Firestore
export const COLLECTIONS = {
  PRODUCTS: "products",
  USERS: "users",
  ORDERS: "orders",
  BLOG_POSTS: "blog_posts",
  COUPONS: "coupons",
  REVIEWS: "reviews",
} as const;

export { app };
