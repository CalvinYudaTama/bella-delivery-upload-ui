'use client';

import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
// import { usePathname } from 'next/navigation'; // Not currently used, but may be needed for active link styling
import { ChevronDown } from 'lucide-react';
import { LOOKBOOK_URLS } from '@/config/url.config';

interface NavigationProps {
  activeMenu: string | null;
  onMenuToggle: (menuId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeMenu, onMenuToggle }) => {
  // const pathname = usePathname(); // Not currently used, but may be needed for active link styling

  // Navigation items configuration - aligned with Shopify header
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
      href: LOOKBOOK_URLS.HOME,
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

  return (
    <nav 
      className="hidden md:flex items-center" 
      style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        whiteSpace: 'nowrap'
      }}
    >
      {navItems.map((item) => {
        // Simple link items (no mega menu)
        if (!item.hasMegaMenu) {
          return (
            <Link
              key={item.id}
              href={item.href as Route}
              className="nav-link"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 0',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                color: '#333',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease, text-decoration 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {item.label}
            </Link>
          );
        }

        // Items with mega menu
        return (
          <div key={item.id} className="relative">
            <button
              onClick={() => onMenuToggle(item.id)}
              className={`nav-link ${activeMenu === item.id ? 'active' : ''}`}
              data-has-mega="true"
              data-menu-item={item.id}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 0',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                color: activeMenu === item.id ? '#4F46E5' : '#333',
                textDecoration: activeMenu === item.id ? 'underline' : 'none',
                ...(activeMenu === item.id && {
                  textDecorationStyle: 'solid' as const,
                  textDecorationSkipInk: 'auto' as const,
                  textDecorationThickness: 'auto' as const,
                  textUnderlineOffset: 'auto' as const,
                  textUnderlinePosition: 'from-font' as const,
                }),
                cursor: 'pointer',
                transition: 'color 0.2s ease, text-decoration 0.2s ease',
                fontFamily: 'Inter, sans-serif',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                whiteSpace: 'nowrap',
              } as React.CSSProperties}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
              <ChevronDown 
                className="transition-transform duration-200"
                style={{
                  width: '12px',
                  height: '12px',
                  color: activeMenu === item.id ? '#4F46E5' : '#333',
                  transform: activeMenu === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            
            {/* Mega menu will be rendered separately in Header component */}
          </div>
        );
      })}
    </nav>
  );
};

export default Navigation;
