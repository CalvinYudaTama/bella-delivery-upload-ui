'use client';

import React, { useState } from 'react';
import FooterLogo from './Footer/FooterLogo';
import FooterMenu from './Footer/FooterMenu';
import FooterBottom from './Footer/FooterBottom';
import { DEFAULT_FOOTER_MENUS, type FooterMenuData } from '@/config/footerConfig';

interface FooterProps {
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  menus?: FooterMenuData[];
}

const Footer: React.FC<FooterProps> = ({
  backgroundColor = '#1a1a1a',
  paddingTop = 80,
  paddingBottom = 40,
  menus = DEFAULT_FOOTER_MENUS
}) => {
  const [activeMenus, setActiveMenus] = useState<Set<number>>(new Set([0])); // First menu active by default on mobile

  const toggleMenu = (index: number) => {
    setActiveMenus(prev => {
      const isActive = prev.has(index);
      // Close all other accordions first (Shopify behavior: only one open at a time)
      const newSet = new Set<number>();
      // Toggle current accordion
      if (isActive) {
        // If it was active, close it (leave newSet empty)
      } else {
        // If it was not active, open it (close all others, open this one)
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <footer className="bella-footer" style={{ backgroundColor }}>
      <div className="bella-footer__wrapper">
        <div
          className="bella-footer__content"
          style={{
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`
          }}
        >
          <div className="bella-container footer-custom" style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {/* Main Grid: Logo + Menus */}
            <div className="bella-footer__grid">
              {/* Left Column - Logo */}
              <FooterLogo />

              {/* Right Column - Menus Container */}
              <div className="bella-footer__menus-wrapper">
                {menus.map((menuData, index) => (
                  <FooterMenu
                    key={index}
                    heading={menuData.heading}
                    menu={menuData.menu}
                    isActive={activeMenus.has(index)}
                    onToggle={() => toggleMenu(index)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <FooterBottom />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 