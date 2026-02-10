'use client';

import React, { useRef, useEffect } from 'react';
import ServicesMenu from './ServicesMenu';
import LocationMenu from './LocationMenu';
import LookbookMenu from './LookbookMenu';
import CaseStudiesMenu from './CaseStudiesMenu';
import MegaMenuOverlay from './MegaMenuOverlay';

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

/**
 * Mega Menu Component
 * 
 * Main wrapper component that handles mega menu positioning and rendering.
 * Manages which mega menu type to display based on activeMenu prop.
 * Case Studies menu is positioned relative to its navigation link.
 */
const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const isServicesActive = activeMenu === 'our-services';
  const isLocationActive = activeMenu === 'our-location';
  const isLookbookActive = activeMenu === 'lookbook';
  const isCaseStudiesActive = activeMenu === 'case-studies';

  // Position Case Studies menu relative to its navigation link
  useEffect(() => {
    if (!isCaseStudiesActive || !menuRef.current) return;

    const menu = menuRef.current;
    
    // Find the Case Studies button using data attribute
    const caseStudiesButton = document.querySelector('button[data-has-mega="true"][data-menu-item="case-studies"]') as HTMLElement;

    if (!caseStudiesButton) return;

    // Small delay to ensure menu is rendered and container width is calculated
    const timeoutId = setTimeout(() => {
      const linkRect = caseStudiesButton.getBoundingClientRect();
      const container = menu.querySelector('.mega-menu-container--case-studies') as HTMLElement;
      
      if (container) {
        // Get the positioning context (parent element with position: relative)
        const parentElement = menu.offsetParent as HTMLElement;
        const parentRect = parentElement ? parentElement.getBoundingClientRect() : { left: 0 };
        
        const menuWidth = container.offsetWidth;
        const linkCenter = linkRect.left + (linkRect.width / 2);
        // Calculate position relative to parent element
        const menuLeft = Math.max(20, linkCenter - parentRect.left - (menuWidth / 2));
        
        menu.style.left = menuLeft + 'px';
        menu.style.right = 'auto';
        menu.style.transform = 'none';
      }
    }, 0);

    // Cleanup: reset styles when menu closes
    return () => {
      clearTimeout(timeoutId);
      if (menu) {
        menu.style.left = '';
        menu.style.right = '';
        menu.style.transform = '';
      }
    };
  }, [isCaseStudiesActive]);

  if (!activeMenu) return null;

  return (
    <>
      {/* Overlay */}
      <MegaMenuOverlay isActive={!!activeMenu} onClick={onClose} />
      
      {/* Mega Menu Container - positioned absolutely below header */}
      <div
        ref={menuRef}
        className={`mega-menu ${activeMenu ? 'active' : ''}`}
        id={`megaMenu-${activeMenu}`}
      >
        {/* Services Menu */}
        {isServicesActive && (
          <ServicesMenu isActive={isServicesActive} />
        )}
        
        {/* Location Menu */}
        {isLocationActive && (
          <LocationMenu isActive={isLocationActive} />
        )}
        
        {/* Lookbook Menu */}
        {isLookbookActive && (
          <LookbookMenu isActive={isLookbookActive} />
        )}
        
        {/* Case Studies Menu */}
        {isCaseStudiesActive && (
          <CaseStudiesMenu isActive={isCaseStudiesActive} />
        )}
      </div>
    </>
  );
};

export default MegaMenu;
