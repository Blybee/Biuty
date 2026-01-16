import type { PaginatedResponse } from "@/shared/types";
import type {
  User,
  UserListItem,
  CreateUserDTO,
  UpdateUserDTO,
  Address,
  UserRole,
  UserStatus,
} from "./model";

/**
 * Filtros para usuarios
 */
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  query?: string;
}

/**
 * Interface del repositorio de usuarios
 */
export interface IUserRepository {
  /**
   * Obtiene un usuario por su ID
   */
  getById(id: string): Promise<User | null>;

  /**
   * Obtiene un usuario por su email
   */
  getByEmail(email: string): Promise<User | null>;

  /**
   * Obtiene lista paginada de usuarios
   */
  getAll(
    filters?: UserFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<UserListItem>>;

  /**
   * Crea un nuevo usuario
   */
  create(data: CreateUserDTO): Promise<User>;

  /**
   * Actualiza un usuario existente
   */
  update(id: string, data: UpdateUserDTO): Promise<User>;

  /**
   * Actualiza el rol del usuario
   */
  updateRole(id: string, role: UserRole): Promise<void>;

  /**
   * Actualiza el estado del usuario
   */
  updateStatus(id: string, status: UserStatus): Promise<void>;

  /**
   * Agrega una dirección al usuario
   */
  addAddress(userId: string, address: Omit<Address, "id">): Promise<Address>;

  /**
   * Actualiza una dirección del usuario
   */
  updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<Address>;

  /**
   * Elimina una dirección del usuario
   */
  deleteAddress(userId: string, addressId: string): Promise<void>;

  /**
   * Establece una dirección como predeterminada
   */
  setDefaultAddress(userId: string, addressId: string): Promise<void>;

  /**
   * Elimina un usuario (soft delete)
   */
  delete(id: string): Promise<void>;
}
