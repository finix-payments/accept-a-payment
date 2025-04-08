import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Finix Example E-commerce Application

> A demonstration e-commerce application showcasing Finix's payment integration capabilities through practical implementation examples.

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

## Routes and Navigation
### /
- **Description**: Homepage with featured products
- **Purpose**: Entry point showcasing available products

### /products
- **Description**: Product catalog listing
- **Purpose**: Browse and select products for purchase

### /cart
- **Description**: Shopping cart management
- **Purpose**: Review and modify selected items before checkout

### /checkout/tokenization
- **Description**: Payment method tokenization example
- **Purpose**: Demonstrate secure card tokenization for future use

### /checkout/hosted
- **Description**: Hosted checkout integration
- **Purpose**: Showcase Finix's hosted checkout solution

## Code Examples
### Payment Tokenization
- **Description**: Example implementation of Finix's Tokenization Form
- **Location**: \`src/app/checkout/tokenization/page.tsx\`

### Shopping Cart
- **Description**: Context-based cart management system
- **Location**: \`src/app/context/CartContext.tsx\`

### Payment Processing
- **Description**: Integration with Finix payment API
- **Location**: \`src/app/components/PaymentForm.tsx\`

## Integration Examples
- [Tokenization Form](/checkout/tokenization) - Example of secure payment method tokenization
- [Hosted Checkout](/checkout/hosted) - Example of Finix's hosted checkout integration
- [Cart Implementation](/cart) - Example of shopping cart functionality

## Resources and Documentation
- [Finix Documentation](https://finix.com/docs) - Official Finix API documentation
- [Support](https://support.finix.com) - Get help with your integration

## Repository
https://github.com/your-repo/accept-a-payment

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