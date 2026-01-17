"use client";

import { useState, useCallback } from "react";
import { getUserRepository } from "@/infrastructure/firebase";
import type {
  User,
  UserListItem,
  UserFilters,
  UserRole,
  UserStatus,
} from "@/entities/user";

type LoadingState = "idle" | "loading" | "success" | "error";

interface UseAdminUsersState {
  users: UserListItem[];
  selectedUser: User | null;
  loadingState: LoadingState;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: UseAdminUsersState = {
  users: [],
  selectedUser: null,
  loadingState: "idle",
  error: null,
  currentPage: 1,
  hasMore: false,
};

/**
 * Hook para manejar usuarios en el panel de administración
 */
export function useAdminUsers() {
  const [state, setState] = useState<UseAdminUsersState>(initialState);
  const repository = getUserRepository();

  /**
   * Carga lista de usuarios con filtros y paginación
   */
  const loadUsers = useCallback(
    async (filters?: UserFilters, page = 1, pageSize = 20) => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        const result = await repository.getAll(filters, page, pageSize);
        setState((prev) => ({
          ...prev,
          users: page === 1 ? result.data : [...prev.users, ...result.data],
          currentPage: page,
          hasMore: result.hasMore,
          loadingState: "success",
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al cargar usuarios",
        }));
      }
    },
    [repository]
  );

  /**
   * Obtiene un usuario por su ID
   */
  const getUser = useCallback(
    async (id: string): Promise<User | null> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        const user = await repository.getById(id);
        setState((prev) => ({
          ...prev,
          selectedUser: user,
          loadingState: "success",
        }));
        return user;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al obtener usuario",
        }));
        return null;
      }
    },
    [repository]
  );

  /**
   * Actualiza el rol de un usuario
   */
  const updateUserRole = useCallback(
    async (id: string, role: UserRole): Promise<boolean> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        await repository.updateRole(id, role);
        setState((prev) => ({
          ...prev,
          users: prev.users.map((u) => (u.id === id ? { ...u, role } : u)),
          loadingState: "success",
        }));
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al actualizar rol",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Actualiza el estado de un usuario
   */
  const updateUserStatus = useCallback(
    async (id: string, status: UserStatus): Promise<boolean> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        await repository.updateStatus(id, status);
        setState((prev) => ({
          ...prev,
          users: prev.users.map((u) => (u.id === id ? { ...u, status } : u)),
          loadingState: "success",
        }));
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al actualizar estado",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Elimina un usuario (soft delete)
   */
  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, loadingState: "loading", error: null }));

      try {
        await repository.delete(id);
        setState((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u.id !== id),
          loadingState: "success",
        }));
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loadingState: "error",
          error: err instanceof Error ? err.message : "Error al eliminar usuario",
        }));
        return false;
      }
    },
    [repository]
  );

  /**
   * Limpia el usuario seleccionado
   */
  const clearSelectedUser = useCallback(() => {
    setState((prev) => ({ ...prev, selectedUser: null }));
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    users: state.users,
    selectedUser: state.selectedUser,
    isLoading: state.loadingState === "loading",
    error: state.error,
    currentPage: state.currentPage,
    hasMore: state.hasMore,

    // Acciones
    loadUsers,
    getUser,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    clearSelectedUser,
    clearError,
  };
}
