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
// unnecessarily. Matches Figma node 14645-30844.
function FloatingTabBar({ projectId }: { projectId?: string }) {
  const pathname = usePathname();
  const isMLS = pathname?.includes('/mls-hub') ?? false;

  const tabs = [
    {
      label: 'Deliveries',
      href: projectId ? `/projects/${projectId}/delivery` : '/projects',
      active: !isMLS,
      icon: (active: boolean) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M7.33333 14.4867C7.53603 14.6037 7.76595 14.6653 8 14.6653C8.23405 14.6653 8.46397 14.6037 8.66667 14.4867L13.3333 11.82C13.5358 11.7031 13.704 11.535 13.821 11.3326C13.938 11.1301 13.9998 10.9005 14 10.6667V5.33333C13.9998 5.09952 13.938 4.86987 13.821 4.66744C13.704 4.46501 13.5358 4.29691 13.3333 4.18L8.66667 1.51333C8.46397 1.39631 8.23405 1.3347 8 1.3347C7.76595 1.3347 7.53603 1.39631 7.33333 1.51333L2.66667 4.18C2.46418 4.29691 2.29599 4.46501 2.17897 4.66744C2.06196 4.86987 2.00024 5.09952 2 5.33333V10.6667C2.00024 10.9005 2.06196 11.1301 2.17897 11.3326C2.29599 11.535 2.46418 11.7031 2.66667 11.82L7.33333 14.4867Z" stroke={active ? '#FFFFFF' : '#000B14'} strokeWidth="1.66652" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14.6667V8" stroke={active ? '#FFFFFF' : '#000B14'} strokeWidth="1.66652" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.19333 4.66667L8 8L13.8067 4.66667" stroke={active ? '#FFFFFF' : '#000B14'} strokeWidth="1.66652" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 2.84667L11 6.28" stroke={active ? '#FFFFFF' : '#000B14'} strokeWidth="1.66652" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'MLS Hub',
      href: projectId ? `/projects/${projectId}/mls-hub` : '/projects',
      active: isMLS,
      icon: (active: boolean) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M2.58333 14.75C2.19444 14.3611 2 13.8889 2 13.3333C2 12.7778 2.19444 12.3056 2.58333 11.9167C2.97222 11.5278 3.44444 11.3333 4 11.3333C4.15556 11.3333 4.3 11.35 4.43333 11.3833C4.56667 11.4167 4.69444 11.4611 4.81667 11.5167L5.76667 10.3333C5.45556 9.98889 5.23889 9.6 5.11667 9.16667C4.99444 8.73333 4.96667 8.3 5.03333 7.86667L3.68333 7.41667C3.49444 7.69444 3.25556 7.91667 2.96667 8.08333C2.67778 8.25 2.35556 8.33333 2 8.33333C1.44444 8.33333 0.972222 8.13889 0.583333 7.75C0.194444 7.36111 0 6.88889 0 6.33333C0 5.77778 0.194444 5.30556 0.583333 4.91667C0.972222 4.52778 1.44444 4.33333 2 4.33333C2.55556 4.33333 3.02778 4.52778 3.41667 4.91667C3.80556 5.30556 4 5.77778 4 6.33333V6.46667L5.35 6.93333C5.57222 6.53333 5.86956 6.19444 6.242 5.91667C6.61444 5.63889 7.03378 5.46111 7.5 5.38333V3.93333C7.06667 3.81111 6.70844 3.57489 6.42533 3.22467C6.14222 2.87444 6.00044 2.46622 6 2C6 1.44444 6.19444 0.972222 6.58333 0.583333C6.97222 0.194444 7.44444 0 8 0C8.55556 0 9.02778 0.194444 9.41667 0.583333C9.80556 0.972222 10 1.44444 10 2C10 2.46667 9.85556 2.87511 9.56667 3.22533C9.27778 3.57556 8.92222 3.81156 8.5 3.93333V5.38333C8.96667 5.46111 9.38622 5.63889 9.75867 5.91667C10.1311 6.19444 10.4282 6.53333 10.65 6.93333L12 6.46667V6.33333C12 5.77778 12.1944 5.30556 12.5833 4.91667C12.9722 4.52778 13.4444 4.33333 14 4.33333C14.5556 4.33333 15.0278 4.52778 15.4167 4.91667C15.8056 5.30556 16 5.77778 16 6.33333C16 6.88889 15.8056 7.36111 15.4167 7.75C15.0278 8.13889 14.5556 8.33333 14 8.33333C13.6444 8.33333 13.3193 8.25 13.0247 8.08333C12.73 7.91667 12.494 7.69444 12.3167 7.41667L10.9667 7.86667C11.0333 8.3 11.0056 8.73067 10.8833 9.15867C10.7611 9.58667 10.5444 9.97822 10.2333 10.3333L11.1833 11.5C11.3056 11.4444 11.4333 11.4029 11.5667 11.3753C11.7 11.3478 11.8444 11.3338 12 11.3333C12.5556 11.3333 13.0278 11.5278 13.4167 11.9167C13.8056 12.3056 14 12.7778 14 13.3333C14 13.8889 13.8056 14.3611 13.4167 14.75C13.0278 15.1389 12.5556 15.3333 12 15.3333C11.4444 15.3333 10.9722 15.1389 10.5833 14.75C10.1944 14.3611 10 13.8889 10 13.3333C10 13.1111 10.0362 12.8973 10.1087 12.692C10.1811 12.4867 10.2782 12.3004 10.4 12.1333L9.45 10.95C8.99444 11.2056 8.50844 11.3333 7.992 11.3333C7.47556 11.3333 6.98933 11.2056 6.53333 10.95L5.6 12.1333C5.72222 12.3 5.81956 12.4862 5.892 12.692C5.96444 12.8978 6.00044 13.1116 6 13.3333C6 13.8889 5.80556 14.3611 5.41667 14.75C5.02778 15.1389 4.55556 15.3333 4 15.3333C3.44444 15.3333 2.97222 15.1389 2.58333 14.75ZM8 10C8.46667 10 8.86111 9.83889 9.18333 9.51667C9.50556 9.19444 9.66667 8.8 9.66667 8.33333C9.66667 7.86667 9.50556 7.47222 9.18333 7.15C8.86111 6.82778 8.46667 6.66667 8 6.66667C7.53333 6.66667 7.13889 6.82778 6.81667 7.15C6.49444 7.47222 6.33333 7.86667 6.33333 8.33333C6.33333 8.8 6.49444 9.19444 6.81667 9.51667C7.13889 9.83889 7.53333 10 8 10Z" fill={active ? '#FFFFFF' : '#000B14'}/>
        </svg>
      ),
    },
  ];

  return (
    // Outer bottom bar — full-width, flush to bottom edge (Figma node 14645:30844)
    <div
      className="projects-floating-tab"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        background: 'rgba(255, 255, 255, 0.9)',
        borderTop: '0.653px solid #E5E7EB',
        boxShadow: '0px -4px 20px 0px rgba(0,0,0,0.1)',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      {/* Inner pill container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 49,
          padding: '2px 2px 0',
          gap: 6,
          borderRadius: 999,
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
              gap: 8,
              borderRadius: 999,
              padding: tab.active ? '9px 33px' : '9px 37px',
              background: tab.active ? '#000B14' : 'transparent',
              boxShadow: tab.active
                ? '0px 4px 6px 0px rgba(0,0,0,0.1), 0px 2px 4px 0px rgba(0,0,0,0.1)'
                : 'none',
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: 500,
              color: tab.active ? '#FFFFFF' : '#000B14',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
              transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {tab.icon(tab.active)}
            {tab.label}
          </Link>
        ))}
      </div>
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
          overflowX: 'clip',
          backgroundColor: '#F9FAFB',
          paddingTop: isDesktop ? 24 : 16,
          paddingLeft: isDesktop ? 32 : 0,
          paddingRight: isDesktop ? 32 : 0,
          // Extra bottom padding on mobile/tablet so content clears the bottom nav bar
          // Bar height: ~65px (8px top + 49px pill + 8px bottom). Extra 35px for breathing room.
          paddingBottom: isDesktop ? 24 : 100,
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
