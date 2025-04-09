import { NextRequest, NextResponse } from 'next/server';


// Types for the request and response
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

interface CheckoutRequest {
  items: CartItem[];
  buyerEmail?: string;
  buyerFirstName?: string;
  buyerLastName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items } = body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:3000' : 'https://finixsamplestore.com';

    // Construct the checkout request
    const checkoutRequest = {
      merchant_id: 'MUmfEGv5bMpSJ9k5TFRUjkmm',
      payment_frequency: 'ONE_TIME',
      is_multiple_use: false,
      allowed_payment_methods: ['PAYMENT_CARD'],
      nickname: 'Finix Store Checkout',
      // set the items to show the customer
      items: items.map(item => ({
        image_details: {
          primary_image_url: item.image,
        },
        description: item.description,
        price_details: {
          sale_amount: Math.round(item.price * 100), // Convert to cents
          currency: 'USD',
        },
        quantity: item.quantity.toString()
      })),
      // set amount details
      amount_details: {
        amount_type: 'FIXED',
        total_amount: Math.round(total * 100), // Convert to cents
        currency: 'USD',
        amount_breakdown: {
          subtotal_amount: Math.round(subtotal * 100),
          shipping_amount: 0,
          estimated_tax_amount: Math.round(tax * 100),
        }
      },
      // set additional experience details and return URLs
      additional_details: {
        collect_name: true,
        collect_email: true,
        collect_phone_number: true,
        collect_billing_address: true,
        collect_shipping_address: true,
        success_return_url: `${baseUrl}/checkout/success?amount=${Math.round(total * 100)}`,
        cart_return_url: `${baseUrl}/cart`,
        expired_session_url: `${baseUrl}/cart`,
        terms_of_service_url: `${baseUrl}/terms`,
        expiration_in_minutes: 60 // 1 hour expiration
      },
      // add your branding here
      branding: {
        brand_color: '#FFF',
        accent_color: '#155dfc',
        logo: 'https://s3-us-west-2.amazonaws.com/payments-dashboard-assets/dashboard.finixpayments.com/finix-logo-v2-black.png',
        icon: 'https://s3-us-west-2.amazonaws.com/payments-dashboard-assets/dashboard.finixpayments.com/finix-logo-v2-black.png',
      },
    };

    // Make request to Finix API
    const response = await fetch('https://finix.sandbox-payments-api.com/checkout_forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from('USfdccsr1Z5iVbXDyYt7hjZZ:313636f3-fac2-45a7-bff7-a334b93e7bda').toString('base64')}` // use your API key and secret
      },
      body: JSON.stringify(checkoutRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout' },
      { status: 500 }
    );
  }
} 