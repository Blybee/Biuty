import { create } from "zustand";
import type { CheckoutStep, ShippingData, PaymentData, CheckoutData } from "./types";
import type { CartItem, CartSummary } from "@/features/cart";
import type { LoadingState } from "@/shared/types";

/**
 * Estado del proceso de checkout
 */
interface CheckoutState {
  // Datos
  step: CheckoutStep;
  shipping: ShippingData | null;
  payment: PaymentData | null;
  items: CartItem[];
  summary: CartSummary | null;
  orderId: string | null;
  orderNumber: string | null;
  
  // Estado
  loadingState: LoadingState;
  error: string | null;
  
  // Acciones
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShipping: (data: ShippingData) => void;
  setPayment: (data: PaymentData) => void;
  setItems: (items: CartItem[]) => void;
  setSummary: (summary: CartSummary) => void;
  setOrderResult: (orderId: string, orderNumber: string) => void;
  setLoadingState: (state: LoadingState) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const steps: CheckoutStep[] = ["shipping", "payment", "review", "complete"];

const initialState = {
  step: "shipping" as CheckoutStep,
  shipping: null,
  payment: null,
  items: [],
  summary: null,
  orderId: null,
  orderNumber: null,
  loadingState: "idle" as LoadingState,
  error: null,
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  setStep: (step) =>
    set({ step }),

  nextStep: () => {
    const currentIndex = steps.indexOf(get().step);
    if (currentIndex < steps.length - 1) {
      set({ step: steps[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const currentIndex = steps.indexOf(get().step);
    if (currentIndex > 0) {
      set({ step: steps[currentIndex - 1] });
    }
  },

  setShipping: (shipping) =>
    set({ shipping }),

  setPayment: (payment) =>
    set({ payment }),

  setItems: (items) =>
    set({ items }),

  setSummary: (summary) =>
    set({ summary }),

  setOrderResult: (orderId, orderNumber) =>
    set({ orderId, orderNumber }),

  setLoadingState: (loadingState) =>
    set({ loadingState }),

  setError: (error) =>
    set({ error }),

  reset: () =>
    set(initialState),
}));
