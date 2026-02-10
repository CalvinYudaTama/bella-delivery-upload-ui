'use client';

import React, { useState, useRef } from 'react';
import { Menu } from 'lucide-react';
import WishlistModal from './Header/WishlistModal';
import MobileDrawer from './Header/MobileDrawer';
import AnnouncementBar from './Header/AnnouncementBar';
import HeaderLogo from './Header/HeaderLogo';
import Navigation from './Header/Navigation';
import HeaderIcons from './Header/HeaderIcons';
import MegaMenu from './Header/MegaMenu/MegaMenu';
import { useMegaMenu } from './Header/hooks/useMegaMenu';

const Header: React.FC = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  
  // Use mega menu hook for managing menu state
  const { activeMenu, toggleMenu, closeAllMenus } = useMegaMenu();

  const handleWishlistToggle = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
  };

  const handleMobileDrawerToggle = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Main Header */}
      <header 
        ref={headerRef} 
        className="fixed left-0 right-0 shadow-lg transition-all duration-300 bg-white text-gray-900"
        style={{
          top: '40px', // Position below announcement bar
          zIndex: 1001, // Below WishlistModal but above AnnouncementBar
        }}
      >
        <div 
          className="flex items-center justify-center"
          style={{
            height: 'var(--header-height, 122px)',
            paddingTop: '20px',
            paddingBottom: '20px',
          }}
        >
        <div className="mx-auto px-[100px] max-[990px]:px-4 max-[431px]:px-3" style={{ width: '1440px', maxWidth: '1440px', position: 'relative' }}>
          <div 
            className="flex items-center justify-between w-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {/* Mobile Menu Toggle Button - Left side on mobile */}
            <button
              onClick={handleMobileDrawerToggle}
              className="md:hidden mobile-menu-toggle"
              type="button"
              aria-label="Open menu"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
                color: '#333',
                width: '40px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo - Center on mobile, left on desktop */}
            <div className="md:flex-1 flex justify-center md:justify-start header-logo-wrapper" style={{ flex: 1, minWidth: 0 }}>
              <HeaderLogo />
            </div>

            {/* Center Section - Navigation (Desktop only) - Absolutely centered */}
            <div 
              className="hidden md:block"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
              }}
            >
              <Navigation 
                activeMenu={activeMenu}
                onMenuToggle={toggleMenu}
              />
            </div>

            {/* Right Section - User Actions */}
            <HeaderIcons 
              onWishlistToggle={handleWishlistToggle}
            />
          </div>

          {/* Mega Menu */}
          <MegaMenu 
            activeMenu={activeMenu}
            onClose={closeAllMenus}
          />
        </div>
      </div>
      </header>
      
      {/* Wishlist Modal */}
      <WishlistModal isOpen={isWishlistOpen} onClose={handleWishlistClose} />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={handleMobileDrawerClose} />
    </>
  );
};

export default Header; 