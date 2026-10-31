import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage.js";
import { toNpr } from "../utils/formatPrice.js";

const CartContext = createContext(null);
const DELIVERY_CHARGE = 100; // Rs.

export function CartProvider({ children }) {
  // Lazy initial state: read localStorage once when the app starts.
  const [cartItems, setCartItems] = useState(() => getFromLocalStorage("cart", []));

  // Keep localStorage in sync every time the cart changes.
  useEffect(() => {
    saveToLocalStorage("cart", cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const { id, title, thumbnail, price, discountPercentage, stock } = product;
      return [...prev, { id, title, thumbnail, price, discountPercentage, stock, quantity }];
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  const increaseQuantity = (id) =>
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));

  const decreaseQuantity = (id) =>
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))
    );

  const clearCart = () => setCartItems([]);

  // useMemo: recalculate only when cartItems changes.
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, i) => sum + toNpr(i.price) * i.quantity, 0);
    const discount = cartItems.reduce(
      (sum, i) => sum + Math.round(toNpr(i.price) * (i.discountPercentage / 100)) * i.quantity,
      0
    );
    const delivery = cartItems.length > 0 ? DELIVERY_CHARGE : 0;
    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
  }, [cartItems]);

  const cartItemCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);

  const value = {
    cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart,
    totals, cartTotal: totals.total, cartItemCount,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook so components write useCart() instead of useContext(CartContext).
export const useCart = () => useContext(CartContext);
