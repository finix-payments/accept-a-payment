'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import type { ApplePayPaymentRequest } from '@/types/global';

interface ApplePayButtonProps {
  onPaymentSuccess: (transferId: string, amount: number) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

export default function ApplePayButton({ 
  onPaymentSuccess, 
  onPaymentError,
  disabled = false
}: ApplePayButtonProps) {
  const { totalPrice } = useCart();
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  
  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;


  useEffect(() => {
    if (window.ApplePaySession) {
      setIsApplePayAvailable(window.ApplePaySession.canMakePayments());
    }
  }, []);

  const createAndStartApplePaySession = useCallback(() => {
    if (!window.ApplePaySession) {
      onPaymentError(new Error('Apple Pay is not available'));
      return;
    }

    if (!window.ApplePaySession.canMakePayments()) {
      onPaymentError(new Error('Apple Pay is not available on this device'));
      return;
    }

    const paymentRequest: ApplePayPaymentRequest = {
      countryCode: 'US',
      currencyCode: 'USD',
      merchantCapabilities: ['supports3DS'],
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      total: {
        label: 'Finix Store',
        amount: total.toFixed(2)
      },
      requiredBillingContactFields: ['postalAddress']
    };

    const applyPaySession = new window.ApplePaySession(6, paymentRequest);

    // Handle merchant validation
    applyPaySession.onvalidatemerchant = async (event) => {
      try {
        const validationURL = event.validationURL;

        if (!validationURL) {
          onPaymentError(new Error('Merchant validation failed'));
          return;
        }

        const response = await fetch('/api/apple-pay/validate-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            validation_url: validationURL
          }),
        });

        const data = await response.json();
        const merchantSession = JSON.parse(data.session_details);
        applyPaySession.completeMerchantValidation(merchantSession);
      } catch (err) {
        console.error('err:', err);
        onPaymentError(err instanceof Error ? err : new Error('Merchant validation failed'));
      }
    };

    // Handle payment authorization
    applyPaySession.onpaymentauthorized = async (event) => {
      try {
        const payment = event.payment;
        const paymentToken = payment.token;

        if (!paymentToken || !window.ApplePaySession) {
          if (window.ApplePaySession) {
            applyPaySession.completePayment(window.ApplePaySession.STATUS_FAILURE);
          }
          onPaymentError(new Error('Payment token is null'));
          return;
        }

        const billingContact = payment.billingContact;

        const addressData: Record<string, string> = billingContact ? {
          ...(billingContact.countryCode && { country: billingContact.countryCode }),
          ...(billingContact.postalCode && { postal_code: billingContact.postalCode }),
          ...(billingContact.addressLines && billingContact.addressLines.length > 0 && { 
            line1: billingContact.addressLines[0] 
          }),
          ...(billingContact.addressLines && billingContact.addressLines.length > 1 && { 
            line2: billingContact.addressLines[1] 
          }),
          ...(billingContact.locality && { city: billingContact.locality }),
          ...(billingContact.administrativeArea && { region: billingContact.administrativeArea }),
        } : {};

        const name = billingContact
          ? `${billingContact.givenName || ''} ${billingContact.familyName || ''}`.trim()
          : '';

        const stringifiedPaymentToken = JSON.stringify({
          token: paymentToken
        });


        const response = await fetch('/api/apple-pay/process-payment', {
          
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentToken: stringifiedPaymentToken,
            addressData: addressData,
            name: name || undefined,
            amount: Math.round(total * 100),
            currency: 'USD'
          }),
        });

        const transferData = await response.json();
        
        applyPaySession.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        
        
        onPaymentSuccess(transferData.id, Math.round(total * 100));
      } catch (err) {
        console.error('Payment processing error:', err);
        if (window.ApplePaySession) {
          applyPaySession.completePayment(window.ApplePaySession.STATUS_FAILURE);
        }
        onPaymentError(err instanceof Error ? err : new Error('Payment processing failed'));
      }
    };

    applyPaySession.oncancel = () => {
      onPaymentError(new Error('Payment cancelled by user'));
    };

    applyPaySession.begin();
  }, [total, onPaymentSuccess, onPaymentError]);

  if (!isApplePayAvailable) {
    return null;
  }

  return (
    <div className="w-full">
      <button
        className="apple-pay-button border border-gray-300 hover:bg-blue-700"
        onClick={createAndStartApplePaySession}
        disabled={disabled}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '500',
          backgroundColor: 'black',
          fontSize: '14px',
          borderRadius: '4px',
          width: '100%',
          minHeight: '40px',
          border: '1px solid #dadce0',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        }}
        aria-label="Buy with Apple Pay"
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <svg
          id="svg-logo" 
          className="logo" 
          viewBox="0 0 30 35" 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ 
            display: 'inline-block',
            height: '18px',
            width: 'auto',
            marginRight: '8px'
          }}
        >
          <title>Apple Logo</title>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g fill="currentColor">
              <path d="M19.4028,5.5674 C20.6008,4.0684 21.4138,2.0564 21.1998,0.0004 C19.4458,0.0874 17.3058,1.1574 16.0668,2.6564 C14.9538,3.9414 13.9688,6.0374 14.2258,8.0074 C16.1948,8.1784 18.1618,7.0244 19.4028,5.5674"></path>
              <path d="M21.1772,8.3926 C18.3182,8.2226 15.8872,10.0156 14.5212,10.0156 C13.1552,10.0156 11.0642,8.4786 8.8022,8.5196 C5.8592,8.5626 3.1282,10.2276 1.6342,12.8746 C-1.4378,18.1696 0.8232,26.0246 3.8112,30.3376 C5.2622,32.4716 7.0102,34.8206 9.3142,34.7366 C11.4912,34.6506 12.3442,33.3266 14.9902,33.3266 C17.6352,33.3266 18.4042,34.7366 20.7082,34.6936 C23.0972,34.6506 24.5922,32.5586 26.0422,30.4226 C27.7072,27.9906 28.3882,25.6426 28.4312,25.5126 C28.3882,25.4706 23.8232,23.7186 23.7812,18.4676 C23.7382,14.0706 27.3652,11.9786 27.5362,11.8496 C25.4882,8.8196 22.2872,8.4786 21.1772,8.3926"></path>
            </g>
          </g>
        </svg>
        <span>Pay</span>
      </button>
    </div>
  );
}

