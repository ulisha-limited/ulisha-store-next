/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  discount_price?: number;
  discount_active?: boolean;
  discount_percentage?: number;
  category: string;
  image: string;
  description: string;
  created_at?: string;
  store_id?: string;
  seller_id?: string;
  seller_phone?: string;
  rating?: number;
  shipping_location: string;
  selectedColor?: string;
  selectedSize?: string;
  variantId?: string;
}

interface DeliveryDetails {
  name: string;
  phone: string;
  address: string;
  state: string;
  payment_ref?: string;
  payment_method?: string;
}

interface CartState {
  session: CartSession | null;
  items: CartItem[];
  savedItems: CartItem[];
  loading: boolean;
  error: string | null;
  initializeSession: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  saveForLater: (productId: string) => Promise<void>;
  moveToCart: (productId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => Promise<void>;
  processPayment: (total: number, deliveryDetails?: DeliveryDetails) => Promise<unknown>;
}

interface CartSession {
  id: string;
  user_id: string;
  status: string;
}

interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  is_saved_for_later: boolean;
  product: Product;
  variant_id?: string;
  selected_color?: string;
  selected_size?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let retries = 0;
  while (true) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      await delay(baseDelay * Math.pow(2, retries));
      retries++;
    }
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  session: null,
  items: [],
  savedItems: [],
  loading: false,
  error: null,

  initializeSession: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { session: authSession } } = await retryWithBackoff(() => 
        supabase.auth.getSession()
      );
      
      if (!authSession?.user) {
        set({ session: null, items: [], savedItems: [] });
        return;
      }

      // First try to get existing active session
      const { data: existingSession } = await retryWithBackoff(async () =>
        await supabase
          .from('shopping_sessions')
          .select('*')
          .eq('user_id', authSession.user.id)
          .eq('status', 'active')
          .maybeSingle()
      );

      if (existingSession) {
        set({ session: existingSession });
        return;
      }

      // Close any existing sessions before creating a new one
      await retryWithBackoff(async () =>
        await supabase
          .from('shopping_sessions')
          .update({ status: 'closed' })
          .eq('user_id', authSession.user.id)
          .eq('status', 'active')
      );

      // Create new session with error handling
      const { data: newSession, error: insertError } = await retryWithBackoff(async () =>
        await supabase
          .from('shopping_sessions')
          .insert([{ 
            user_id: authSession.user.id, 
            status: 'active' 
          }])
          .select()
          .single()
      );

      if (insertError) {
        // If insert fails, try one more time to get existing session
        // (in case another request created one in the meantime)
        const { data: retrySession } = await retryWithBackoff(async () =>
          await supabase
            .from('shopping_sessions')
            .select('*')
            .eq('user_id', authSession.user.id)
            .eq('status', 'active')
            .maybeSingle()
        );

        if (retrySession) {
          set({ session: retrySession });
          return;
        }
        throw insertError;
      }

      if (newSession) {
        set({ session: newSession });
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      set({ error: 'Failed to initialize shopping session' });
    } finally {
      set({ loading: false });
    }
  },

  fetchCart: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { session: authSession } } = await retryWithBackoff(() =>
        supabase.auth.getSession()
      );
      
      if (!authSession?.user) {
        set({ items: [], savedItems: [], session: null });
        return;
      }

      if (!get().session) {
        await get().initializeSession();
      }

      const currentSession = get().session;
      if (!currentSession?.id) {
        set({ items: [], savedItems: [] });
        return;
      }

      const { data: cartItems } = await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .select(`
            *,
            product:products(*)
          `)
          .eq('session_id', currentSession.id)
      );

      const validCartItems = (cartItems || []).filter(item => item && item.product);

      const items = validCartItems
        .filter(item => !item.is_saved_for_later)
        .map(item => ({
          ...item,
          product: item.product
        }));

      const savedItems = validCartItems
        .filter(item => item.is_saved_for_later)
        .map(item => ({
          ...item,
          product: item.product
        }));

      set({ items, savedItems });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ error: 'Failed to fetch cart items' });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product: Product, quantity = 1) => {
    try {
      set({ loading: true, error: null });
      
      if (!get().session) {
        await get().initializeSession();
      }

      const currentSession = get().session;
      if (!currentSession?.id) {
        throw new Error('No active session');
      }

      // Query for existing cart item with exact variant match
      const { data: existingItem } = await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .select('*')
          .eq('session_id', currentSession.id)
          .eq('product_id', product.id)
          .is('variant_id', product.variantId || null)
          .is('selected_color', product.selectedColor || null)
          .is('selected_size', product.selectedSize || null)
          .maybeSingle()
      );

      if (existingItem) {
        // Update existing item quantity
        await retryWithBackoff(async () =>
          await supabase
            .from('cart_items_new')
            .update({ 
              quantity: existingItem.quantity + quantity,
              price_snapshot: product.price,
              is_saved_for_later: false
            })
            .eq('id', existingItem.id)
        );
      } else {
        // Insert new item
        await retryWithBackoff(async () =>
          await supabase
            .from('cart_items_new')
            .insert([{
              session_id: currentSession.id,
              product_id: product.id,
              quantity,
              price_snapshot: product.price,
              variant_id: product.variantId || null,
              selected_color: product.selectedColor || null,
              selected_size: product.selectedSize || null,
              is_saved_for_later: false
            }])
        );
      }

      await get().fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      set({ error: 'Failed to add item to cart' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      set({ loading: true, error: null });
      const currentSession = get().session;
      if (!currentSession?.id) return;

      await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .delete()
          .eq('session_id', currentSession.id)
          .eq('product_id', productId)
      );

      await get().fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      set({ error: 'Failed to remove item from cart' });
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      set({ loading: true, error: null });
      const currentSession = get().session;
      if (!currentSession?.id) return;

      if (quantity <= 0) {
        await get().removeFromCart(productId);
        return;
      }

      await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .update({ quantity })
          .eq('session_id', currentSession.id)
          .eq('product_id', productId)
      );

      await get().fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      set({ error: 'Failed to update item quantity' });
    } finally {
      set({ loading: false });
    }
  },

  saveForLater: async (productId: string) => {
    try {
      set({ loading: true, error: null });
      const currentSession = get().session;
      if (!currentSession?.id) return;

      await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .update({ is_saved_for_later: true })
          .eq('session_id', currentSession.id)
          .eq('product_id', productId)
      );

      await get().fetchCart();
    } catch (error) {
      console.error('Error saving for later:', error);
      set({ error: 'Failed to save item for later' });
    } finally {
      set({ loading: false });
    }
  },

  moveToCart: async (productId: string) => {
    try {
      set({ loading: true, error: null });
      const currentSession = get().session;
      if (!currentSession?.id) return;

      await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .update({ is_saved_for_later: false })
          .eq('session_id', currentSession.id)
          .eq('product_id', productId)
      );

      await get().fetchCart();
    } catch (error) {
      console.error('Error moving to cart:', error);
      set({ error: 'Failed to move item to cart' });
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ loading: true, error: null });
      const currentSession = get().session;
      if (!currentSession?.id) return;

      await retryWithBackoff(async () =>
        await supabase
          .from('cart_items_new')
          .delete()
          .eq('session_id', currentSession.id)
      );

      set({ items: [], savedItems: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Failed to clear cart' });
    } finally {
      set({ loading: false });
    }
  },

  processPayment: async (total: number, deliveryDetails?: DeliveryDetails) => {
    try {
      set({ loading: true, error: null });
      const currentSession = get().session;
      if (!currentSession?.id) {
        throw new Error('No active session');
      }

      const orderData = {
        user_id: currentSession.user_id,
        total,
        status: 'pending',
        delivery_name: deliveryDetails?.name,
        delivery_phone: deliveryDetails?.phone,
        delivery_address: deliveryDetails?.address,
        delivery_state: deliveryDetails?.state,
        payment_ref: deliveryDetails?.payment_ref,
        payment_method: deliveryDetails?.payment_method
      };

      const { data: order, error: orderError } = await retryWithBackoff(async () =>
        await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single()
      );

      if (orderError) throw orderError;

      const cartItems = get().items;
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price_snapshot,
        variant_id: item.variant_id,
        selected_color: item.selected_color,
        selected_size: item.selected_size
      }));

      await retryWithBackoff(async () =>
        await supabase
          .from('order_items')
          .insert(orderItems)
      );

      return order;
    } catch (error) {
      console.error('Error processing payment:', error);
      set({ error: 'Failed to process payment' });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));