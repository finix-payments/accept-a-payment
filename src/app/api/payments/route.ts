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

    // Validate environment variables
    if (!process.env.FINIX_API_KEY || !process.env.FINIX_API_SECRET || !process.env.FINIX_MERCHANT_ID) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Set up headers for Finix API requests
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${process.env.FINIX_API_KEY}:${process.env.FINIX_API_SECRET}`).toString('base64')}`
    }

    // Create Identity request to Finix API for the Buyer
    const identityResponse = await fetch(`${process.env.FINIX_API_URL}/identities`, {
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
    const paymentInstrumentResponse = await fetch(`${process.env.FINIX_API_URL}/payment_instruments`, {
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
    const response = await fetch(`${process.env.FINIX_API_URL}/transfers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency,
        merchant: process.env.FINIX_MERCHANT_ID, // use your merchant ID
        source: paymentInstrument.id,
        tags: {
          integration_type: 'direct_api'
        }
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