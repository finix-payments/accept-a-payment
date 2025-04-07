# Finix Payment Integration Example

This is an example e-commerce application that demonstrates how to integrate Finix Payments into a Next.js web application. The example shows two different methods of accepting payments:

1. Finix Hosted Checkout - Redirects customers to a secure Finix-hosted checkout page
2. Finix Tokenization Form - Embeds the Finix Tokenization Form directly in the website

## Features

- Modern Next.js 14 application with TypeScript
- Beautiful UI using Tailwind CSS
- Product catalog with example items
- Shopping cart functionality
- Two payment integration methods
- Basic API structure for payment processing

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finix-take-payment-example.git
cd finix-take-payment-example
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Finix API credentials and merchant ID:
```env
FINIX_API_KEY=USfdccsr1Z5iVbXDyYt7hjZZ
FINIX_API_SECRET=313636f3-fac2-45a7-bff7-a334b93e7bda
FINIX_API_URL=https://finix.sandbox-payments-api.com
FINIX_MERCHANT_ID=MUmfEGv5bMpSJ9k5TFRUjkmm
PUBLIC_BASE_URL=http://localhost:3000 
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── payments/
│   │       └── route.ts         # API route for payment processing
│   │   ├── checkout/
│   │   │   ├── finix-hosted/
│   │   │   │   └── page.tsx        # Finix Hosted Checkout page
│   │   │   └── tokenization/
│   │   │       └── page.tsx        # Tokenization Form page
│   │   ├── cart/
│   │   │   └── page.tsx            # Shopping cart page
│   │   ├── layout.tsx              # Root layout with navigation
│   │   └── page.tsx                # Product catalog page
│   └── components/                 # Reusable components (to be added)
```

## Payment Integration Methods

### 1. Finix Hosted Checkout

This method redirects customers to a secure Finix-hosted checkout page. The flow is:

1. Customer adds items to cart
2. Customer clicks "Checkout with Finix Hosted"
3. Customer is redirected to Finix's hosted checkout page
4. After payment, customer is redirected back to success/failure page

### 2. Finix Tokenization Form

This method embeds the Finix Tokenization Form directly in the website. The flow is:

1. Customer adds items to cart
2. Customer clicks "Checkout with Tokenization"
3. Customer enters payment details in the embedded form
4. Form creates a payment token
5. Token is sent to our API to process the payment
6. Customer sees success/failure message

## Development

This is a work in progress. The following features are planned:

- [ ] Add state management for the shopping cart
- [ ] Implement actual Finix API integration
- [ ] Add error handling and validation
- [ ] Add loading states and animations
- [ ] Add unit tests
- [ ] Add documentation for API endpoints

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
