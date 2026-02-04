"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import "./cart.css";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artisan: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/cart");
      return;
    }
    
    // Proceed to checkout (you can implement this later)
    alert("Checkout functionality coming soon!");
  };

  if (loading) {
    return (
      <main className="page">
        <Header />
        <div className="cart-loading">Loading cart...</div>
      </main>
    );
  }

  return (
    <main className="page">
      <Header />
      <section className="cart">
        <div className="container">
          <h1 className="cart__title">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="cart__empty">
              <p className="cart__empty-text">Your cart is empty</p>
              <a href="/gallery" className="btn btn--primary">
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="cart__layout">
              {/* Cart Items */}
              <div className="cart__items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item__image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item__details">
                      <h3 className="cart-item__name">{item.name}</h3>
                      <p className="cart-item__artisan">by {item.artisan}</p>
                      <p className="cart-item__price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item__quantity">
                      <button
                        className="quantity__btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="quantity__value">{item.quantity}</span>
                      <button
                        className="quantity__btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item__total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  className="cart__clear"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="cart__summary">
                <h2 className="summary__title">Order Summary</h2>
                
                <div className="summary__line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary__line">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                
                <div className="summary__line">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="summary__divider" />
                
                <div className="summary__line summary__line--total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn--primary summary__checkout"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>

                <a href="/gallery" className="summary__continue">
                  Continue Shopping
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
