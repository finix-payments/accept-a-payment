export const productCardCode = `'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useInspector } from '../context/InspectorContext';
import { productCardCode } from './inspector/code/ProductCardCode';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  const { addItem, items } = useCart();
  const { isInspectorMode } = useInspector();

  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
      description
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      data-inspectable
      data-component="ProductCard"
      data-code={productCardCode}
    >
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        <div className="mt-8 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">\${price.toFixed(2)}</span>
          <div className="flex items-center space-x-4">
            {quantity > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                In cart: {quantity}
              </span>
            )}
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer"
            >
              {quantity > 0 ? 'Add Another' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;