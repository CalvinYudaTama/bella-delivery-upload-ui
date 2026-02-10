'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { gsap } from 'gsap';
import MegaMenuContainer from './MegaMenuContainer';
import { LOCATION_MENU_DATA } from '@/config/megaMenuData';

interface LocationMenuProps {
  isActive: boolean;
  data?: {
    locations: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
      icon?: string;
    }>;
  };
}

/**
 * Location Menu Component
 * 
 * Displays "Our Location" mega menu with location cards in a 4-column grid.
 * Matches Shopify Header Code structure.
 */
const LocationMenu: React.FC<LocationMenuProps> = ({ isActive, data }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const animationSpeed = 0.4;

  // Use data from config
  const defaultData = {
    locations: LOCATION_MENU_DATA,
  };

  const menuData = data || defaultData;

  // Animate cards when menu opens
  useEffect(() => {
    if (!isActive || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.mega-location-card');
    
    // Reset and animate
    gsap.set(cards, { opacity: 0, y: 20 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: animationSpeed,
      stagger: 0.05,
      ease: 'power2.out',
    });

    return () => {
      gsap.killTweensOf(cards);
    };
  }, [isActive, animationSpeed]);

  if (!isActive) return null;

  return (
    <MegaMenuContainer className="mega-menu-container--location">
      <div className="mega-menu-content mega-menu-content--location">
        <div className="mega-location-grid" ref={gridRef}>
          {menuData.locations.map((location) => (
            <Link
              key={location.id}
              href={location.url as Route}
              className="mega-location-card"
            >
              {/* Header: Icon + Title + Arrow */}
              <div className="mega-location-header">
                {/* Location Icon */}
                <div className="mega-location-icon">
                  {/* LocationCard doesn't have icon, so we use a default SVG icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                
                {/* Location Name */}
                <h4 className="mega-location-title">{location.title}</h4>
                
                {/* Right Arrow Icon */}
                <svg className="mega-location-arrow" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 10h10m0 0l-4-4m4 4l-4 4"/>
                </svg>
              </div>
              
              {/* Location Description */}
              <p className="mega-location-text">
                {location.description || 'Lorem Ipsum'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </MegaMenuContainer>
  );
};

export default LocationMenu;
