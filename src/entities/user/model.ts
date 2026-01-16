import type { EntityId, Timestamp } from "@/shared/types";

/**
 * Rol del usuario
 */
export type UserRole = "customer" | "admin" | "super_admin";

/**
 * Estado del usuario
 */
export type UserStatus = "active" | "inactive" | "suspended";

/**
 * Dirección del usuario
 */
export interface Address {
  id: EntityId;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  number: string;
  apartment?: string;
  district: string;
  city: string;
  province: string;
  postalCode?: string;
  reference?: string;
  isDefault: boolean;
}

/**
 * Entidad Usuario
 */
export interface User {
  id: EntityId;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoURL?: string;
  
  // Rol y estado
  role: UserRole;
  status: UserStatus;
  
  // Direcciones
  addresses: Address[];
  
  // Preferencias
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  
  // Metadata
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Usuario para listado (admin)
 */
export interface UserListItem {
  id: EntityId;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
}

/**
 * Datos para crear un usuario
 */
export type CreateUserDTO = {
  email: string;
  displayName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

/**
 * Datos para actualizar un usuario
 */
export type UpdateUserDTO = Partial<
  Omit<User, "id" | "email" | "createdAt" | "updatedAt">
>;

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sesión del usuario
 */
export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}
