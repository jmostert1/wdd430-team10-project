import { useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageSrc?: string;
  quantity: number;
};

export default function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.productId === item.productId);
      if (existingItem) {
        // Increase quantity if item already exists
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      // Add new item with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
}
