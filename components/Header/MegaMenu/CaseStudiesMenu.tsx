'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { gsap } from 'gsap';
import MegaMenuContainer from './MegaMenuContainer';
import { CASE_STUDIES_MENU_DATA } from '@/config/megaMenuData';

interface CaseStudiesMenuProps {
  isActive: boolean;
  data?: {
    caseStudies: Array<{
      id: string;
      title: string;
      url: string;
    }>;
  };
}

/**
 * Case Studies Menu Component
 * 
 * Simple dropdown list for "Case Studies" menu.
 * Matches Shopify Header Code structure - compact list style.
 */
const CaseStudiesMenu: React.FC<CaseStudiesMenuProps> = ({ isActive, data }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const animationSpeed = 0.4;

  // Use data from config
  const defaultData = {
    caseStudies: CASE_STUDIES_MENU_DATA,
  };

  const menuData = data || defaultData;

  // Animate list items when menu opens
  useEffect(() => {
    if (!isActive || !listRef.current) return;

    const items = listRef.current.querySelectorAll('.case-studies-item');
    
    // Reset and animate
    gsap.set(items, { opacity: 0, x: -10 });
    gsap.to(items, {
      opacity: 1,
      x: 0,
      duration: animationSpeed,
      stagger: 0.05,
      ease: 'power2.out',
    });

    return () => {
      gsap.killTweensOf(items);
    };
  }, [isActive, animationSpeed]);

  if (!isActive) return null;

  return (
    <MegaMenuContainer className="mega-menu-container--case-studies">
      <div className="mega-menu-content mega-menu-content--case-studies">
        <nav className="case-studies-nav" aria-label="Case Studies">
          <ul className="case-studies-list" ref={listRef}>
            {menuData.caseStudies.map((caseStudy) => (
              <li key={caseStudy.id} className="case-studies-item">
                <Link href={caseStudy.url as Route} className="case-studies-link">
                  <span className="case-studies-link-text">{caseStudy.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </MegaMenuContainer>
  );
};

export default CaseStudiesMenu;
