'use client';

import { useEffect, useRef } from 'react';

interface HoverPreviewProps {
  element: HTMLElement;
}

export default function HoverPreview({ element }: HoverPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    const rect = element.getBoundingClientRect();
    const preview = previewRef.current;

    preview.style.position = 'fixed';
    preview.style.left = `${rect.left}px`;
    preview.style.top = `${rect.top}px`;
    preview.style.width = `${rect.width}px`;
    preview.style.height = `${rect.height}px`;
    preview.style.border = '2px solid #3b82f6';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
  }, [element]);

  return <div ref={previewRef} />;
} 