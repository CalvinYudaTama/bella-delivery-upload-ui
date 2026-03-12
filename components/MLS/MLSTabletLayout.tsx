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

  // ── Image Settings card (inside preview) ──────────────────────────────────
  const imageSettingsCard = (
    <div style={{
      background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14,
      padding: 16, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#4F46E5', lineHeight: '1.4' }}>
        Image Settings
      </span>
      {/* Logo Size slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#52595F', lineHeight: '1.4' }}>Logo Size</span>
          <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#4F46E5', lineHeight: '1.4' }}>{watermarkSize}%</span>
        </div>
        <style>{sliderCSS}</style>
        <input
          className="mls-watermark-slider"
          type="range" min={0} max={100} value={watermarkSize}
          onChange={(e) => setWatermarkSize(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      {/* Apply to All */}
      <div
        role="button"
        onClick={() => setApplyToAll((v: boolean) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: 4, flexShrink: 0,
          border: applyToAll ? 'none' : '2px solid #D1D5DC',
          background: applyToAll ? '#4F46E5' : '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          {applyToAll && (
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#52595F', lineHeight: '1.4' }}>
          Apply to All Photos
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
      <div
        className="mls-tablet__tab-bar"
        style={{
          display: 'flex', alignItems: 'stretch',
          borderBottom: '1px solid #E5E7EB',
          width: '100%', boxSizing: 'border-box',
          background: '#FFFFFF',
        }}
      >
        {(['resize-watermark', 'smart-description'] as ActiveTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'resize-watermark' ? 'Resize & Watermark' : 'Smart Description';
          return (
            <button
              key={tab}
              className={`mls-tablet__tab${isActive ? ' mls-tablet__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: 'transparent', border: 'none',
                borderBottom: isActive ? '2px solid #000B14' : '2px solid transparent',
                marginBottom: -1,
                fontFamily: 'Inter', fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#000B14' : '#858A8E',
                cursor: 'pointer', lineHeight: '1.4',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  TAB 1: Resize & Watermark                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'resize-watermark' && (
        <div className="mls-tablet__tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>

          {/* ── Two-column control card ─────────────────────────────────── */}
          <div
            className="mls-tablet__control-card"
            style={{
              display: 'flex', gap: 0,
              border: '1px solid #E5E7EB', borderRadius: 10,
              overflow: 'hidden', width: '100%', boxSizing: 'border-box',
              background: '#FFFFFF',
            }}
          >
            {/* Left column: Instagram / Resize */}
            <div
              className="mls-tablet__instagram-col"
              style={{
                flex: 1, minWidth: 0,
                background: '#EFF6FF',
                padding: 12, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 10,
                borderRight: '1px solid #E5E7EB',
              }}
            >
              {/* Platform info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <InstagramIcon size={28} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                    color: '#1C398E', lineHeight: '1.3',
                  }}>
                    Instagram
                  </span>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 11, fontWeight: 400,
                    color: '#4F46E5', lineHeight: '1.3',
                  }}>
                    Square Post
                  </span>
                </div>
              </div>

              {/* Resize dropdown trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  className="mls-tablet__resize-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: '100%', padding: '7px 10px',
                    border: '1px solid #BEDBFF', borderRadius: 6,
                    background: '#FFFFFF', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: 'Inter', fontSize: 11, color: '#4A5565',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
                    {selectedResize}
                  </span>
                  <div style={{
                    flexShrink: 0, marginLeft: 4,
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>
                    <ChevronDownIcon color="#4F46E5" size={14} />
                  </div>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
                    zIndex: 50, background: '#FFFFFF',
                    border: '1px solid #E9EAEB', borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    overflow: 'hidden', boxSizing: 'border-box',
                  }}>
                    {RESIZE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                        style={{
                          width: '100%', padding: '9px 10px', textAlign: 'left',
                          background: opt === selectedResize ? '#F5F3FF' : 'transparent',
                          border: 'none', borderBottom: '1px solid #F3F4F6',
                          cursor: 'pointer', display: 'block', boxSizing: 'border-box',
                          fontFamily: 'Inter', fontSize: 12,
                          color: opt === selectedResize ? '#4F46E5' : '#000B14',
                          fontWeight: opt === selectedResize ? 500 : 400,
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Watermark */}
            <div
              className="mls-tablet__watermark-col"
              style={{
                flex: 1, minWidth: 0,
                background: '#FFFFFF',
                padding: 12, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              {/* Label + toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                    color: '#374151', lineHeight: '1.4',
                  }}>
                    Watermark
                  </span>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 11, fontWeight: 400,
                    color: '#6B7280', lineHeight: '1.3',
                  }}>
                    PNG, JPG • Max 2MB
                  </span>
                </div>
                <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
              </div>

              {/* Upload + Adjust logo size buttons (when watermark ON) */}
              {watermarkEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <UploadButton
                    watermarkFile={watermarkFile}
                    watermarkInputRef={watermarkInputRef}
                    handleWatermarkUpload={handleWatermarkUpload}
                  />
                  {/* Adjust logo size button — opens preview section */}
                  <button
                    className="mls-tablet__adjust-logo-btn"
                    type="button"
                    onClick={() => setShowPreview(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px',
                      border: '1px solid #4F46E5',
                      borderRadius: 6,
                      background: '#F5F3FF',
                      cursor: 'pointer',
                      fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                      color: '#4F46E5',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1.75C4.1 1.75 1.75 4.1 1.75 7C1.75 9.9 4.1 12.25 7 12.25C9.9 12.25 12.25 9.9 12.25 7C12.25 4.1 9.9 1.75 7 1.75Z" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 4.667V7M7 9.333H7.006" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Adjust logo size
                  </button>
                </div>
              )}

              {/* Filename chip (when logo uploaded) */}
              {watermarkFile && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#F0FDF4', border: '1px solid #B9F8CF',
                  borderRadius: 6, padding: '4px 8px', boxSizing: 'border-box',
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M9.33 1.33H4a1.33 1.33 0 0 0-1.33 1.34v10.66A1.33 1.33 0 0 0 4 14.67h8a1.33 1.33 0 0 0 1.33-1.34V5.33L9.33 1.33Z" stroke="#00A63E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.33 1.33V5.33h4" stroke="#00A63E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 11, fontWeight: 500,
                    color: '#0D542B', lineHeight: '1.3',
                    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {watermarkFile.name}
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#00A63E' }}>
                    {formatFileSize(watermarkFile.size)}
                  </span>
                  <button
                    type="button" onClick={handleWatermarkClear}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Preview section (collapsible) ───────────────────────────── */}
          {watermarkEnabled && (
            <div
              className="mls-tablet__preview-section"
              style={{
                width: '100%', background: '#FFFFFF',
                border: '1px solid #E5E7EB', borderRadius: 10,
                boxSizing: 'border-box', overflow: 'hidden',
              }}
            >
              {/* Preview header — always visible, click to toggle */}
              <div
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', cursor: 'pointer',
                }}
              >
                <span style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                  color: '#000B14', lineHeight: '21px', letterSpacing: '-0.15px',
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
                <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Image Settings card */}
                  {imageSettingsCard}

                  {/* Image preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{
                      position: 'relative', width: '100%',
                      aspectRatio: '1 / 1',
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

                  {/* Export button */}
                  {exportButton}
                </div>
              )}
            </div>
          )}

          {/* ── Photo selection section ──────────────────────────────────── */}
          <div
            className="mls-tablet__photo-section"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
                  color: '#111827', lineHeight: '1.4',
                }}>
                  Select Images to Export
                </span>
                <span style={{
                  fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
                  color: '#6B7280', lineHeight: '1.4',
                }}>
                  {selectedPhotos.size} of {MLS_PHOTOS.length}
                </span>
              </div>
              {/* Deselect all / Select all */}
              {allSelected ? (
                <button
                  onClick={() => setSelectedPhotos(new Set())}
                  style={{
                    padding: '4px 10px', borderRadius: 6,
                    border: '1px solid #D1D5DC', background: 'transparent',
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
                    color: '#52595F', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  Deselect all
                </button>
              ) : (
                <button
                  onClick={toggleSelectAll}
                  style={{
                    padding: '4px 10px', borderRadius: 6,
                    border: '1px solid #4F46E5', background: 'transparent',
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
                    color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  Select all
                </button>
              )}
            </div>

            {/* Photo grid — 3 columns, gap 8px, 4:3 aspect */}
            <div
              className="mls-tablet__photo-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}
            >
              {MLS_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  className="mls-tablet__photo-card"
                  onClick={() => togglePhoto(photo.id)}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
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
        <div className="mls-tablet__tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>

          {/* Card */}
          <div style={{
            width: '100%', background: '#FFFFFF',
            border: '1px solid #E5E7EB', borderRadius: 12,
            padding: 16, boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <span style={{
              fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
              color: '#111827', lineHeight: '1.4',
            }}>
              Smart Marketing Description
            </span>
            <p style={{
              fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
              color: '#858A8E', lineHeight: '1.5',
              margin: 0,
            }}>
              Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you.
            </p>

            {/* Generate button */}
            <button
              onClick={handleGenerateClick}
              style={{
                width: '100%', height: 46, padding: '12px 24px',
                borderRadius: 12, border: 'none',
                background: '#4F46E5', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <span style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.02em',
              }}>
                {generatedDescription ? 'TRY ANOTHER' : 'TRY OUR AI DESCRIPTION GENERATOR'}
              </span>
            </button>

            {/* Warning: no property info */}
            {showNoInfoWarning && !generatedDescription && (
              <div style={{
                background: '#FFFBEB', border: '1px solid #F59E0B',
                borderRadius: 12, padding: 16, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#92400E' }}>No Property Information</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#92400E' }}>Property information was not provided during upload.</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPropertyModal(true)}
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
                onClick={() => setIsEditingDescription(true)}
                style={{
                  background: '#FAFAFA', borderRadius: 12,
                  padding: 16, boxSizing: 'border-box',
                  cursor: 'text', border: isEditingDescription ? '2px solid #4F46E5' : '2px solid transparent',
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

    </div>
  );
}
