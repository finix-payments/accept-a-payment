import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "./context/CartContext";
import { InspectorProvider } from "./context/InspectorContext";
import InspectorButton from "./components/inspector/InspectorButton";
import InspectorOverlay from "./components/inspector/InspectorOverlay";
import CartNavLink from "./components/CartNavLink";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Finix Accept Payment Example Store',
  description: 'Example e-commerce application showcasing Finix payment integration with Checkout Forms and Tokenization Form products.',
  keywords: ['Finix', 'payments', 'e-commerce', 'checkout', 'tokenization', 'example', 'integration'],
  openGraph: {
    title: 'Finix Accept Payment Example Store',
    description: 'Learn how to integrate Finix payments into your e-commerce platform with our example application.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finix Accept Payment Example Store',
    description: 'Example e-commerce application with Finix payment integration.',
  },
  authors: [{ name: 'Finix' }],
  creator: 'Finix',
  publisher: 'Finix',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.finix.com/v/1/2/3/finix.js" strategy="beforeInteractive" />
        <Script src="https://pay.google.com/gp/p/js/pay.js" strategy="afterInteractive" />
        <Script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <InspectorProvider>
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <Link href="/" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Finix Store
                      </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      <Link href="/home" className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                        Home
                      </Link>
                      <Link href="/products" className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                        Products
                      </Link>
                      <CartNavLink />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <InspectorButton />
                  </div>
                </div>
              </div>
            </nav>
            <main>
              {children}
            </main>
            <InspectorOverlay />
          </InspectorProvider>
        </CartProvider>
    </body>
  </html>
);
}
