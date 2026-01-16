"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/shared/lib";
import { Button, Input, Badge } from "@/shared/ui";
import { useCart } from "@/features/cart";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Check,
  Smartphone,
} from "lucide-react";

type Step = "shipping" | "payment" | "review";

const paymentMethods = [
  { id: "card", name: "Tarjeta de Crédito/Débito", icon: CreditCard },
  { id: "yape", name: "Yape", icon: Smartphone },
  { id: "plin", name: "Plin", icon: Smartphone },
];

export default function CheckoutPage() {
  const { items, summary, isEmpty } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [selectedPayment, setSelectedPayment] = useState("card");

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-20 px-6">
          <h1 className="text-2xl font-semibold text-forest mb-4">
            No hay productos en tu carrito
          </h1>
          <Button variant="primary">
            <Link href="/shop">Ir a la tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: "shipping", label: "Envío", icon: MapPin },
    { id: "payment", label: "Pago", icon: CreditCard },
    { id: "review", label: "Confirmar", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container-biuty py-8">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sage hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver al carrito
        </Link>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id as Step)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  currentStep === step.id
                    ? "bg-primary text-white"
                    : steps.findIndex((s) => s.id === currentStep) > index
                    ? "bg-primary/20 text-primary"
                    : "bg-sage/10 text-sage"
                )}
              >
                <step.icon className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-sage/20 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Información de Envío
                </h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nombre" placeholder="Juan" required />
                    <Input label="Apellido" placeholder="Pérez" required />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="juan@email.com"
                    required
                  />

                  <Input
                    label="Teléfono"
                    type="tel"
                    placeholder="+51 999 999 999"
                    required
                  />

                  <Input
                    label="Dirección"
                    placeholder="Av. Principal 123"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Distrito" placeholder="Miraflores" required />
                    <Input label="Ciudad" placeholder="Lima" required />
                    <Input label="Código Postal" placeholder="15074" />
                  </div>

                  <Input
                    label="Referencia (opcional)"
                    placeholder="Cerca del parque..."
                  />

                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setCurrentStep("payment")}
                    >
                      Continuar al Pago
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Método de Pago
                </h2>

                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors",
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-sage/20 hover:border-sage/40"
                      )}
                    >
                      <method.icon className={cn(
                        "w-6 h-6",
                        selectedPayment === method.id ? "text-primary" : "text-sage"
                      )} />
                      <span className="font-medium">{method.name}</span>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                {selectedPayment === "card" && (
                  <div className="space-y-4 pt-4 border-t border-sage/10">
                    <Input
                      label="Número de Tarjeta"
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Fecha de Expiración" placeholder="MM/YY" />
                      <Input label="CVV" placeholder="123" />
                    </div>
                    <Input
                      label="Nombre en la Tarjeta"
                      placeholder="JUAN PEREZ"
                    />
                  </div>
                )}

                {(selectedPayment === "yape" || selectedPayment === "plin") && (
                  <div className="p-6 bg-background rounded-xl text-center">
                    <p className="text-sage-dark mb-4">
                      Recibirás instrucciones para completar el pago con {selectedPayment === "yape" ? "Yape" : "Plin"} después de confirmar tu pedido.
                    </p>
                  </div>
                )}

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("shipping")}
                  >
                    Atrás
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setCurrentStep("review")}
                  >
                    Revisar Pedido
                  </Button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-background rounded-lg overflow-hidden">
                          <Image
                            src={item.product.thumbnail || "/images/placeholder.jpg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-forest line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-sage">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Dirección de Envío</h3>
                  <p className="text-sage-dark">
                    Juan Pérez<br />
                    Av. Principal 123<br />
                    Miraflores, Lima 15074<br />
                    +51 999 999 999
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Método de Pago</h3>
                  <p className="text-sage-dark flex items-center gap-2">
                    {selectedPayment === "card" ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Tarjeta terminada en ****3456
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5" />
                        {selectedPayment === "yape" ? "Yape" : "Plin"}
                      </>
                    )}
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("payment")}
                  >
                    Atrás
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Confirmar Pedido - {formatPrice(summary.total)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Tu Pedido</h2>

              <div className="space-y-4 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 bg-background rounded-lg overflow-hidden">
                      <Image
                        src={item.product.thumbnail || "/images/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-forest truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-sage">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-sage">
                    +{items.length - 3} productos más
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-sage/10 pt-6">
                <div className="flex justify-between">
                  <span className="text-sage-dark">Subtotal</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Descuento</span>
                    <span>-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sage-dark">Envío</span>
                  <span>
                    {summary.shipping === 0 ? (
                      <span className="text-primary">Gratis</span>
                    ) : (
                      formatPrice(summary.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-sage/10">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatPrice(summary.total)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-sage/10 space-y-3">
                <div className="flex items-center gap-3 text-sm text-sage-dark">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Pago 100% seguro con encriptación SSL</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-sage-dark">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Entrega estimada: 2-5 días hábiles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
