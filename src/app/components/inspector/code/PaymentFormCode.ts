export const paymentFormCode = `'use client';

import { useEffect, useRef, useState } from 'react';
import { FinixForm, PaymentFormProps, FormState, BinInformation } from '@/types/global';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { paymentFormCode } from './inspector/code/PaymentFormCode';

export default function PaymentForm({ onSuccess, shippingAddress }: PaymentFormProps) {
  const finixForm = useRef<FinixForm | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const { totalPrice } = useCart();
  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  {/* Initialize Finix Tokenization Library */}
  useEffect(() => {
    const { Finix } = window;

    if (Finix && !finixForm.current) {
      {/* Finix Tokenization Options - https://finix.com/docs/guides/payments/online-payments/payment-details/token-forms/ */}
      const options = {
        // optional fields to require billing address collection if needed
        showAddress: true,
        requiredFields: ['address_line1', 'city', 'state', 'postal_code'],
        // onUpdate function required when using custom submit buttons to properly enable/disable them
        onUpdate: (state: FormState, binInformation: BinInformation, hasErrors: boolean) => {
          setIsFormValid(!hasErrors);
        },
        // optional styles
        styles: {
          default: {
            border: "1px solid #d1d5dc",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.25rem",
            color: "#091e42",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 0 rgba(9,30,66,.08)",
          },
        },
      };

      finixForm.current = Finix.CardTokenForm("payment-form", options);
    }
  }, []);

  const handleTokenReceived = async (token: string) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
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
      router.push(\`/checkout/success?transferId=\${data.id}&amount=\${Math.round(total * 100)}\`);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      const token = await new Promise((resolve, reject) => {
        finixForm.current?.submit("sandbox", "APc9vhYcPsRuTSpKD9KpMtPe", function (err, res) {
          if (err) reject(err);
          else resolve(res.data.id);
        });
      });

      handleTokenReceived(token as string);
    } catch (err) {
      setIsProcessing(false);
      setError('Tokenization failed: ' + (err as Error).message);
    }
  };

  return (
    <div data-inspectable data-component="PaymentForm" data-code={paymentFormCode}>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Billing Information</h2>

       {/* Error Messaging */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {/* Finix Tokenization iframe will be loaded here */}
      <div id="payment-form" />
      
      {/* Custom Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !isFormValid}
          className={\`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white \${
    isProcessing || !isFormValid ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer'
} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800\`}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </div>
          ) : (
            'Pay Now'
          )}
        </button>
      </div>
    </div>
  );
}`;