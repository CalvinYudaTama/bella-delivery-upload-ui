'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import { 
  SERVICES_MENU_DATA, 
  LOCATION_MENU_DATA, 
  LOOKBOOK_MENU_DATA,
  CASE_STUDIES_MENU_DATA 
} from '@/config/megaMenuData';
import { HEADER_URLS, LOOKBOOK_URLS } from '@/config/url.config';
import { BRAND_CONFIGS } from '@/config/brandConfig';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<string>('main');
  const [navigationStack, setNavigationStack] = useState<string[]>(['main']);

  // Navigation items - matching Navigation.tsx structure
  const navItems = [
    {
      id: 'our-services',
      label: 'Our Services',
      href: '#',
      hasMegaMenu: true,
    },
    {
      id: 'lookbook',
      label: 'Lookbook',
      href: '/',
      hasMegaMenu: true,
    },
    {
      id: 'case-studies',
      label: 'Case Studies',
      href: '#',
      hasMegaMenu: true,
    },
    {
      id: 'our-location',
      label: 'Our Location',
      href: '#',
      hasMegaMenu: true,
    },
  ];

  // Reset to main view
  const resetToMain = () => {
    setCurrentView('main');
    setNavigationStack(['main']);
  };

  // Navigate to a new view
  const navigateTo = (viewName: string) => {
    setNavigationStack(prev => {
      // Don't add if already in stack
      if (prev.includes(viewName)) {
        return prev;
      }
      return [...prev, viewName];
    });
    setCurrentView(viewName);
  };

  // Navigate back to previous view
  const navigateBack = () => {
    setNavigationStack(prev => {
      if (prev.length <= 1) return prev;
      
      const newStack = [...prev];
      newStack.pop();
      const previousView = newStack[newStack.length - 1];
      
      setCurrentView(previousView);
      return newStack;
    });
  };

  // Get view class name based on current state
  const getViewClassName = (viewName: string): string => {
    if (viewName === currentView) {
      return 'mobile-nav-view active';
    }
    
    const currentIndex = navigationStack.indexOf(currentView);
    const viewIndex = navigationStack.indexOf(viewName);
    
    // If view is not in stack, it should be hidden
    if (viewIndex === -1) {
      return 'mobile-nav-view next';
    }
    
    // If view is before current in stack, it's previous
    if (viewIndex < currentIndex) {
      return 'mobile-nav-view previous';
    }
    
    // Otherwise it's next (future view)
    return 'mobile-nav-view next';
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset to main view when drawer closes
      resetToMain();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`mobile-drawer ${isOpen ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          {/* Logo */}
          <Link href={HEADER_URLS.HOME} className="mobile-drawer-logo-link" style={{ display: 'flex', alignItems: 'center' }} target="_self" rel="noopener noreferrer">
            <div className="mobile-drawer-logo-wrapper">
              <Image
                src="/bella_virtual_black.svg"
                alt="Bella Staging Logo"
                width={298}
                height={60}
                className="mobile-drawer-logo-image"
                unoptimized={true}
              />
            </div>
          </Link>

          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Close menu"
            className="mobile-drawer-close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Navigation Container */}
        <div className="mobile-drawer-nav-container">
          {/* Main Navigation View */}
          <div className={getViewClassName('main')} data-view="main">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.id} className="mobile-nav-item">
                  {item.hasMegaMenu ? (
                    <button
                      onClick={() => navigateTo(item.id)}
                      className="mobile-nav-link"
                    >
                      {item.label}
                      <ChevronRight className="w-5 h-5" style={{ width: '20px', height: '20px', color: '#999', flexShrink: 0, pointerEvents: 'none' }} />
                    </button>
                  ) : (
                    <Link
                      href={item.href as Route}
                      onClick={onClose}
                      className="mobile-nav-link"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services View */}
          <div className={getViewClassName('our-services')} data-view="our-services">
            <div className="mobile-view-header" onClick={navigateBack}>
              <button className="mobile-view-back" aria-label="Back">
                <ChevronLeft className="w-5 h-5" style={{ width: '18px', height: '18px' }} />
              </button>
              <div className="mobile-view-title">Our Services</div>
            </div>
            <ul className="mobile-nav-list">
              {SERVICES_MENU_DATA.map((category) => {
                const hasServices = category.services && category.services.length > 0;
                const categoryViewId = `our-services-${category.handle}`;
                
                return (
                  <li key={category.id} className="mobile-nav-item">
                    {hasServices ? (
                      <button
                        onClick={() => navigateTo(categoryViewId)}
                        className="mobile-nav-link"
                      >
                        {category.title}
                        <ChevronRight className="w-5 h-5" style={{ width: '20px', height: '20px', color: '#999', flexShrink: 0, pointerEvents: 'none' }} />
                      </button>
                    ) : (
                      <Link
                        href={category.url as Route}
                        onClick={onClose}
                        className="mobile-nav-link"
                      >
                        {category.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Our Services Category Views (Third Level) */}
          {SERVICES_MENU_DATA.map((category) => {
            if (!category.services || category.services.length === 0) return null;
            
            const categoryViewId = `our-services-${category.handle}`;
            
            return (
              <div key={categoryViewId} className={getViewClassName(categoryViewId)} data-view={categoryViewId}>
                <div className="mobile-view-header" onClick={navigateBack}>
                  <button className="mobile-view-back" aria-label="Back">
                    <ChevronLeft className="w-5 h-5" style={{ width: '18px', height: '18px' }} />
                  </button>
                  <div className="mobile-view-title">{category.title}</div>
                </div>
                <ul className="mobile-nav-list">
                  {category.services.map((service) => (
                    <li key={service.id} className="mobile-nav-item">
                      <Link
                        href={service.url as Route}
                        onClick={onClose}
                        className="mobile-nav-link"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Lookbook View */}
          <div className={getViewClassName('lookbook')} data-view="lookbook">
            <div className="mobile-view-header" onClick={navigateBack}>
              <button className="mobile-view-back" aria-label="Back">
                <ChevronLeft className="w-5 h-5" style={{ width: '18px', height: '18px' }} />
              </button>
              <div className="mobile-view-title">Lookbook</div>
            </div>
            <div className="mobile-mega-content">
              <div className="mobile-lookbook-grid">
                {/* Explore Lookbooks Featured Card */}
                <Link
                  href={LOOKBOOK_MENU_DATA.featured.url as Route}
                  onClick={onClose}
                  className="mobile-lookbook-card mobile-lookbook-card--featured"
                >
                  <div className="mobile-lookbook-featured-header">
                    <h3 className="mobile-lookbook-featured-title">
                      {LOOKBOOK_MENU_DATA.featured.title}
                    </h3>
                    <svg
                      className="mobile-lookbook-featured-arrow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 10h10m0 0l-4-4m4 4l-4 4"/>
                    </svg>
                  </div>
                  <p className="mobile-lookbook-text">
                    {LOOKBOOK_MENU_DATA.featured.description}
                  </p>
                </Link>

                {/* Brand List Cards with Logos */}
                {(() => {
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

                  return orderedBrands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={brand.url as Route}
                      onClick={onClose}
                      className="mobile-lookbook-card mobile-lookbook-card--logo"
                    >
                      <div className="mobile-lookbook-logo-wrapper">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={200}
                          height={60}
                          unoptimized={true}
                        />
                      </div>
                    </Link>
                  ));
                })()}
              </div>

              {/* Contact Us Link */}
              <div className="mobile-lookbook-footer">
                <p className="mobile-lookbook-footer-text">
                  Want to be featured?
                  <Link href={LOOKBOOK_URLS.CONTACT_US as Route} onClick={onClose} className="mobile-lookbook-footer-link">
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Case Studies View */}
          <div className={getViewClassName('case-studies')} data-view="case-studies">
            <div className="mobile-view-header" onClick={navigateBack}>
              <button className="mobile-view-back" aria-label="Back">
                <ChevronLeft className="w-5 h-5" style={{ width: '18px', height: '18px' }} />
              </button>
              <div className="mobile-view-title">Case Studies</div>
            </div>
            <ul className="mobile-nav-list">
              {CASE_STUDIES_MENU_DATA.map((caseStudy) => (
                <li key={caseStudy.id} className="mobile-nav-item">
                  <Link
                    href={caseStudy.url as Route}
                    onClick={onClose}
                    className="mobile-nav-link"
                  >
                    {caseStudy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Location View */}
          <div className={getViewClassName('our-location')} data-view="our-location">
            <div className="mobile-view-header" onClick={navigateBack}>
              <button className="mobile-view-back" aria-label="Back">
                <ChevronLeft className="w-5 h-5" style={{ width: '18px', height: '18px' }} />
              </button>
              <div className="mobile-view-title">Our Location</div>
            </div>
            <ul className="mobile-nav-list">
              {LOCATION_MENU_DATA.map((location) => (
                <li key={location.id} className="mobile-nav-item">
                  <Link
                    href={location.url as Route}
                    onClick={onClose}
                    className="mobile-nav-link"
                  >
                    {location.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
