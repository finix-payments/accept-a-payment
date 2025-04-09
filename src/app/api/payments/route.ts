import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, amount, currency = 'USD' } = body;

    // Validate required fields
    if (!token || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Set up headers for Finix API requests
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from('USfdccsr1Z5iVbXDyYt7hjZZ:313636f3-fac2-45a7-bff7-a334b93e7bda').toString('base64')}` // use your API key and secret
    }

    // Create Identity request to Finix API for the Buyer
    const identityResponse = await fetch('https://finix.sandbox-payments-api.com/identities', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        entity: {}, // Add entity details if needed
      }),
    });

    if (!identityResponse.ok) {
      const error = await identityResponse.json();
      throw new Error(error.message || 'Identity creation failed');
    }

    const identity = await identityResponse.json();

    // Claim the token by creating a Payment Instrument request to Finix API
    const paymentInstrumentResponse = await fetch('https://finix.sandbox-payments-api.com/payment_instruments', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        token,
        type: 'TOKEN',
        identity: identity.id,
      }),
    });

    if (!paymentInstrumentResponse.ok) {
      const error = await paymentInstrumentResponse.json();
      throw new Error(error.message || 'Payment instrument creation failed');
    }

    const paymentInstrument = await paymentInstrumentResponse.json();

    // Create payment request to Finix API
    const response = await fetch('https://finix.sandbox-payments-api.com/transfers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency,
        merchant: 'MUmfEGv5bMpSJ9k5TFRUjkmm', // use your merchant ID
        source: paymentInstrument.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transfer creation failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  }
} 