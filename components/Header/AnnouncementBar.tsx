'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  onClose?: () => void;
  closeable?: boolean;
}

/**
 * Announcement Bar Component
 * Top banner for announcements - copied from Shopify theme
 * Includes close button functionality
 */
const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = 'Virtual Staging that Sells Better | 6–12 Hr Turnaround ✨',
  icon,
  backgroundColor = '#121212',
  textColor = '#ffffff',
  onClose,
  closeable = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="announcement-bar"
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor,
        color: textColor,
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="announcement-bar-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 20px',
          width: '100%',
        }}
      >
        {icon && (
          <div
            className="announcement-icon"
            style={{
              fontSize: '18px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </div>
        )}

        <div
          className="announcement-text"
          style={{
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.5,
            textAlign: 'center',
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />

        {closeable && (
          <button
            onClick={handleClose}
            className="announcement-close"
            aria-label="Close announcement"
            type="button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
              padding: '4px',
              marginLeft: '8px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;

