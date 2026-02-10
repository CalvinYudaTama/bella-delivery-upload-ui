'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export const useMegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Open a mega menu
  const openMenu = useCallback((menuId: string) => {
    setActiveMenu(menuId);
  }, []);

  // Close current mega menu
  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setActiveMenu(null);
  }, []);

  // Toggle menu (open if closed, close if open)
  const toggleMenu = useCallback((menuId: string) => {
    setActiveMenu(prev => prev === menuId ? null : menuId);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside mega menu and nav links
      const isMenuClick = (target as Element).closest('.mega-menu');
      const isNavLinkClick = (target as Element).closest('.nav-link');
      
      if (!isMenuClick && !isNavLinkClick && activeMenu) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu, closeAllMenus]);

  // Close menu when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeMenu) {
        closeAllMenus();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeMenu, closeAllMenus]);

  return {
    activeMenu,
    overlayRef,
    openMenu,
    closeMenu,
    closeAllMenus,
    toggleMenu,
  };
};
