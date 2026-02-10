import React from 'react';
import type { Route } from 'next';
import Link from 'next/link';

interface MenuItem {
  title: string;
  url: string;
}

interface FooterMenuProps {
  heading: string;
  menu: MenuItem[];
  headingColor?: string;
  headingWeight?: number;
  linkColor?: string;
  isActive?: boolean;
  onToggle?: () => void;
}

const FooterMenu: React.FC<FooterMenuProps> = ({
  heading,
  menu,
  headingColor = '#ffffff',
  headingWeight = 600,
  linkColor = '#ffffff',
  isActive = false,
  onToggle
}) => {
  return (
    <div className={`bella-footer__column bella-footer__column--menu ${isActive ? 'active' : ''}`}>
      {/* Desktop: Standalone heading */}
      {heading && (
        <h3
          className="bella-footer__heading bella-footer__heading--desktop"
          style={{
            color: headingColor,
            fontWeight: headingWeight
          }}
        >
          {heading}
        </h3>
      )}

      {/* Mobile: Accordion toggle button with heading inside */}
      <button
        type="button"
        className="bella-footer__accordion-toggle"
        aria-expanded={isActive}
        onClick={onToggle}
        data-footer-accordion
      >
        {heading && (
          <h3
            className="bella-footer__heading bella-footer__heading--mobile"
            style={{
              color: headingColor,
              fontWeight: headingWeight
            }}
          >
            {heading}
          </h3>
        )}
        <span className="bella-footer__accordion-icon">
          <svg viewBox="0 0 24 24" stroke="white" strokeWidth="2" fill="none">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      
      {menu && menu.length > 0 && (
        <ul className="bella-footer__menu">
          {menu.map((link, index) => (
            <li key={index} className="bella-footer__menu-item">
              <Link
                href={link.url as Route}
                className="bella-footer__menu-link"
                style={{ color: linkColor }}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FooterMenu;

