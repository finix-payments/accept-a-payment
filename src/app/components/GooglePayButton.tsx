'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
}: GooglePayButtonProps) {
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { totalPrice } = useCart();
  
  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const onGooglePaymentsButtonClicked = useCallback(async () => {
    if (!window.googlePayClient || !isGooglePayReady) {
      return;
    }

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
    }
  }, [total, isGooglePayReady, onPaymentSuccess, onPaymentError]);

  useEffect(() => {
    const initializeGooglePay = async () => {
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

      const clientConfiguration = {
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
      
      window.googlePayClient.isReadyToPay(clientConfiguration).then(function (response) {
        if (response.result) {
          setIsGooglePayReady(true);
        }
      }).catch(function (err) {
        console.error('Google Pay initialization error:', err);
      });
    };

    initializeGooglePay();
  }, []);

  useEffect(() => {
    if (isGooglePayReady && containerRef.current && window.googlePayClient) {
      const button = window.googlePayClient.createButton({ onClick: onGooglePaymentsButtonClicked });
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(button);
    }
  }, [isGooglePayReady, onGooglePaymentsButtonClicked]);

  if (!isGooglePayReady) {
    return null;
  }

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
      
      {/* Official Google Pay button will be rendered here */}
      <div ref={containerRef} className="mt-4 w-full" />
    </div>
  );
}
