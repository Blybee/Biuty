"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "../model/store";
import { getAuthService } from "@/infrastructure/firebase";
import type { CreateUserDTO, LoginCredentials } from "@/entities/user";

const authService = getAuthService();

/**
 * Hook para manejar la autenticación
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    loadingState,
    error,
    setUser,
    setLoadingState,
    setError,
    logout: logoutStore,
  } = useAuthStore();

  /**
   * Suscribirse a cambios de autenticación
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoadingState("success");
    });

    return () => unsubscribe();
  }, [setUser, setLoadingState]);

  /**
   * Registrar nuevo usuario
   */
  const signUp = useCallback(
    async (data: CreateUserDTO) => {
      setLoadingState("loading");
      setError(null);

      try {
        const user = await authService.signUp(data);
        setUser(user);
        setLoadingState("success");
        return { success: true, user };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al registrarse";
        setError(message);
        return { success: false, error: message };
      }
    },
    [setUser, setLoadingState, setError]
  );

  /**
   * Iniciar sesión
   */
  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      setLoadingState("loading");
      setError(null);

      try {
        const user = await authService.signIn(credentials);
        setUser(user);
        setLoadingState("success");
        return { success: true, user };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al iniciar sesión";
        setError(message);
        return { success: false, error: message };
      }
    },
    [setUser, setLoadingState, setError]
  );

  /**
   * Cerrar sesión
   */
  const signOut = useCallback(async () => {
    setLoadingState("loading");

    try {
      await authService.signOut();
      logoutStore();
      setLoadingState("success");
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(message);
      return { success: false, error: message };
    }
  }, [logoutStore, setLoadingState, setError]);

  /**
   * Enviar email de recuperación de contraseña
   */
  const sendPasswordReset = useCallback(
    async (email: string) => {
      setLoadingState("loading");
      setError(null);

      try {
        await authService.sendPasswordReset(email);
        setLoadingState("success");
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al enviar email";
        setError(message);
        return { success: false, error: message };
      }
    },
    [setLoadingState, setError]
  );

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading: loadingState === "loading",
    error,
    isAdmin,

    // Acciones
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
  };
}
