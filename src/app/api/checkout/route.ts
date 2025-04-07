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

    // Construct the checkout request
    const checkoutRequest = {
      merchant_id: process.env.FINIX_MERCHANT_ID,
      payment_frequency: "ONE_TIME",
      is_multiple_use: false,
      allowed_payment_methods: ["PAYMENT_CARD"],
      nickname: "Finix Store Checkout",
      // set the items to show the customer
      items: items.map(item => ({
        image_details: {
          primary_image_url: item.image,
        },
        description: item.description,
        price_details: {
          sale_amount: Math.round(item.price * 100), // Convert to cents
          currency: "USD",
        },
        quantity: item.quantity.toString()
      })),
      // set amount details
      amount_details: {
        amount_type: "FIXED",
        total_amount: Math.round(total * 100), // Convert to cents
        currency: "USD",
        amount_breakdown: {
          subtotal_amount: Math.round(subtotal * 100),
          shipping_amount: 0,
          estimated_tax_amount: Math.round(tax * 100),
          discount_amount: "0",
          tip_amount: "0"
        }
      },
      // set additional experience details and return URLs
      additional_details: {
        collect_name: true,
        collect_email: true,
        collect_phone_number: true,
        collect_billing_address: true,
        collect_shipping_address: true,
        success_return_url: `${process.env.PUBLIC_BASE_URL}/checkout/success?amount=${Math.round(total * 100)}`,
        cart_return_url: `${process.env.PUBLIC_BASE_URL}/cart`,
        expired_session_url: `${process.env.PUBLIC_BASE_URL}/cart`,
        terms_of_service_url: `${process.env.PUBLIC_BASE_URL}/terms`,
        expiration_in_minutes: 60 // 1 hour expiration
      },
      // add your branding here
      branding: {
        brand_color: "#fbe5d0",
        accent_color: "#ff4838",
        logo: "https://s3.amazonaws.com/customer-uploaded-assets-prod/04-12-2023-05_13_37_ACME_logo-01%20%281%29.png",
        icon: "https://s3.amazonaws.com/customer-uploaded-assets-prod/04-12-2023-05_13_37_ACME_logo-01%20%281%29.png"
      },
    };

    // Make request to Finix API
    const response = await fetch(`${process.env.FINIX_API_URL}/checkout_forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.FINIX_API_KEY}:${process.env.FINIX_API_SECRET}`).toString('base64')}`
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