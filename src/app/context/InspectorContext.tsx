'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface InspectorContextType {
  isInspectorMode: boolean;
  toggleInspectorMode: () => void;
  selectedElement: HTMLElement | null;
  setSelectedElement: (element: HTMLElement | null) => void;
  hoveredElement: HTMLElement | null;
  setHoveredElement: (element: HTMLElement | null) => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [isInspectorMode, setIsInspectorMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const toggleInspectorMode = () => {
    setIsInspectorMode(!isInspectorMode);
    if (!isInspectorMode) {
      setSelectedElement(null);
      setHoveredElement(null);
    }
  };

  return (
    <InspectorContext.Provider
      value={{
        isInspectorMode,
        toggleInspectorMode,
        selectedElement,
        setSelectedElement,
        hoveredElement,
        setHoveredElement,
      }}
    >
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  const context = useContext(InspectorContext);
  if (context === undefined) {
    throw new Error('useInspector must be used within an InspectorProvider');
  }
  return context;
} 