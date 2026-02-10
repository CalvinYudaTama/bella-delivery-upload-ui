'use client';

import React from 'react';

interface MegaMenuOverlayProps {
  isActive: boolean;
  onClick: () => void;
}

/**
 * Mega Menu Overlay Component
 * 
 * Full-screen semi-transparent overlay that appears when a mega menu is open.
 * Clicking the overlay closes the mega menu.
 * 
 * Styling is handled by globals.css using CSS classes.
 */
const MegaMenuOverlay: React.FC<MegaMenuOverlayProps> = ({ isActive, onClick }) => {
  return (
    <div 
      className={`mega-menu-overlay ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-hidden={!isActive}
    />
  );
};

export default MegaMenuOverlay;
