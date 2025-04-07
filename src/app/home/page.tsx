'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">Welcome to Finix Store</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Experience seamless payments with Finix. We offer two secure payment methods to suit your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Finix Hosted Checkout</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our hosted checkout solution provides a secure, pre-built payment page that handles all the complexity of payment processing.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Fully hosted and secure
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              PCI compliant
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Easy to implement
            </li>
          </ul>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Try Hosted Checkout
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tokenization Form</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our tokenization form allows you to collect payment information directly on your site while maintaining security.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Customizable design
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Seamless integration
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Full control over UX
            </li>
          </ul>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
          >
            Try Tokenization Form
          </Link>
        </div>
      </div>
    </div>
  );
} 