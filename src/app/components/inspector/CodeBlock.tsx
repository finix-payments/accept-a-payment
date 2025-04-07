'use client';

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export default function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Remove any existing Prism classes
      codeRef.current.className = '';
      // Add the language class
      codeRef.current.classList.add(`language-${language}`);
      // Apply syntax highlighting
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className={`relative group ${className}`}>
      <pre
        ref={codeRef}
        className="!m-0 !rounded-lg"
      >
        <code className={`!m-0 language-${language}`}>{code}</code>
      </pre>
      <button
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(code);
        }}
        title="Copy to clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </button>
    </div>
  );
} 