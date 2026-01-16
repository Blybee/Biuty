"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, Logo } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Check } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading, error, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      setFormError("Por favor ingresa tu nombre completo");
      return false;
    }
    if (!formData.email) {
      setFormError("Por favor ingresa tu correo electrónico");
      return false;
    }
    if (!formData.password) {
      setFormError("Por favor ingresa una contraseña");
      return false;
    }
    if (formData.password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return false;
    }
    if (!formData.acceptTerms) {
      setFormError("Debes aceptar los términos y condiciones");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: `${formData.firstName} ${formData.lastName}`,
    });

    if (result.success) {
      router.push("/");
    } else {
      const errorMessage = translateFirebaseError(result.error || "");
      setFormError(errorMessage);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["", "Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200"
          alt="Estilo de vida saludable"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/90 to-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Únete a la comunidad Biuty
            </h2>
            <p className="text-lg text-white/90 max-w-md mb-8">
              Miles de personas ya confían en nosotros para su bienestar diario. ¡Sé parte de nuestra familia!
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <span className="text-3xl font-bold">10K+</span>
                <p className="text-sm text-white/80">Clientes felices</p>
              </div>
              <div>
                <span className="text-3xl font-bold">500+</span>
                <p className="text-sm text-white/80">Productos</p>
              </div>
              <div>
                <span className="text-3xl font-bold">4.9★</span>
                <p className="text-sm text-white/80">Calificación</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Logo size="lg" />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-forest mb-2">
              Crea tu cuenta
            </h1>
            <p className="text-sage-dark">
              Regístrate para acceder a ofertas exclusivas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {(formError || error) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {formError || error}
              </div>
            )}

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-forest">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-12"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-forest">
                  Apellido
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-forest">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.strength
                            ? level <= 2
                              ? "bg-red-400"
                              : level <= 3
                              ? "bg-yellow-400"
                              : "bg-green-400"
                            : "bg-sage/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-sage">{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-forest">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-12"
                  disabled={isLoading}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms & Newsletter */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-sage text-primary focus:ring-primary"
                />
                <span className="text-sm text-sage-dark">
                  Acepto los{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-sage text-primary focus:ring-primary"
                />
                <span className="text-sm text-sage-dark">
                  Quiero recibir ofertas exclusivas y novedades por email
                </span>
              </label>
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
                  Creando cuenta...
                </>
              ) : (
                "Crear mi cuenta"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sage-dark">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
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
    "auth/email-already-in-use": "Ya existe una cuenta con este correo electrónico",
    "auth/invalid-email": "El correo electrónico no es válido",
    "auth/weak-password": "La contraseña es demasiado débil",
    "auth/operation-not-allowed": "El registro está temporalmente deshabilitado",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet",
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return message;
    }
  }

  return "Error al crear la cuenta. Por favor intenta de nuevo.";
}
