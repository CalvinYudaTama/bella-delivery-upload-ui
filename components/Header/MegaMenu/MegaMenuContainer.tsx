'use client';

import React, { ReactNode } from 'react';

interface MegaMenuContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mega Menu Container Component
 * 
 * Base container for mega menu content with backdrop-filter support.
 * Provides a blurred background effect on modern browsers.
 */
const MegaMenuContainer: React.FC<MegaMenuContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`mega-menu-container ${className}`}>
      {children}
    </div>
  );
};

export default MegaMenuContainer;
