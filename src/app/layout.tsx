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
  title: "Finix Payment Example Store",
  description: "Example e-commerce store demonstrating Finix payment integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.finix.com/v/1/2/3/finix.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <InspectorProvider>
            <nav className="bg-white dark:bg-gray-800 shadow-lg">
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
