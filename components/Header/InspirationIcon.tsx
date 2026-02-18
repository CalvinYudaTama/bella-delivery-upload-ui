'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface InspirationIconProps {
  onClick: () => void;
  customIcon?: string;
  className?: string;
}

/**
 * Inspiration Icon Component
 * Replaces Cart icon in dashboard - opens Inspiration modal
 * Uses custom icon if provided, otherwise Lucide heart icon
 */
export const InspirationIcon: React.FC<InspirationIconProps> = ({
  onClick,
  customIcon,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`header-icon-link ${className}`}
      aria-label="Inspiration"
      style={{
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        transition: 'opacity 0.3s, background 0.3s',
        borderRadius: '8px',
      }}
    >
      {customIcon ? (
        <img
          src={customIcon}
          alt="Inspiration"
          className="header-icon-image"
          style={{
            width: '24px',
            height: '24px',
          }}
        />
      ) : (
        <Heart
          className="header-icon"
          style={{
            width: '24px',
            height: '24px',
            strokeWidth: 2,
            color: '#333333',
          }}
        />
      )}
    </button>
  );
};

export default InspirationIcon;
