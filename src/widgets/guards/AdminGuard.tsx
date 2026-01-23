"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { getAuthService } from "@/infrastructure/firebase";
import { Loader2 } from "lucide-react";

const authService = getAuthService();

interface AdminGuardProps {
    children: React.ReactNode;
}

/**
 * Guard component para proteger rutas de administrador
 * 
 * Verifica:
 * 1. Usuario autenticado
 * 2. Usuario tiene rol de admin (via custom claims)
 * 
 * Redirige a /login si no está autenticado
 * Muestra error si no tiene permisos de admin
 */
export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        async function checkAdminAccess() {
            // Si está cargando, esperar
            if (isLoading) {
                return;
            }

            // Si no está autenticado, redirigir a login
            if (!isAuthenticated || !user) {
                // Solo redirigir si ya terminó de cargar
                if (!isLoading) {
                    router.push("/login");
                }
                setIsChecking(false);
                setIsAuthorized(false);
                return;
            }

            // Verificar si tiene permisos de admin desde el objeto user
            const hasAdminRole = user.role === "admin" || user.role === "super_admin";

            setIsAuthorized(hasAdminRole);
            setIsChecking(false);
        }

        checkAdminAccess();
    }, [isAuthenticated, user, isLoading, router]);

    // Mostrar loading mientras verifica
    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sage-dark">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si no tiene permisos
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Acceso Denegado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        No tienes permisos para acceder al panel de administración.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-xl transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    // Usuario autorizado, mostrar contenido
    return <>{children}</>;
}
