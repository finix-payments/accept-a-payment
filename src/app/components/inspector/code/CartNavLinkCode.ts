export const cartNavLinkCode = `'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useInspector } from '../context/InspectorContext';

export default function CartNavLink() {
  const { totalItems } = useCart();
  const { isInspectorMode } = useInspector();

  return (
    <Link 
      href="/cart" 
      className={\`text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 \${isInspectorMode ? 'hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 cursor-pointer' : ''}\`}
    >
      Cart
      {totalItems > 0 && (
        <span className="ml-2 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
}`;
