import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paymentToken, 
      addressData, 
      name, 
      amount, 
      currency = 'USD' 
    } = body;

    if (!paymentToken || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const headers = {
      'Content-Type': 'application/json',
      'Finix-Version': '2022-02-01',
      'Authorization': `Basic ${Buffer.from('USfdccsr1Z5iVbXDyYt7hjZZ:313636f3-fac2-45a7-bff7-a334b93e7bda').toString('base64')}` // use your API key and secret
    };

    // Create Identity
    const identityResponse = await fetch('https://finix.sandbox-payments-api.com/identities', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        entity: {
          phone: '7145677613',
          first_name: 'John',
          last_name: 'Smith',
          email: 'finix_example@finix.com',
          personal_address: {
            city: 'San Mateo',
            country: 'USA',
            region: 'CA',
            line2: 'Apartment 7',
            line1: '741 Douglass St',
            postal_code: '94114'
          }
        },
        identity_roles: [
          'BUYER'
        ],
        tags: {
          key: 'value'
        },
        type: 'PERSONAL'
      }),
    });

    const identity = await identityResponse.json();

    const finixAddress: Record<string, string> = {};
    
    if (addressData) {
      if (addressData.line1) finixAddress.line1 = addressData.line1;
      if (addressData.line2) finixAddress.line2 = addressData.line2;
      if (addressData.city) finixAddress.city = addressData.city;
      if (addressData.region) finixAddress.region = addressData.region;
      if (addressData.postal_code) finixAddress.postal_code = addressData.postal_code;
      if (addressData.country) finixAddress.country = addressData.country;
    }

    const paymentInstrumentBody: Record<string, unknown> = {
      third_party_token: paymentToken,
      type: 'APPLE_PAY',
      identity: identity.id,
      merchant_identity: 'IDjvxGeXBLKH1V9YnWm1CS4n',
    };

    if (name) {
      paymentInstrumentBody.name = name;
    }

    if (Object.keys(finixAddress).length > 0) {
      paymentInstrumentBody.address = finixAddress;
    }

    // Create Payment Instrument
    const paymentInstrumentResponse = await fetch('https://finix.sandbox-payments-api.com/payment_instruments', {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentInstrumentBody),
    });

    const paymentInstrument = await paymentInstrumentResponse.json();

    // Create Transfer
    const transferResponse = await fetch('https://finix.sandbox-payments-api.com/transfers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: Math.round(parseFloat(amount)),
        currency,
        merchant: 'MUvWVhLpLj9w7kV1EXA7yvzc',
        source: paymentInstrument.id,
      }),
    });

    const transferData = await transferResponse.json();
    return NextResponse.json(transferData);
  } catch (error) {
    console.error('Apple Pay payment processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  }
}
