# My Figures Payments for GoHighLevel

A white-label payment provider for GoHighLevel marketplace powered by Finix.

## Overview

My Figures Payments is a custom payment provider integration for GoHighLevel that allows businesses to accept payments directly through their GoHighLevel account. This integration leverages Finix as the underlying payment processor while presenting a seamless, white-labeled payment experience for your customers.

## Features

- **White-Labeled Payment Processing**: Offer a seamless payment experience under your own brand
- **One-Time Payments**: Accept one-time payments through forms, order pages, and payment links
- **Recurring Payments**: Create and manage subscriptions with automatic billing
- **Off-Session Payments**: Charge saved payment methods without customer interaction
- **Test & Live Modes**: Test your payment integration before going live
- **Management UI**: Easy-to-use interface for configuring payment settings
- **Webhook Support**: Real-time notifications for payment events

## Requirements

- Node.js 16+
- GoHighLevel Developer Account
- Finix Account (with API credentials)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/my-figures-payments.git
   cd my-figures-payments
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   # GoHighLevel app credentials
   GHL_APP_CLIENT_ID=your_client_id
   GHL_APP_CLIENT_SECRET=your_client_secret
   GHL_API_DOMAIN=https://services.leadconnectorhq.com
   GHL_APP_SSO_KEY=your_sso_key

   # Your app URL
   APP_URL=http://localhost:3000

   # Finix API credentials
   FINIX_API_KEY=your_finix_api_key
   FINIX_API_SECRET=your_finix_api_secret
   FINIX_MERCHANT_ID=your_finix_merchant_id

   # My Figures configuration
   MY_FIGURES_API_KEY=my_figures_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Creating a GoHighLevel Marketplace App

1. Sign up for a developer account at [GoHighLevel Marketplace](https://marketplace.gohighlevel.com/).

2. Create a new marketplace app with the following settings:
   - **App Name**: My Figures Payments
   - **Category**: Third Party Provider
   - **Required Scopes**:
     - payments/orders.readonly
     - payments/orders.write
     - payments/subscriptions.readonly
     - payments/transactions.readonly
     - payments/custom-provider.readonly
     - payments/custom-provider.write
     - products.readonly
     - products/prices.readonly
   - **Redirect URL**: `${APP_URL}/api/authorize-handler`
   - **Webhook URL**: `${APP_URL}/api/webhook-handler`

3. Configure the payment provider settings:
   - **Name**: My Figures Payments
   - **Description**: White-label payment processing powered by Finix
   - **Payment Provider Types**: OneTime, Recurring, OffSession
   - **Logo**: Upload your branded logo

## Deployment

This application can be deployed to any Node.js hosting service. We recommend using [Render](https://render.com/) for easy deployment:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to `npm install && npm run build`
4. Set the start command to `npm start`
5. Add all environment variables from `.env.local`
6. Deploy the application

## Integration Flow

1. **App Installation**: When a user installs your app from the marketplace, they are redirected to the authorization handler endpoint.
2. **OAuth Flow**: The authorization handler exchanges the code for an access token and creates the payment provider configuration in GHL.
3. **Configuration**: The user is redirected to the management UI to configure their Finix API credentials.
4. **Payment Processing**: When a customer makes a payment in GHL, the payment iframe is loaded and handles the communication with Finix.
5. **Webhooks**: Webhook events are sent to your application to notify about payment statuses and subscription updates.

## Testing

Use the following test card numbers to test different payment scenarios:

- `4111 1111 1111 1111` - Successful payment
- `4000 0000 0000 0002` - Declined payment

## License

[MIT License](LICENSE)

## Support

For support, please contact [support@myfigures.com](mailto:support@myfigures.com).
