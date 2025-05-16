import { NextRequest, NextResponse } from 'next/server';

/**
 * Query endpoint for GoHighLevel payment operations
 * 
 * This endpoint handles various payment-related operations requested by GHL:
 * - verify: Verify if a payment was successful
 * - refund: Process a refund
 * - list_payment_methods: List saved payment methods for a customer
 * - charge_payment: Charge a saved payment method
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, apiKey, ...data } = body;
    
    console.log(`Processing ${type} request:`, data);
    
    // Verify API key - in production, you would validate this against stored keys
    // if (apiKey !== process.env.MY_FIGURES_API_KEY) {
    //   return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    // }
    
    switch (type) {
      case 'verify':
        return await handleVerify(data);
      case 'refund':
        return await handleRefund(data);
      case 'list_payment_methods':
        return await handleListPaymentMethods(data);
      case 'charge_payment':
        return await handleChargePayment(data);
      default:
        return NextResponse.json({ error: 'Invalid query type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Query processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Verify if a payment was successful
 */
async function handleVerify({ transactionId, chargeId, subscriptionId }: any) {
  try {
    // In a production app, you would verify the payment with Finix
    // Example:
    // const response = await fetch(`https://finix.sandbox-payments-api.com/transfers/${chargeId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Basic ${Buffer.from(`${process.env.FINIX_API_KEY}:${process.env.FINIX_API_SECRET}`).toString('base64')}`
    //   }
    // });
    // const paymentData = await response.json();
    // 
    // if (paymentData.state === 'SUCCEEDED') {
    //   return NextResponse.json({ success: true });
    // } else {
    //   return NextResponse.json({ success: false });
    // }
    
    // For testing, we'll assume the payment was successful
    console.log(`Verifying payment for transaction: ${transactionId}, charge: ${chargeId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ success: false });
  }
}

/**
 * Process a refund
 */
async function handleRefund({ transactionId, amount }: any) {
  try {
    // In a production app, you would process the refund with Finix
    // Example:
    // const response = await fetch('https://finix.sandbox-payments-api.com/transfers', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Basic ${Buffer.from(`${process.env.FINIX_API_KEY}:${process.env.FINIX_API_SECRET}`).toString('base64')}`
    //   },
    //   body: JSON.stringify({
    //     amount: Math.round(parseFloat(amount) * 100),
    //     currency: 'USD',
    //     source: 'MERCHANT_ID',
    //     destination: 'PAYMENT_INSTRUMENT_ID',
    //     refund_of: transactionId
    //   })
    // });
    // const refundData = await response.json();
    
    console.log(`Processing refund for transaction: ${transactionId}, amount: ${amount}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json({ success: false });
  }
}

/**
 * List saved payment methods for a customer
 */
async function handleListPaymentMethods({ contactId, locationId }: any) {
  try {
    // In a production app, you would fetch payment methods from Finix
    // For testing, we'll return a mock payment method
    console.log(`Listing payment methods for contact: ${contactId}, location: ${locationId}`);
    
    return NextResponse.json([
      {
        id: 'pm_test123456789',
        type: 'card',
        title: 'Visa',
        subTitle: '•••• 4242',
        expiry: '12/25',
        customerId: `customer_${contactId}`,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png'
      }
    ]);
  } catch (error) {
    console.error('List payment methods error:', error);
    return NextResponse.json([]);
  }
}

/**
 * Charge a saved payment method
 */
async function handleChargePayment({ paymentMethodId, contactId, transactionId, amount, currency, chargeDescription }: any) {
  try {
    // In a production app, you would process the charge with Finix
    // For testing, we'll assume the charge was successful
    console.log(`Charging payment method: ${paymentMethodId} for contact: ${contactId}, amount: ${amount}, currency: ${currency}`);
    
    return NextResponse.json({
      success: true,
      chargeId: `ch_${Date.now()}`,
      message: 'Payment successful',
      chargeSnapshot: {
        id: `ch_${Date.now()}`,
        status: 'succeeded',
        amount: parseFloat(amount),
        chargeId: `ch_${Date.now()}`,
        chargedAt: Math.floor(Date.now() / 1000)
      }
    });
  } catch (error) {
    console.error('Charge payment error:', error);
    return NextResponse.json({
      success: false,
      failed: true,
      message: error instanceof Error ? error.message : 'Charge processing failed'
    });
  }
} 