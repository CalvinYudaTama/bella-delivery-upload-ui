'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import { gsap } from 'gsap';
import MegaMenuContainer from './MegaMenuContainer';
import { BRAND_CONFIGS } from '@/config/brandConfig';
import { LOOKBOOK_MENU_DATA } from '@/config/megaMenuData';
import { LOOKBOOK_URLS } from '@/config/url.config';

interface LookbookMenuProps {
  isActive: boolean;
  data?: {
    featured?: {
      title: string;
      description: string;
      url: string;
      bgColor?: string;
      textColor?: string;
    };
    brands?: Array<{
      id: string;
      name: string;
      logo: string;
      url?: string;
    }>;
  };
}

/**
 * Lookbook Menu Component
 * 
 * Displays "Lookbook" mega menu with:
 * - 1 Featured card (promotional)
 * - Up to 11 brand logo cards
 * - Dynamic grid layout (4 cols → 3 → 2 → 1)
 * Matches Shopify Header Code structure.
 */
const LookbookMenu: React.FC<LookbookMenuProps> = ({ isActive, data }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const animationSpeed = 0.4;

  // Keep header brand logos visually consistent with BrandSelectionModal:
  // all logos share the same displayed height.
  const DEFAULT_LOGO_HEIGHT = 60; // px - same as BrandSelectionModal
  const DEFAULT_CONTAINER_PADDING = 8; // px

  // Use data from config, with brands from BRAND_CONFIGS in specific order
  // Order: Crate & Barrel, Article Company, EQ3, Rove Concepts, Gus Modern, MGBW (Mitchell Gold + Bob Williams), Rochebobois, Hooker Furniture, Eternity Modern, Sundays, King Living, Mobital
  const brandOrder = [
    'Crate & Barrel',
    'Article Company',
    'EQ3',
    'Rove Concepts',
    'Gus Modern',
    'MGBW',
    'Rochebobois',
    'Hooker Furniture',
    'Eternity Modern',
    'Sundays',
    'King Living',
    'Mobital',
  ];

  // Map brand names to their URLs from url.config
  const brandUrlMap: Record<string, string> = {
    'Rove Concepts': LOOKBOOK_URLS.ROVE_CONCEPTS,
    'Gus Modern': LOOKBOOK_URLS.GUS_MODERN,
    'Sundays': LOOKBOOK_URLS.SUNDAYS,
    'Mobital': LOOKBOOK_URLS.MOBITAL,
    'Article Company': LOOKBOOK_URLS.ARTICLE_COMPANY,
    'EQ3': LOOKBOOK_URLS.EQ3,
    'Hooker Furniture': LOOKBOOK_URLS.HOOKER_FURNITURE,
    'MGBW': LOOKBOOK_URLS.MGBW,
    'Eternity Modern': LOOKBOOK_URLS.ETERNITY_MODERN,
    'King Living': LOOKBOOK_URLS.KING_LIVING,
    'Crate & Barrel': LOOKBOOK_URLS.CRATE_BARREL,
    'Rochebobois': LOOKBOOK_URLS.ROCHEBOBOIS,
  };

  const orderedBrands = brandOrder
    .map((brandName) => BRAND_CONFIGS.find((brand) => brand.name === brandName))
    .filter((brand): brand is NonNullable<typeof brand> => brand !== undefined)
    .map((brand, index) => ({
      id: `brand-${index + 1}`,
      name: brand.name,
      logo: brand.logo,
      url: brandUrlMap[brand.name] || `/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`,
    }));

  const defaultData = {
    featured: LOOKBOOK_MENU_DATA.featured,
    brands: orderedBrands,
  };

  const menuData = data || defaultData;

  // Animate cards when menu opens
  useEffect(() => {
    if (!isActive || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.mega-lookbook-card');
    
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
    <MegaMenuContainer className="mega-menu-container--lookbook">
      <div className="mega-menu-content mega-menu-content--lookbook" style={{ position: 'relative' }}>
        <div className="mega-lookbook-grid" ref={gridRef}>
          {/* Featured Card */}
          {menuData.featured && (
            <Link
              href={menuData.featured.url as Route}
              className="mega-lookbook-card mega-lookbook-card--featured"
              style={{
                backgroundColor: menuData.featured.bgColor || '#4F46E5',
              }}
            >
              {/* Header: Title + Arrow */}
              <div className="mega-lookbook-featured-header">
                <h3
                  className="mega-lookbook-featured-title"
                  style={{ color: menuData.featured.textColor || '#FFFFFF' }}
                >
                  {menuData.featured.title}
                </h3>
                
                <svg
                  className="mega-lookbook-featured-arrow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  style={{ color: menuData.featured.textColor || '#FFFFFF' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 10h10m0 0l-4-4m4 4l-4 4"/>
                </svg>
              </div>
              
              {/* Description Text */}
              <p
                className="mega-lookbook-text"
                style={{ color: menuData.featured.textColor || '#FFFFFF' }}
              >
                {menuData.featured.description}
              </p>
            </Link>
          )}
          
          {/* Logo Cards */}
          {menuData.brands?.map((brand) => (
            <Link
              key={brand.id}
              href={(brand.url || '#') as Route}
              className="mega-lookbook-card mega-lookbook-card--logo"
              onClick={!brand.url ? (e) => e.preventDefault() : undefined}
              style={{
                ...(!brand.url ? { cursor: 'default' } : {}),
                width: '275.5px',
                height: '144px',
              }}
            >
              <div
                className="mega-lookbook-logo-wrapper"
                style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: `${DEFAULT_CONTAINER_PADDING}px`,
                }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={200}
                  height={DEFAULT_LOGO_HEIGHT}
                  style={{
                    height: `${DEFAULT_LOGO_HEIGHT}px`,
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Contact Message - Bottom Right */}
        <div 
          className="mega-lookbook-contact-message"
          style={{
            marginTop: '24px',
            textAlign: 'right',
            fontSize: '13px',
            color: '#6B7280',
            lineHeight: '1.5',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Want to be featured?{' '}
          <Link
            href={LOOKBOOK_URLS.CONTACT_US}
            style={{
              color: '#4F46E5',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '140%',
            }}
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </MegaMenuContainer>
  );
};

export default LookbookMenu;
