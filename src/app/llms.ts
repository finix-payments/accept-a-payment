type LLMMetadata = {
  name: string
  description: string
  repository: string
  purpose: string
  technologies: string[]
  mainFeatures: string[]
  routes: {
    path: string
    description: string
    purpose: string
  }[]
  codeExamples: {
    feature: string
    description: string
    location: string
  }[]
  contact: {
    documentation: string
    support: string
  }
}

export default function llms(): LLMMetadata {
  return {
    name: "Finix Accept Payment Example Store",
    description: "An example e-commerce application showcasing Finix's payment acceptance integration with Checkout Forms and Tokenization Forms",
    repository: "https://github.com/finix-payments/accept-a-payment",
    purpose: "To provide developers with a working example of integrating Finix payment acceptance with Checkout Forms and Tokenization Forms",
    
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Finix Checkout Forms",
      "Finix Tokenization Forms",
      "Tailwind CSS"
    ],

    mainFeatures: [
      "Product catalog browsing and management",
      "Shopping cart functionality",
      "Secure payment processing",
      "Payment method tokenization",
      "Responsive mobile-first design",
      "Dark mode support"
    ],

    routes: [
      {
        path: "/",
        description: "Homepage with featured products",
        purpose: "Entry point showcasing available products"
      },
      {
        path: "/products",
        description: "Product catalog listing",
        purpose: "Browse and select products for purchase"
      },
      {
        path: "/cart",
        description: "Shopping cart management",
        purpose: "Review and modify selected items before checkout"
      },
      {
        path: "/checkout",
        description: "Checkout process using Finix Checkout Forms",
        purpose: "Complete purchase with integrated payment processing"
      },
      {
        path: "/checkout/tokenization",
        description: "Payment method tokenization example",
        purpose: "Demonstrate secure card tokenization for future use"
      }
    ],

    codeExamples: [
      {
        feature: "Payment Tokenization Checkout Experience",
        description: "Example implementation of Finix's Tokenization Form with a checkout experience",
        location: "src/app/checkout/tokenization/page.tsx"
      },
      {
        feature: "Finix Tokenization Form React Component",
        description: "React component example of Finix Tokenization Form",
        location: "src/app/components/PaymentForm.tsx"
      }
    ],

    contact: {
      documentation: "https://finix.com/docs",
      support: "https://help.finix.com/"
    }
  }
}