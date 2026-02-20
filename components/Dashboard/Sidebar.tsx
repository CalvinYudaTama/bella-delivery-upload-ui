'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Phone } from 'lucide-react';

// SVG Icons
const VirtualStagingIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5"/>
    <path d="M4 9l2.5-2.5L8 8l2-2 2 2" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5" cy="6.5" r="1" fill={active ? '#111827' : '#6B7280'}/>
  </svg>
);

const MLSIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="5" height="5" rx="0.5" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5"/>
    <rect x="9" y="2" width="5" height="5" rx="0.5" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5"/>
    <rect x="2" y="9" width="5" height="5" rx="0.5" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5"/>
    <rect x="9" y="9" width="5" height="5" rx="0.5" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5"/>
  </svg>
);

const OtherServicesIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5"/>
    <path d="M8 5v3l2 2" stroke={active ? '#111827' : '#6B7280'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Chevron UP = active/open, Chevron RIGHT = inactive/closed
const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 10l4-4 4 4" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRight = ({ color = '#9CA3AF' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface SidebarProps {
  projectId?: string;
}

function SidebarInner({ projectId: propProjectId }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();

  // Prefer projectId from URL params (new routes), fallback to prop (old ?page= routes)
  const projectId = (params?.projectId as string) || propProjectId;

  // Detect active section from pathname
  const isDraftActive = pathname === '/projects' || (pathname.includes('/projects') && !pathname.includes('/delivery') && !pathname.includes('/revision') && !pathname.includes('/history'));
  const isDeliveryActive = pathname.includes('/delivery');
  const isRevisionActive = pathname.includes('/revision');
  const isHistoryActive = pathname.includes('/history');
  const isVirtualStagingSection = isDeliveryActive || isRevisionActive || isHistoryActive || isDraftActive;
  const isMLSActive = pathname.includes('/mls-hub');
  const isOtherActive = pathname.includes('/other-services');

  // Keep virtual staging sub-menu open if any sub-item is active
  const [virtualStagingOpen, setVirtualStagingOpen] = useState(isVirtualStagingSection);
  const [otherServicesOpen, setOtherServicesOpen] = useState(false);

  // Build href for sub-items using projectId
  const draftHref    = projectId ? `/projects?page=${projectId}/delivery` : '/projects'; // Old route — Draft Delivery page
  const deliveryHref = projectId ? `/projects/${projectId}/delivery` : '#';              // New route — Latest Revision page
  const revisionHref = projectId ? `/projects/${projectId}/revision` : '#';
  const historyHref  = projectId ? `/projects/${projectId}/history`  : '#';
  const mlsHubHref   = projectId ? `/projects/${projectId}/mls-hub`  : '#';             // MLS Marketing Hub

  // Reusable top-level menu item style
  const menuItemStyle = (active: boolean): React.CSSProperties => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: active ? '#F3F4F6' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    color: active ? '#111827' : '#6B7280',
    fontSize: '14px',
    fontWeight: active ? 600 : 400,
    fontFamily: 'Inter, sans-serif',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'background 0.15s',
    boxSizing: 'border-box' as const,
  });

  // Reusable sub-item style
  const subItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: active ? 600 : 400,
    color: active ? '#111827' : '#6B7280',
    textDecoration: active ? 'underline' : 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    transition: 'background 0.15s',
  });

  return (
    <aside
      style={{
        width: '300px',
        minWidth: '256px',
        height: 'calc(100vh - 132px)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #E9EAEB',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '130px',
        overflowY: 'auto',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      {/* Navigation */}
      <nav style={{ padding: '8px 10px', flex: 1 }}>

        {/* Virtual Staging Delivery */}
        <div>
          <button
            onClick={() => setVirtualStagingOpen(!virtualStagingOpen)}
            style={menuItemStyle(isVirtualStagingSection)}
            onMouseEnter={(e) => { if (!isVirtualStagingSection) (e.currentTarget as HTMLElement).style.backgroundColor = '#F9FAFB'; }}
            onMouseLeave={(e) => { if (!isVirtualStagingSection) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            <span style={{ flexShrink: 0 }}><VirtualStagingIcon active={isVirtualStagingSection} /></span>
            <span style={{ flex: 1 }}>Virtual Staging Delivery</span>
            {/* Chevron UP when active/open, RIGHT when inactive/closed */}
            {isVirtualStagingSection && virtualStagingOpen ? <ChevronUp /> : <ChevronRight />}
          </button>

          {/* Sub-items — shown when open */}
          {virtualStagingOpen && (
            <div style={{ paddingLeft: '28px', paddingTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>

              {/* Draft Delivery — links to old /projects?page= route */}
              <Link
                href={draftHref}
                style={subItemStyle(isDraftActive)}
                onMouseEnter={(e) => { if (!isDraftActive) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { if (!isDraftActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>Draft Delivery</span>
                <ChevronRight color={isDraftActive ? '#111827' : '#9CA3AF'} />
              </Link>

              {/* Latest Revision */}
              <Link
                href={deliveryHref}
                style={subItemStyle(isDeliveryActive)}
                onMouseEnter={(e) => { if (!isDeliveryActive) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { if (!isDeliveryActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>Latest Revision</span>
                <ChevronRight color={isDeliveryActive ? '#111827' : '#9CA3AF'} />
              </Link>

              {/* Delivery History */}
              <Link
                href={historyHref}
                style={subItemStyle(isHistoryActive)}
                onMouseEnter={(e) => { if (!isHistoryActive) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { if (!isHistoryActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>Delivery History</span>
                <ChevronRight color={isHistoryActive ? '#111827' : '#9CA3AF'} />
              </Link>

            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '8px 12px' }} />

        {/* MLS Marketing Hub */}
        <div>
          <Link
            href={mlsHubHref}
            style={menuItemStyle(isMLSActive)}
            onMouseEnter={(e) => { if (!isMLSActive) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
            onMouseLeave={(e) => { if (!isMLSActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span style={{ flexShrink: 0 }}><MLSIcon active={isMLSActive} /></span>
            <span style={{ flex: 1 }}>MLS Marketing Hub</span>
            <ChevronRight />
          </Link>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '8px 12px' }} />

        {/* Other Featured Services */}
        <div>
          <button
            onClick={() => setOtherServicesOpen(!otherServicesOpen)}
            style={menuItemStyle(isOtherActive)}
            onMouseEnter={(e) => { if (!isOtherActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#F9FAFB'; }}
            onMouseLeave={(e) => { if (!isOtherActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            <span style={{ flexShrink: 0 }}><OtherServicesIcon active={isOtherActive} /></span>
            <span style={{ flex: 1 }}>Other Featured Services</span>
            {isOtherActive && otherServicesOpen ? <ChevronUp /> : <ChevronRight />}
          </button>

          {/* Sub-items */}
          {otherServicesOpen && (
            <div style={{ paddingLeft: '28px', paddingTop: '2px' }}>
              {['Furniture Removal', 'Design My Room'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    color: '#6B7280',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Call Support - Bottom — entire block is clickable, opens WhatsApp */}
      <div style={{ borderTop: '1px solid #E9EAEB', padding: '16px' }}>
        <Link
          href="https://api.whatsapp.com/send/?phone=17788595252&text=Hi+Bella%2C+I%E2%80%99m+interested+in+virtual+staging&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            gap: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
        >
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              Call Support
            </p>
            <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', margin: '2px 0 0 0' }}>
              Contact us if you need a help
            </p>
          </div>
          <div
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111827',
              borderRadius: '6px',
              color: '#fff',
            }}
          >
            <Phone width={14} height={14} />
          </div>
        </Link>
      </div>
    </aside>
  );
}

// Wrap with Suspense because useSearchParams() requires it in Next.js App Router
export default function Sidebar({ projectId }: SidebarProps) {
  return (
    <Suspense fallback={<div style={{ width: '256px', minWidth: '256px', backgroundColor: '#ffffff', borderRight: '1px solid #E9EAEB' }} />}>
      <SidebarInner projectId={projectId} />
    </Suspense>
  );
}
