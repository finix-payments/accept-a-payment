'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const subtotal = totalPrice;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your cart is empty</h1>
          <Link
            href="/products"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <button
              onClick={clearCart}
              className="mt-4 w-full text-center bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <Link
                  href="/checkout/hosted"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Pay with Hosted Checkout
                </Link>
                <Link
                  href="/checkout/tokenization"
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800"
                >
                  Pay with Tokenization Form
                </Link>
                <Link
                  href="/products"
                  className="block text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 