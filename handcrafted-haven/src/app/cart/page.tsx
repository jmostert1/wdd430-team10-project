"use client";

import Header from "@/components/Header";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import useAuthUser from "@/hooks/useAuth";
import "./cart.css";
import Image from "next/image";


export default function CartPage() {
  const { isLoggedIn, loadingUser } = useAuthUser({ redirectToLogin: true });
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  if (loadingUser) {
    return (
      <main className="page">
        <Header />
        <section className="cart-section">
          <div className="container">
            <p className="cart__loading">Loading cart...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="page">
      <Header />
      <section className="cart-section">
        <div className="container">
          <div className="cart-panel">
            <div className="cart-header">
              <h1 className="cart-title">Shopping Cart</h1>
              {cartItems.length > 0 && (
                <button
                  className="btn btn--secondary"
                  onClick={clearCart}
                  type="button"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p className="cart-empty__text">Your cart is empty</p>
                <Link href="/gallery" className="btn btn--primary">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="cart-item">
                      <Link
                        href={`/items/${item.productId}`}
                        className="cart-item__image"
                      >
                        <Image
                          src={item.imageSrc || "/products/default-product.png"}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="cart-item__img"
                          sizes="120px"
                        />
                      </Link>

                      <div className="cart-item__details">
                        <Link
                          href={`/items/${item.productId}`}
                          className="cart-item__name"
                        >
                          {item.name}
                        </Link>
                        <div className="cart-item__price">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="cart-item__quantity">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item__subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-summary__row">
                    <span className="cart-summary__label">
                      Subtotal ({getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""}):
                    </span>
                    <span className="cart-summary__value">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-summary__actions">
                    <Link href="/gallery" className="btn btn--secondary">
                      Continue Shopping
                    </Link>
                    <button className="btn btn--primary" type="button">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
