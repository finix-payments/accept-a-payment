'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const transferId = searchParams.get('transferId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Payment Successful!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Thank you for your purchase. Your payment of ${amount ? (Number(amount) / 100).toFixed(2) : '0.00'} has been processed successfully.
          </p>
          {transferId && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Transfer ID: {transferId}
            </p>
          )}
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}