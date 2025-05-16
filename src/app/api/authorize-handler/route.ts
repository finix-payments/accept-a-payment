import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth handler for GoHighLevel marketplace app installation
 * 
 * This endpoint is called when a user installs your app from the GHL marketplace.
 * It exchanges the temporary authorization code for an access token.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const locationId = url.searchParams.get('locationId') || '';
    
    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }
    
    console.log(`Authorization code received: ${code} for location: ${locationId}`);
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://services.leadconnectorhq.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GHL_APP_CLIENT_ID,
        client_secret: process.env.GHL_APP_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(error.message || 'Failed to get access token');
    }
    
    const tokenData = await tokenResponse.json();
    
    // Store token data securely - in a production app, you would save this to a database
    console.log('Access token received:', tokenData.access_token);
    console.log('Refresh token received:', tokenData.refresh_token);
    
    // Create payment provider configuration in GHL if locationId is available
    if (locationId) {
      await createPaymentProviderConfig(locationId, tokenData.access_token);
    } else {
      console.warn('No locationId provided, skipping payment provider configuration');
    }
    
    // Redirect to management UI
    return NextResponse.redirect(new URL('/management', request.url));
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authorization failed' },
      { status: 500 }
    );
  }
}

/**
 * Create payment provider configuration in GHL
 */
async function createPaymentProviderConfig(locationId: string, accessToken: string) {
  try {
    const response = await fetch('https://services.leadconnectorhq.com/payments/custom-provider/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name: 'My Figures Payments',
        description: 'White-label payment processing powered by Finix',
        imageUrl: 'https://your-domain.com/logo.png', // Replace with your logo URL
        locationId,
        queryUrl: `${process.env.APP_URL}/api/query`,
        paymentsUrl: `${process.env.APP_URL}/payment-iframe`
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment provider configuration');
    }
    
    console.log('Payment provider configuration created successfully');
    return await response.json();
  } catch (error) {
    console.error('Error creating payment provider configuration:', error);
    throw error;
  }
} 