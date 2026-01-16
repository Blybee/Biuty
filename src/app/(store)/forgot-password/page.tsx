"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Logo } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { sendPasswordReset, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Por favor ingresa tu correo electrónico");
      return;
    }

    const result = await sendPasswordReset(email);

    if (result.success) {
      setIsSuccess(true);
    } else {
      const errorMessage = translateFirebaseError(result.error || "");
      setFormError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" />
        </div>

        {isSuccess ? (
          /* Success State */
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-forest mb-4">
              ¡Correo enviado!
            </h1>
            <p className="text-sage-dark mb-8">
              Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
              <strong className="text-forest">{email}</strong>
            </p>
            <p className="text-sm text-sage mb-8">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
            <Link href="/login">
              <Button variant="primary" size="lg" className="w-full">
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Back Link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sage hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-forest mb-2">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-sage-dark">
                No te preocupes, ingresa tu correo electrónico y te enviaremos las instrucciones para restablecerla.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {formError}
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormError(null);
                    }}
                    className="pl-12"
                    disabled={isLoading}
                  />
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
                    Enviando...
                  </>
                ) : (
                  "Enviar instrucciones"
                )}
              </Button>
            </form>

            {/* Help Text */}
            <p className="mt-8 text-center text-sm text-sage">
              ¿Recuerdas tu contraseña?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:text-primary-hover transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </>
        )}
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
    "auth/invalid-email": "El correo electrónico no es válido",
    "auth/too-many-requests": "Demasiados intentos. Por favor espera unos minutos",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet",
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return message;
    }
  }

  return "Error al enviar el correo. Por favor intenta de nuevo.";
}
