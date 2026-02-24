'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeliveryImage {
  id: string;
  url: string;
  isApproved: boolean;
  // TODO (Riley): add more fields as needed from API response
}

interface LatestRevisionContentProps {
  projectId: string;
  orderId?: string;
  // TODO (Riley): replace dummy images with real data from API
  inProgressImages?: DeliveryImage[];
  completedImages?: DeliveryImage[];
  onApproveAll?: () => void;
  onDownloadInProgress?: () => void;
  onDownloadCompleted?: () => void;
}

// ─── Icon Components ──────────────────────────────────────────────────────────

// Thumbs up icon for Approve All button
const ThumbsUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.66602 6.66602V14.666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.0007 3.92065L9.33398 6.66732H13.2207C13.4276 6.66732 13.6318 6.71551 13.8169 6.80808C14.0021 6.90065 14.1631 7.03506 14.2873 7.20065C14.4115 7.36625 14.4954 7.55848 14.5325 7.76214C14.5695 7.96579 14.5586 8.17527 14.5007 8.37398L12.9473 13.7073C12.8665 13.9843 12.6981 14.2276 12.4673 14.4007C12.2365 14.5737 11.9558 14.6673 11.6673 14.6673H2.66732C2.3137 14.6673 1.97456 14.5268 1.72451 14.2768C1.47446 14.0267 1.33398 13.6876 1.33398 13.334V8.00065C1.33398 7.64703 1.47446 7.30789 1.72451 7.05784C1.97456 6.80779 2.3137 6.66732 2.66732 6.66732H4.50732C4.75537 6.66719 4.99848 6.59786 5.20929 6.46713C5.4201 6.3364 5.59027 6.14946 5.70065 5.92732L8.00065 1.33398C8.31504 1.33788 8.62448 1.41276 8.90585 1.55305C9.18723 1.69333 9.43327 1.89539 9.62559 2.14412C9.81791 2.39285 9.95153 2.68182 10.0165 2.98945C10.0814 3.29708 10.076 3.61541 10.0007 3.92065Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Download icon for Download All button
const DownloadIcon = ({ color = '#4F46E5' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3V10M8 10L5.5 7.5M8 10L10.5 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Figma design placeholder assets (from Figma MCP — local dev only) ────────
// TODO (Riley): replace these with real hosted image URLs from your CDN/API
const FIGMA_MAIN_IMAGE_URL    = '/images/delivery/main-living-room.png'; // living room wide
const FIGMA_IMG_BEDROOM       = '/images/delivery/bedroom.png'; // bedroom
const FIGMA_IMG_LIVING_ROOM   = '/images/delivery/living-room.png'; // living room
const FIGMA_IMG_DINING_ROOM   = '/images/delivery/dining-room.png'; // dining room
const FIGMA_FACE_HAPPY_URL    = '/images/delivery/face-happy.svg';
const FIGMA_FACE_SAD_URL      = '/images/delivery/face-sad.svg';


// ─── Dummy data (TODO Riley: replace with real API data) ──────────────────────

// TODO (Riley): replace all dummy data with real images from API
const DUMMY_IN_PROGRESS: DeliveryImage[] = [
  { id: '1', url: FIGMA_IMG_LIVING_ROOM, isApproved: false },
  { id: '2', url: FIGMA_IMG_DINING_ROOM, isApproved: false },
  { id: '3', url: FIGMA_IMG_BEDROOM,     isApproved: false },
];

const DUMMY_COMPLETED: DeliveryImage[] = [
  { id: '4', url: FIGMA_IMG_BEDROOM,     isApproved: true },
  { id: '5', url: FIGMA_IMG_LIVING_ROOM, isApproved: true },
  { id: '6', url: FIGMA_IMG_DINING_ROOM, isApproved: true },
  { id: '7', url: FIGMA_MAIN_IMAGE_URL,  isApproved: true },
];

// ─── Gallery Image Card ───────────────────────────────────────────────────────

function GalleryImageCard({ image, isTabletOrMobile }: { image: DeliveryImage; isTabletOrMobile: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="revision-gallery-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '10px',
        flexShrink: 0,
        overflow: 'hidden',
        border: image.isApproved ? '2px solid #16A34A' : '2px solid transparent',
        cursor: 'pointer',
        // Always landscape 16:10 aspect ratio — responsive via grid column width
        aspectRatio: '16 / 10',
      }}
    >
      {/* Base image */}
      <img
        className="revision-gallery-card__image"
        src={image.url}
        alt="delivery"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
      />

      {/* Dark gradient overlay — always subtle, stronger on hover (matching Figma) */}
      <div
        className="revision-gallery-card__overlay"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '10px',
          background: hovered
            ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)',
          transition: 'background 0.2s ease',
        }}
      />

      {/* Face icon — top right, always visible */}
      <div
        className="revision-gallery-card__face-icon"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: isTabletOrMobile ? '28px' : '40px',
          height: isTabletOrMobile ? '28px' : '40px',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <img
          className="revision-gallery-card__face-icon-img"
          src={image.isApproved ? FIGMA_FACE_HAPPY_URL : FIGMA_FACE_SAD_URL}
          alt={image.isApproved ? 'completed' : 'in progress'}
          style={{
            width: isTabletOrMobile ? '28px' : '40px',
            height: isTabletOrMobile ? '28px' : '40px',
            aspectRatio: '1 / 1',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Hover action buttons — bottom RIGHT (View, Link, Download) */}
      {/* TODO (Riley): wire onClick handlers to real actions */}
      <div
        className="revision-gallery-card__actions"
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          zIndex: 2,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {/* View button */}
        <button
          className="revision-gallery-card__action-btn revision-gallery-card__action-btn--view"
          aria-label="View image"
          style={{
            width: '32px', height: '32px', padding: '0',
            border: 'none', background: 'transparent',
            cursor: 'pointer', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.8729 15.6096C25.6942 15.3652 21.4371 9.625 15.9999 9.625C10.5627 9.625 6.30539 15.3652 6.12691 15.6094C5.9577 15.8413 5.9577 16.1558 6.12691 16.3876C6.30539 16.632 10.5627 22.3723 15.9999 22.3723C21.4371 22.3723 25.6942 16.632 25.8729 16.3878C26.0423 16.156 26.0423 15.8413 25.8729 15.6096ZM15.9999 21.0536C11.9949 21.0536 8.52606 17.2437 7.49922 15.9982C8.52473 14.7516 11.9863 10.9437 15.9999 10.9437C20.0048 10.9437 23.4733 14.7529 24.5006 15.9991C23.4751 17.2456 20.0135 21.0536 15.9999 21.0536Z" fill="white"/>
            <path d="M15.999 12.0449C13.8177 12.0449 12.043 13.8197 12.043 16.001C12.043 18.1823 13.8177 19.957 15.999 19.957C18.1804 19.957 19.9551 18.1823 19.9551 16.001C19.9551 13.8197 18.1804 12.0449 15.999 12.0449ZM15.999 18.6383C14.5447 18.6383 13.3617 17.4552 13.3617 16.001C13.3617 14.5467 14.5448 13.3636 15.999 13.3636C17.4533 13.3636 18.6364 14.5467 18.6364 16.001C18.6364 17.4552 17.4533 18.6383 15.999 18.6383Z" fill="white"/>
          </svg>
        </button>

        {/* Link / Copy button */}
        <button
          className="revision-gallery-card__action-btn revision-gallery-card__action-btn--link"
          aria-label="Copy link"
          style={{
            width: '32px', height: '32px', padding: '0',
            border: 'none', background: 'transparent',
            cursor: 'pointer', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip_link)">
              <path d="M16.612 19.0598L14.1639 21.508C13.1514 22.5205 11.5041 22.5206 10.4916 21.5081C10.0012 21.0176 9.73111 20.3655 9.73111 19.672C9.73111 18.9785 10.0012 18.3265 10.4915 17.836L12.9397 15.3877C13.2777 15.0497 13.2777 14.5016 12.9397 14.1636C12.6017 13.8257 12.0536 13.8257 11.7156 14.1636L9.26752 16.6118C8.44997 17.4297 8 18.5163 8 19.672C8 20.8279 8.45015 21.9147 9.26758 22.7322C10.1113 23.5758 11.2195 23.9977 12.3278 23.9977C13.436 23.9977 14.5443 23.5758 15.3879 22.7322L17.836 20.2839C18.174 19.9459 18.174 19.3979 17.836 19.0598C17.4981 18.7219 16.9501 18.7219 16.612 19.0598Z" fill="white"/>
              <path d="M23.9999 12.3277C23.9999 11.1717 23.5497 10.0849 22.7323 9.26746C21.0448 7.58009 18.2992 7.58015 16.6119 9.26746L14.1637 11.7157C13.8256 12.0537 13.8256 12.6018 14.1637 12.9398C14.5017 13.2778 15.0497 13.2778 15.3877 12.9398L17.8361 10.4915C18.8484 9.47917 20.4957 9.47912 21.5082 10.4915C21.9986 10.982 22.2688 11.6341 22.2688 12.3277C22.2688 13.0211 21.9987 13.6731 21.5084 14.1636L19.0601 16.6119C18.7221 16.9499 18.7221 17.498 19.0602 17.836C19.3982 18.174 19.9462 18.174 20.2842 17.836L22.7328 15.3873C23.5499 14.57 23.9999 13.4833 23.9999 12.3277Z" fill="white"/>
              <path d="M12.9391 19.0613C13.3081 19.4303 13.9081 19.4303 14.1631 19.0613L19.0594 14.165C19.3974 13.8271 19.3974 13.279 19.0594 12.941C18.7214 12.603 18.1734 12.603 17.8353 12.941L12.9391 17.8372C12.601 18.1753 12.601 18.7233 12.9391 19.0613Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip_link">
                <rect width="16" height="16" fill="white" transform="translate(8 8)"/>
              </clipPath>
            </defs>
          </svg>
        </button>

        {/* Download button */}
        <button
          className="revision-gallery-card__action-btn revision-gallery-card__action-btn--download"
          aria-label="Download image"
          style={{
            width: '32px', height: '32px', padding: '0',
            border: 'none', background: 'transparent',
            cursor: 'pointer', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18.6813C15.9 18.6813 15.8063 18.6658 15.7188 18.6348C15.6312 18.6038 15.55 18.5505 15.475 18.475L12.775 15.775C12.625 15.625 12.553 15.45 12.559 15.25C12.565 15.05 12.637 14.875 12.775 14.725C12.925 14.575 13.1033 14.497 13.3098 14.491C13.5163 14.485 13.6943 14.5568 13.8438 14.7063L15.25 16.1125V10.75C15.25 10.5375 15.322 10.3595 15.466 10.216C15.61 10.0725 15.788 10.0005 16 10C16.212 9.9995 16.3903 10.0715 16.5347 10.216C16.6793 10.3605 16.751 10.5385 16.75 10.75V16.1125L18.1562 14.7063C18.3062 14.5563 18.4845 14.4843 18.691 14.4903C18.8975 14.4963 19.0755 14.5745 19.225 14.725C19.3625 14.875 19.4345 15.05 19.441 15.25C19.4475 15.45 19.3755 15.625 19.225 15.775L16.525 18.475C16.45 18.55 16.3688 18.6033 16.2812 18.6348C16.1937 18.6663 16.1 18.6818 16 18.6813ZM11.5 22C11.0875 22 10.7345 21.8533 10.441 21.5598C10.1475 21.2663 10.0005 20.913 10 20.5V19C10 18.7875 10.072 18.6095 10.216 18.466C10.36 18.3225 10.538 18.2505 10.75 18.25C10.962 18.2495 11.1402 18.3215 11.2847 18.466C11.4292 18.6105 11.501 18.7885 11.5 19V20.5H20.5V19C20.5 18.7875 20.572 18.6095 20.716 18.466C20.86 18.3225 21.038 18.2505 21.25 18.25C21.462 18.2495 21.6402 18.3215 21.7847 18.466C21.9292 18.6105 22.001 18.7885 22 19V20.5C22 20.9125 21.8533 21.2658 21.5597 21.5598C21.2662 21.8538 20.913 22.0005 20.5 22H11.5Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Section Header (tab style) ───────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div
      className="revision-section-header"
      style={{
        width: '100%',
        borderBottom: '2px solid #E9EAEB',
        marginBottom: '20px',
      }}
    >
      <div
        className="revision-section-header__tab"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: '36px',
          paddingBottom: '12px',
          paddingLeft: '4px',
          paddingRight: '4px',
          borderBottom: '2px solid #000B14',
          marginBottom: '-2px',
        }}
      >
        <span
          className="revision-section-header__label"
          style={{
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000B14',
            lineHeight: '20px',
          }}
        >
          {label}
        </span>
        {/* Badge */}
        <div
          className="revision-section-header__badge"
          style={{
            backgroundColor: '#000B14',
            borderRadius: '9999px',
            padding: '1px 8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            className="revision-section-header__badge-count"
            style={{
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 500,
              color: '#FFFDFF',
              lineHeight: '18px',
            }}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LatestRevisionContent({
  projectId,
  orderId,
  inProgressImages = DUMMY_IN_PROGRESS,
  completedImages = DUMMY_COMPLETED,
  onApproveAll,
  onDownloadInProgress,
  onDownloadCompleted,
}: LatestRevisionContentProps) {

  const totalPhotos = inProgressImages.length + completedImages.length;

  // ─── Responsive breakpoint (matches layout.tsx and DeliveryContent.tsx) ──────
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsTabletOrMobile(typeof window !== 'undefined' && window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── Carousel state ──────────────────────────────────────────────────────────
  // All images combined for carousel navigation (in-progress first, then completed)
  // TODO (Riley): wire to real image list from API
  const allImages = useMemo(
    () => [...inProgressImages, ...completedImages],
    [inProgressImages, completedImages]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePreviousImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  // Safe index in case allImages changes length
  const safeIndex = allImages.length > 0 ? currentIndex % allImages.length : 0;

  // Current image shown in main preview (falls back to Figma placeholder if no images)
  const currentImageUrl = allImages[safeIndex]?.url ?? FIGMA_MAIN_IMAGE_URL;

  return (
    <div className="revision-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ─── PAGE HEADER — same as .delivery-page-header (responsive) ────────── */}
      <div
        className="revision-page-header"
        style={{
          display: 'flex',
          flexDirection: isTabletOrMobile ? 'column' : 'row',
          alignItems: isTabletOrMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isTabletOrMobile ? '4px' : '0',
          width: '100%',
          marginBottom: isTabletOrMobile ? '12px' : '16px',
        }}
      >
        <h1
          className="revision-page-header__title"
          style={{
            color: '#000B14',
            fontFamily: 'Inter',
            fontSize: isTabletOrMobile ? '18px' : '24px',
            fontWeight: 600,
            lineHeight: isTabletOrMobile ? '1.4' : '32px',
            margin: 0,
          }}
        >
          Virtual Staging Delivery
        </h1>
        {/* TODO (Riley): replace with real order ID from API */}
        <span
          className="revision-page-header__order"
          style={{
            color: '#535862',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
          }}
        >
          Order # {orderId || projectId || '—'}
        </span>
      </div>

      {/* ─── STATS BAR — same as .delivery-stats-bar (responsive) ─────────────
          Desktop  : single row — stats left, buttons right
          Tablet/Mobile: stats row on top, buttons row below (full-width)
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="revision-stats-bar"
        style={{
          display: 'flex',
          flexDirection: isTabletOrMobile ? 'column' : 'row',
          alignItems: isTabletOrMobile ? 'stretch' : 'center',
          gap: isTabletOrMobile ? '12px' : '24px',
          padding: isTabletOrMobile ? '12px' : '12px 16px',
          borderRadius: '8px',
          border: '1px solid #E9EAEB',
          background: '#FFFFFF',
          marginBottom: isTabletOrMobile ? '16px' : '20px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Top row: stats */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: isTabletOrMobile ? '12px' : '24px',
          flex: isTabletOrMobile ? 'none' : 1,
        }}>
          {/* Stat: Photos Delivered */}
          <div className="revision-stats-bar__stat" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
              <rect width="32" height="32" rx="16" fill="#DCFCE7"/>
              <path d="M10.667 16L14.0003 19.3333L21.3337 12" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {/* TODO (Riley): replace with real count from API */}
              <span style={{ color: '#000B14', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, lineHeight: '20px' }}>
                {totalPhotos} Photos Delivered
              </span>
              <span style={{ color: '#858A8E', fontFamily: 'Inter', fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                Ready for review
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="revision-stats-bar__divider" style={{ width: '1px', height: '36px', background: '#E9EAEB', flexShrink: 0 }} />

          {/* Stat: Total File Size */}
          <div className="revision-stats-bar__stat" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
              <rect width="32" height="32" rx="16" fill="#EFF6FF"/>
              <path d="M16 10V18M16 18L13 15M16 18L19 15" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 20H21" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {/* TODO (Riley): replace with real file size from API */}
              <span style={{ color: '#000B14', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, lineHeight: '20px' }}>
                2.4GB Total
              </span>
              <span style={{ color: '#858A8E', fontFamily: 'Inter', fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}>
                Available to download
              </span>
            </div>
          </div>

          {/* Spacer — only on desktop to push buttons right */}
          {!isTabletOrMobile && <div className="revision-stats-bar__spacer" style={{ flex: 1 }} />}

          {/* Desktop: Approve All Button inline */}
          {!isTabletOrMobile && (
            <button
              className="revision-stats-bar__approve-btn"
              type="button"
              onClick={onApproveAll}
              disabled={inProgressImages.length === 0}
              style={{
                display: 'flex', height: '36px', padding: '0 16px',
                alignItems: 'center', gap: '8px', borderRadius: '6px',
                background: inProgressImages.length === 0 ? '#C1C2C3' : '#00A63E',
                border: 'none', color: '#FFFFFF',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                cursor: inProgressImages.length === 0 ? 'not-allowed' : 'pointer',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              <ThumbsUpIcon />
              Approve All
            </button>
          )}

          {/* Desktop: Download All Button inline */}
          {!isTabletOrMobile && (
            <button
              className="revision-stats-bar__download-btn"
              type="button"
              onClick={onDownloadInProgress}
              style={{
                display: 'flex', height: '36px', padding: '0 16px',
                alignItems: 'center', gap: '8px', borderRadius: '6px',
                border: '1.5px solid #4F46E5', background: '#FFFFFF', color: '#4F46E5',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              <DownloadIcon />
              Download All
            </button>
          )}
        </div>

        {/* Mobile/Tablet bottom row: full-width action buttons */}
        {isTabletOrMobile && (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            {inProgressImages.length > 0 && (
              <button
                type="button"
                onClick={onApproveAll}
                style={{
                  flex: 1, height: '38px', padding: '0 12px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
                  borderRadius: '8px', border: 'none',
                  background: '#00A63E', color: '#FFFFFF',
                  fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                <ThumbsUpIcon />
                Approve All
              </button>
            )}
            <button
              type="button"
              onClick={onDownloadInProgress}
              style={{
                flex: 1, height: '38px', padding: '0 12px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px',
                borderRadius: '8px', border: '1.5px solid #4F46E5',
                background: '#FFFFFF', color: '#4F46E5',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <DownloadIcon />
              Download All
            </button>
          </div>
        )}
      </div>

      {/* ─── MAIN PREVIEW IMAGE (carousel) — landscape, same as DeliveryContent ─
          Desktop  : fixed height 622px
          Tablet/Mobile: aspect-ratio 390/249 (landscape)
      ──────────────────────────────────────────────────────────────────────── */}
      {isTabletOrMobile && (
        <p style={{
          fontFamily: 'Inter', fontSize: '18px', fontWeight: 600,
          color: '#000B14', lineHeight: '1.4', margin: '0 0 12px 0',
        }}>
          Preview: Shop With Virtual Look
        </p>
      )}
      <div
        className="revision-preview-frame"
        style={{
          width: '100%',
          height: isTabletOrMobile ? undefined : '622px',
          aspectRatio: isTabletOrMobile ? '390 / 249' : undefined,
          borderRadius: isTabletOrMobile ? '8px' : '16px',
          overflow: 'hidden',
          marginBottom: isTabletOrMobile ? '0' : '24px',
          position: 'relative',
          boxShadow: isTabletOrMobile
            ? '0px 4px 6px rgba(0,0,0,0.1), 0px 10px 15px rgba(0,0,0,0.1)'
            : '0 4px 24px rgba(0,0,0,0.12)',
          backgroundColor: '#E9EAEB',
          flexShrink: 0,
        }}
      >
        {/* Main image */}
        <img
          className="revision-preview-frame__img"
          src={currentImageUrl}
          alt="main preview — virtual staging result"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Face happy / sad action icons — top right */}
        <div
          className="revision-preview-frame__face-icons"
          style={{
            position: 'absolute',
            top: isTabletOrMobile ? '8px' : '10px',
            right: isTabletOrMobile ? '8px' : '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: isTabletOrMobile ? '4px' : '8px',
            zIndex: 10,
          }}
        >
          {/* Approve button — happy face */}
          <button
            className="revision-preview-frame__face-btn revision-preview-frame__face-btn--approve"
            aria-label="Approve image"
            style={{
              width: isTabletOrMobile ? '36px' : '48px',
              height: isTabletOrMobile ? '36px' : '48px',
              padding: 0,
              border: 'none', background: 'transparent', cursor: 'pointer',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.15s, filter 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)';
              (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.filter = 'none';
            }}
          >
            <img
              src={FIGMA_FACE_HAPPY_URL}
              alt="approve"
              style={{
                width: isTabletOrMobile ? '36px' : '48px',
                height: isTabletOrMobile ? '36px' : '48px',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
              }}
            />
          </button>

          {/* Reject button — sad face */}
          <button
            className="revision-preview-frame__face-btn revision-preview-frame__face-btn--reject"
            aria-label="Reject image"
            style={{
              width: isTabletOrMobile ? '36px' : '48px',
              height: isTabletOrMobile ? '36px' : '48px',
              padding: 0,
              border: 'none', background: 'transparent', cursor: 'pointer',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.15s, filter 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)';
              (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.filter = 'none';
            }}
          >
            <img
              src={FIGMA_FACE_SAD_URL}
              alt="reject"
              style={{
                width: isTabletOrMobile ? '36px' : '48px',
                height: isTabletOrMobile ? '36px' : '48px',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
              }}
            />
          </button>
        </div>

        {/* Prev / Next navigation arrows */}
        <button
          className="revision-preview-frame__nav-btn revision-preview-frame__nav-btn--prev"
          onClick={handlePreviousImage}
          aria-label="Previous image"
          style={{
            position: 'absolute',
            left: isTabletOrMobile ? '12px' : '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: isTabletOrMobile ? '36px' : '50px',
            height: isTabletOrMobile ? '36px' : '50px',
            borderRadius: isTabletOrMobile ? '18px' : '25px',
            border: 'none',
            background: 'rgba(255,255,255,0.80)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: isTabletOrMobile ? '8px' : '13px', gap: '10px', zIndex: 10,
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.80)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isTabletOrMobile ? '14' : '20'} height={isTabletOrMobile ? '8' : '10'} viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className="revision-preview-frame__nav-btn revision-preview-frame__nav-btn--next"
          onClick={handleNextImage}
          aria-label="Next image"
          style={{
            position: 'absolute',
            right: isTabletOrMobile ? '12px' : '20px',
            top: '50%',
            transform: 'translateY(-50%) rotate(180deg)',
            width: isTabletOrMobile ? '36px' : '50px',
            height: isTabletOrMobile ? '36px' : '50px',
            borderRadius: isTabletOrMobile ? '18px' : '25px',
            border: 'none',
            background: 'rgba(255,255,255,0.80)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            padding: isTabletOrMobile ? '8px' : '13px', gap: '10px', zIndex: 10,
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.80)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isTabletOrMobile ? '14' : '20'} height={isTabletOrMobile ? '8' : '10'} viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ─── GALLERY CONTAINER ───────────────────────────────────────────────── */}
      <div
        className="revision-gallery-container"
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          padding: isTabletOrMobile ? '16px' : '24px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: isTabletOrMobile ? '16px' : '24px',
        }}
      >

        {/* ── IN PROGRESS SECTION ─────────────────────────────────────────────── */}
        <div className="revision-gallery-section revision-gallery-section--in-progress" style={{ width: '100%' }}>
          <SectionHeader label="In Progress" count={inProgressImages.length} />

          {/* Gallery grid — max 3 per row on both desktop and mobile */}
          <div
            className="revision-gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: isTabletOrMobile ? '12px' : '24px',
              marginBottom: isTabletOrMobile ? '16px' : '24px',
            }}
          >
            {inProgressImages.map((img) => (
              <GalleryImageCard key={img.id} image={img} isTabletOrMobile={isTabletOrMobile} />
            ))}
          </div>

          {/* Section action buttons — full width on mobile, right-aligned on desktop */}
          <div
            className="revision-gallery-actions"
            style={{
              display: 'flex',
              justifyContent: isTabletOrMobile ? 'stretch' : 'flex-end',
              gap: '8px',
              paddingBottom: isTabletOrMobile ? '8px' : '24px',
            }}
          >
            <button
              className="revision-gallery-actions__download-btn"
              type="button"
              onClick={onDownloadInProgress}
              style={{
                flex: isTabletOrMobile ? 1 : 'none',
                display: 'flex', height: '38px', padding: '0 32px',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderRadius: '6px', border: '2px solid #4F46E5',
                background: '#FFFDFF', color: '#4F46E5',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Download all
            </button>
            <button
              className="revision-gallery-actions__approve-btn"
              type="button"
              onClick={onApproveAll}
              style={{
                flex: isTabletOrMobile ? 1 : 'none',
                display: 'flex', height: '38px', padding: '0 32px',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderRadius: '6px', border: 'none',
                background: '#2BC556', color: '#FFFFFF',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Approve all
            </button>
          </div>
        </div>

        {/* ── COMPLETED SECTION ───────────────────────────────────────────────── */}
        <div className="revision-gallery-section revision-gallery-section--completed" style={{ width: '100%' }}>
          <SectionHeader label="Completed" count={completedImages.length} />

          {/* Gallery grid — max 3 per row */}
          <div
            className="revision-gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: isTabletOrMobile ? '12px' : '24px',
              marginBottom: isTabletOrMobile ? '16px' : '24px',
            }}
          >
            {completedImages.map((img) => (
              <GalleryImageCard key={img.id} image={img} isTabletOrMobile={isTabletOrMobile} />
            ))}
          </div>

          {/* Section action button — full width on mobile, right-aligned on desktop */}
          <div
            className="revision-gallery-actions revision-gallery-actions--completed"
            style={{
              display: 'flex',
              justifyContent: isTabletOrMobile ? 'stretch' : 'flex-end',
              paddingBottom: isTabletOrMobile ? '8px' : '24px',
            }}
          >
            <button
              className="revision-gallery-actions__download-btn"
              type="button"
              onClick={onDownloadCompleted}
              style={{
                flex: isTabletOrMobile ? 1 : 'none',
                display: 'flex', height: '38px', padding: '0 32px',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderRadius: '6px', border: '2px solid #4F46E5',
                background: '#FFFDFF', color: '#4F46E5',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Download all
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
