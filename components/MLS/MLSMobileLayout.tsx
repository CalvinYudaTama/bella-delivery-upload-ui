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

  // ── Logo overlay for preview ────────────────────────────────────────────────
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

  // ── Bella Virtual logo overlay ──────────────────────────────────────────────
  const bellaLogo = (
    <div style={{ position: 'absolute', bottom: '3%', right: '3%', pointerEvents: 'none' }}>
      <img src="/bella-staging-logo.svg" alt="Bella Virtual" style={{ width: 90, height: 'auto', display: 'block', opacity: 0.95 }} />
    </div>
  );

  // ── Pagination controls ─────────────────────────────────────────────────────
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

  // ── Preview Modal (Page 3) ──────────────────────────────────────────────────
  if (showPreview && watermarkEnabled) {
    return (
      <div
        ref={containerRef}
        className="mls-hub mls-hub--mobile mls-hub--preview"
        style={{
          width: '100%', display: 'flex', flexDirection: 'column',
          gap: 0, boxSizing: 'border-box', background: '#FAFAFA',
        }}
      >
        {/* ── Preview Modal Header ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB', boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <InstagramIcon size={24} />
            <span style={{
              fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
              color: '#111827', lineHeight: '1.4',
            }}>
              Instagram
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#374151',
            }}
            aria-label="Close preview"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="#374151" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Subtitle ─────────────────────────────────────────────────── */}
        <div style={{ padding: '10px 20px 0', boxSizing: 'border-box' }}>
          <span style={{
            fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
            color: '#6366F1', lineHeight: '1.5',
          }}>
            Images will be resized to 1080 × 1080px (1:1 aspect ratio)
          </span>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box' }}>

          {/* Image Settings section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{
              fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
              color: '#111827', lineHeight: '1.4',
            }}>
              Image Settings
            </span>

            {/* Logo size slider row */}
            <div style={{
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 10, padding: '12px 16px', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 400,
                  color: '#374151', lineHeight: '1.4',
                }}>
                  Slide to adjust the logo size
                </span>
                <span style={{
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
                  color: '#6366F1', lineHeight: '1.4',
                }}>
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
          </div>

          {/* Image preview with dashed border */}
          <div style={{
            border: '2px dashed #6366F1',
            borderRadius: 10, overflow: 'hidden',
            position: 'relative', width: '100%',
            aspectRatio: '1 / 1', background: '#F3F4F6',
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

          {/* Pagination */}
          {pagination}

          {/* Confirm button */}
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            style={{
              width: '100%', height: 46, borderRadius: 8, border: 'none',
              background: '#6366F1', color: '#FFFFFF',
              fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', lineHeight: '1.4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  MAIN LAYOUT (Page 1 / Page 2 / Page 4)
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="mls-hub mls-hub--mobile"
      style={{
        width: '100%', boxSizing: 'border-box', background: '#FAFAFA',
      }}
    >
      {/* ── Unified padded container: gap 16 between all sections ──────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        boxSizing: 'border-box',
      }}>

        {/* ── TAB BAR ──────────────────────────────────────────────────── */}
        <div style={{
          width: '100%', height: 36,
          borderBottom: '1px solid #E9EAEB',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'flex-start',
          padding: '0 20px',
        }}>
          {/* Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            background: '#FAFAFA', border: '1px solid #E9EAEB', borderRadius: 8,
          }}>
            {(['resize-watermark', 'smart-description'] as ActiveTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'resize-watermark' ? 'Resize & Watermark' : 'Smart Description';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    height: 36, padding: '8px 12px',
                    border: isActive ? '1px solid #D5D7DA' : '1px solid transparent',
                    borderRadius: 8,
                    background: isActive ? '#FFFFFF' : 'transparent',
                    boxShadow: isActive ? '0px 1px 2px rgba(10,13,18,0.05)' : 'none',
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                    color: isActive ? '#414651' : '#717680',
                    cursor: 'pointer', lineHeight: '1.35',
                    whiteSpace: 'nowrap', boxSizing: 'border-box',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  TAB 1: Resize & Watermark                                   */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'resize-watermark' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 20px 20px', boxSizing: 'border-box' }}>
            {/* ── Platform selector card ──────────────────────────────── */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: '#FFFFFF', border: '1px solid #E5E7EB',
                  borderRadius: 12, padding: 13, boxSizing: 'border-box',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  cursor: 'pointer',
                }}
              >
                {/* 20×20 purple square icon */}
                <div style={{
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
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: '#1C398E', lineHeight: '1.4',
                  }}>
                    Instagram • Square Post
                  </span>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#4F46E5', lineHeight: '1.5',
                  }}>
                    Images will be resized to 1:1 ratio
                  </span>
                </div>
                {/* Chevron */}
                <div style={{
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
            <div style={{
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 12, padding: 13, boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {/* Watermark toggle row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                    color: '#374151', lineHeight: '1.35',
                  }}>
                    Watermark
                  </span>
                  <span style={{
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Upload My Logo button */}
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

                  {/* File name chip */}
                  {watermarkFile && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      border: '1px solid #E5E7EB', borderRadius: 6,
                      padding: '6px 10px', boxSizing: 'border-box',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M9.33 1.33H4a1.33 1.33 0 0 0-1.33 1.34v10.66A1.33 1.33 0 0 0 4 14.67h8a1.33 1.33 0 0 0 1.33-1.34V5.33L9.33 1.33Z" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.33 1.33V5.33h4" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <span style={{
                  flex: 1,
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                  color: '#111827', lineHeight: '1.4',
                }}>
                  Select Images to Export
                </span>
                <span style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                  color: '#6B7280', lineHeight: '1.4', flexShrink: 0,
                }}>
                  {selectedPhotos.size} of {MLS_PHOTOS.length} selected
                </span>
              </div>

              {/* Select All / Download buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  type="button"
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {MLS_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
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
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
                    )}
                    {selectedPhotos.has(photo.id) && (
                      <div style={{
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px 20px', boxSizing: 'border-box' }}>

          {/* Card */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: 12, padding: 16, boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <span style={{
              fontFamily: 'Inter', fontSize: 14, fontWeight: 600,
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
              type="button"
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
              <div style={{
                background: '#FFFBEB', border: '1px solid #F59E0B',
                borderRadius: 8, padding: 16, boxSizing: 'border-box',
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
                  type="button"
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
                  background: '#FAFAFA', borderRadius: 8,
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
                      boxSizing: 'border-box',
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

      </div>{/* end unified padded container */}
    </div>
  );
}
