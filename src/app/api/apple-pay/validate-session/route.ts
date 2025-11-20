import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { validation_url } = body;

    
    if (!validation_url) {
      return NextResponse.json(
        { error: 'Missing validation_url' },
        { status: 400 }
      );
    }

    const headers = {
      'Content-Type': 'application/json',
      'Finix-Version': '2022-02-01',
      'Authorization': `Basic ${Buffer.from('USfdccsr1Z5iVbXDyYt7hjZZ:313636f3-fac2-45a7-bff7-a334b93e7bda').toString('base64')}` // use your API key and secret
    };

    // Create Apple Pay session validation request
    const sessionRequest = {
      display_name: 'Finix Store',
      domain: 'finixsamplestore.com',
      merchant_identity: 'IDjvxGeXBLKH1V9YnWm1CS4n',
      validation_url: validation_url
    };

    const response = await fetch('https://finix.sandbox-payments-api.com/apple_pay_sessions', {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionRequest),
    });

    const data = await response.json();
    return NextResponse.json({ session_details: data.session_details });
  } catch (error) {
    console.error('Apple Pay session validation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Apple Pay session validation failed' },
      { status: 500 }
    );
  }
}

