import { create } from 'zustand';
import api from '../api/axios';

const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/api/cart');
      set({ cartItems: response.data, loading: false });
    } catch (error) {
      console.error('Себетті жүктеу қатесі:', error);
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      await api.post('/api/cart', { product_id: productId, quantity });
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Қате' };
    }
  },

  removeFromCart: async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Қате' };
    }
  },

  getTotalPrice: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  },

  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;
