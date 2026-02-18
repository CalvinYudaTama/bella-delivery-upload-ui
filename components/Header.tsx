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

  const handleInspirationToggle = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const handleInspirationClose = () => {
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
      {/* Header Wrapper - Contains Announcement Bar + Main Header */}
      <div className="header-wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        {/* Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header */}
        <header
          ref={headerRef}
          className="main-header bg-white text-gray-900 shadow-lg"
          style={{
            position: 'relative',
            width: '100%',
            transition: 'all 0.3s ease',
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          {/* Header Content Container */}
          <div
            className="header-content"
            style={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              padding: '0',
            }}
          >
            {/* Header Inner Flex Container */}
            <div
              className="header-inner"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '40px',
                position: 'relative',
                width: '100%',
              }}
            >
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={handleMobileDrawerToggle}
                className="mobile-menu-toggle"
                type="button"
                aria-label="Open menu"
                style={{
                  display: 'none',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#333',
                  width: '40px',
                  height: '40px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo */}
              <div className="header-logo-wrapper" style={{ flexShrink: 0, minWidth: 'fit-content' }}>
                <HeaderLogo />
              </div>

              {/* Navigation - Desktop only - Centered */}
              <div className="header-nav-wrapper" style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <Navigation
                  activeMenu={activeMenu}
                  onMenuToggle={toggleMenu}
                />
              </div>

              {/* Icons */}
              <div className="header-icons-wrapper" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <HeaderIcons
                  onInspirationClick={handleInspirationToggle}
                  shopifyAccountUrl="https://www.bellavirtual.com/account"
                />
              </div>
            </div>

            {/* Mega Menu */}
            <MegaMenu
              activeMenu={activeMenu}
              onClose={closeAllMenus}
            />
          </div>
        </header>
      </div>
      
      {/* Inspiration Modal (renamed from Wishlist) */}
      <WishlistModal isOpen={isWishlistOpen} onClose={handleInspirationClose} />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={handleMobileDrawerClose} />

      {/* Responsive Styles */}
      <style jsx>{`
        .header-content {
          max-width: auto !important;
          width: 100%;
          padding: 0 !important;
        }

        .header-inner {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          width: 100%;
          padding: 10px 20px;
          margin-bottom: 0;
          background-color: #ffffff;
        }

        .mobile-menu-toggle {
          display: none !important;
        }

        .header-nav-wrapper {
          display: flex;
          flex-direction: row;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Tablet - max-width: 990px */
        @media (max-width: 990px) {
          .header-content {
            padding: 0 !important;
          }

          .header-inner {
            gap: 24px !important;
            padding: 10px 20px;
          }
        }

        /* Mobile - max-width: 768px */
        @media (max-width: 768px) {
          .header-content {
            padding: 0 !important;
          }

          .header-inner {
            gap: 16px !important;
            padding: 12px 16px;
          }

          .mobile-menu-toggle {
            display: flex !important;
            order: 1;
          }

          .header-logo-wrapper {
            order: 2;
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .header-nav-wrapper {
            display: none !important;
          }

          .header-icons-wrapper {
            order: 3;
          }
        }

        /* Small Mobile - max-width: 480px */
        @media (max-width: 480px) {
          .header-content {
            padding: 0 !important;
          }

          .header-inner {
            gap: 12px !important;
            padding: 12px 12px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
 