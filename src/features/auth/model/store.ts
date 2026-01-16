import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/entities/user";
import type { LoadingState } from "@/shared/types";

/**
 * Estado de autenticación
 */
interface AuthState {
  // Usuario
  user: User | null;
  isAuthenticated: boolean;
  
  // Estado
  loadingState: LoadingState;
  error: string | null;
  
  // Acciones
  setUser: (user: User | null) => void;
  setLoadingState: (state: LoadingState) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loadingState: "idle",
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoadingState: (loadingState) =>
        set({ loadingState }),

      setError: (error) =>
        set({ error, loadingState: "error" }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: "biuty-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
