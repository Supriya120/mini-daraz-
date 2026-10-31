import { createContext, useContext, useState, useEffect } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => getFromLocalStorage("wishlist", []));

  useEffect(() => {
    saveToLocalStorage("wishlist", wishlistItems);
  }, [wishlistItems]);

  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  const addToWishlist = (product) => {
    if (isInWishlist(product.id)) return;
    const { id, title, thumbnail, price, discountPercentage, stock, category } = product;
    setWishlistItems((prev) => [...prev, { id, title, thumbnail, price, discountPercentage, stock, category }]);
  };

  const removeFromWishlist = (id) => setWishlistItems((prev) => prev.filter((item) => item.id !== id));

  const value = { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
