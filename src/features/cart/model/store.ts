import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartSummary, AppliedCoupon } from "./types";
import type { ProductListItem } from "@/entities/product";

/**
 * Estado del carrito
 */
interface CartState {
  // Items
  items: CartItem[];
  
  // Cupón
  coupon: AppliedCoupon | null;
  
  // UI State
  isOpen: boolean;
  
  // Acciones
  addItem: (product: ProductListItem, quantity?: number, variantId?: string, variantName?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Cupón
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  
  // UI
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  getSummary: () => CartSummary;
  getItemCount: () => number;
}

/**
 * Genera un ID único para el item del carrito
 */
function generateCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (product, quantity = 1, variantId, variantName) => {
        set((state) => {
          const itemId = generateCartItemId(product.id, variantId);
          const existingItem = state.items.find((item) => item.id === itemId);

          if (existingItem) {
            // Actualizar cantidad si el item ya existe
            return {
              items: state.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      totalPrice: (item.quantity + quantity) * item.unitPrice,
                    }
                  : item
              ),
            };
          }

          // Agregar nuevo item
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product,
            variantId,
            variantName,
            quantity,
            unitPrice: product.price,
            totalPrice: product.price * quantity,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: quantity * item.unitPrice,
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getSummary: () => {
        const { items, coupon } = get();
        
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Calcular descuento del cupón
        let discount = 0;
        if (coupon) {
          if (coupon.type === "percentage") {
            discount = subtotal * (coupon.discount / 100);
          } else {
            discount = coupon.discount;
          }
        }

        // Envío gratis sobre S/100
        const shipping = subtotal > 100 ? 0 : 10;
        
        // Sin impuestos adicionales (ya incluidos en el precio)
        const tax = 0;
        
        const total = subtotal - discount + shipping + tax;

        return {
          subtotal,
          discount,
          shipping,
          tax,
          total: Math.max(0, total),
          itemCount,
        };
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "biuty-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);
