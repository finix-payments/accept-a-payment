/**
 * Finix Example E-commerce Application
 * 
 * This is a test web application demonstrating Finix's payment integration solutions.
 * It showcases how to build a modern e-commerce merchant experience using:
 * - Finix Checkout Forms
 * - Finix Tokenization Forms
 * - Example product catalog and shopping cart
 * 
 * For more information, visit: https://finix.com/docs
 */
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://finixsamplestore.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/cart',
          '/checkout',
          '/checkout/tokenization',
        ],
        disallow: [
          '/api/',
          '/test/',
          '/dev/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}