'use client';

import React, { useState } from 'react';
import {
  MLSPhoto,
  RESIZE_OPTIONS,
  MLS_PHOTOS,
  ChevronDownIcon,
  InstagramIcon,
  WatermarkToggle,
  UploadButton,
} from './MLSMarketingHubContent';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = 'resize-watermark' | 'smart-description';

export interface MLSTabletLayoutProps {
  // Resize & dropdown
  selectedResize: string;
  setSelectedResize: (v: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;

  // Watermark
  watermarkEnabled: boolean;
  handleWatermarkToggle: () => void;
  watermarkFile: File | null;
  watermarkPreviewUrl: string | null;
  watermarkInputRef: React.RefObject<HTMLInputElement | null>;
  handleWatermarkUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWatermarkClear: () => void;
  watermarkSize: number;
  setWatermarkSize: (v: number) => void;
  formatFileSize: (bytes: number) => string;

  // Preview
  previewIndex: number;
  setPreviewIndex: (v: number) => void;
  applyToAll: boolean;
  setApplyToAll: React.Dispatch<React.SetStateAction<boolean>>;
  photosToPreview: MLSPhoto[];
  sliderCSS: string;

  // Photo selection
  selectedPhotos: Set<string>;
  setSelectedPhotos: React.Dispatch<React.SetStateAction<Set<string>>>;
  togglePhoto: (id: string) => void;
  toggleSelectAll: () => void;
  allSelected: boolean;
  selectedCount: number;
  hasSelection: boolean;

  // Smart Description
  generatedDescription: string | null;
  setGeneratedDescription: React.Dispatch<React.SetStateAction<string | null>>;
  isEditingDescription: boolean;
  setIsEditingDescription: (v: boolean) => void;
  showNoInfoWarning: boolean;
  resetNoInfoWarning: () => void;
  handleGenerateClick: () => void;
  setShowPropertyModal: (v: boolean) => void;

  // Container ref (for ResizeObserver — tablet needs to keep it on its root)
  containerRef: React.RefObject<HTMLDivElement>;
}

// ─── MLSTabletLayout ─────────────────────────────────────────────────────────
// Tablet layout (480px – 767px) based on Figma nodes 14654:64983–14654:65163
// Separated from MLSMarketingHubContent so the backend team's desktop code
// stays in a clean, untouched file.

export default function MLSTabletLayout({
  selectedResize,
  setSelectedResize,
  dropdownOpen,
  setDropdownOpen,
  watermarkEnabled,
  handleWatermarkToggle,
  watermarkFile,
  watermarkPreviewUrl,
  watermarkInputRef,
  handleWatermarkUpload,
  handleWatermarkClear,
  watermarkSize,
  setWatermarkSize,
  formatFileSize,
  previewIndex,
  setPreviewIndex,
  applyToAll,
  setApplyToAll,
  photosToPreview,
  sliderCSS,
  selectedPhotos,
  setSelectedPhotos,
  togglePhoto,
  toggleSelectAll,
  allSelected,
  selectedCount,
  hasSelection,
  generatedDescription,
  setGeneratedDescription,
  isEditingDescription,
  setIsEditingDescription,
  showNoInfoWarning,
  resetNoInfoWarning,
  handleGenerateClick,
  setShowPropertyModal,
  containerRef,
}: MLSTabletLayoutProps) {

  const [activeTab, setActiveTab] = useState<ActiveTab>('resize-watermark');
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  // Popup modal for "Adjust logo size" — replaces the inline collapsible on tablet
  const [showSizePopup, setShowSizePopup] = useState(false);

  // ── Property modal field states ────────────────────────────────────────────
  const [propType, setPropType] = useState('');
  const [buyerProfile, setBuyerProfile] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [activePropField, setActivePropField] = useState<string | null>(null);

  // ── Dummy description text (Figma node 14654:65160) ───────────────────────
  const DUMMY_DESCRIPTION = "One of the prettiest streets in Mount Pleasant West, this beautifully maintained 2-bed, 2-bath TH offers the perfect blend of comfort and space. Surrounded by mature trees & cherry blossoms, this setting feels peaceful and established while remaining in the heart of the city. Unique floor plan offers a generous dining area with high ceilings off the kitchen, ideal for hosting. Each bdrm on its own level for some solitude with 3 private outdoor spaces to suit your mood. 4-unit strata offering a boutique feel with a strong sense of community. Walkable to Cambie Village, Main Street, Canada Line and community gardens. Easy to show. Open house Saturday Feb 21st 1 to 3 pm.";

  // ── Logo overlay for preview ───────────────────────────────────────────────
  const logoOverlay = (
    <div
      className="mls-t__logo-overlay"
      style={{
        position: 'absolute', top: '3%', left: '3%', pointerEvents: 'none',
        transformOrigin: 'top left',
        transform: `scale(${0.3 + (watermarkSize / 100) * 0.7})`,
      }}
    >
      {watermarkPreviewUrl ? (
        <img
          className="mls-t__logo-overlay-img"
          src={watermarkPreviewUrl}
          alt="Your logo"
          style={{
            width: `${Math.round(24 + watermarkSize * 1.76)}px`,
            maxWidth: '35%', height: 'auto',
            objectFit: 'contain', opacity: 0.92, display: 'block',
          }}
        />
      ) : (
        <div
          className="mls-t__logo-overlay-placeholder"
          style={{
            background: 'rgba(217,217,217,0.75)', borderRadius: 4,
            padding: '6px 14px', display: 'inline-flex', alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#000', lineHeight: '1.4' }}>Logo</span>
        </div>
      )}
    </div>
  );

  // ── Bella Virtual logo overlay ─────────────────────────────────────────────
  const bellaLogo = (
    <div className="mls-t__bella-logo" style={{ position: 'absolute', bottom: '3%', right: '3%', pointerEvents: 'none' }}>
      <img src="/bella-staging-logo.svg" alt="Bella Virtual" style={{ width: 90, height: 'auto', display: 'block', opacity: 0.95 }} />
    </div>
  );

  // ── Pagination controls ────────────────────────────────────────────────────
  const pagination = (
    <div className="mls-t__pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div
        className="mls-t__pagination-prev"
        onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
        style={{
          background: '#F9FAFB', borderRadius: 10, padding: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: previewIndex === 0 ? 'not-allowed' : 'pointer',
          opacity: previewIndex === 0 ? 0.35 : 1, flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span
        className="mls-t__pagination-counter"
        style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#858A8E', minWidth: 28, textAlign: 'center' }}
      >
        {previewIndex + 1}/{photosToPreview.length}
      </span>
      <div
        className="mls-t__pagination-next"
        onClick={() => setPreviewIndex(Math.min(photosToPreview.length - 1, previewIndex + 1))}
        style={{
          background: '#F9FAFB', borderRadius: 10, padding: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: previewIndex === photosToPreview.length - 1 ? 'not-allowed' : 'pointer',
          opacity: previewIndex === photosToPreview.length - 1 ? 0.35 : 1, flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 12L10 8L6 4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );


  // ── Confirm button (inside popup) ─────────────────────────────────────────
  const exportButton = (
    <button
      type="button"
      className="mls-t__export-btn"
      onClick={() => setShowSizePopup(false)}
      style={{
        width: '100%', height: 48, borderRadius: 6, border: 'none',
        background: '#4F46E5', color: '#FFFFFF',
        fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
        cursor: 'pointer', lineHeight: '1.4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box', flexShrink: 0,
      }}
    >
      Confirm
    </button>
  );

  // ────────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="mls-hub mls-hub--tablet"
      style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0, boxSizing: 'border-box' }}
    >

      {/* ── TAB BAR ────────────────────────────────────────────────────────── */}
      {/* Figma node: 14654:65154 */}
      <div
        className="mls-t__tab-bar"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          width: '100%', boxSizing: 'border-box',
          padding: '20px 20px 0px 20px',
          background: 'transparent',
        }}
      >
        {/* ── Pill (Horizontal tabs) ── */}
        <div className="mls-t__tab-pill" style={{
          display: 'flex', alignItems: 'center',
          background: '#FAFAFA',
          border: '1px solid #E9EAEB',
          borderRadius: 8,
          gap: 2,
          boxSizing: 'border-box',
        }}>
          {(['resize-watermark', 'smart-description'] as ActiveTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'resize-watermark' ? 'Resize & Watermark' : 'Smart Description';
            return (
              <button
                key={tab}
                className={`mls-t__tab-btn${isActive ? ' mls-t__tab-btn--active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  // Reset warning state on every tab switch (unless AI result already generated)
                  if (!generatedDescription) resetNoInfoWarning();
                }}
                style={{
                  height: 36,
                  padding: '8px 12px',
                  borderTop:    isActive ? '1px solid #D5D7DA' : '1px solid transparent',
                  borderLeft:   isActive ? '1px solid #D5D7DA' : '1px solid transparent',
                  borderRight:  isActive ? '1px solid #D5D7DA' : '1px solid transparent',
                  borderBottom: isActive ? '1px solid #D5D7DA' : '1px solid transparent',
                  borderRadius: 8,
                  background: isActive ? '#FFFFFF' : 'transparent',
                  boxShadow: isActive ? '0px 1px 2px 0px rgba(10,13,18,0.05)' : 'none',
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                  color: isActive ? '#414651' : '#717680',
                  cursor: 'pointer', lineHeight: '1.35',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  TAB 1: Resize & Watermark                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'resize-watermark' && (
        <div className="mls-t__tab-content mls-t__rw-content" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 20px 24px' }}>

          {/* ── Two cards side by side (Figma node 14654:65036) ────────────── */}
          <div className="mls-t__rw-cards-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, width: '100%', boxSizing: 'border-box' }}>

            {/* ── LEFT CARD: Instagram platform info ──────────────────────── */}
            <div
              className="mls-t__platform-card"
              style={{
                flexShrink: 0,
                background: '#EFF6FF',
                border: '1px solid #BEDBFF',
                borderRadius: 10,
                padding: 16, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 0,
                position: 'relative',
              }}
            >
              {/* Platform info row: icon + text + chevron */}
              <div
                className="mls-t__platform-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}
              >
                {/* Instagram icon — indigo 20×20 rounded square */}
                <div className="mls-t__platform-icon" style={{
                  width: 20, height: 20, borderRadius: 10, flexShrink: 0,
                  background: '#4F46E5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                  </svg>
                </div>

                {/* Title + subtitle */}
                <div className="mls-t__platform-text" style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <span className="mls-t__platform-title" style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: '#1C398E', lineHeight: '1.4',
                    whiteSpace: 'nowrap',
                  }}>
                    Instagram • Square Post
                  </span>
                  <span className="mls-t__platform-subtitle" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#4F46E5', lineHeight: '1.5',
                    whiteSpace: 'nowrap',
                  }}>
                    Images will be resized to 1:1 ratio
                  </span>
                </div>

                {/* Chevron */}
                <div className="mls-t__platform-chevron" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 8px', alignSelf: 'stretch',
                }}>
                  <div style={{
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>
                    <ChevronDownIcon color="#1C398E" size={14} />
                  </div>
                </div>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="mls-t__platform-dropdown" style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  zIndex: 50, background: '#FFFFFF', minWidth: '100%',
                  border: '1px solid #E9EAEB', borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  overflow: 'hidden', boxSizing: 'border-box',
                }}>
                  {RESIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={`mls-t__platform-dropdown-item${opt === selectedResize ? ' mls-t__platform-dropdown-item--active' : ''}`}
                      onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                      style={{
                        width: '100%', padding: '9px 12px', textAlign: 'left',
                        background: opt === selectedResize ? '#F5F3FF' : 'transparent',
                        border: 'none', borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer', display: 'block', boxSizing: 'border-box',
                        fontFamily: 'Inter', fontSize: 13,
                        color: opt === selectedResize ? '#4F46E5' : '#000B14',
                        fontWeight: opt === selectedResize ? 500 : 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT CARD: Watermark ────────────────────────────────────── */}
            <div
              className="mls-t__watermark-card"
              style={{
                flex: '1 0 0', minWidth: 0,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                padding: 17, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
            >
              {/* Label + toggle row */}
              <div className="mls-t__watermark-toggle-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div className="mls-t__watermark-label-group" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="mls-t__watermark-title" style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                    color: '#374151', lineHeight: '1.35',
                  }}>
                    Watermark
                  </span>
                  <span className="mls-t__watermark-hint" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                    color: '#6B7280', lineHeight: '1.4',
                  }}>
                    Accepts PNG, JPG • Max 2MB
                  </span>
                </div>
                <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
              </div>

              {/* Upload + Adjust buttons side by side (when watermark ON) */}
              {watermarkEnabled && (
                <div className="mls-t__watermark-body" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>

                  {/* Left: Upload button + filename chip */}
                  <div className="mls-t__upload-col" style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Hidden file input */}
                    <input
                      ref={watermarkInputRef as React.RefObject<HTMLInputElement>}
                      className="mls-t__upload-input"
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      style={{ display: 'none' }}
                      onChange={handleWatermarkUpload}
                    />
                    <button
                      type="button"
                      className="mls-t__upload-btn"
                      onClick={() => watermarkInputRef.current?.click()}
                      style={{
                        width: '100%', height: 42,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        border: '1px solid #E5E7EB', borderRadius: 8,
                        background: '#F9FAFB', cursor: 'pointer',
                        fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                        color: '#4F46E5', lineHeight: '1.4',
                        boxSizing: 'border-box',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 10.5V3M8 3L5.5 5.5M8 3L10.5 5.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12V13C2 13.55 2.45 14 3 14H13C13.55 14 14 13.55 14 13V12" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Upload My Logo
                    </button>

                    {/* Filename chip */}
                    {watermarkFile && (
                      <div className="mls-t__file-chip" style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: '#FAFAFA', padding: 4,
                        boxSizing: 'border-box',
                      }}>
                        <span className="mls-t__file-chip-name" style={{
                          fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                          color: '#858A8E', lineHeight: '1.4',
                          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {watermarkFile.name.length > 22
                            ? watermarkFile.name.slice(0, 19) + '...' + watermarkFile.name.slice(-4)
                            : watermarkFile.name}
                        </span>
                        <button
                          type="button"
                          className="mls-t__file-chip-remove"
                          onClick={handleWatermarkClear}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center',
                            fontFamily: 'Inter', fontSize: 9, fontWeight: 500,
                            color: '#858A8E', lineHeight: '19.5px',
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Adjust logo size button */}
                  <div className="mls-t__adjust-col" style={{ flex: '1 0 0', minWidth: 0 }}>
                    <button
                      className="mls-t__adjust-logo-btn"
                      type="button"
                      onClick={() => setShowSizePopup(true)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '9px 16px',
                        border: 'none', borderRadius: 6,
                        background: 'linear-gradient(to right, #AD46FF, #F6339A)',
                        cursor: 'pointer',
                        fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                        color: '#FFFDFF', lineHeight: '1.4',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box', width: '100%',
                      }}
                    >
                      <svg style={{ width: 24, height: 24, flexShrink: 0 }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3333 2.6661H14M11.3333 2.6661C11.3333 3.03943 12.3293 3.73743 12.6667 3.99943M11.3333 2.6661C11.3333 2.29277 12.3293 1.59477 12.6667 1.33277M4.66667 2.6661H2M4.66667 2.6661C4.66667 2.29277 3.67067 1.59477 3.33333 1.33277M4.66667 2.6661C4.66667 3.03943 3.67067 3.73743 3.33333 3.99943M6.55667 14.6661V14.0334C6.55667 13.6034 6.41733 13.1848 6.16 12.8394L3.72133 9.57077C3.44 9.19343 3.21533 8.7261 3.40133 8.2941C3.70133 7.59477 4.55 7.14077 5.588 8.18877L6.65267 9.32877V2.37943C6.69 1.01677 8.882 0.949433 8.976 2.37943V6.33943C9.96267 6.21143 14.6107 6.90743 13.9327 9.8541L13.8373 10.2761C13.7 10.8894 13.2947 11.9808 12.848 12.6188C12.3827 13.2834 12.5467 13.9454 12.5467 14.6654" stroke="#FFFDFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Adjust logo size
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* ── Photo selection section ──────────────────────────────────── */}
          <div
            className="mls-t__photo-section"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
          >
            {/* Header */}
            <div className="mls-t__photo-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              {/* Left: title */}
              <span className="mls-t__photo-section-title" style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                color: '#111827', lineHeight: '1.4', whiteSpace: 'nowrap',
              }}>
                Select Images to Export
              </span>
              {/* Right: Select all + count */}
              <div className="mls-t__photo-section-actions" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {allSelected ? (
                  <button
                    className="mls-t__select-all-btn mls-t__select-all-btn--deselect"
                    onClick={() => setSelectedPhotos(new Set())}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                      color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap',
                      lineHeight: '1.35', textDecoration: 'underline',
                    }}
                  >
                    Deselect all
                  </button>
                ) : (
                  <button
                    className="mls-t__select-all-btn"
                    onClick={toggleSelectAll}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                      color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap',
                      lineHeight: '1.35', textDecoration: 'underline',
                    }}
                  >
                    Select all
                  </button>
                )}
                <span className="mls-t__photo-count" style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                  color: '#6B7280', lineHeight: '1.4', whiteSpace: 'nowrap',
                }}>
                  {selectedPhotos.size} of {MLS_PHOTOS.length} selected
                </span>
              </div>
            </div>

            {/* Photo grid — 3 columns, gap 8px, 4:3 aspect */}
            <div
              className="mls-t__photo-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              {MLS_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  className={`mls-t__photo-card${selectedPhotos.has(photo.id) ? ' mls-t__photo-card--selected' : ''}`}
                  onClick={() => togglePhoto(photo.id)}
                  style={{
                    position: 'relative',
                    borderRadius: 10,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    aspectRatio: '4 / 3',
                    boxShadow: selectedPhotos.has(photo.id)
                      ? '0 0 0 2.5px #4F46E5'
                      : '0 0 0 1px #E5E7EB',
                    transition: 'box-shadow 0.15s ease',
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Dark overlay when selected */}
                  <div className="mls-t__photo-card-overlay" style={{
                    position: 'absolute', inset: 0,
                    background: selectedPhotos.has(photo.id) ? 'rgba(0,0,0,0.2)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }} />
                  {/* Checkmark badge */}
                  {selectedPhotos.has(photo.id) && (
                    <div className="mls-t__photo-card-check" style={{
                      position: 'absolute', top: 5, right: 5,
                      width: 18, height: 18, borderRadius: 4,
                      background: '#4F46E5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  TAB 2: Smart Description                                          */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'smart-description' && (
        <div className="mls-t__tab-content mls-t__sd-content" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 20px 24px' }}>

          {/* Card */}
          <div className="mls-t__sd-card" style={{
            width: '100%', background: '#FFFFFF',
            border: '1px solid #E5E7EB', borderRadius: 12,
            padding: '17px 17px 17px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>

            {/* Description text */}
            <p className="mls-t__sd-description" style={{
              fontFamily: 'Inter', fontSize: 18, fontWeight: 400,
              color: '#858A8E', lineHeight: 1.4, margin: 0,
            }}>
              Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you.
            </p>

            {/* Generate button */}
            <button
              className="mls-t__sd-generate-btn"
              onClick={handleGenerateClick}
              style={{
                height: 46, padding: '12px 24px',
                borderRadius: 6, border: 'none',
                background: '#4F46E5', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                alignSelf: 'flex-start', boxSizing: 'border-box',
              }}
            >
              <span style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                color: '#FFFFFF', textTransform: 'capitalize', whiteSpace: 'nowrap',
              }}>
                Try Our AI Description Generator
              </span>
            </button>

            {/* Warning + Provide Info – shown after generate click when no info provided */}
            {showNoInfoWarning && !generatedDescription && (
              <div className="mls-t__sd-warning-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Warning box */}
                <div className="mls-t__sd-warning" style={{
                  background: '#FFF3CD', border: '1px solid #FFC107',
                  borderRadius: 8, padding: '17px 17px 16px',
                  boxSizing: 'border-box',
                }}>
                  <div className="mls-t__sd-warning-body" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {/* Warning icon */}
                    <div className="mls-t__sd-warning-icon" style={{ width: 20, height: 20, flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.58 2.91L1.39 15.5C1.14 15.93 1.44 16.47 1.95 16.47H16.33C16.83 16.47 17.14 15.93 16.89 15.5L9.7 2.91C9.44 2.47 8.84 2.47 8.58 2.91Z" stroke="#856404" strokeWidth="1.3" strokeLinejoin="round"/>
                        <path d="M9.14 8V11.5" stroke="#856404" strokeWidth="1.4" strokeLinecap="round"/>
                        <circle cx="9.14" cy="13.5" r="0.75" fill="#856404"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="mls-t__sd-warning-title" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#856404', lineHeight: '21px' }}>
                        No Property Information
                      </span>
                      <span className="mls-t__sd-warning-subtitle" style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#856404', lineHeight: '19.5px' }}>
                        Property information was not provided during upload.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provide Information Now button */}
                <button
                  className="mls-t__sd-provide-btn"
                  onClick={() => setPropertyModalOpen(true)}
                  style={{
                    height: 46, padding: '12px 24px',
                    borderRadius: 12, border: '2px solid #4F46E5',
                    background: '#FFFDFF', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    alignSelf: 'flex-start', boxSizing: 'border-box',
                  }}
                >
                  <span style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                    color: '#4F46E5', textTransform: 'capitalize', whiteSpace: 'nowrap',
                  }}>
                    Provide information now
                  </span>
                </button>

              </div>
            )}

            {/* Generated description panel */}
            {generatedDescription && (
              <div
                className="mls-t__sd-result"
                onClick={() => setIsEditingDescription(true)}
                style={{
                  background: '#FAFAFA', borderRadius: 12,
                  padding: 16, boxSizing: 'border-box',
                  cursor: 'text',
                  border: isEditingDescription ? '2px solid #4F46E5' : '2px solid transparent',
                  transition: 'border-color 0.15s',
                }}
              >
                {isEditingDescription ? (
                  <textarea
                    className="mls-t__sd-result-textarea"
                    autoFocus
                    value={generatedDescription}
                    onChange={e => setGeneratedDescription(e.target.value)}
                    onBlur={() => setIsEditingDescription(false)}
                    style={{
                      width: '100%', minHeight: 120, resize: 'vertical',
                      fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                      color: '#0A0A0A', lineHeight: '22px', letterSpacing: '-0.15px',
                      border: 'none', background: 'transparent', outline: 'none', padding: 0,
                    }}
                  />
                ) : (
                  <p className="mls-t__sd-result-text" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                    color: '#0A0A0A', lineHeight: '22px',
                    letterSpacing: '-0.15px', margin: 0,
                  }}>
                    {generatedDescription}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  Adjust Logo Size Popup — triggered by "Adjust logo size" button    */}
      {/*  Same popup pattern as mobile (mls-m__preview-overlay)              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showSizePopup && watermarkEnabled && (() => {
        // Parse "Platform – W × H px (ratio)" → platformName + dims
        const dashIdx = selectedResize.indexOf(' – ');
        const platformName = dashIdx !== -1 ? selectedResize.slice(0, dashIdx) : selectedResize;
        const platformDims = dashIdx !== -1 ? selectedResize.slice(dashIdx + 3) : '';
        return (
          <div
            className="mls-t__size-popup-overlay"
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(133,138,142,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px', boxSizing: 'border-box',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowSizePopup(false); }}
          >
            <div
              className="mls-t__size-popup-modal"
              style={{
                background: '#FFFFFF',
                borderRadius: 10, border: '1px solid #E5E7EB',
                width: '100%', maxWidth: 480,
                padding: 20, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 14,
                maxHeight: 'calc(100vh - 40px)', overflowY: 'auto',
              }}
            >
              {/* ── Header row: platform icon + name + close ────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                {/* Platform icon — indigo rounded square */}
                <div style={{
                  width: 34, height: 34, background: '#4F46E5',
                  borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                    <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="white" strokeWidth="1.2"/>
                    <circle cx="6" cy="6" r="2.2" stroke="white" strokeWidth="1.2"/>
                    <circle cx="9" cy="3" r="0.7" fill="white"/>
                  </svg>
                </div>
                {/* Platform name */}
                <span style={{
                  flex: 1, minWidth: 0,
                  fontFamily: 'Inter', fontSize: 18, fontWeight: 700,
                  color: '#1C398E', lineHeight: '1.4',
                }}>
                  {platformName}
                </span>
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setShowSizePopup(false)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, flexShrink: 0, width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label="Close"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#374151" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* ── Subtitle: resize dimensions ──────────────────────────── */}
              {platformDims && (
                <span style={{
                  paddingLeft: 44, flexShrink: 0,
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                  color: '#4F46E5', lineHeight: '1.4',
                }}>
                  Images will be resized to {platformDims}
                </span>
              )}

              {/* ── Image Settings card (reuses imageSettingsCard) ────────── */}
              <div style={{
                background: '#F9FAFB', border: '1px solid #E5E7EB',
                borderRadius: 10, padding: 14, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                  color: '#4F46E5', lineHeight: '1.4',
                }}>
                  Image Settings
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 21 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#52595F', lineHeight: '1.5', whiteSpace: 'nowrap' }}>
                      Slide to adjust the logo size
                    </span>
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#4F46E5', lineHeight: '1.5' }}>
                      {watermarkSize}%
                    </span>
                  </div>
                  <style>{sliderCSS}</style>
                  <input
                    className="mls-watermark-slider mls-t__size-popup-slider"
                    type="range" min={0} max={100} value={watermarkSize}
                    onChange={(e) => setWatermarkSize(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* ── Image preview + pagination ───────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  position: 'relative', width: '100%',
                  aspectRatio: '1 / 0.8',
                  borderRadius: 10, overflow: 'hidden',
                  background: '#F3F4F6',
                }}>
                  {photosToPreview.length > 0 && (
                    <img
                      src={photosToPreview[previewIndex]?.url ?? ''}
                      alt={photosToPreview[previewIndex]?.label ?? ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  {logoOverlay}
                  {bellaLogo}
                </div>
                {pagination}
              </div>

              {/* ── Export button ────────────────────────────────────────── */}
              {exportButton}
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  Property Information Modal                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {propertyModalOpen && (
        <div className="mls-t__prop-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 20px', boxSizing: 'border-box',
        }}>
          <div className="mls-t__prop-modal" style={{
            background: '#FFFFFF', borderRadius: 16,
            boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: 700,
            boxSizing: 'border-box',
          }}>

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="mls-t__prop-header" style={{
              height: 69, borderBottom: '1px solid #E5E7EB',
              background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 24px', boxSizing: 'border-box',
            }}>
              <span className="mls-t__prop-header-title" style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: '#0A0A0A', lineHeight: '30px' }}>
                Property Information
              </span>
              <button
                className="mls-t__prop-close"
                onClick={() => setPropertyModalOpen(false)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* ── Form body ───────────────────────────────────────────────── */}
            <div className="mls-t__prop-body" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>

              {/* Subtitle */}
              <p className="mls-t__prop-subtitle" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#6A7282', lineHeight: '21px', margin: 0 }}>
                Please provide property details to generate an AI-powered marketing description.
              </p>

              {/* Fields container */}
              <div className="mls-t__prop-fields" style={{
                background: '#FAFAFA', borderRadius: 16,
                padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
                boxSizing: 'border-box',
              }}>

                {/* Property type — custom dropdown */}
                <div className="mls-t__prop-field-wrap" style={{ position: 'relative' }}>
                  <div
                    className="mls-t__prop-field"
                    onClick={() => setActivePropField(activePropField === 'type' ? null : 'type')}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${activePropField === 'type' ? '#4F46E5' : '#ECEFF0'}`,
                      borderRadius: activePropField === 'type' ? '16px 16px 0 0' : 16, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '4px 12px', boxSizing: 'border-box', cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M1 6.5L7 1.5L13 6.5V13.5H9V9.5H5V13.5H1V6.5Z" stroke="#858A8E" strokeWidth="1" strokeLinejoin="round"/>
                      </svg>
                      <span style={{
                        fontFamily: 'Inter', fontSize: 16, fontWeight: 500,
                        color: propType ? '#0A0A0A' : '#858A8E', lineHeight: '22px',
                      }}>
                        {propType || 'Property type'}
                      </span>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{
                      flexShrink: 0,
                      transform: activePropField === 'type' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {activePropField === 'type' && (
                    <div className="mls-t__prop-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      background: '#FFFFFF', border: '1px solid #4F46E5', borderTop: 'none',
                      borderRadius: '0 0 16px 16px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      {['Condo', 'Townhouse', 'Detached', 'Other'].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setPropType(opt); setActivePropField(null); }}
                          style={{
                            width: '100%', padding: '11px 16px', textAlign: 'left',
                            background: propType === opt ? '#F5F3FF' : '#FFFFFF',
                            border: 'none', borderBottom: '1px solid #F3F4F6',
                            cursor: 'pointer', display: 'block',
                            fontFamily: 'Inter', fontSize: 14,
                            color: propType === opt ? '#4F46E5' : '#374151',
                            fontWeight: propType === opt ? 500 : 400,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Intended buyer profile — custom dropdown */}
                <div className="mls-t__prop-field-wrap" style={{ position: 'relative' }}>
                  <div
                    className="mls-t__prop-field"
                    onClick={() => setActivePropField(activePropField === 'buyer' ? null : 'buyer')}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${activePropField === 'buyer' ? '#4F46E5' : '#ECEFF0'}`,
                      borderRadius: activePropField === 'buyer' ? '16px 16px 0 0' : 16, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '4px 12px', boxSizing: 'border-box', cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="7" cy="4.5" r="2.5" stroke="#858A8E" strokeWidth="1"/>
                        <path d="M1.5 12.5C1.5 10.01 4.02 8 7 8C9.98 8 12.5 10.01 12.5 12.5" stroke="#858A8E" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                      <span style={{
                        fontFamily: 'Inter', fontSize: 16, fontWeight: 500,
                        color: buyerProfile ? '#0A0A0A' : '#858A8E', lineHeight: '22px',
                      }}>
                        {buyerProfile || 'Intended buyer profile'}
                      </span>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{
                      flexShrink: 0,
                      transform: activePropField === 'buyer' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {activePropField === 'buyer' && (
                    <div className="mls-t__prop-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      background: '#FFFFFF', border: '1px solid #4F46E5', borderTop: 'none',
                      borderRadius: '0 0 16px 16px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      {['First-time buyer', 'Investor', 'Family', 'Other'].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setBuyerProfile(opt); setActivePropField(null); }}
                          style={{
                            width: '100%', padding: '11px 16px', textAlign: 'left',
                            background: buyerProfile === opt ? '#F5F3FF' : '#FFFFFF',
                            border: 'none', borderBottom: '1px solid #F3F4F6',
                            cursor: 'pointer', display: 'block',
                            fontFamily: 'Inter', fontSize: 14,
                            color: buyerProfile === opt ? '#4F46E5' : '#374151',
                            fontWeight: buyerProfile === opt ? 500 : 400,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Intended use — custom dropdown */}
                <div className="mls-t__prop-field-wrap" style={{ position: 'relative' }}>
                  <div
                    className="mls-t__prop-field"
                    onClick={() => setActivePropField(activePropField === 'use' ? null : 'use')}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${activePropField === 'use' ? '#4F46E5' : '#ECEFF0'}`,
                      borderRadius: activePropField === 'use' ? '16px 16px 0 0' : 16, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '4px 12px', boxSizing: 'border-box', cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M1 1.5H6.5L11 6L6 11L1 6V1.5Z" stroke="#858A8E" strokeWidth="1" strokeLinejoin="round"/>
                        <circle cx="3.5" cy="3.5" r="0.75" fill="#858A8E"/>
                      </svg>
                      <span style={{
                        fontFamily: 'Inter', fontSize: 16, fontWeight: 500,
                        color: intendedUse ? '#0A0A0A' : '#858A8E', lineHeight: '22px',
                      }}>
                        {intendedUse || 'Intended use'}
                      </span>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{
                      flexShrink: 0,
                      transform: activePropField === 'use' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {activePropField === 'use' && (
                    <div className="mls-t__prop-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      background: '#FFFFFF', border: '1px solid #4F46E5', borderTop: 'none',
                      borderRadius: '0 0 16px 16px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      {['Primary residence', 'Investment', 'Vacation home', 'Other'].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setIntendedUse(opt); setActivePropField(null); }}
                          style={{
                            width: '100%', padding: '11px 16px', textAlign: 'left',
                            background: intendedUse === opt ? '#F5F3FF' : '#FFFFFF',
                            border: 'none', borderBottom: '1px solid #F3F4F6',
                            cursor: 'pointer', display: 'block',
                            fontFamily: 'Inter', fontSize: 14,
                            color: intendedUse === opt ? '#4F46E5' : '#374151',
                            fontWeight: intendedUse === opt ? 500 : 400,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property address */}
                <div className="mls-t__prop-field" style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 16, height: 40,
                  display: 'flex', alignItems: 'center',
                  padding: '4px 12px', gap: 8, boxSizing: 'border-box',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M7 1C4.79 1 3 2.79 3 5C3 7.25 6 11 7 13C8 11 11 7.25 11 5C11 2.79 9.21 1 7 1Z" stroke="#858A8E" strokeWidth="1"/>
                    <circle cx="7" cy="5" r="1.5" stroke="#858A8E" strokeWidth="1"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Property address"
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#858A8E',
                      lineHeight: '22px',
                    }}
                  />
                </div>

                {/* MLS listing link */}
                <div className="mls-t__prop-field" style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 16, height: 40,
                  display: 'flex', alignItems: 'center',
                  padding: '4px 12px', gap: 8, boxSizing: 'border-box',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M5 7C5.55 7.55 6.45 7.55 7 7L9 5C9.55 4.45 9.55 3.55 9 3C8.45 2.45 7.55 2.45 7 3L6 4" stroke="#858A8E" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M7 5C6.45 4.45 5.55 4.45 5 5L3 7C2.45 7.55 2.45 8.45 3 9C3.55 9.55 4.45 9.55 5 9L6 8" stroke="#858A8E" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="MLS listing link if applicable"
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#858A8E',
                      lineHeight: '22px',
                    }}
                  />
                </div>

              </div>{/* /mls-t__prop-fields */}

              {/* ── Footer buttons ──────────────────────────────────────── */}
              <div className="mls-t__prop-footer" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                  className="mls-t__prop-cancel-btn"
                  onClick={() => setPropertyModalOpen(false)}
                  style={{
                    height: 45, padding: '0 20px',
                    borderRadius: 8, border: 'none',
                    background: '#F3F4F6', cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#4A5565',
                    lineHeight: '21px', whiteSpace: 'nowrap',
                  }}
                >
                  Cancel
                </button>
                <button
                  className="mls-t__prop-submit-btn"
                  onClick={() => {
                    setGeneratedDescription(DUMMY_DESCRIPTION);
                    setPropertyModalOpen(false);
                  }}
                  style={{
                    height: 45, padding: '0 24px',
                    borderRadius: 8, border: 'none',
                    background: '#4F46E5', cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#FFFFFF',
                    textTransform: 'uppercase', lineHeight: '21px', whiteSpace: 'nowrap',
                  }}
                >
                  Generate Description
                </button>
              </div>

            </div>{/* /mls-t__prop-body */}

          </div>
        </div>
      )}

    </div>
  );
}
