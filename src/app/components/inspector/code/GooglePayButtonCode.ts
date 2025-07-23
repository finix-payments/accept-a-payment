export const googlePayButtonCode = `'use client';

import { useCallback } from 'react';
import GooglePayButtonReact from '@google-pay/button-react';
import { useCart } from '@/app/context/CartContext';
import { googlePayButtonCode } from './inspector/code/GooglePayButtonCode';

interface GooglePayButtonProps {
  onPaymentSuccess: (paymentData: google.payments.api.PaymentData) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

export default function GooglePayButton({ 
  onPaymentSuccess, 
  onPaymentError, 
}: GooglePayButtonProps) {
  const { totalPrice } = useCart();
  
  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePaymentAuthorized = useCallback((paymentData: google.payments.api.PaymentData) => {
    try {
      // Pass the Google Pay PaymentData directly to the success handler
      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError(error as Error);
    }
  }, [onPaymentSuccess, onPaymentError]);

  const handleError = useCallback((error: Error | google.payments.api.PaymentsError) => {
    console.error('Google Pay error:', error);
    onPaymentError(error as Error);
  }, [onPaymentError]);

  return (
    <div className="mt-4" data-inspectable data-component="GooglePayButton" data-code={googlePayButtonCode}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or pay with</span>
        </div>
      </div>
      
      <div className="mt-4 w-full">
        <GooglePayButtonReact
          environment="TEST"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER']
                },
                tokenizationSpecification: {
                  type: 'PAYMENT_GATEWAY',
                  parameters: {
                    gateway: 'finix',
                    gatewayMerchantId: 'ID12345'
                  }
                }
              }
            ],
            merchantInfo: {
              merchantId: 'ID12345',
              merchantName: 'Finix Store'
            },
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPrice: total.toString(),
              currencyCode: 'USD'
            }
          }}
          onLoadPaymentData={handlePaymentAuthorized}
          onError={handleError}
          existingPaymentMethodRequired={false}
        />
      </div>
    </div>
  );
}`;
