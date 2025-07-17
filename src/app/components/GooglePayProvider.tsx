'use client';

import { useEffect } from 'react';

export default function GooglePayProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeGooglePay = () => {
      if (typeof window !== 'undefined' && window.google?.payments?.api?.PaymentsClient) {
        window.googlePayClient = new window.google.payments.api.PaymentsClient({
          environment: "TEST"
        });
      }
    };

    // Check if Google Pay is already loaded
    if (window.google?.payments?.api?.PaymentsClient) {
      initializeGooglePay();
    } else {
      // Listen for the script to load
      const checkGooglePay = setInterval(() => {
        if (window.google?.payments?.api?.PaymentsClient) {
          initializeGooglePay();
          clearInterval(checkGooglePay);
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkGooglePay);
      }, 10000);

      return () => clearInterval(checkGooglePay);
    }
  }, []);

  return <>{children}</>;
}
