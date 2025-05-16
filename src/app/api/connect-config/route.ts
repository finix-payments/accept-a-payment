import { NextRequest, NextResponse } from 'next/server';

/**
 * Connect config endpoint for updating payment provider configuration in GHL
 * 
 * This endpoint updates the payment provider configuration in GHL when:
 * - A merchant updates their API credentials
 * - A merchant toggles between test and live mode
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, apiKey, publishableKey, locationId, accessToken } = body;
    
    if (!mode || !apiKey || !publishableKey || !locationId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log(`Updating ${mode} mode configuration for location: ${locationId}`);
    
    // Call GHL API to update payment provider configuration
    const response = await fetch('https://services.leadconnectorhq.com/payments/custom-provider/connect-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        type: mode, // 'test' or 'live'
        locationId,
        apiKey,
        publishableKey
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update ${mode} mode configuration`);
    }
    
    const data = await response.json();
    console.log(`${mode} mode configuration updated successfully:`, data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Connect config error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Configuration update failed' },
      { status: 500 }
    );
  }
}

/**
 * Set default payment provider endpoint
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { locationId, accessToken } = body;
    
    if (!locationId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log(`Setting My Figures Payments as default for location: ${locationId}`);
    
    // Call GHL API to set default payment provider
    const response = await fetch('https://services.leadconnectorhq.com/payments/custom-provider/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        locationId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set as default payment provider');
    }
    
    const data = await response.json();
    console.log('Set as default payment provider successfully:', data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Set default error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Set default failed' },
      { status: 500 }
    );
  }
} 