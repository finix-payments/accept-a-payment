'use client';

import Link from 'next/link';
import { withInspector } from './withInspector';
import InspectorButton from './InspectorButton';
import InspectorOverlay from './InspectorOverlay';

const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Finix Store
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <InspectorButton />
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
    <main className="flex-grow">{children}</main>
    <InspectorOverlay />
  </div>
);

export default withInspector(BaseLayout); 