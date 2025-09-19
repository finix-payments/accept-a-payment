export const applePayButtonCode = `'use client';

import React from 'react';
import './ApplePayButton.scss';
import { useCart } from '@/app/context/CartContext';

interface ApplePayProps {
  merchant_id: string;
  merchant_identity: string;
  recurringType?: string;
  originalTransferId?: string;
  reuseInstrumentId?: string;
  onPaymentSuccess?: (transferId: string) => void;
  onPaymentError?: (error: string) => void;
}

const ApplePayButton: React.FC<ApplePayProps> = ({
  merchant_id,
  merchant_identity,
  recurringType,
  originalTransferId,
  reuseInstrumentId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const { totalPrice } = useCart();
  
  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const totalString = \`$\${total.toFixed(2)}\`;

  const processPayment = async ({ session, token }) => {
    const sessionKey = window.FinixAuth?.getSessionKey?.() || '';

    const request = {
      type: 'APPLE_PAY',
      third_party_token: token,
      amount: totalString.substring(1),
      merchant: merchant_id,
      merchant_identity,
      fraud_session_id: sessionKey,
      recurring_type: recurringType,
      original_transfer_id: originalTransferId,
      reuse_instrument_id: reuseInstrumentId
    };

    try {
      const response = await fetch('/api/payment/APPLE_PAY', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const { id, message } = await response.json();

      if (id) {
        session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        onPaymentSuccess?.(id);
      } else {
        session.completePayment(window.ApplePaySession.STATUS_FAILURE);
        onPaymentError?.(message || 'Payment failed');
      }
    } catch (error) {
      console.log('error', error);
      session.completePayment(window.ApplePaySession.STATUS_FAILURE);
      onPaymentError?.('Payment processing failed');
    }
  };

  const startApplePaySession = async () => {
    if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
      console.log('Apple Pay is not available');
      return;
    }

    const request = {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      merchantCapabilities: ['supports3DS'],
      total: { label: 'Finix Store', amount: totalString.substring(1) },
    };

    const session = new window.ApplePaySession(3, request);
    session.begin();

    // Handle merchant validation and payment authorization
    session.onvalidatemerchant = async (event) => {
      const response = await fetch('/api/apple_pay_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validation_url: event.validationURL,
          merchant_identity: merchant_identity,
          domain: window.location.hostname,
          display_name: 'Finix Store',
        }),
      });

      const { session_details } = await response.json();
      session.completeMerchantValidation(JSON.parse(session_details));
    };

    session.onpaymentauthorized = (event) => {
      const token = JSON.stringify(event.payment);
      processPayment({ session, token });
    };
  };

  if (typeof window !== 'undefined' && 
      (!window.ApplePaySession || !window.ApplePaySession.canMakePayments())) {
    return null;
  }

  return (
    <div
      className="w-full"
      data-inspectable
      data-component="ApplePay"
      data-code={applePayButtonCode}
    >
      <apple-pay-button
        buttonstyle="black"
        type="buy"
        locale="en-US"
        onclick={startApplePaySession}
      />
    </div>
  );
};

export default ApplePayButton;`;
