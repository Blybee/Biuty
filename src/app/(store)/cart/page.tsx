"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { useCart } from "@/features/cart";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Shield,
  Tag,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    summary,
    isEmpty,
    coupon,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    applyDiscountCoupon,
    removeCoupon,
  } = useCart();

  const handleApplyCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("coupon") as string;
    if (code) {
      const result = applyDiscountCoupon(code);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-20 px-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold text-forest mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-sage-dark mb-8 max-w-md mx-auto">
            Parece que aún no has agregado productos a tu carrito. 
            Explora nuestra tienda y encuentra lo que necesitas.
          </p>
          <Button variant="primary" size="lg">
            <Link href="/shop" className="flex items-center gap-2">
              Explorar Tienda
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-biuty py-12">
        <h1 className="text-3xl mb-8">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 md:p-6 flex gap-4 md:gap-6"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative w-24 h-24 md:w-32 md:h-32 bg-background rounded-lg overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={item.product.thumbnail || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-forest hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-sm text-sage mt-1">{item.variantName}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-sage hover:text-error hover:bg-error/10 rounded-full transition-colors h-fit"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-sage/20 rounded-full">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="p-2 hover:bg-sage/10 rounded-l-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="p-2 hover:bg-sage/10 rounded-r-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-forest">
                        {formatPrice(item.totalPrice)}
                      </p>
                      <p className="text-sm text-sage">
                        {formatPrice(item.unitPrice)} c/u
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <label className="text-sm font-medium text-forest mb-2 block">
                  Código de descuento
                </label>
                <div className="flex gap-2">
                  <Input
                    name="coupon"
                    placeholder="Ingresa tu código"
                    className="flex-1"
                    leftIcon={<Tag className="w-4 h-4" />}
                    defaultValue={coupon?.code || ""}
                    disabled={!!coupon}
                  />
                  {coupon ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeCoupon}
                    >
                      Quitar
                    </Button>
                  ) : (
                    <Button type="submit" variant="secondary">
                      Aplicar
                    </Button>
                  )}
                </div>
                {coupon && (
                  <p className="text-sm text-primary mt-2">
                    ¡Cupón {coupon.code} aplicado!
                  </p>
                )}
              </form>

              {/* Summary Lines */}
              <div className="space-y-3 text-sm border-t border-sage/10 pt-6">
                <div className="flex justify-between">
                  <span className="text-sage-dark">Subtotal ({summary.itemCount} productos)</span>
                  <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                </div>

                {summary.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Descuento</span>
                    <span>-{formatPrice(summary.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sage-dark">Envío</span>
                  <span className="font-medium">
                    {summary.shipping === 0 ? (
                      <span className="text-primary">Gratis</span>
                    ) : (
                      formatPrice(summary.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg pt-4 border-t border-sage/10">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-forest">
                    {formatPrice(summary.total)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {summary.shipping > 0 && (
                <div className="mt-6 p-4 bg-background rounded-lg">
                  <p className="text-sm text-sage-dark mb-2">
                    ¡Agrega{" "}
                    <span className="font-semibold text-primary">
                      {formatPrice(100 - summary.subtotal)}
                    </span>{" "}
                    más para envío gratis!
                  </p>
                  <div className="h-2 bg-sage/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (summary.subtotal / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Button variant="primary" fullWidth className="mt-6 py-4">
                <Link href="/checkout" className="flex items-center justify-center gap-2 w-full">
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-sage/10 space-y-3">
                <div className="flex items-center gap-3 text-sm text-sage-dark">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>Envío gratis en compras mayores a S/100</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-sage-dark">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Pago 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
