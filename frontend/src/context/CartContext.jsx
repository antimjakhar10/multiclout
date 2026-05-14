import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "multiclout_cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course) => {
    if (!course?._id) return;

    setCartItems((prev) => {
      const exists = prev.some((item) => item._id === course._id);
      if (exists) return prev;

      return [
        ...prev,
        {
          _id: course._id,
          title: course.title,
          slug: course.slug,
          image: course.image,
          instructor: course.instructor,
          category: course.category,
          price: Number(course.price || 0),
          oldPrice: Number(course.oldPrice || 0),
        },
      ];
    });
  };

  const removeFromCart = (courseId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== courseId));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};