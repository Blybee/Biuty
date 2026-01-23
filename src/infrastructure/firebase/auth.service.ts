import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, COLLECTIONS } from "./config";
import type {
  User,
  CreateUserDTO,
  LoginCredentials,
  UserSession,
} from "@/entities/user";

/**
 * Servicio de autenticación con Firebase
 */
export class FirebaseAuthService {
  private get auth() {
    return getFirebaseAuth();
  }

  private get db() {
    return getFirebaseDb();
  }

  /**
   * Crea el documento de usuario en Firestore
   */
  private async createUserDocument(
    firebaseUser: FirebaseUser,
    additionalData?: Partial<CreateUserDTO>
  ): Promise<User> {
    const userRef = doc(this.db, COLLECTIONS.USERS, firebaseUser.uid);
    const now = Timestamp.now();

    const userData: Omit<User, "id"> = {
      email: firebaseUser.email!,
      displayName: additionalData?.displayName || firebaseUser.displayName || "",
      firstName: additionalData?.firstName,
      lastName: additionalData?.lastName,
      phone: additionalData?.phone,
      photoURL: firebaseUser.photoURL || undefined,
      role: "customer",
      status: "active",
      addresses: [],
      preferences: {
        newsletter: true,
        notifications: true,
        language: "es",
      },
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, userData);

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  }

  /**
   * Obtiene los datos del usuario de Firestore
   */
  private async getUserDocument(uid: string): Promise<User | null> {
    const userRef = doc(this.db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...userSnap.data(),
    } as User;
  }

  /**
   * Registra un nuevo usuario
   */
  async signUp(data: CreateUserDTO): Promise<User> {
    const { email, password, ...additionalData } = data;

    const credential: UserCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    // Actualizar perfil de Firebase Auth
    if (additionalData.displayName) {
      await updateProfile(credential.user, {
        displayName: additionalData.displayName,
      });
    }

    // Crear documento en Firestore
    const user = await this.createUserDocument(credential.user, additionalData);

    return user;
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async signIn(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;

    const credential = await signInWithEmailAndPassword(this.auth, email, password);

    // Obtener datos del usuario
    let user = await this.getUserDocument(credential.user.uid);

    // Si no existe el documento, crearlo
    if (!user) {
      user = await this.createUserDocument(credential.user);
    }

    return user;
  }

  /**
   * Cierra la sesión actual
   */
  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  /**
   * Envía email de recuperación de contraseña
   */
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Obtiene el usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    return this.getUserDocument(firebaseUser.uid);
  }

  /**
   * Suscribe a cambios en el estado de autenticación
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserDocument(firebaseUser.uid);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Obtiene el rol del usuario desde sus custom claims
   */
  async getUserRole(userId: string): Promise<User["role"] | null> {
    try {
      const firebaseUser = this.auth.currentUser;
      if (!firebaseUser || firebaseUser.uid !== userId) {
        return null;
      }

      const idTokenResult = await firebaseUser.getIdTokenResult();
      const customClaims = idTokenResult.claims;

      // Verificar custom claims primero
      if (customClaims.role) {
        return customClaims.role as User["role"];
      }

      // Fallback a Firestore si no hay custom claims
      const user = await this.getUserDocument(userId);
      return user?.role || null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  /**
   * Fuerza la actualización del token de ID para obtener claims actualizados
   */
  async refreshUserToken(): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      throw new Error("No authenticated user");
    }
    await firebaseUser.getIdToken(true); // Force refresh
  }

  /**
   * Obtiene el usuario actual con sus custom claims
   */
  async getCurrentUserWithClaims(): Promise<{
    user: User | null;
    claims: Record<string, any>;
  }> {
    const firebaseUser = this.auth.currentUser;

    if (!firebaseUser) {
      return { user: null, claims: {} };
    }

    const idTokenResult = await firebaseUser.getIdTokenResult();
    const user = await this.getUserDocument(firebaseUser.uid);

    return {
      user,
      claims: idTokenResult.claims,
    };
  }

  /**
   * Verifica si el usuario tiene un rol específico usando custom claims
   */
  async hasRole(userId: string, role: User["role"]): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === role;
  }

  /**
   * Verifica si el usuario es administrador usando custom claims
   */
  async isAdmin(userId: string): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === "admin" || userRole === "super_admin";
  }
}

// Singleton
let authService: FirebaseAuthService | null = null;

export function getAuthService(): FirebaseAuthService {
  if (!authService) {
    authService = new FirebaseAuthService();
  }
  return authService;
}
