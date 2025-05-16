'use client';

import { useEffect, useRef, useState } from 'react';
import { FinixForm, FormState, BinInformation } from '@/types/global';

export default function PaymentIframe() {
  const finixForm = useRef<FinixForm | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Listen for messages from the parent window (GHL)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // In production, verify origin
      // if (event.origin !== 'https://app.gohighlevel.com') return;
      
      if (event.data && event.data.type === 'payment_initiate_props') {
        console.log('Payment data received from GHL:', event.data);
        setPaymentData(event.data);
      }
    }
    
    window.addEventListener('message', handleMessage);
    
    // Let GHL know the iframe is ready
    window.parent.postMessage({
      type: 'custom_provider_ready',
      loaded: true,
      addCardOnFileSupported: true // Enable "Add Card on File" feature if supported
    }, '*');
    
    console.log('Ready event sent to parent');
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Initialize Finix form
  useEffect(() => {
    const { Finix } = window as any;
    
    if (Finix && !finixForm.current) {
      console.log('Initializing Finix form');
      
      const options = {
        showAddress: true,
        requiredFields: ['address_line1', 'city', 'state', 'postal_code'],
        onUpdate: (state: FormState, binInformation: BinInformation, hasErrors: boolean) => {
          setIsFormValid(!hasErrors);
        },
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
  
  const handleSubmit = async () => {
    if (!paymentData) {
      setError('No payment data received');
      return;
    }
    
    try {
      setError(null);
      setIsProcessing(true);
      
      console.log('Processing payment...');
      
      // Get token from Finix
      const token = await new Promise((resolve, reject) => {
        finixForm.current?.submit("sandbox", "APc9vhYcPsRuTSpKD9KpMtPe", function (err: any, res: any) {
          if (err) {
            console.error('Tokenization error:', err);
            reject(err);
          } else {
            console.log('Tokenization successful:', res.data.id);
            resolve(res.data.id);
          }
        });
      });
      
      // Process payment with token
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          amount: paymentData.amount,
          currency: paymentData.currency,
          orderId: paymentData.orderId,
          transactionId: paymentData.transactionId,
          contact: paymentData.contact
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment processing failed');
      }
      
      const data = await response.json();
      console.log('Payment successful:', data);
      
      // Notify GHL of successful payment
      window.parent.postMessage({
        type: 'custom_element_success_response',
        chargeId: data.id
      }, '*');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      
      // Notify GHL of payment failure
      window.parent.postMessage({
        type: 'custom_element_error_response',
        error: {
          description: err instanceof Error ? err.message : 'Payment processing failed'
        }
      }, '*');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = () => {
    // Notify GHL that user canceled the payment
    window.parent.postMessage({
      type: 'custom_element_close_response'
    }, '*');
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Figures Payments</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {paymentData ? (
        <div className="mb-6">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Amount:</span>
            <span className="text-gray-900 font-medium">${parseFloat(paymentData.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Currency:</span>
            <span className="text-gray-900">{paymentData.currency}</span>
          </div>
          {paymentData.contact && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Customer:</span>
              <span className="text-gray-900">{paymentData.contact.name}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600">Waiting for payment data...</p>
        </div>
      )}
      
      <div id="payment-form" className="mb-6"></div>
      
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !isFormValid || !paymentData}
          className={`flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isProcessing || !isFormValid || !paymentData ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Pay Now'
          )}
        </button>
        
        <button
          onClick={handleCancel}
          className="py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>Secured by My Figures Payments</p>
        <p>Powered by Finix</p>
      </div>
    </div>
  );
} 