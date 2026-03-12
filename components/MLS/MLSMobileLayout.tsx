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

export interface MLSMobileLayoutProps {
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

  // Container ref
  containerRef: React.RefObject<HTMLDivElement>;
}

// ─── MLSMobileLayout ─────────────────────────────────────────────────────────
// Mobile layout (< 480px) based on Figma design with 4 states:
//   Page 1: Resize & Watermark tab, watermark OFF (default)
//   Page 2: Resize & Watermark tab, watermark ON (with upload + adjust logo)
//   Page 3: Preview modal (logo size slider + image preview)
//   Page 4: Smart Description tab

export default function MLSMobileLayout({
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
}: MLSMobileLayoutProps) {

  const [activeTab, setActiveTab] = useState<ActiveTab>('resize-watermark');
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);

  // ── Property modal field states ─────────────────────────────────────────────
  const [propType, setPropType] = useState('');
  const [buyerProfile, setBuyerProfile] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [activePropField, setActivePropField] = useState<string | null>(null);

  // ── Dummy description text ──────────────────────────────────────────────────
  const DUMMY_DESCRIPTION = "One of the prettiest streets in Mount Pleasant West, this beautifully maintained 2-bed, 2-bath TH offers the perfect blend of comfort and space. Surrounded by mature trees & cherry blossoms, this setting feels peaceful and established while remaining in the heart of the city. Unique floor plan offers a generous dining area with high ceilings off the kitchen, ideal for hosting. Each bdrm on its own level for some solitude with 3 private outdoor spaces to suit your mood. 4-unit strata offering a boutique feel with a strong sense of community. Walkable to Cambie Village, Main Street, Canada Line and community gardens. Easy to show. Open house Saturday Feb 21st 1 to 3 pm.";

  // ── Logo overlay for preview ────────────────────────────────────────────────
  const logoOverlay = (
    <div
      className="mls-m__logo-overlay"
      style={{
        position: 'absolute', top: '3%', left: '3%', pointerEvents: 'none',
        transformOrigin: 'top left',
        transform: `scale(${0.3 + (watermarkSize / 100) * 0.7})`,
      }}
    >
      {watermarkPreviewUrl ? (
        <img
          className="mls-m__logo-overlay-img"
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
          className="mls-m__logo-overlay-placeholder"
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

  // ── Bella Virtual logo overlay ──────────────────────────────────────────────
  const bellaLogo = (
    <div className="mls-m__bella-logo" style={{ position: 'absolute', bottom: '3%', right: '3%', pointerEvents: 'none' }}>
      <img src="/bella-staging-logo.svg" alt="Bella Virtual" style={{ width: 90, height: 'auto', display: 'block', opacity: 0.95 }} />
    </div>
  );

  // ── Pagination controls ─────────────────────────────────────────────────────
  const pagination = (
    <div className="mls-m__pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div
        className="mls-m__pagination-prev"
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
        className="mls-m__pagination-counter"
        style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#858A8E', minWidth: 28, textAlign: 'center' }}
      >
        {previewIndex + 1}/{photosToPreview.length}
      </span>
      <div
        className="mls-m__pagination-next"
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

  // ────────────────────────────────────────────────────────────────────────────
  //  MAIN LAYOUT (Page 1 / Page 2 / Page 4) + Preview Modal overlay
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="mls-hub mls-hub--mobile"
      style={{
        width: '100%', boxSizing: 'border-box', background: '#FAFAFA',
      }}
    >
      {/* ── Single padded container matching Figma px-[20px] gap-[16px] ── */}
      <div className="mls-m__inner" style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        padding: '0 8px 8px', boxSizing: 'border-box',
      }}>

        {/* ── TAB BAR ──────────────────────────────────────────────────── */}
        <div className="mls-m__tab-bar" style={{
          display: 'flex', alignItems: 'center', gap: 2, width: '100%',
          background: '#FAFAFA', border: '1px solid #E9EAEB', borderRadius: 8,
          boxSizing: 'border-box',
        }}>
          {(['resize-watermark', 'smart-description'] as ActiveTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'resize-watermark' ? 'Resize & Watermark' : 'Smart Description';
            return (
              <button
                key={tab}
                className={`mls-m__tab-btn${isActive ? ' mls-m__tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, minWidth: 0,
                  height: 36, padding: '8px 12px',
                  border: isActive ? '1px solid #D5D7DA' : '1px solid transparent',
                  borderRadius: 8,
                  background: isActive ? '#FFFFFF' : 'transparent',
                  boxShadow: isActive ? '0px 1px 2px rgba(10,13,18,0.05)' : 'none',
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                  color: isActive ? '#414651' : '#717680',
                  cursor: 'pointer', lineHeight: '1.35',
                  whiteSpace: 'nowrap', boxSizing: 'border-box',
                  textAlign: 'center',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  TAB 1: Resize & Watermark                                   */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'resize-watermark' && (
          <div className="mls-m__rw-content" style={{ display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>

            {/* ── Platform selector card ──────────────────────────────── */}
            <div className="mls-m__platform-card" style={{ position: 'relative' }}>
              <div
                className="mls-m__platform-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: '#FFFFFF', border: '1px solid #E5E7EB',
                  borderRadius: 12, padding: 13, boxSizing: 'border-box',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  cursor: 'pointer',
                }}
              >
                {/* 20×20 purple square icon */}
                <div className="mls-m__platform-icon" style={{
                  width: 20, height: 20, background: '#4F46E5',
                  borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="white" strokeWidth="1.2"/>
                    <circle cx="6" cy="6" r="2.2" stroke="white" strokeWidth="1.2"/>
                    <circle cx="9" cy="3" r="0.7" fill="white"/>
                  </svg>
                </div>
                {/* Text */}
                <div className="mls-m__platform-text" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="mls-m__platform-title" style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: '#1C398E', lineHeight: '1.4',
                  }}>
                    Instagram • Square Post
                  </span>
                  <span className="mls-m__platform-subtitle" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#4F46E5', lineHeight: '1.5',
                  }}>
                    Images will be resized to 1:1 ratio
                  </span>
                </div>
                {/* Chevron */}
                <div className="mls-m__platform-chevron" style={{
                  display: 'flex', alignItems: 'center', alignSelf: 'stretch',
                  padding: '0 8px', flexShrink: 0,
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}>
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="mls-m__platform-dropdown" style={{
                  position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
                  zIndex: 50, background: '#FFFFFF',
                  border: '1px solid #E9EAEB', borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  overflow: 'hidden', boxSizing: 'border-box',
                }}>
                  {RESIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={`mls-m__platform-dropdown-item${opt === selectedResize ? ' mls-m__platform-dropdown-item--active' : ''}`}
                      onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                      style={{
                        width: '100%', padding: '10px 16px', textAlign: 'left',
                        background: opt === selectedResize ? '#F5F3FF' : 'transparent',
                        border: 'none', borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer', display: 'block', boxSizing: 'border-box',
                        fontFamily: 'Inter', fontSize: 13,
                        color: opt === selectedResize ? '#4F46E5' : '#111827',
                        fontWeight: opt === selectedResize ? 500 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Watermark card ──────────────────────────────────────── */}
            <div className="mls-m__watermark-card" style={{
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 12, padding: 13, boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {/* Watermark toggle row */}
              <div className="mls-m__watermark-toggle-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="mls-m__watermark-label-group" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="mls-m__watermark-title" style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                    color: '#374151', lineHeight: '1.35',
                  }}>
                    Watermark
                  </span>
                  <span className="mls-m__watermark-hint" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#6B7280', lineHeight: '1.5',
                  }}>
                    Accepts PNG, JPG • Max 2MB
                  </span>
                </div>
                <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
              </div>

              {/* Watermark ON state: upload + adjust logo */}
              {watermarkEnabled && (
                <div className="mls-m__watermark-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Upload My Logo button */}
                  <input
                    ref={watermarkInputRef as React.RefObject<HTMLInputElement>}
                    className="mls-m__upload-input"
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    style={{ display: 'none' }}
                    onChange={handleWatermarkUpload}
                  />
                  <button
                    type="button"
                    className="mls-m__upload-btn"
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

                  {/* File name chip */}
                  {watermarkFile && (
                    <div className="mls-m__file-chip" style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      border: '1px solid #E5E7EB', borderRadius: 6,
                      padding: '6px 10px', boxSizing: 'border-box',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M9.33 1.33H4a1.33 1.33 0 0 0-1.33 1.34v10.66A1.33 1.33 0 0 0 4 14.67h8a1.33 1.33 0 0 0 1.33-1.34V5.33L9.33 1.33Z" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.33 1.33V5.33h4" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="mls-m__file-chip-name" style={{
                        fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
                        color: '#374151', lineHeight: '1.4',
                        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {watermarkFile.name.length > 22
                          ? watermarkFile.name.slice(0, 19) + '...' + watermarkFile.name.slice(-4)
                          : watermarkFile.name}
                      </span>
                      <button
                        type="button"
                        className="mls-m__file-chip-remove"
                        onClick={handleWatermarkClear}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center',
                        }}
                        aria-label="Remove file"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4L12 12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Adjust logo size button */}
                  <button
                    type="button"
                    className="mls-m__adjust-logo-btn"
                    onClick={() => setShowPreview(true)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      padding: '9px 16px', height: 42, width: '100%',
                      border: 'none', borderRadius: 6,
                      background: 'linear-gradient(to right, #AD46FF, #F6339A)',
                      cursor: 'pointer',
                      fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                      color: '#FFFFFF', lineHeight: '1.4', boxSizing: 'border-box',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8H14M2 4H14M2 12H8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="2.5" stroke="#FFFFFF" strokeWidth="1.5"/>
                      <path d="M12 10.5V9M12 15V13.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10.5 12H9M15 12H13.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Adjust logo size
                  </button>
                </div>
              )}
            </div>

            {/* ── Select Images section ────────────────────────────────── */}
            <div className="mls-m__images-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Header row */}
              <div className="mls-m__images-header" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <span className="mls-m__images-title" style={{
                  flex: 1,
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                  color: '#111827', lineHeight: '1.4',
                }}>
                  Select Images to Export
                </span>
                <span className="mls-m__images-count" style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                  color: '#6B7280', lineHeight: '1.4', flexShrink: 0,
                }}>
                  {selectedPhotos.size} of {MLS_PHOTOS.length} selected
                </span>
              </div>

              {/* Select All / Download buttons */}
              <div className="mls-m__images-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  type="button"
                  className="mls-m__select-all-btn"
                  onClick={allSelected ? () => setSelectedPhotos(new Set()) : toggleSelectAll}
                  style={{
                    flex: 1, height: 40,
                    border: `1.5px solid ${allSelected ? '#D1D5DB' : '#00A63E'}`,
                    borderRadius: 6, background: 'transparent', cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: allSelected ? '#374151' : '#00A63E', lineHeight: '1.4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {allSelected ? 'Deselect All' : 'Select all'}
                </button>
                <button
                  type="button"
                  className={`mls-m__download-btn${hasSelection ? ' mls-m__download-btn--active' : ''}`}
                  disabled={!hasSelection}
                  onClick={() => { /* TODO: call export API */ }}
                  style={{
                    flex: 1, height: 40,
                    border: 'none', borderRadius: 6,
                    background: hasSelection ? '#4F46E5' : '#E5E7EB',
                    cursor: hasSelection ? 'pointer' : 'not-allowed',
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: hasSelection ? '#FFFFFF' : '#9CA3AF', lineHeight: '1.4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {hasSelection ? `Download (${selectedCount})` : 'Download'}
                </button>
              </div>

              {/* Photo grid — 3 columns, 1:1 aspect */}
              <div className="mls-m__photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {MLS_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className={`mls-m__photo-card${selectedPhotos.has(photo.id) ? ' mls-m__photo-card--selected' : ''}`}
                    onClick={() => togglePhoto(photo.id)}
                    style={{
                      position: 'relative', borderRadius: 10,
                      overflow: 'hidden', cursor: 'pointer', aspectRatio: '1 / 1',
                      boxShadow: selectedPhotos.has(photo.id)
                        ? '0 0 0 2.5px #4F46E5'
                        : '0 0 0 1px #E5E7EB',
                    }}
                  >
                    <img
                      src={photo.url} alt={photo.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {selectedPhotos.has(photo.id) && (
                      <div className="mls-m__photo-card-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                    )}
                    {selectedPhotos.has(photo.id) && (
                      <div className="mls-m__photo-card-check" style={{
                        position: 'absolute', top: 5, right: 5,
                        width: 18, height: 18, borderRadius: 4, background: '#4F46E5',
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

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/*  TAB 2: Smart Description (Page 4)                               */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'smart-description' && (
          <div className="mls-m__sd-content" style={{ display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box' }}>

            {/* Card */}
            <div className="mls-m__sd-card" style={{
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 12, padding: 16, boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <span className="mls-m__sd-title" style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                color: '#111827', lineHeight: '1.4',
              }}>
                Smart Marketing Description
              </span>
              <p className="mls-m__sd-description" style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                color: '#858A8E', lineHeight: '1.5',
                margin: 0,
              }}>
                Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you.
              </p>

              {/* Generate button */}
              <button
                type="button"
                className="mls-m__sd-generate-btn"
                onClick={handleGenerateClick}
                style={{
                  width: '100%', height: 46,
                  border: 'none', borderRadius: 6,
                  background: '#4F46E5', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                  color: '#FFFFFF', lineHeight: '1.4', textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}>
                  {generatedDescription ? 'TRY ANOTHER' : 'TRY OUR AI DESCRIPTION GENERATOR'}
                </span>
              </button>

              {/* Warning: no property info */}
              {showNoInfoWarning && !generatedDescription && (
                <div className="mls-m__sd-warning" style={{
                  background: '#FFFBEB', border: '1px solid #F59E0B',
                  borderRadius: 8, padding: 16, boxSizing: 'border-box',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  <div className="mls-m__sd-warning-body" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="mls-m__sd-warning-title" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#92400E' }}>No Property Information</span>
                      <span className="mls-m__sd-warning-subtitle" style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#92400E' }}>Property information was not provided during upload.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mls-m__sd-warning-btn"
                    onClick={() => setPropertyModalOpen(true)}
                    style={{
                      alignSelf: 'flex-start', padding: '8px 16px',
                      borderRadius: 8, border: '1px solid #F59E0B',
                      background: '#FFFFFF', cursor: 'pointer',
                      fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: '#92400E',
                    }}
                  >
                    Provide information now
                  </button>
                </div>
              )}

              {/* AI result panel */}
              {generatedDescription && (
                <div
                  className="mls-m__sd-result"
                  onClick={() => setIsEditingDescription(true)}
                  style={{
                    background: '#FAFAFA', borderRadius: 8,
                    padding: 16, boxSizing: 'border-box',
                    cursor: 'text', border: isEditingDescription ? '2px solid #4F46E5' : '2px solid transparent',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {isEditingDescription ? (
                    <textarea
                      className="mls-m__sd-result-textarea"
                      autoFocus
                      value={generatedDescription}
                      onChange={e => setGeneratedDescription(e.target.value)}
                      onBlur={() => setIsEditingDescription(false)}
                      style={{
                        width: '100%', minHeight: 120, resize: 'vertical',
                        fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                        color: '#0A0A0A', lineHeight: '22px', letterSpacing: '-0.15px',
                        border: 'none', background: 'transparent', outline: 'none', padding: 0,
                        boxSizing: 'border-box',
                      }}
                    />
                  ) : (
                    <p className="mls-m__sd-result-text" style={{
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

      </div>{/* end mls-m__inner */}

      {/* ── Property Information Modal — fixed overlay ───────────────────── */}
      {propertyModalOpen && (
        <div className="mls-m__prop-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px 16px', boxSizing: 'border-box',
          overflowY: 'auto',
        }}>
          <div className="mls-m__prop-modal" style={{
            background: '#FFFFFF', borderRadius: 16,
            boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: 380,
            boxSizing: 'border-box',
          }}>

            {/* Header */}
            <div className="mls-m__prop-header" style={{
              height: 56, borderBottom: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', boxSizing: 'border-box', flexShrink: 0,
            }}>
              <span className="mls-m__prop-header-title" style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                color: '#0A0A0A', lineHeight: '1.4',
              }}>
                Property Information
              </span>
              <button
                type="button"
                className="mls-m__prop-close"
                onClick={() => setPropertyModalOpen(false)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="mls-m__prop-body" style={{
              padding: 16, display: 'flex', flexDirection: 'column', gap: 14,
              boxSizing: 'border-box',
            }}>

              {/* Subtitle */}
              <p className="mls-m__prop-subtitle" style={{
                fontFamily: 'Inter', fontSize: 13, fontWeight: 400,
                color: '#6A7282', lineHeight: '1.5', margin: 0,
              }}>
                Please provide property details to generate an AI-powered marketing description.
              </p>

              {/* Fields */}
              <div className="mls-m__prop-fields" style={{
                background: '#FAFAFA', borderRadius: 12,
                padding: 12, display: 'flex', flexDirection: 'column', gap: 10,
                boxSizing: 'border-box',
              }}>

                {/* Property type — custom dropdown */}
                <div className="mls-m__prop-field-wrap" style={{ position: 'relative' }}>
                  <div
                    className="mls-m__prop-field"
                    onClick={() => setActivePropField(activePropField === 'type' ? null : 'type')}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${activePropField === 'type' ? '#4F46E5' : '#ECEFF0'}`,
                      borderRadius: activePropField === 'type' ? '12px 12px 0 0' : 12, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '4px 12px', boxSizing: 'border-box', cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M1 6.5L7 1.5L13 6.5V13.5H9V9.5H5V13.5H1V6.5Z" stroke="#858A8E" strokeWidth="1" strokeLinejoin="round"/>
                      </svg>
                      <span style={{
                        fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                        color: propType ? '#0A0A0A' : '#858A8E', lineHeight: '1.4',
                      }}>
                        {propType || 'Property type'}
                      </span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" style={{
                      flexShrink: 0,
                      transform: activePropField === 'type' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {activePropField === 'type' && (
                    <div className="mls-m__prop-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      background: '#FFFFFF', border: '1px solid #4F46E5', borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      {['Condo', 'Townhouse', 'Detached', 'Other'].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setPropType(opt); setActivePropField(null); }}
                          style={{
                            width: '100%', padding: '10px 14px', textAlign: 'left',
                            background: propType === opt ? '#F5F3FF' : '#FFFFFF',
                            border: 'none', borderBottom: '1px solid #F3F4F6',
                            cursor: 'pointer', display: 'block',
                            fontFamily: 'Inter', fontSize: 13,
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
                <div className="mls-m__prop-field-wrap" style={{ position: 'relative' }}>
                  <div
                    className="mls-m__prop-field"
                    onClick={() => setActivePropField(activePropField === 'buyer' ? null : 'buyer')}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${activePropField === 'buyer' ? '#4F46E5' : '#ECEFF0'}`,
                      borderRadius: activePropField === 'buyer' ? '12px 12px 0 0' : 12, height: 40,
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
                        fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                        color: buyerProfile ? '#0A0A0A' : '#858A8E', lineHeight: '1.4',
                      }}>
                        {buyerProfile || 'Intended buyer profile'}
                      </span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" style={{
                      flexShrink: 0,
                      transform: activePropField === 'buyer' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {activePropField === 'buyer' && (
                    <div className="mls-m__prop-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      background: '#FFFFFF', border: '1px solid #4F46E5', borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      {['First-time buyer', 'Investor', 'Family', 'Other'].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setBuyerProfile(opt); setActivePropField(null); }}
                          style={{
                            width: '100%', padding: '10px 14px', textAlign: 'left',
                            background: buyerProfile === opt ? '#F5F3FF' : '#FFFFFF',
                            border: 'none', borderBottom: '1px solid #F3F4F6',
                            cursor: 'pointer', display: 'block',
                            fontFamily: 'Inter', fontSize: 13,
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
                <div className="mls-m__prop-field-wrap" style={{ position: 'relative' }}>
                  <div
                    className="mls-m__prop-field"
                    onClick={() => setActivePropField(activePropField === 'use' ? null : 'use')}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${activePropField === 'use' ? '#4F46E5' : '#ECEFF0'}`,
                      borderRadius: activePropField === 'use' ? '12px 12px 0 0' : 12, height: 40,
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
                        fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                        color: intendedUse ? '#0A0A0A' : '#858A8E', lineHeight: '1.4',
                      }}>
                        {intendedUse || 'Intended use'}
                      </span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" style={{
                      flexShrink: 0,
                      transform: activePropField === 'use' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}>
                      <path d="M3.5 5.5L7.5 9.5L11.5 5.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {activePropField === 'use' && (
                    <div className="mls-m__prop-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                      background: '#FFFFFF', border: '1px solid #4F46E5', borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      {['Primary residence', 'Investment', 'Vacation home', 'Other'].map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setIntendedUse(opt); setActivePropField(null); }}
                          style={{
                            width: '100%', padding: '10px 14px', textAlign: 'left',
                            background: intendedUse === opt ? '#F5F3FF' : '#FFFFFF',
                            border: 'none', borderBottom: '1px solid #F3F4F6',
                            cursor: 'pointer', display: 'block',
                            fontFamily: 'Inter', fontSize: 13,
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
                <div className="mls-m__prop-field" style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 12, height: 40,
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
                      fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#858A8E',
                      lineHeight: '1.4',
                    }}
                  />
                </div>

                {/* MLS listing link */}
                <div className="mls-m__prop-field" style={{
                  background: '#FFFFFF', border: '1px solid #ECEFF0',
                  borderRadius: 12, height: 40,
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
                      fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#858A8E',
                      lineHeight: '1.4',
                    }}
                  />
                </div>

              </div>{/* /mls-m__prop-fields */}

              {/* Footer buttons */}
              <div className="mls-m__prop-footer" style={{
                display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center',
              }}>
                <button
                  type="button"
                  className="mls-m__prop-cancel-btn"
                  onClick={() => setPropertyModalOpen(false)}
                  style={{
                    height: 40, padding: '0 16px',
                    borderRadius: 8, border: 'none',
                    background: '#F3F4F6', cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: '#4A5565',
                    lineHeight: '1.4', whiteSpace: 'nowrap',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mls-m__prop-submit-btn"
                  onClick={() => {
                    setGeneratedDescription(DUMMY_DESCRIPTION);
                    setPropertyModalOpen(false);
                  }}
                  style={{
                    height: 40, padding: '0 16px',
                    borderRadius: 8, border: 'none',
                    background: '#4F46E5', cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: '#FFFFFF',
                    textTransform: 'uppercase', lineHeight: '1.4', whiteSpace: 'nowrap',
                  }}
                >
                  Generate Description
                </button>
              </div>

            </div>{/* /mls-m__prop-body */}

          </div>
        </div>
      )}

      {/* ── Preview Modal — fixed overlay (Page 3) ───────────────────────── */}
      {showPreview && watermarkEnabled && (
        <div className="mls-m__preview-overlay" style={{
          position: 'fixed', inset: 0,
          background: 'rgba(133,138,142,0.6)',
          zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px 16px', boxSizing: 'border-box',
        }}>
          <div className="mls-m__preview-modal" style={{
            background: '#FFFFFF',
            borderRadius: 7, border: '1px solid #E5E7EB',
            width: '100%', maxWidth: 350,
            padding: 16, boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', gap: 11,
            maxHeight: 'calc(100vh - 40px)', overflowY: 'auto',
          }}>
            {/* Header: row 1 — icon + title + close button (same line, no overlap) */}
            <div className="mls-m__preview-header" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Instagram icon — 30×30 purple rounded square */}
              <div className="mls-m__preview-platform-icon" style={{
                width: 30, height: 30, background: '#4F46E5',
                borderRadius: 7, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
                  <rect x="1.5" y="1.5" width="9" height="9" rx="2.5" stroke="white" strokeWidth="1.2"/>
                  <circle cx="6" cy="6" r="2.2" stroke="white" strokeWidth="1.2"/>
                  <circle cx="9" cy="3" r="0.7" fill="white"/>
                </svg>
              </div>
              {/* Title */}
              <span className="mls-m__preview-title" style={{
                flex: 1, minWidth: 0,
                fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                color: '#1C398E', lineHeight: '1.4',
              }}>
                Instagram
              </span>
              {/* Close button */}
              <button
                type="button"
                className="mls-m__preview-close"
                onClick={() => setShowPreview(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, flexShrink: 0, width: 24, height: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Close preview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#374151" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {/* Header: row 2 — subtitle (indented to align with title) */}
            <span className="mls-m__preview-subtitle" style={{
              paddingLeft: 38, flexShrink: 0,
              fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
              color: '#4F46E5', lineHeight: '1.4',
            }}>
              Images will be resized to 1080 × 1080px (1:1 aspect ratio)
            </span>

            {/* Image Settings card */}
            <div className="mls-m__preview-settings-card" style={{
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              borderRadius: 10, padding: 11, boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 11, flexShrink: 0,
            }}>
              <span className="mls-m__preview-settings-title" style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                color: '#4F46E5', lineHeight: '1.4',
              }}>
                Image Settings
              </span>
              <div className="mls-m__preview-settings-slider-col" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="mls-m__preview-settings-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="mls-m__preview-settings-label" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#52595F', lineHeight: '1.5',
                  }}>
                    Slide to adjust the logo size
                  </span>
                  <span className="mls-m__preview-settings-value" style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#4F46E5', lineHeight: '1.5',
                  }}>
                    {watermarkSize}%
                  </span>
                </div>
                <style>{sliderCSS}</style>
                <input
                  className="mls-watermark-slider mls-m__preview-slider"
                  type="range" min={0} max={100} value={watermarkSize}
                  onChange={(e) => setWatermarkSize(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Image preview + pagination */}
            <div className="mls-m__preview-image-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', flexShrink: 0 }}>
              <div className="mls-m__preview-image-area" style={{
                width: '100%', height: 285, overflow: 'hidden',
                position: 'relative', flexShrink: 0,
              }}>
                {photosToPreview.length > 0 && (
                  <img
                    className="mls-m__preview-image"
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

            {/* Confirm button */}
            <button
              type="button"
              className="mls-m__preview-confirm-btn"
              onClick={() => setShowPreview(false)}
              style={{
                width: '100%', height: 33, borderRadius: 4, border: 'none',
                background: '#4F46E5', color: '#FFFFFF',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', lineHeight: '1.5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxSizing: 'border-box', flexShrink: 0,
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
