'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Dashboard/Sidebar';

// ─── Breakpoints ──────────────────────────────────────────────────────────────
// Desktop  : window.innerWidth >= 1024px → sidebar visible
// Compact  : window.innerWidth <  1024px → sidebar hidden, content full-width

function ProjectsLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || '';
  const projectId = pageParam.split('/')[0] || undefined;

  // Detect viewport width to toggle sidebar
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    // Set accurate initial value after mount
    setWindowWidth(window.innerWidth);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isDesktop = windowWidth >= 1024;

  return (
    /*
     * Layout structure:
     * - app/layout.tsx <main> already adds paddingTop: 102px (header offset)
     * - Desktop (≥1024px): Sidebar (sticky) + Main content side by side
     * - Tablet/Mobile (<1024px): Sidebar hidden, Main content full-width
     */
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      {/* Sidebar — only visible on desktop */}
      {isDesktop && <Sidebar projectId={projectId} />}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowX: 'hidden',
          backgroundColor: '#F9FAFB',
          padding: isDesktop ? '24px 32px' : '16px',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProjectsLayoutInner>{children}</ProjectsLayoutInner>
    </Suspense>
  );
}
