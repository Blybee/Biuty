import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb, COLLECTIONS } from "./config";
import type { PaginatedResponse } from "@/shared/types";
import type {
  IUserRepository,
  User,
  UserListItem,
  CreateUserDTO,
  UpdateUserDTO,
  Address,
  UserRole,
  UserStatus,
  UserFilters,
} from "@/entities/user";

/**
 * Implementación del repositorio de usuarios con Firebase
 */
export class FirebaseUserRepository implements IUserRepository {
  private get db() {
    return getFirebaseDb();
  }

  private get collectionRef() {
    return collection(this.db, COLLECTIONS.USERS);
  }

  /**
   * Convierte Timestamp de Firestore a Date
   */
  private convertTimestamp(timestamp: unknown): Date | undefined {
    if (!timestamp) return undefined;
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      return (timestamp as { toDate: () => Date }).toDate();
    }
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'number') return new Date(timestamp);
    return undefined;
  }

  /**
   * Convierte documento de Firestore a User
   */
  private docToUser(doc: { id: string; data: () => Record<string, unknown> }): User {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as User;
  }

  /**
   * Convierte User a UserListItem
   */
  private toListItem(user: User): UserListItem {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async getById(id: string): Promise<User | null> {
    const docRef = doc(this.db, COLLECTIONS.USERS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.docToUser({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getByEmail(email: string): Promise<User | null> {
    const q = query(
      this.collectionRef,
      where("email", "==", email),
      firestoreLimit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    return this.docToUser({ id: docSnap.id, data: () => docSnap.data() });
  }

  async getAll(
    filters?: UserFilters,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<UserListItem>> {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters?.role) {
      constraints.push(where("role", "==", filters.role));
    }
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }

    // Order by creation date
    constraints.push(orderBy("createdAt", "desc"));

    // Pagination
    constraints.push(firestoreLimit(pageSize + 1));

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    let users = snapshot.docs.slice(0, pageSize).map((docSnap) =>
      this.toListItem(this.docToUser({ id: docSnap.id, data: () => docSnap.data() }))
    );

    // Filter by search query locally (Firebase doesn't support full-text search)
    if (filters?.query) {
      const searchLower = filters.query.toLowerCase();
      users = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          user.displayName.toLowerCase().includes(searchLower)
      );
    }

    return {
      data: users,
      total: users.length,
      page,
      pageSize,
      hasMore: snapshot.docs.length > pageSize,
    };
  }

  async create(data: CreateUserDTO): Promise<User> {
    const now = Timestamp.now();
    const userId = doc(this.collectionRef).id;

    const userData = {
      email: data.email,
      displayName: data.displayName,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || "",
      photoURL: "",
      role: "customer" as UserRole,
      status: "active" as UserStatus,
      addresses: [],
      preferences: {
        newsletter: false,
        notifications: true,
        language: "es",
      },
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(this.db, COLLECTIONS.USERS, userId), userData);

    return {
      id: userId,
      ...userData,
    } as User;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const docRef = doc(this.db, COLLECTIONS.USERS, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error("User not found after update");
    }

    return updated;
  }

  async updateRole(id: string, role: UserRole): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.USERS, id);
    await updateDoc(docRef, {
      role,
      updatedAt: Timestamp.now(),
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.USERS, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  }

  async addAddress(userId: string, address: Omit<Address, "id">): Promise<Address> {
    const user = await this.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      ...address,
    };

    const addresses = [...user.addresses, newAddress];

    await this.update(userId, { addresses });

    return newAddress;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<Address> {
    const user = await this.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const addresses = user.addresses.map((addr) =>
      addr.id === addressId ? { ...addr, ...data } : addr
    );

    await this.update(userId, { addresses });

    const updatedAddress = addresses.find((a) => a.id === addressId);
    if (!updatedAddress) {
      throw new Error("Address not found");
    }

    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const user = await this.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const addresses = user.addresses.filter((addr) => addr.id !== addressId);
    await this.update(userId, { addresses });
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const user = await this.getById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const addresses = user.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    await this.update(userId, { addresses });
  }

  async delete(id: string): Promise<void> {
    // Soft delete - change status to inactive
    await this.updateStatus(id, "inactive");
  }

  /**
   * Get total number of customers
   */
  async getCustomerCount(): Promise<number> {
    const q = query(
      this.collectionRef,
      where("role", "==", "customer"),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
}

// Singleton
let userRepository: FirebaseUserRepository | null = null;

export function getUserRepository(): IUserRepository {
  if (!userRepository) {
    userRepository = new FirebaseUserRepository();
  }
  return userRepository;
}
