'use client';

import { useEffect, useState } from 'react';
import { PaymentDataRequest, PaymentData } from '@/types/global';
import { useCart } from '@/app/context/CartContext';
import { googlePayButtonCode } from './inspector/code/GooglePayButtonCode';

interface GooglePayButtonProps {
  onPaymentSuccess: (paymentData: PaymentData) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

export default function GooglePayButton({ 
  onPaymentSuccess, 
  onPaymentError, 
  disabled = false 
}: GooglePayButtonProps) {
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { totalPrice } = useCart();
  
  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    const checkGooglePayAvailability = async () => {
      // Wait for Google Pay client to be available
      const waitForGooglePay = () => {
        return new Promise<void>((resolve) => {
          if (window.googlePayClient) {
            resolve();
          } else {
            const checkInterval = setInterval(() => {
              if (window.googlePayClient) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
              clearInterval(checkInterval);
              resolve();
            }, 5000);
          }
        });
      };

      await waitForGooglePay();

      if (!window.googlePayClient) {
        return;
      }

      try {
        const isReadyToPayRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER']
            }
          }]
        };

        const response = await window.googlePayClient.isReadyToPay(isReadyToPayRequest);
        setIsGooglePayReady(response.result);
      } catch (error) {
        console.error('Error checking Google Pay availability:', error);
        setIsGooglePayReady(false);
      }
    };

    checkGooglePayAvailability();
  }, []);

  const handleGooglePayClick = async () => {
    if (!window.googlePayClient || !isGooglePayReady) {
      return;
    }

    setIsLoading(true);

    try {
      const paymentDataRequest: PaymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              'gateway': 'finix',
              'gatewayMerchantId': 'ID12345'
            }
          }
        }],
        merchantInfo: {
          merchantName: 'Finix Store'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: total.toFixed(2),
          currencyCode: 'USD',
          countryCode: 'US'
        }
      };

      const paymentData = await window.googlePayClient.loadPaymentData(paymentDataRequest);
      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Google Pay payment failed:', error);
      onPaymentError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isGooglePayReady) {
    return null;
  }

  return (
    <div className="mt-4" data-inspectable data-component="GooglePayButton" data-code={googlePayButtonCode}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or pay with</span>
        </div>
      </div>
      
      <button
        onClick={handleGooglePayClick}
        disabled={disabled || isLoading}
        className="mt-4 w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        style={{
          background: 'linear-gradient(to right, #4285f4, #34a853, #fbbc05, #ea4335)',
        }}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="white"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="white"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="white"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="white"
              />
            </svg>
            <span>Pay with Google Pay</span>
          </>
        )}
      </button>
    </div>
  );
}
