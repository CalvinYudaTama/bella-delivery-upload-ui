'use client';

import React, { useState, useEffect } from 'react';
import { Heart, User } from 'lucide-react';

interface HeaderIconsProps {
  onInspirationClick: () => void;
  shopifyAccountUrl?: string;
  customInspirationIcon?: string;
  customAccountIcon?: string;
}

/**
 * HeaderIcons Component
 * Right side icons: Inspiration (heart) + Account
 * Removed: Currency, Search, Cart (per dashboard requirements)
 */
const HeaderIcons: React.FC<HeaderIconsProps> = ({
  onInspirationClick,
  shopifyAccountUrl = 'https://www.bellavirtual.com/account',
  customInspirationIcon,
  customAccountIcon,
}) => {
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    setIconsLoaded(true);
  }, []);

  // Fallback SVG for Heart icon
  const HeartSVG = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#333333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  // Fallback SVG for User icon
  const UserSVG = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#333333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <div
      className="header-icons"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
        flexShrink: 0,
      }}
    >
      {/* Inspiration Button with Icon + Text */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onInspirationClick();
        }}
        className="header-icon-link"
        aria-label="Inspiration"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          color: '#333333',
          padding: '8px 12px',
          transition: 'opacity 0.3s, background 0.3s',
          borderRadius: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7';
          e.currentTarget.style.background = '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {customInspirationIcon ? (
          <img
            src={customInspirationIcon}
            alt="Inspiration"
            className="header-icon-image"
            style={{
              width: '22px',
              height: '22px',
            }}
          />
        ) : iconsLoaded ? (
          <Heart
            style={{
              width: '22px',
              height: '22px',
              strokeWidth: 2,
              stroke: '#333333',
              fill: 'none',
              display: 'block',
            }}
          />
        ) : (
          <HeartSVG />
        )}
        <span
          style={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 'normal',
            whiteSpace: 'nowrap',
          }}
        >
          Inspiration
        </span>
      </a>

      {/* Account Icon (links to Shopify account) */}
      <a
        href={shopifyAccountUrl}
        className="header-icon-link"
        aria-label="Account"
        target="_self"
        style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'opacity 0.3s, background 0.3s',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7';
          e.currentTarget.style.background = '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {customAccountIcon ? (
          <img
            src={customAccountIcon}
            alt="Account"
            className="header-icon-image"
            style={{
              width: '22px',
              height: '22px',
            }}
          />
        ) : iconsLoaded ? (
          <User
            style={{
              width: '22px',
              height: '22px',
              strokeWidth: 2,
              stroke: '#333333',
              fill: 'none',
              display: 'block',
            }}
          />
        ) : (
          <UserSVG />
        )}
      </a>
    </div>
  );
};

export default HeaderIcons;
