'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import PaymentForm from '../../components/PaymentForm';
import ShippingAddressForm from '../../components/ShippingAddressForm';
import GooglePayButton from '../../components/GooglePayButton';
import ApplePayButton from '../../components/ApplePayButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TokenizationPage() {
  const { items, totalPrice } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleGooglePaySuccess = async (paymentData: google.payments.api.PaymentData) => {
    setIsProcessing(true);

    try {
      const googlePayToken = paymentData.paymentMethodData.tokenizationData.token;

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googlePayToken,
          amount: Math.round(total * 100),
          currency: 'USD',
          shippingAddress: {
            line1: shippingAddress.line1,
            line2: shippingAddress.line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zip: shippingAddress.zip,
            country: shippingAddress.country
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment processing failed');
      }

      const data = await response.json();
      router.push(`/checkout/success?transferId=${data.id}&amount=${Math.round(total * 100)}`);
    } catch (err) {
      console.error('Google Pay payment failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGooglePayError = (error: Error) => {
    console.error('Google Pay payment failed:', error);
  };

  const handleApplePaySuccess = (transferId: string) => {
    router.push(`/checkout/success?transferId=${transferId}&amount=${Math.round(total * 100)}`);
  };

  const handleApplePayError = (error: string) => {
    console.error('Apple Pay payment failed:', error);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Column - Payment Form */}
      <div className="w-full lg:w-2/3 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[600px] m-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                    Products
                  </Link>
                </li>
                <li className="text-gray-500 dark:text-gray-400">/</li>
                <li>
                  <Link href="/cart" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                    Cart
                  </Link>
                </li>
                <li className="text-gray-500 dark:text-gray-400">/</li>
                <li className="text-blue-500 dark:text-blue-400">Payment</li>
              </ol>
            </nav>
          </div>

          {/* Test Card Information */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong className="text-gray-900 dark:text-gray-100">Important:</strong> This is a sandbox environment - no real payments are processed. Please do not enter real card information. 
            Instead, use test card data, such as <span className="font-mono text-gray-900 dark:text-gray-100">4111 1111 1111 1111</span> with any future expiration date and any 3-digit CVV.
            </p>
          </div>

          {/* Shipping Address Form */}
          <ShippingAddressForm onAddressChange={setShippingAddress} />

          {/* Payment Form */}
          <PaymentForm shippingAddress={shippingAddress} />
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-300 dark:border-gray-700">
        <div className="sticky top-0 p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Order Summary</h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Express Checkout Options */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">Express Checkout</span>
            </div>
          </div>

          <div className="mt-6 m-auto w-max">
            <GooglePayButton
              onPaymentSuccess={handleGooglePaySuccess}
              onPaymentError={handleGooglePayError}
              disabled={isProcessing}
            />

            <ApplePayButton
              merchant_id="MUmfEGv5bMpSJ9k5TFRUjkmm"
              merchant_identity="ID6UfSm1d4WPiWgLYmbyeo3H"
              onPaymentSuccess={handleApplePaySuccess}
              onPaymentError={handleApplePayError}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 