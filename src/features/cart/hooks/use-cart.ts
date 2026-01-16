"use client";

import { useCallback } from "react";
import { useCartStore } from "../model/store";
import type { ProductListItem } from "@/entities/product";
import type { AppliedCoupon } from "../model/types";

/**
 * Hook para manejar el carrito de compras
 */
export function useCart() {
  const {
    items,
    coupon,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    openCart,
    closeCart,
    toggleCart,
    getSummary,
    getItemCount,
  } = useCartStore();

  /**
   * Agrega un producto al carrito
   */
  const addToCart = useCallback(
    (
      product: ProductListItem,
      quantity = 1,
      variantId?: string,
      variantName?: string
    ) => {
      addItem(product, quantity, variantId, variantName);
      openCart(); // Abrir el mini-cart al agregar
    },
    [addItem, openCart]
  );

  /**
   * Elimina un item del carrito
   */
  const removeFromCart = useCallback(
    (itemId: string) => {
      removeItem(itemId);
    },
    [removeItem]
  );

  /**
   * Actualiza la cantidad de un item
   */
  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number) => {
      updateQuantity(itemId, quantity);
    },
    [updateQuantity]
  );

  /**
   * Incrementa la cantidad de un item
   */
  const incrementQuantity = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        updateQuantity(itemId, item.quantity + 1);
      }
    },
    [items, updateQuantity]
  );

  /**
   * Decrementa la cantidad de un item
   */
  const decrementQuantity = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (item && item.quantity > 1) {
        updateQuantity(itemId, item.quantity - 1);
      } else if (item) {
        removeItem(itemId);
      }
    },
    [items, updateQuantity, removeItem]
  );

  /**
   * Aplica un cupón de descuento
   */
  const applyDiscountCoupon = useCallback(
    (couponCode: string) => {
      // En producción, esto validaría el cupón contra el backend
      // Por ahora, simulamos algunos cupones válidos
      const validCoupons: Record<string, AppliedCoupon> = {
        BIUTY10: { code: "BIUTY10", discount: 10, type: "percentage" },
        BIUTY20: { code: "BIUTY20", discount: 20, type: "percentage" },
        DESCUENTO15: { code: "DESCUENTO15", discount: 15, type: "fixed" },
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        applyCoupon(coupon);
        return { success: true, message: "Cupón aplicado correctamente" };
      }

      return { success: false, message: "Cupón inválido o expirado" };
    },
    [applyCoupon]
  );

  /**
   * Verifica si un producto está en el carrito
   */
  const isInCart = useCallback(
    (productId: string, variantId?: string) => {
      const itemId = variantId ? `${productId}-${variantId}` : productId;
      return items.some((item) => item.id === itemId);
    },
    [items]
  );

  /**
   * Obtiene la cantidad de un producto en el carrito
   */
  const getQuantityInCart = useCallback(
    (productId: string, variantId?: string) => {
      const itemId = variantId ? `${productId}-${variantId}` : productId;
      const item = items.find((i) => i.id === itemId);
      return item?.quantity || 0;
    },
    [items]
  );

  return {
    // Estado
    items,
    coupon,
    isOpen,
    summary: getSummary(),
    itemCount: getItemCount(),
    isEmpty: items.length === 0,

    // Acciones de items
    addToCart,
    removeFromCart,
    updateItemQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,

    // Acciones de cupón
    applyDiscountCoupon,
    removeCoupon,

    // Acciones de UI
    openCart,
    closeCart,
    toggleCart,

    // Utilidades
    isInCart,
    getQuantityInCart,
  };
}
