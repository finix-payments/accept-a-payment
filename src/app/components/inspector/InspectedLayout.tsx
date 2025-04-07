'use client';

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
              <a href="/" className="text-xl font-bold text-gray-900">
                Finix Store
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <InspectorButton />
            <a href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </a>
          </div>
        </div>
      </div>
    </header>
    <main className="flex-grow">{children}</main>
    <InspectorOverlay />
  </div>
);

export default withInspector(BaseLayout); 