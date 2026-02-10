'use client';

import React from 'react';

interface AnnouncementBarProps {
  text?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
}

/**
 * Announcement Bar Component
 * 
 * Fixed top bar that displays promotional text.
 * Matches Shopify Header Code structure.
 */
const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = 'Transform Empty Rooms into Dream Homes | 24-48 Hour Turnaround ✨',
  icon,
  bgColor = '#212121',
  textColor = '#FFFFFF',
  fontSize = 16,
  fontWeight = 400,
}) => {
  return (
    <div
      className="announcement-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        background: bgColor,
        color: textColor,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        textAlign: 'center',
        padding: '10px 20px',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        minHeight: '40px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="announcement-bar-inner"
        style={{
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {icon && (
          <div
            className="announcement-icon"
            style={{
              width: '16px',
              height: '16px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
        
        <div
          className="announcement-text"
          style={{
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          <p style={{ margin: 0, display: 'inline' }}>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;

