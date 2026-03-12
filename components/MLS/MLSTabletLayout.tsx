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
  showPreview: boolean;
  setShowPreview: (v: boolean) => void;
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
  showPreview,
  setShowPreview,
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
  handleGenerateClick,
  setShowPropertyModal,
  containerRef,
}: MLSTabletLayoutProps) {

  const [activeTab, setActiveTab] = useState<ActiveTab>('resize-watermark');
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);

  // ── Dummy description text (Figma node 14654:65160) ───────────────────────
  const DUMMY_DESCRIPTION = "One of the prettiest streets in Mount Pleasant West, this beautifully maintained 2-bed, 2-bath TH offers the perfect blend of comfort and space. Surrounded by mature trees & cherry blossoms, this setting feels peaceful and established while remaining in the heart of the city. Unique floor plan offers a generous dining area with high ceilings off the kitchen, ideal for hosting. Each bdrm on its own level for some solitude with 3 private outdoor spaces to suit your mood. 4-unit strata offering a boutique feel with a strong sense of community. Walkable to Cambie Village, Main Street, Canada Line and community gardens. Easy to show. Open house Saturday Feb 21st 1 to 3 pm.";

  // ── Logo overlay for preview ───────────────────────────────────────────────
  const logoOverlay = (
    <div style={{
      position: 'absolute', top: '3%', left: '3%', pointerEvents: 'none',
      transformOrigin: 'top left',
      transform: `scale(${0.3 + (watermarkSize / 100) * 0.7})`,
    }}>
      {watermarkPreviewUrl ? (
        <img
          src={watermarkPreviewUrl}
          alt="Your logo"
          style={{
            width: `${Math.round(24 + watermarkSize * 1.76)}px`,
            maxWidth: '35%', height: 'auto',
            objectFit: 'contain', opacity: 0.92, display: 'block',
          }}
        />
      ) : (
        <div style={{
          background: 'rgba(217,217,217,0.75)', borderRadius: 4,
          padding: '6px 14px', display: 'inline-flex', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#000', lineHeight: '1.4' }}>Logo</span>
        </div>
      )}
    </div>
  );

  // ── Bella Virtual logo overlay ─────────────────────────────────────────────
  const bellaLogo = (
    <div style={{ position: 'absolute', bottom: '3%', right: '3%', pointerEvents: 'none' }}>
      <img src="/bella-staging-logo.svg" alt="Bella Virtual" style={{ width: 90, height: 'auto', display: 'block', opacity: 0.95 }} />
    </div>
  );

  // ── Pagination controls ────────────────────────────────────────────────────
  const pagination = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div
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
      <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#858A8E', minWidth: 28, textAlign: 'center' }}>
        {previewIndex + 1}/{photosToPreview.length}
      </span>
      <div
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

  // ── Image Settings card (inside preview) — Figma 14654:65183 ──────────────
  const imageSettingsCard = (
    <div style={{
      background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14,
      padding: 16, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          flex: '1 0 0',
          fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
          color: '#4F46E5', lineHeight: '1.4',
        }}>
          Image Settings
        </span>
      </div>
      {/* Slider section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 21 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#52595F', lineHeight: '1.4', whiteSpace: 'nowrap' }}>
            Slide to adjust the logo size
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#4F46E5', lineHeight: '1.4' }}>
            {watermarkSize}%
          </span>
        </div>
        <style>{sliderCSS}</style>
        <input
          className="mls-watermark-slider"
          type="range" min={0} max={100} value={watermarkSize}
          onChange={(e) => setWatermarkSize(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      {/* Apply logo to all photos */}
      <div
        role="button"
        onClick={() => setApplyToAll((v: boolean) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, height: 24, cursor: 'pointer', userSelect: 'none' }}
      >
        {/* Checkbox — 18×18, border 2px #D1D5DC when off, filled indigo when on */}
        <div style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
          border: applyToAll ? 'none' : '2px solid #D1D5DC',
          background: applyToAll ? '#4F46E5' : '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          {applyToAll && (
            <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#52595F', lineHeight: '1.4' }}>
          Apply logo to all photos
        </span>
      </div>
    </div>
  );

  // ── Export button ──────────────────────────────────────────────────────────
  // TODO (backend): On click, trigger the export API with this payload:
  //   photoIds         → Array.from(selectedPhotos)   // string[] of selected photo IDs
  //   watermarkEnabled → watermarkEnabled             // boolean
  //   watermarkFile    → watermarkFile                // File | null
  //   watermarkSize    → watermarkSize                // number 0–100
  //   applyToAll       → applyToAll                   // boolean
  //   resizeOption     → selectedResize               // string
  const exportButton = (
    <button
      disabled={!hasSelection}
      onClick={() => { /* TODO (backend): call export API */ }}
      style={{
        height: 48, borderRadius: 6, border: 'none',
        background: hasSelection ? '#4F46E5' : '#E5E7EB',
        color: hasSelection ? '#FFFFFF' : '#9CA3AF',
        fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
        cursor: hasSelection ? 'pointer' : 'not-allowed', lineHeight: '1.4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxSizing: 'border-box', width: '100%',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M9 2.25V11.25M9 11.25L6 8.25M9 11.25L12 8.25" stroke={hasSelection ? 'white' : '#9CA3AF'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.25 13.5V14.625C2.25 15.246 2.754 15.75 3.375 15.75H14.625C15.246 15.75 15.75 15.246 15.75 14.625V13.5" stroke={hasSelection ? 'white' : '#9CA3AF'} strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
      {hasSelection ? `Export All (${selectedCount} Images)` : 'Select images to export'}
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
      {/* Figma node: 14654:65034 — pill/card style */}
      <div
        className="mls-tablet__tab-bar"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          borderBottom: '1px solid #E9EAEB',
          width: '100%', boxSizing: 'border-box',
          padding: '12px 20px',
          background: '#FFFFFF',
        }}
      >
        {/* ── Pill container ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#FAFAFA',
          border: '1px solid #E9EAEB',
          borderRadius: 8,
          gap: 2,
          padding: 4,
          boxSizing: 'border-box',
        }}>
          {(['resize-watermark', 'smart-description'] as ActiveTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'resize-watermark' ? 'Resize & Watermark' : 'Smart Description';
            return (
              <button
                key={tab}
                className={`mls-tablet__tab${isActive ? ' mls-tablet__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  height: 36,
                  padding: '8px 12px',
                  border: isActive ? '1px solid #D5D7DA' : '1px solid transparent',
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
        <div className="mls-tablet__tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 20px 24px' }}>

          {/* ── Two cards side by side (Figma node 14654:65036) ────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, width: '100%', boxSizing: 'border-box' }}>

            {/* ── LEFT CARD: Instagram platform info ──────────────────────── */}
            <div
              className="mls-tablet__instagram-col"
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
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}
              >
                {/* Instagram icon — indigo 20×20 rounded square */}
                <div style={{
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: '#1C398E', lineHeight: '1.4',
                    whiteSpace: 'nowrap',
                  }}>
                    Instagram • Square Post
                  </span>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#4F46E5', lineHeight: '1.5',
                    whiteSpace: 'nowrap',
                  }}>
                    Images will be resized to 1:1 ratio
                  </span>
                </div>

                {/* Chevron */}
                <div style={{
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
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  zIndex: 50, background: '#FFFFFF', minWidth: '100%',
                  border: '1px solid #E9EAEB', borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  overflow: 'hidden', boxSizing: 'border-box',
                }}>
                  {RESIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
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
              className="mls-tablet__watermark-col"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                    color: '#374151', lineHeight: '1.35',
                  }}>
                    Watermark
                  </span>
                  <span style={{
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
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>

                  {/* Left: Upload button + filename chip */}
                  <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Hidden file input */}
                    <input
                      ref={watermarkInputRef as React.RefObject<HTMLInputElement>}
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      style={{ display: 'none' }}
                      onChange={handleWatermarkUpload}
                    />
                    <button
                      type="button"
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
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: '#FAFAFA', padding: 4,
                        boxSizing: 'border-box',
                      }}>
                        <span style={{
                          fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                          color: '#858A8E', lineHeight: '1.4',
                          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {watermarkFile.name.length > 22
                            ? watermarkFile.name.slice(0, 19) + '...' + watermarkFile.name.slice(-4)
                            : watermarkFile.name}
                        </span>
                        <button
                          type="button" onClick={handleWatermarkClear}
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
                  <div style={{ flex: '1 0 0', minWidth: 0 }}>
                    <button
                      className="mls-tablet__adjust-logo-btn"
                      type="button"
                      onClick={() => setShowPreview(true)}
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

          {/* ── Preview section (collapsible) — Figma 14654:65163 ──────── */}
          {watermarkEnabled && (
            <div
              className="mls-tablet__preview-section"
              style={{
                width: '100%', background: '#FFFFFF',
                border: '1px solid #E5E7EB', borderRadius: 10,
                boxSizing: 'border-box',
                padding: 16,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              {/* Preview header — always visible, click to toggle */}
              <div
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 24,
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  flex: '1 0 0',
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                  color: '#000B14', lineHeight: '1.4',
                }}>
                  Preview
                </span>
                <div style={{
                  transform: showPreview ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  display: 'flex', alignItems: 'center',
                }}>
                  <ChevronDownIcon color="#374151" size={18} />
                </div>
              </div>

              {/* Preview expanded content */}
              {showPreview && (
                <>
                  {/* Inner column: Image Settings card + preview image */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Image Settings card */}
                    {imageSettingsCard}

                    {/* Image preview + pagination */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  </div>

                  {/* Export button — bottom of preview card */}
                  {exportButton}
                </>
              )}
            </div>
          )}

          {/* ── Photo selection section ──────────────────────────────────── */}
          <div
            className="mls-tablet__photo-section"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              {/* Left: title */}
              <span style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                color: '#111827', lineHeight: '1.4', whiteSpace: 'nowrap',
              }}>
                Select Images to Export
              </span>
              {/* Right: Select all + count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {allSelected ? (
                  <button
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
                <span style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                  color: '#6B7280', lineHeight: '1.4', whiteSpace: 'nowrap',
                }}>
                  {selectedPhotos.size} of {MLS_PHOTOS.length} selected
                </span>
              </div>
            </div>

            {/* Photo grid — 3 columns, gap 8px, 4:3 aspect */}
            <div
              className="mls-tablet__photo-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              {MLS_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  className="mls-tablet__photo-card"
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
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: selectedPhotos.has(photo.id) ? 'rgba(0,0,0,0.2)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }} />
                  {/* Checkmark badge */}
                  {selectedPhotos.has(photo.id) && (
                    <div style={{
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
        <div className="mls-tablet__tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 20px 24px' }}>

          {/* Card */}
          <div style={{
            width: '100%', background: '#FFFFFF',
            border: '1px solid #E5E7EB', borderRadius: 12,
            padding: '32px 17px 17px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>

            {/* Description text */}
            <p style={{
              fontFamily: 'Inter', fontSize: 18, fontWeight: 600,
              color: '#858A8E', lineHeight: 1.4, margin: 0,
            }}>
              Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you.
            </p>

            {/* Generate button */}
            <button
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Warning box */}
                <div style={{
                  background: '#FFF3CD', border: '1px solid #FFC107',
                  borderRadius: 8, padding: '17px 17px 16px',
                  boxSizing: 'border-box',
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {/* Warning icon */}
                    <div style={{ width: 20, height: 20, flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.58 2.91L1.39 15.5C1.14 15.93 1.44 16.47 1.95 16.47H16.33C16.83 16.47 17.14 15.93 16.89 15.5L9.7 2.91C9.44 2.47 8.84 2.47 8.58 2.91Z" stroke="#856404" strokeWidth="1.3" strokeLinejoin="round"/>
                        <path d="M9.14 8V11.5" stroke="#856404" strokeWidth="1.4" strokeLinecap="round"/>
                        <circle cx="9.14" cy="13.5" r="0.75" fill="#856404"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#856404', lineHeight: '21px' }}>
                        No Property Information
                      </span>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#856404', lineHeight: '19.5px' }}>
                        Property information was not provided during upload.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provide Information Now button */}
                <button
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
                  <p style={{
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
      {/*  Property Information Modal                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {propertyModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px', boxSizing: 'border-box',
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 16,
            boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: 500,
            overflow: 'hidden', boxSizing: 'border-box',
          }}>

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div style={{
              height: 69, borderBottom: '1px solid #E5E7EB',
              background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 24px', boxSizing: 'border-box',
            }}>
              <span style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: '#0A0A0A', lineHeight: '30px' }}>
                Property Information
              </span>
              <button
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
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>

              {/* Subtitle */}
              <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#6A7282', lineHeight: '21px', margin: 0 }}>
                Please provide property details to generate an AI-powered marketing description.
              </p>

              {/* Fields container */}
              <div style={{
                background: '#FAFAFA', borderRadius: 16,
                padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
                boxSizing: 'border-box',
              }}>

                {/* Property type */}
                <div style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 16, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 12px', boxSizing: 'border-box',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M1 6.5L7 1.5L13 6.5V13.5H9V9.5H5V13.5H1V6.5Z" stroke="#858A8E" strokeWidth="1" strokeLinejoin="round"/>
                    </svg>
                    <select style={{
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#858A8E',
                      border: 'none', outline: 'none', background: 'transparent',
                      appearance: 'none', WebkitAppearance: 'none', flex: 1, cursor: 'pointer',
                      lineHeight: '22px',
                    }}>
                      <option value="">Property type</option>
                      <option>Condo</option>
                      <option>Townhouse</option>
                      <option>Detached</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Intended buyer profile */}
                <div style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 16, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 12px', boxSizing: 'border-box',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="7" cy="4.5" r="2.5" stroke="#858A8E" strokeWidth="1"/>
                      <path d="M1.5 12.5C1.5 10.01 4.02 8 7 8C9.98 8 12.5 10.01 12.5 12.5" stroke="#858A8E" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    <select style={{
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#858A8E',
                      border: 'none', outline: 'none', background: 'transparent',
                      appearance: 'none', WebkitAppearance: 'none', flex: 1, cursor: 'pointer',
                      lineHeight: '22px',
                    }}>
                      <option value="">Intended buyer profile</option>
                      <option>First-time buyer</option>
                      <option>Investor</option>
                      <option>Family</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Intended use */}
                <div style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 16, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 12px', boxSizing: 'border-box',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M1 1.5H6.5L11 6L6 11L1 6V1.5Z" stroke="#858A8E" strokeWidth="1" strokeLinejoin="round"/>
                      <circle cx="3.5" cy="3.5" r="0.75" fill="#858A8E"/>
                    </svg>
                    <select style={{
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#858A8E',
                      border: 'none', outline: 'none', background: 'transparent',
                      appearance: 'none', WebkitAppearance: 'none', flex: 1, cursor: 'pointer',
                      lineHeight: '22px',
                    }}>
                      <option value="">Intended use</option>
                      <option>Primary residence</option>
                      <option>Investment</option>
                      <option>Vacation home</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Property address */}
                <div style={{
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
                <div style={{
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

              </div>{/* /fields container */}

              {/* ── Footer buttons ──────────────────────────────────────── */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
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

            </div>{/* /form body */}

          </div>
        </div>
      )}

    </div>
  );
}
