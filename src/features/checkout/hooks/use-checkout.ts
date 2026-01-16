"use client";

import { useCallback, useEffect } from "react";
import { useCheckoutStore } from "../model/store";
import { useCart } from "@/features/cart";
import { useAuth } from "@/features/auth";
import { getOrderRepository } from "@/infrastructure/firebase";
import type { ShippingData, PaymentData } from "../model/types";

const orderRepository = getOrderRepository();

/**
 * Hook para manejar el proceso de checkout
 */
export function useCheckout() {
  const {
    step,
    shipping,
    payment,
    items,
    summary,
    orderId,
    orderNumber,
    loadingState,
    error,
    setStep,
    nextStep,
    prevStep,
    setShipping,
    setPayment,
    setItems,
    setSummary,
    setOrderResult,
    setLoadingState,
    setError,
    reset,
  } = useCheckoutStore();

  const { items: cartItems, summary: cartSummary, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  /**
   * Sincronizar items del carrito
   */
  useEffect(() => {
    setItems(cartItems);
    setSummary(cartSummary);
  }, [cartItems, cartSummary, setItems, setSummary]);

  /**
   * Guarda los datos de envío y avanza
   */
  const saveShipping = useCallback(
    (data: ShippingData) => {
      setShipping(data);
      nextStep();
    },
    [setShipping, nextStep]
  );

  /**
   * Guarda los datos de pago y avanza
   */
  const savePayment = useCallback(
    (data: PaymentData) => {
      setPayment(data);
      nextStep();
    },
    [setPayment, nextStep]
  );

  /**
   * Procesa el pedido
   */
  const placeOrder = useCallback(async () => {
    if (!user || !shipping || !payment || items.length === 0) {
      setError("Faltan datos para completar el pedido");
      return { success: false };
    }

    setLoadingState("loading");
    setError(null);

    try {
      const order = await orderRepository.create({
        userId: user.id,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddressId: shipping.addressId || "",
        paymentMethod: payment.method,
        customerNotes: undefined,
      });

      setOrderResult(order.id, order.orderNumber);
      setLoadingState("success");
      nextStep(); // Ir a la página de confirmación
      clearCart(); // Limpiar el carrito

      return { success: true, order };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al procesar el pedido";
      setError(message);
      setLoadingState("error");
      return { success: false, error: message };
    }
  }, [user, shipping, payment, items, setOrderResult, setLoadingState, setError, nextStep, clearCart]);

  /**
   * Reinicia el checkout
   */
  const resetCheckout = useCallback(() => {
    reset();
  }, [reset]);

  /**
   * Verifica si se puede avanzar al siguiente paso
   */
  const canProceed = useCallback(() => {
    switch (step) {
      case "shipping":
        return !!shipping;
      case "payment":
        return !!payment;
      case "review":
        return items.length > 0 && !!shipping && !!payment;
      default:
        return false;
    }
  }, [step, shipping, payment, items]);

  return {
    // Estado
    step,
    shipping,
    payment,
    items,
    summary,
    orderId,
    orderNumber,
    isLoading: loadingState === "loading",
    error,
    isAuthenticated,

    // Navegación
    setStep,
    nextStep,
    prevStep,

    // Acciones
    saveShipping,
    savePayment,
    placeOrder,
    resetCheckout,

    // Utilidades
    canProceed,
  };
}
