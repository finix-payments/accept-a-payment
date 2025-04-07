'use client';

import ProductCard from '../components/ProductCard';
import Link from 'next/link';

const products = [
  {
    id: '1',
    name: 'Sunglasses',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Stylish sunglasses for any occasion'
  },
  {
    id: '2',
    name: 'Watch',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=2968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Elegant timepiece for everyday wear'
  },
  {
    id: '3',
    name: 'Headphones',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Premium wireless headphones'
  }
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Products</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Browse our collection of premium clothing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/cart"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
} 