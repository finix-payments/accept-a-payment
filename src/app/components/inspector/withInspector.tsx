'use client';

import { useInspector } from '../../context/InspectorContext';
import { ComponentType, useEffect } from 'react';

export function withInspector<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithInspector(props: P) {
    const { isInspectorMode, setSelectedElement, setHoveredElement } = useInspector();

    useEffect(() => {
      if (!isInspectorMode) return;

      const handleMouseOver = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target && target !== document.body) {
          setHoveredElement(target);
        }
      };

      const handleMouseOut = () => {
        setHoveredElement(null);
      };

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLElement;
        if (target && target !== document.body) {
          setSelectedElement(target);
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
    }, [isInspectorMode, setSelectedElement, setHoveredElement]);

    return <WrappedComponent {...props} />;
  };
} 