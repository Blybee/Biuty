"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { useCart } from "@/features/cart";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";

export function MiniCart() {
  const {
    items,
    isOpen,
    summary,
    isEmpty,
    closeCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1040] bg-forest/50 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-[1050] h-full w-full max-w-md bg-white shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-sage/10">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-forest">
                Tu Carrito ({summary.itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-sage hover:text-forest hover:bg-sage/10 rounded-full transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-sage" />
                </div>
                <h3 className="text-lg font-semibold text-forest mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-sage mb-6">
                  Explora nuestra tienda y encuentra productos increíbles
                </p>
                <Button onClick={closeCart} variant="primary">
                  <Link href="/shop">Explorar Tienda</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-sage/10">
                {items.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.thumbnail || "/images/placeholder.jpg"}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-forest hover:text-primary line-clamp-2 transition-colors"
                        >
                          {item.product.name}
                        </Link>

                        {item.variantName && (
                          <p className="text-xs text-sage mt-0.5">
                            {item.variantName}
                          </p>
                        )}

                        <p className="text-sm font-bold text-forest mt-1">
                          {formatPrice(item.unitPrice)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-sage/20 rounded-full">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="p-1.5 hover:bg-sage/10 rounded-l-full transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="p-1.5 hover:bg-sage/10 rounded-r-full transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-sage hover:text-error hover:bg-error/10 rounded-full transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {!isEmpty && (
            <div className="border-t border-sage/10 p-6 space-y-4 bg-background/50">
              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-dark">Subtotal</span>
                  <span className="font-medium text-forest">
                    {formatPrice(summary.subtotal)}
                  </span>
                </div>

                {summary.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Descuento</span>
                    <span>-{formatPrice(summary.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sage-dark">Envío</span>
                  <span className="font-medium text-forest">
                    {summary.shipping === 0 ? (
                      <span className="text-primary">Gratis</span>
                    ) : (
                      formatPrice(summary.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base pt-2 border-t border-sage/20">
                  <span className="font-semibold text-forest">Total</span>
                  <span className="font-bold text-forest">
                    {formatPrice(summary.total)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {summary.shipping > 0 && (
                <p className="text-xs text-sage text-center">
                  ¡Agrega{" "}
                  <span className="font-semibold text-primary">
                    {formatPrice(100 - summary.subtotal)}
                  </span>{" "}
                  más para envío gratis!
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={closeCart}
                  className="py-4"
                >
                  <Link href="/checkout" className="flex items-center justify-center w-full">
                    Finalizar Compra
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={closeCart}
                >
                  <Link href="/cart" className="flex items-center justify-center w-full">
                    Ver Carrito Completo
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </Fragment>
  );
}
