import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct, IOrderItem } from '@/types';

export interface CartItem extends IOrderItem {
    productName: string;
    productImage: string;
}

interface CartState {
    items: CartItem[];
    addItem: (product: IProduct, customizations: IOrderItem['customizations'], unitPrice: number) => void;
    removeItem: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, customizations, unitPrice) => {
                const productID = product._id;

                set((state) => ({
                    items: [...state.items, {
                        product: productID,
                        productName: product.name,
                        productImage: product.imageUrl,
                        quantity: 1,
                        customizations,
                        unitPrice
                    }]
                }));
            },
            removeItem: (index) => {
                set((state) => ({
                    items: state.items.filter((_, i) => i !== index)
                }));
            },
            updateQuantity: (index, quantity) => {
                set((state) => ({
                    items: state.items.map((item, i) => i === index ? { ...item, quantity } : item)
                }));
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
            }
        }),
        {
            name: 'coffeehybrid-cart',
        }
    )
);
