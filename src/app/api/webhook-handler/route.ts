import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook handler for GoHighLevel events
 * 
 * This endpoint receives webhook events from GoHighLevel:
 * - App installation/uninstallation events
 * - payment.captured
 * - subscription.trialing
 * - subscription.active
 * - subscription.updated
 * - subscription.charged
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook received:', body);
    
    // Handle different webhook event types
    switch (body.event) {
      case 'app.installed':
        return handleAppInstalled(body);
      case 'app.uninstalled':
        return handleAppUninstalled(body);
      case 'payment.captured':
        return handlePaymentCaptured(body);
      case 'subscription.trialing':
      case 'subscription.active':
      case 'subscription.updated':
      case 'subscription.charged':
        return handleSubscriptionEvent(body);
      default:
        return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle app installation webhook
 */
async function handleAppInstalled(data: any) {
  // Store installation details in database
  console.log('App installed:', data);
  return NextResponse.json({ success: true });
}

/**
 * Handle app uninstallation webhook
 */
async function handleAppUninstalled(data: any) {
  // Remove installation details from database
  console.log('App uninstalled:', data);
  return NextResponse.json({ success: true });
}

/**
 * Handle payment captured webhook
 */
async function handlePaymentCaptured(data: any) {
  const { chargeId, ghlTransactionId, chargeSnapshot, locationId, apiKey } = data;
  
  // Process the payment capture event
  console.log('Payment captured:', {
    chargeId,
    ghlTransactionId,
    chargeStatus: chargeSnapshot?.status,
    amount: chargeSnapshot?.amount,
    locationId
  });
  
  // In a production app, you would update your database with payment status
  
  return NextResponse.json({ success: true });
}

/**
 * Handle subscription events webhook
 */
async function handleSubscriptionEvent(data: any) {
  const { event, ghlSubscriptionId, subscriptionSnapshot, locationId } = data;
  
  // Process the subscription event
  console.log('Subscription event:', {
    event,
    ghlSubscriptionId,
    subscriptionStatus: subscriptionSnapshot?.status,
    locationId
  });
  
  // In a production app, you would update your database with subscription status
  
  return NextResponse.json({ success: true });
} 