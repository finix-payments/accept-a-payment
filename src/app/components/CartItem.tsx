'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useInspector } from '../context/InspectorContext';
import { cartItemCode } from './inspector/code/CartItemCode';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();
  const { isInspectorMode } = useInspector();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div 
      className={`flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 ${isInspectorMode ? 'hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 cursor-pointer' : ''}`}
      data-inspectable
      data-component="CartItem"
      data-code={cartItemCode}
    >
      <div className="relative w-20 h-20">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border dark:border-gray-600 rounded">
          <button
            onClick={handleDecrease}
            className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="px-2 py-1 text-gray-900 dark:text-gray-100">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
} 