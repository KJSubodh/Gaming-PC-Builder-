import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      console.error("Error fetching cart", e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    let prodId = product.id;
    
    // If product ID is missing, fetch from backend
    if (!prodId) {
      try {
        const res = await fetch("http://localhost:5000/products");
        const products = await res.json();
        const matched = products.find(
          (p) => p.name.toLowerCase() === product.name.toLowerCase()
        );
        if (matched) {
          prodId = matched.id;
        } else {
          console.error("Product not found in database:", product.name);
          return;
        }
      } catch (e) {
        console.error("Error fetching products", e);
        return;
      }
    }

    const response = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: prodId, quantity: 1 }),
    });

    if (response.ok) {
      fetchCart();
    } else {
      console.error("Error adding to cart:", await response.text());
    }
  };

  const removeFromCart = async (cartId) => {
    await fetch(`http://localhost:5000/cart/${cartId}`, { method: "DELETE" });
    fetchCart();
  };

  const clearCart = async () => {
    await fetch("http://localhost:5000/cart", { method: "DELETE" });
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
