# Finix Payment Integration Example

This is an example e-commerce application that demonstrates how to integrate Finix Payments into a Next.js web application. The example shows two different methods of accepting payments:

1. Finix Hosted Checkout - Redirects customers to a secure Finix-hosted checkout page
2. Finix Tokenization Form - Embeds the Finix Tokenization Form directly in the website

## Features

- Next.js 14 e-commerce example with TypeScript
- Basic UI using Tailwind CSS
- Product catalog with example items
- Shopping cart functionality
- Two payment integration methods
- Simple API example for payment processing

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/finix-payments/accept-a-payment.git
cd accept-a-payment
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
