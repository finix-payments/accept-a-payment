'use client';

import { useEffect, useState } from 'react';
import { useInspector } from '../../context/InspectorContext';
import InspectorModal from './InspectorModal';
import HoverPreview from './HoverPreview';

export default function InspectorOverlay() {
  const { isInspectorMode, setSelectedElement } = useInspector();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isInspectorMode) {
      setHoveredElement(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const inspectableElement = target.closest('[data-inspectable]');
      if (inspectableElement) {
        setHoveredElement(inspectableElement as HTMLElement);
      } else {
        setHoveredElement(null);
      }
    };

    const handleMouseOut = () => {
      setHoveredElement(null);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const inspectableElement = target.closest('[data-inspectable]');
      if (inspectableElement) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedElement(inspectableElement as HTMLElement);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isInspectorMode, setSelectedElement]);

  if (!isInspectorMode) return null;

  return (
    <>
      <InspectorModal />
      {hoveredElement && <HoverPreview element={hoveredElement} />}
    </>
  );
} 