import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Finix Example E-commerce Application

> A sample e-commerce application with Finix's payment integration using Checkout Form and Tokenization Form implementation examples.

## Purpose
To provide developers with a working example of integrating Finix payment solutions in a modern e-commerce application.

## Technologies
- Next.js 14
- TypeScript
- Finix Checkout Forms
- Finix Tokenization Forms
- Tailwind CSS

## Main Features
- Product catalog browsing and management
- Shopping cart functionality
- Secure payment processing
- Payment method tokenization
- Responsive mobile-first design
- Dark mode support
- Code inspector for easy code exploration

## Routes and Navigation
### /
- **Description**: Homepage with introduction to Finix Checkout Forms and Tokenization Forms payment acceptance capabilities. 
- **Purpose**: Entry point showcasing Finix payment integration capabilities

### /products
- **Description**: Product catalog listing
- **Purpose**: Browse and select products for purchase

### /cart
- **Description**: Shopping cart management
- **Purpose**: Review and modify selected items before checkout

### /checkout/tokenization
- **Description**: Checkout example using Finix Tokenization Form
- **Purpose**: Demonstrate secure card tokenization using Finix Tokenization Form

### /checkout/hosted
- **Description**: Checkout example using Finix hosted Checkout Forms
- **Purpose**: Demonstrate Finix hosted checkout solution

## Code Examples
### Checkout page with Finix Tokenization Form
- **Description**: Example checkout page experience using Finix Tokenization Form
- **Location**: \`src/app/checkout/tokenization/page.tsx\`

### Payment Form react component code
- **Description**: React component example for Finix Tokenization Form
- **Location**: \`src/app/components/PaymentForm.tsx\`

## Integration Examples
- [Tokenization Form](/checkout/tokenization) - Example of secure payment method tokenization with Next.js
- [Hosted Checkout](/checkout/hosted) - Example of Finix hosted checkout integration
- [Cart Implementation](/cart) - Example of shopping cart functionality

## Resources and Documentation
- [Finix Tokenization Forms Documentation](https://finix.com/docs/guides/payments/online-payments/payment-details/token-forms) - Tokenization Form integration guide
- [Finix Checkout Pages Documentation](https://finix.com/docs/guides/payments/modify/checkout-forms) - Hosted Checkout integration guide
- [Finix Making A Payment Documentatation](https://finix.com/docs/guides/payments/online-payments/getting-started/finix-api/making-a-payment-api) - Making a payment with Finix API
- [Finix Developer Quickstart Guide](https://finix.com/docs/guides/getting-started/integration-overview/) - Finix developer integration quickstart overview
- [Finix Documentation](https://finix.com/docs) - Official Finix API documentation

## Repository
https://github.com/finix-payments/accept-a-payment/

---
> This is a test web application demonstrating Finix's payment integration solutions.
> Do not use real card information. For testing, use card number: 4111 1111 1111 1111`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'X-Robots-Tag': 'llms-txt'
    },
  });
}