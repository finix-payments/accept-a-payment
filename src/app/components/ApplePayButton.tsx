'use client';

import React from 'react';
import './ApplePayButton.css';
import { useCart } from '@/app/context/CartContext';
import { applePayButtonCode } from './inspector/code/ApplePayButtonCode';

interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  total: {
    label: string;
    amount: string;
  };
}

interface ApplePaySessionStatic {
  new (version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySession;
  canMakePayments(): boolean;
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
}

interface ApplePaySession {
  begin(): void;
  completePayment(status: number): void;
  completeMerchantValidation(merchantSession: unknown): void;
  onvalidatemerchant: ((event: ApplePayValidateMerchantEvent) => void) | null;
  onpaymentauthorized: ((event: ApplePayPaymentAuthorizedEvent) => void) | null;
}

interface ApplePayValidateMerchantEvent {
  validationURL: string;
}

interface ApplePayPaymentAuthorizedEvent {
  payment: unknown;
}

declare global {
  interface Window {
    ApplePaySession: ApplePaySessionStatic;
    FinixAuth: {
      getSessionKey: () => string;
    };
  }
}

interface ApplePayProps {
  merchant_id: string;
  merchant_identity: string;
  recurringType?: string;
  originalTransferId?: string;
  reuseInstrumentId?: string;
  onPaymentSuccess?: (transferId: string) => void;
  onPaymentError?: (error: string) => void;
}

const ApplePay: React.FC<ApplePayProps> = ({
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
  const totalString = `$${total.toFixed(2)}`;

  const processPayment = async ({ session, token }: { session: ApplePaySession; token: string }) => {
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
      const response = await fetch(`https://finix.sandbox-payments-api.com/payment/APPLE_PAY`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const { id, message } = await response.json();

      if (id) {
        session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        if (onPaymentSuccess) {
          onPaymentSuccess(id);
        } else {
          window.location.href = `/checkout/success?transferId=${id}&amount=${Math.round(total * 100)}`;
        }
      } else {
        session.completePayment(window.ApplePaySession.STATUS_FAILURE);
        
        if (onPaymentError) {
          onPaymentError(message || 'Payment failed');
        } else {
          if (message) {
            window.location.href = `/error?error=${message}`;
          } else {
            window.location.href = `/error`;
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      session.completePayment(window.ApplePaySession.STATUS_FAILURE);
      
      if (onPaymentError) {
        onPaymentError('Payment processing failed');
      } else {
        window.location.href = `/error`;
      }
    }
  };

  const handleValidateApplePaySession = async (session: ApplePaySession) => {
    session.onvalidatemerchant = async (event: ApplePayValidateMerchantEvent) => {
      const { validationURL } = event;

      const request = {
        validation_url: validationURL,
        merchant_identity: merchant_identity,
        domain: window.location.hostname,
        display_name: 'Finix Store',
      };

      const response = await fetch(`https://finix.sandbox-payments-api.com/apple_pay_sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const { session_details: sessionDetails } = await response.json();
      const normalizedSessionDetails = JSON.parse(sessionDetails);

      session.completeMerchantValidation(normalizedSessionDetails);
    };
  };

  const handleOnPaymentAuthorized = (session: ApplePaySession) => {
    session.onpaymentauthorized = (event: ApplePayPaymentAuthorizedEvent) => {
      const { payment: paymentToken } = event;
      const token = JSON.stringify(paymentToken);

      processPayment({ session, token });
    };
  };

  const handleValidateSessionAndPaymentAuthorization = async (session: ApplePaySession) => {
    await handleValidateApplePaySession(session);
    handleOnPaymentAuthorized(session);
  };

  const startApplePaySession = async () => {
    // Check if Apple Pay is available
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

    handleValidateSessionAndPaymentAuthorization(session);
  };

  // Don't render if Apple Pay is not supported
  if (typeof window !== 'undefined' && (!window.ApplePaySession || !window.ApplePaySession.canMakePayments())) {
    return null;
  }

  return (
    <div
      className="w-full"
      data-inspectable
      data-component="ApplePay"
      data-code={applePayButtonCode}
    >
      {/* @ts-expect-error Apple Pay custom element not in TypeScript definitions */}
      <apple-pay-button
        buttonstyle="black"
        type="buy"
        locale="en-US"
        onclick={startApplePaySession}
      />
    </div>
  );
};

export default ApplePay;
