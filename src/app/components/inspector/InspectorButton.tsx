'use client';

import { useInspector } from '../../context/InspectorContext';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

export default function InspectorButton() {
  const { isInspectorMode, toggleInspectorMode } = useInspector();

  return (
    <button
      onClick={toggleInspectorMode}
      className={`p-2 rounded-md transition-colors cursor-pointer ${
        isInspectorMode
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={isInspectorMode ? 'Exit Inspector Mode' : 'Enter Inspector Mode'}
    >
      <CodeBracketIcon className="h-6 w-6" />
    </button>
  );
} 