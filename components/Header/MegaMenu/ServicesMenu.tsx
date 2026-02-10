'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import { gsap } from 'gsap';
import MegaMenuContainer from './MegaMenuContainer';
import { ServicesMenuData, ServiceCard } from './types';
import { SERVICES_MENU_DATA } from '@/config/megaMenuData';

interface ServicesMenuProps {
  isActive: boolean;
  data?: ServicesMenuData;
}

/**
 * Services Menu Component
 * 
 * Displays a mega menu with:
 * - Left sidebar: Category links
 * - Right main area: Service cards grid (2 columns)
 * - GSAP animations for card entrance
 * - Category switching with animation re-trigger
 */
const ServicesMenu: React.FC<ServicesMenuProps> = ({ isActive, data }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const animationSpeed = 0.4;

  // Convert SERVICES_MENU_DATA to ServicesMenuData format
  const defaultData: ServicesMenuData = {
    categories: SERVICES_MENU_DATA.map((cat) => ({
      id: cat.id,
      title: cat.title,
      handle: cat.handle,
    })),
    services: SERVICES_MENU_DATA.reduce((acc, cat) => {
      acc[cat.handle] = cat.services;
      return acc;
    }, {} as Record<string, ServiceCard[]>),
  };

  const menuData = data || defaultData;

  // Set first category as active when menu opens
  useEffect(() => {
    if (isActive && menuData.categories.length > 0 && !activeCategory) {
      setActiveCategory(menuData.categories[0].handle);
    }
  }, [isActive, menuData.categories, activeCategory]);

  // Animate cards when category changes
  useEffect(() => {
    if (!isActive || !activeCategory || !cardsGridRef.current) return;

    const activeGrid = cardsGridRef.current.querySelector(
      `[data-category-content="${activeCategory}"]`
    ) as HTMLElement;

    if (!activeGrid) return;

    const cards = activeGrid.querySelectorAll('.mega-service-card');
    
    if (cards.length === 0) return;

    // Reset cards to initial state
    gsap.set(cards, { opacity: 0, y: 20 });

    // Animate cards in
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: animationSpeed * 0.8,
      stagger: 0.03,
      ease: 'power2.out',
    });
  }, [activeCategory, isActive, animationSpeed]);

  const handleCategoryHover = (categoryHandle: string) => {
    setActiveCategory(categoryHandle);
  };

  if (!isActive) return null;

  return (
    <MegaMenuContainer className="mega-menu-container--services">
      <div className="mega-menu-content" style={{ display: 'flex', gap: '40px' }}>
        {/* Left Sidebar - Categories */}
        <div className="mega-menu-sidebar" style={{ width: '300px', flexShrink: 0 }}>
          <ul className="mega-menu-categories" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {menuData.categories.map((category) => (
              <li key={category.id} className="mega-category-item" style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => handleCategoryHover(category.handle)}
                  onMouseEnter={() => handleCategoryHover(category.handle)}
                  className={`mega-category-link ${activeCategory === category.handle ? 'active' : ''}`}
                >
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Main Area - Service Cards Grid */}
        <div 
          ref={cardsGridRef}
          className="mega-menu-main-wrapper"
          style={{ flex: 1, position: 'relative', minHeight: '200px' }}
        >
          {menuData.categories.map((category) => {
            const categoryServices = menuData.services[category.handle] || [];
            const isVisible = activeCategory === category.handle;
            const isSingleCard = categoryServices.length === 1;

            return (
              <div
                key={category.handle}
                className="mega-services-grid"
                data-category-content={category.handle}
                style={{
                  display: isVisible ? 'grid' : 'none',
                  gridTemplateColumns: isSingleCard ? '1fr' : 'repeat(2, minmax(280px, 1fr))',
                  gap: '20px',
                  width: '100%',
                }}
              >
                {categoryServices.map((service) => {
                  // Check if this is floorplan service (single card, should use full width)
                  const isFloorplanService = isSingleCard;
                  
                  return (
                    <Link
                      key={service.id}
                      href={service.url as Route}
                      className="mega-service-card"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        alignItems: 'flex-start',
                        gap: '12px',
                        flex: '1 0 0',
                        border: '1px solid #CCC',
                        background: 'var(--neutral-0, #FFF)',
                        cursor: 'pointer',
                        borderRadius: '0',
                      }}
                    >
                      {/* Card Header: Icon + Title + Arrow */}
                      <div 
                        className="mega-service-header"
                        style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                      >
                        {/* Service Icon */}
                        <div 
                          className="mega-service-icon"
                          style={{
                            width: '40px',
                            height: '40px',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--brand-light, #EEF2FF)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginRight: '12px',
                          }}
                        >
                          {service.icon ? (
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={40}
                              height={40}
                              style={{ objectFit: 'contain' }}
                              unoptimized={true}
                            />
                          ) : service.image ? (
                            <Image
                              src={service.image}
                              alt={service.title}
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <svg 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="1.5"
                              style={{ width: '70%', height: '70%', color: 'var(--brand-primary, #4F46E5)' }}
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <path d="M21 15l-5-5L5 21"></path>
                            </svg>
                          )}
                        </div>

                        {/* Service Title */}
                        <h4 
                          className="mega-service-title"
                          style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            flex: '1 0 0',
                            maxWidth: isFloorplanService ? 'none' : '172px',
                            overflow: 'hidden',
                            color: '#333',
                            textOverflow: 'ellipsis',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '20px',
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 0,
                            marginRight: '6px',
                          } as React.CSSProperties & {
                            WebkitBoxOrient: 'vertical';
                            WebkitLineClamp: number;
                          }}
                        >
                          {service.title}
                        </h4>

                        {/* Arrow Icon */}
                        <svg 
                          className="mega-service-arrow"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 20 20"
                          style={{ 
                            flexShrink: 0,
                            width: '18px',
                            height: '18px',
                            marginLeft: 0,
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 10h10m0 0l-4-4m4 4l-4 4"/>
                        </svg>
                      </div>

                      {/* Service Description */}
                      <p 
                        className="mega-service-description"
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          alignSelf: 'stretch',
                          maxWidth: isFloorplanService ? 'none' : '220px',
                          overflow: 'hidden',
                          color: '#666',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '20px',
                          margin: 0,
                          paddingLeft: '52px', // Align with title (40px icon width + 12px margin)
                        } as React.CSSProperties & {
                          WebkitBoxOrient: 'vertical';
                          WebkitLineClamp: number;
                        }}
                      >
                        {service.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </MegaMenuContainer>
  );
};

export default ServicesMenu;
