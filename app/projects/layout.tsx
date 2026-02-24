'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useParams } from 'next/navigation';
import Sidebar from '@/components/Dashboard/Sidebar';

// ─── Breakpoints ──────────────────────────────────────────────────────────────
// Desktop  : window.innerWidth >= 1024px → sidebar visible
// Compact  : window.innerWidth <  1024px → sidebar hidden + floating pill nav

// ─── Deliveries Sub-menu Tab Bar ─────────────────────────────────────────────
// In-flow tab bar that renders at the TOP of the page content area on
// mobile/tablet — ABOVE the page title ("Virtual Staging Delivery").
//
// Design intent:
//   [Global Header — fixed at top]
//   ↕ gap (from root-main paddingTop)
//   [DeliveriesSubTabBar — white card, shadow, inside page content flow]
//   [Page title + Order #]
//   [Stats bar]
//   [Carousel + gallery …]
//
// By being in-flow (not fixed/sticky) it scrolls with the page, and is
// naturally separated from the global header by the root-main padding gap.
// The white card + bottom border + box-shadow provide clear visual separation.
function DeliveriesSubTabBar({ projectId }: { projectId?: string }) {
  const pathname = usePathname();

  // Only show when in Deliveries section (not MLS Hub)
  const isDeliveriesSection = !pathname?.includes('/mls-hub');
  if (!isDeliveriesSection || !projectId) return null;

  const tabs = [
    {
      label: 'Draft Delivery',
      href: `/projects?page=${projectId}/delivery`,
      // Draft Delivery = old /projects?page= route → pathname is always '/projects'
      active: pathname === '/projects',
    },
    {
      label: 'Latest Revision',
      href: `/projects/${projectId}/delivery`,
      // Use endsWith for exact match — prevents overlap with Draft Delivery
      active: pathname?.endsWith('/delivery') ?? false,
    },
    {
      label: 'Delivery History',
      href: `/projects/${projectId}/history`,
      active: pathname?.endsWith('/history') ?? false,
    },
  ];

  return (
    <div
      className="deliveries-sub-tab-bar"
      style={{
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        boxSizing: 'border-box',
      }}
    >
      {/* Pill container — scaled up ~1.5x from Figma base: padding 3px, gap 3px, radius 12px */}
      <div
        className="deliveries-sub-tab-bar__pill"
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 3,
          padding: 3,
          background: '#FAFAFA',
          border: '1px solid #E9EAEB',
          borderRadius: 12,
          boxSizing: 'border-box',
        }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href as any}
            className={`deliveries-sub-tab-bar__tab${tab.active ? ' deliveries-sub-tab-bar__tab--active' : ''}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              padding: '10px 8px',
              borderRadius: 10,
              fontFamily: 'Inter',
              fontSize: 15,
              fontWeight: 600,
              lineHeight: '22px',
              color: tab.active ? '#414651' : '#717680',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              background: tab.active ? '#FFFFFF' : 'transparent',
              border: tab.active ? '1px solid #D5D7DA' : '1px solid transparent',
              boxShadow: tab.active ? '0px 1px 2px 0px rgba(10,13,18,0.05)' : 'none',
              transition: 'background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
              boxSizing: 'border-box',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Floating Pill Tab Bar ────────────────────────────────────────────────────
// Standalone component (outside ProjectsLayoutInner) so it never re-mounts
// unnecessarily. Matches Figma node 13783-39676.
function FloatingTabBar({ projectId }: { projectId?: string }) {
  const pathname = usePathname();
  const isMLS = pathname?.includes('/mls-hub') ?? false;

  const tabs = [
    {
      label: 'Deliveries',
      href: projectId ? `/projects/${projectId}/delivery` : '/projects',
      active: !isMLS,
    },
    {
      label: 'MLS Hub',
      href: projectId ? `/projects/${projectId}/mls-hub` : '/projects',
      active: isMLS,
    },
  ];

  return (
    <div
      className="projects-floating-tab"
      style={{
        position: 'fixed',
        bottom: 20,
        left: 15,
        right: 15,
        zIndex: 500, // below header (1000) but above page content
        display: 'flex',
        alignItems: 'center',
        height: 54,
        background: '#FFFFFF',
        border: '1.2px solid #E5E7EB',
        borderRadius: 999,
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        padding: '7px',
        gap: 6,
        boxSizing: 'border-box',
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href as any}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            borderRadius: 999,
            background: tab.active ? '#000B14' : 'transparent',
            boxShadow: tab.active
              ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)'
              : 'none',
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: 700,
            color: tab.active ? '#FFFFFF' : '#6B7280',
            textDecoration: 'none',
            transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

// ─── Layout Inner ─────────────────────────────────────────────────────────────
function ProjectsLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams();
  const pageParam = searchParams.get('page') || '';

  // Prefer projectId from URL params (new routes), fallback to prop (old ?page= routes)
  const projectId = (params?.projectId as string) || pageParam.split('/')[0] || undefined;

  // Detect viewport width to toggle sidebar / floating pill.
  // `isMounted` prevents layout flash: on first render we don't know real width,
  // so we render just the content (no sidebar, no pill) until effect fires.
  const [windowWidth, setWindowWidth] = useState<number>(1280);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Before mount (SSR / first paint), treat as desktop to match SSR default of 1280.
  // After mount, use real measured width.
  const isDesktop = !isMounted ? true : windowWidth >= 1024;

  return (
    /*
     * Layout structure:
     * - app/layout.tsx <main> already adds paddingTop for header offset
     * - Desktop (≥1024px): Sidebar (sticky) + Main content side by side
     * - Tablet/Mobile (<1024px): Sidebar hidden, floating pill nav at bottom
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
        className="projects-main-content"
        style={{
          flex: 1,
          minWidth: 0,
          overflowX: 'hidden',
          backgroundColor: '#F9FAFB',
          paddingTop: isDesktop ? 24 : 16,
          paddingLeft: isDesktop ? 32 : 0,
          paddingRight: isDesktop ? 32 : 0,
          // Extra bottom padding on mobile/tablet so content clears the floating pill
          paddingBottom: isDesktop ? 24 : 80,
        }}
      >
        {/* Inner content wrapper with horizontal padding on mobile */}
        <div
          className="projects-main-content__inner"
          style={{
            paddingLeft: isDesktop ? 0 : 12,
            paddingRight: isDesktop ? 0 : 12,
          }}
        >
          {/* Deliveries sub-menu tab bar — in-flow, above page title, only on mobile/tablet */}
          {!isDesktop && <DeliveriesSubTabBar projectId={projectId} />}

          {children}
        </div>
      </main>

      {/* Floating pill tab switcher — only on tablet/mobile */}
      {!isDesktop && <FloatingTabBar projectId={projectId} />}
    </div>
  );
}

// ─── Layout Export ────────────────────────────────────────────────────────────
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProjectsLayoutInner>{children}</ProjectsLayoutInner>
    </Suspense>
  );
}
