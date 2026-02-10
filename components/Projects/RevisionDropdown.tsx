'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export interface RevisionTab {
  label: string;
  href: string;
  isActive: boolean;
  revisionNumber?: number;
}

interface RevisionDropdownProps {
  currentTab: RevisionTab;
  allRevisions: RevisionTab[];
  dropdownLabel?: string; // Optional custom label for dropdown button (defaults to currentTab.label)
}

const RevisionDropdown: React.FC<RevisionDropdownProps> = ({ currentTab, allRevisions, dropdownLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button Container with underline */}
      <div 
        style={{
          display: 'inline-flex',
          width: '200px',
          height: '36px',
          padding: '0 var(--spacing-xs, 4px) var(--spacing-lg, 12px) var(--spacing-xs, 4px)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--spacing-md, 8px)',
          borderBottom: currentTab.isActive 
            ? '2px solid var(--Neutral-Dark900, #000B14)' 
            : 'none',
          position: 'relative',
          zIndex: currentTab.isActive ? 3 : 2,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 'var(--spacing-lg, 12px)',
            color: 'var(--Neutral-Dark900, #000B14)',
            fontFamily: 'var(--Font-family-font-family-body, Inter)',
            fontSize: 'var(--Font-size-text-md, 16px)',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'var(--Line-height-text-md, 24px)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <span>{dropdownLabel || currentTab.label}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="23" 
            viewBox="0 0 18 23" 
            fill="none"
            style={{
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path 
              d="M16 8L8.5 15L1 8" 
              stroke="#000B14" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            display: 'flex',
            width: '220px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.10)',
            backgroundColor: '#fff',
            position: 'absolute',
            top: '100%', // Position dropdown directly below the button container
            left: 0,
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {allRevisions.map((tab, index) => (
            <Link
              key={tab.href}
              href={tab.href as '/projects'}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                height: '44px',
                padding: '12px 42px 10px 16px', // Use same padding for all items to prevent text wrapping differences
                alignItems: 'center',
                alignSelf: 'stretch',
                borderBottom: tab.isActive 
                  ? '1px solid #000' 
                  : index < allRevisions.length - 1 
                    ? '1px solid var(--Colors-Border-border-secondary, #E9EAEB)' 
                    : 'none',
                background: tab.isActive ? 'var(--Neutral-Light200, #ECEFF0)' : 'transparent',
                color: '#000B14',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 340,
                lineHeight: '22px',
                textDecoration: 'none',
                width: '100%',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RevisionDropdown;

