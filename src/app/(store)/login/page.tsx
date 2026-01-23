"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, Logo } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading, error, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validación básica
    if (!formData.email || !formData.password) {
      setFormError("Por favor completa todos los campos");
      return;
    }

    const result = await signIn({
      email: formData.email,
      password: formData.password,
    });

    if (result.success && result.user) {
      // Redirigir según el rol del usuario
      if (result.user.role === "admin" || result.user.role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      // Traducir errores comunes de Firebase
      const errorMessage = translateFirebaseError(result.error || "");
      setFormError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="lg" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-forest mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-sage-dark">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(formError || error) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {formError || error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-forest">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-forest">
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sage hover:text-forest transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-sage/20" />
            <span className="px-4 text-sm text-sage">o continúa con</span>
            <div className="flex-1 border-t border-sage/20" />
          </div>

          {/* Social Login (placeholder) */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert("Google Sign In - Próximamente")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert("Facebook Sign In - Próximamente")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sage-dark">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200"
          alt="Productos naturales Biuty"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-forest/90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Tu bienestar, nuestra prioridad
            </h2>
            <p className="text-lg text-white/90 max-w-md">
              Accede a tu cuenta para disfrutar de ofertas exclusivas, seguimiento de pedidos y recomendaciones personalizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Traduce los errores de Firebase Auth a español
 */
function translateFirebaseError(error: string): string {
  const errorMap: Record<string, string> = {
    "auth/user-not-found": "No existe una cuenta con este correo electrónico",
    "auth/wrong-password": "La contraseña es incorrecta",
    "auth/invalid-email": "El correo electrónico no es válido",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
    "auth/too-many-requests": "Demasiados intentos. Por favor espera unos minutos",
    "auth/invalid-credential": "Credenciales incorrectas. Verifica tu email y contraseña",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet",
    "auth/operation-not-allowed": "Esta operación no está permitida",
    "auth/email-already-in-use": "Ya existe una cuenta con este correo electrónico",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return message;
    }
  }

  return "Error al iniciar sesión. Por favor intenta de nuevo.";
}

