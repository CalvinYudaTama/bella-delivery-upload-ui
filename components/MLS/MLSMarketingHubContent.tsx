'use client';

import React, { useState, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MLSPhoto {
  id: string;
  url: string;
  label: string;
}

// ─── Dropdown options (from Figma comment by Violet) ─────────────────────────
const RESIZE_OPTIONS = [
  'realtor.com – 2,000 × 1,500 px (4:3)',
  'Realtor.ca – 2,000 × 1,500 px (4:3)',
  'Zillow – 2,048 × 1,536 px (4:3)',
  'Redfin – 2,048 × 1,536 px (4:3)',
  'REW.ca – 2,400 × 1,600 px (3:2 or 4:3)',
  'Instagram – 1,080 × 1,080 px (1:1)',
  'One-size export – 2,400 × 1,800 px (4:3)',
];

// ─── Dummy photos (from Figma node 13563:31059) ───────────────────────────────
// TODO (Riley): replace with real API images when available
const MLS_PHOTOS: MLSPhoto[] = [
  { id: '1', url: '/images/mls/mls-photo-1.png', label: 'Kitchen' },
  { id: '2', url: '/images/mls/mls-photo-2.png', label: 'Bedroom' },
  { id: '3', url: '/images/mls/mls-photo-3.png', label: 'Living Room' },
  { id: '4', url: '/images/mls/mls-photo-4.png', label: 'Dining Room' },
  { id: '5', url: '/images/mls/mls-photo-5.png', label: 'Study' },
  { id: '6', url: '/images/mls/mls-photo-6.png', label: 'Room' },
  { id: '7', url: '/images/mls/mls-photo-7.png', label: 'Hallway 1' },
  { id: '8', url: '/images/mls/mls-photo-8.png', label: 'Hallway 2' },
  { id: '9', url: '/images/mls/mls-photo-9.png', label: 'Hallway 3' },
];

// ─── Chevron Down Icon ────────────────────────────────────────────────────────
const ChevronDownIcon = () => (
  <svg className="mls-chevron-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Instagram Icon ───────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <div className="mls-platform-icon" style={{
    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
    background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
    </svg>
  </div>
);

// ─── Check Icon ──────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg className="mls-check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Photo Card ───────────────────────────────────────────────────────────────
function PhotoCard({
  photo,
  isSelected,
  onToggle,
}: {
  photo: MLSPhoto;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="mls-photo-card"
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '342 / 176',
        border: isSelected ? '3px solid #4F46E5' : '3px solid transparent',
        transition: 'border-color 0.15s ease',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      <img
        className="mls-photo-card__image"
        src={photo.url}
        alt={photo.label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      <div
        className="mls-photo-card__overlay"
        style={{
          position: 'absolute', inset: 0,
          background: hovered || isSelected ? 'rgba(0,0,0,0.25)' : 'transparent',
          transition: 'background 0.15s ease',
        }}
      />

      {(hovered || isSelected) && (
        <div
          className="mls-photo-card__checkbox"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 32, height: 32,
            borderRadius: 6,
            background: isSelected ? '#4F46E5' : 'rgba(255,255,255,0.85)',
            border: isSelected ? 'none' : '2px solid #D1D5DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s ease',
          }}
        >
          {isSelected && <CheckIcon />}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MLSMarketingHubContent() {
  const [selectedResize, setSelectedResize] = useState(RESIZE_OPTIONS[0]);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string | null>(null);
  const [watermarkSize, setWatermarkSize] = useState(50);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWatermarkFile(file);
    const url = URL.createObjectURL(file);
    setWatermarkPreviewUrl(url);
  };

  const handleWatermarkClear = () => {
    setWatermarkFile(null);
    setWatermarkPreviewUrl(null);
    setWatermarkSize(50);
    if (watermarkInputRef.current) watermarkInputRef.current.value = '';
  };

  const handleWatermarkToggle = () => {
    const next = !watermarkEnabled;
    setWatermarkEnabled(next);
    // If turning off, clear the uploaded file
    if (!next) handleWatermarkClear();
  };

  // Format bytes to human-readable size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const allSelected = selectedPhotos.size === MLS_PHOTOS.length;

  const togglePhoto = (id: string) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(MLS_PHOTOS.map((p) => p.id)));
    }
  };

  return (
    <div className="mls-hub" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ─── TOP BAR: Resize to + Watermark ──────────────────────────────────── */}
      <div className="mls-topbar" style={{
        width: '100%', background: '#FFFFFF',
        borderBottom: '1px solid #E9EAEB',
        padding: 16, boxSizing: 'border-box',
      }}>
        <div className="mls-topbar__inner" style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>

          {/* Resize to dropdown */}
          <div className="mls-topbar__resize" style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 314 }}>
            <label className="mls-topbar__resize-label" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#000B14', lineHeight: '20px' }}>
              Resize to:
            </label>
            <div className="mls-topbar__resize-dropdown" style={{ position: 'relative' }}>
              <button
                className="mls-topbar__resize-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: 314, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 12px', border: '1px solid #D1D5DB', borderRadius: 6,
                  background: '#FFFFFF', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 14, color: '#000B14',
                }}
              >
                <span className="mls-topbar__resize-value" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedResize}
                </span>
                <ChevronDownIcon />
              </button>

              {dropdownOpen && (
                <div className="mls-topbar__resize-menu" style={{
                  position: 'absolute', top: 40, left: 0, zIndex: 50,
                  width: 314, maxHeight: 280, overflowY: 'auto',
                  background: '#FFFFFF', border: '1px solid #E9EAEB',
                  borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }}>
                  {RESIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className="mls-topbar__resize-option"
                      onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                      style={{
                        width: '100%', padding: '10px 12px', textAlign: 'left',
                        background: opt === selectedResize ? '#F5F3FF' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        fontFamily: 'Inter', fontSize: 14,
                        color: opt === selectedResize ? '#4F46E5' : '#000B14',
                        fontWeight: opt === selectedResize ? 500 : 400,
                      }}
                      onMouseEnter={(e) => { if (opt !== selectedResize) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                      onMouseLeave={(e) => { if (opt !== selectedResize) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="mls-topbar__divider" style={{ width: 1, height: 60, background: '#E9EAEB', flexShrink: 0, marginTop: 4 }} />

          {/* Watermark toggle + upload */}
          <div className="mls-topbar__watermark" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="mls-topbar__watermark-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mls-topbar__watermark-label" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#000B14' }}>
                Watermark:
              </span>
              <button
                className="mls-topbar__watermark-toggle"
                onClick={handleWatermarkToggle}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: watermarkEnabled ? '#4F46E5' : '#D1D5DB',
                  position: 'relative', transition: 'background 0.2s ease',
                  flexShrink: 0, padding: 0,
                }}
                aria-label="Toggle watermark"
              >
                <div className="mls-topbar__watermark-knob" style={{
                  position: 'absolute', top: 3,
                  left: watermarkEnabled ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#FFFFFF', transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
            <span className="mls-topbar__watermark-hint" style={{ fontFamily: 'Inter', fontSize: 12, color: '#858A8E', lineHeight: '16px' }}>
              Accepted formats: png, jpeg, jpg, with maximum 10MB.
            </span>
          </div>

          {/* Upload my logo button + size slider — visible only when watermark is ON */}
          {watermarkEnabled && (
            <div className="mls-topbar__watermark-upload" style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              {/* Hidden file input */}
              <input
                ref={watermarkInputRef}
                className="mls-topbar__watermark-file-input"
                type="file"
                accept=".png,.jpeg,.jpg"
                style={{ display: 'none' }}
                onChange={handleWatermarkUpload}
              />

              {/* Upload button — default (no file) or green (file uploaded) */}
              <button
                className="mls-topbar__watermark-upload-btn"
                type="button"
                onClick={() => watermarkInputRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  height: 38, padding: '0 13px',
                  border: watermarkFile ? '1px solid #00C950' : '1px solid #D1D5DC',
                  borderRadius: 10,
                  background: watermarkFile ? '#F0FDF4' : '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                  color: watermarkFile ? '#328048' : '#4F46E5',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  minWidth: 0, maxWidth: 198, overflow: 'hidden',
                }}
              >
                {/* Upload icon — changes colour based on state */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M7 9.5V2M7 2L4.5 4.5M7 2L9.5 4.5"
                    stroke={watermarkFile ? '#328048' : '#4F46E5'}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.75 10.5V11.375C1.75 11.9963 2.25368 12.5 2.875 12.5H11.125C11.7463 12.5 12.25 11.9963 12.25 11.375V10.5"
                    stroke={watermarkFile ? '#328048' : '#4F46E5'}
                    strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {watermarkFile ? watermarkFile.name : 'Upload my logo'}
                </span>
              </button>

              {/* Size slider — only visible after file is uploaded */}
              {watermarkFile && (
                <div className="mls-topbar__watermark-size" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <style>{`
                    .mls-watermark-slider {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 100px;
                      height: 4px;
                      border-radius: 99px;
                      background: linear-gradient(
                        to right,
                        #4F46E5 0%,
                        #4F46E5 ${watermarkSize}%,
                        #E5E7EB ${watermarkSize}%,
                        #E5E7EB 100%
                      );
                      outline: none;
                      cursor: pointer;
                      border: none;
                      padding: 0;
                      margin: 0;
                    }
                    .mls-watermark-slider::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: #4F46E5;
                      cursor: pointer;
                      border: 2px solid #FFFFFF;
                      box-shadow: 0 1px 4px rgba(79, 70, 229, 0.4), 0 0 0 1px #4F46E5;
                      transition: box-shadow 0.15s ease;
                    }
                    .mls-watermark-slider::-moz-range-thumb {
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: #4F46E5;
                      cursor: pointer;
                      border: 2px solid #FFFFFF;
                      box-shadow: 0 1px 4px rgba(79, 70, 229, 0.4), 0 0 0 1px #4F46E5;
                    }
                    .mls-watermark-slider:hover::-webkit-slider-thumb {
                      box-shadow: 0 1px 6px rgba(79, 70, 229, 0.5), 0 0 0 3px rgba(79, 70, 229, 0.15);
                    }
                  `}</style>
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#4A5565', lineHeight: '16px', whiteSpace: 'nowrap' }}>
                    Size:
                  </span>
                  <input
                    className="mls-topbar__watermark-size-slider mls-watermark-slider"
                    type="range"
                    min={0}
                    max={100}
                    value={watermarkSize}
                    onChange={(e) => setWatermarkSize(Number(e.target.value))}
                  />
                  <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#4A5565', lineHeight: '16px', minWidth: 30, textAlign: 'right' }}>
                    {watermarkSize}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── WATERMARK FILE CONFIRMATION BAR — visible after file uploaded ─── */}
      {watermarkFile && (
        <div className="mls-watermark-bar" style={{
          width: '100%', background: '#F0FDF4',
          border: '1px solid #B9F8CF', borderRadius: 10,
          padding: '0 17px', boxSizing: 'border-box',
          height: 62, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: icon + file info */}
          <div className="mls-watermark-bar__info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* File icon container */}
            <div className="mls-watermark-bar__icon-wrap" style={{
              width: 32, height: 32, borderRadius: 10,
              background: '#DCFCE7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33 1.33H4a1.33 1.33 0 0 0-1.33 1.34v10.66A1.33 1.33 0 0 0 4 14.67h8a1.33 1.33 0 0 0 1.33-1.34V5.33L9.33 1.33Z" stroke="#00A63E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.33 1.33V5.33h4" stroke="#00A63E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* File name + size */}
            <div className="mls-watermark-bar__file-meta" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="mls-watermark-bar__file-name" style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                color: '#0D542B', lineHeight: '20px', letterSpacing: '-0.15px',
                maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {watermarkFile.name}
              </span>
              <span className="mls-watermark-bar__file-size" style={{
                fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
                color: '#00A63E', lineHeight: '16px',
              }}>
                {formatFileSize(watermarkFile.size)}
              </span>
            </div>
          </div>

          {/* Right: close / remove button */}
          <button
            className="mls-watermark-bar__remove-btn"
            type="button"
            onClick={handleWatermarkClear}
            aria-label="Remove watermark file"
            style={{
              width: 24, height: 24, borderRadius: 8,
              border: 'none', background: 'transparent',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              padding: 0, flexShrink: 0,
              color: '#4A5565',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* ─── PLATFORM HEADER CARD ────────────────────────────────────────────── */}
      <div className="mls-platform-header" style={{
        width: '100%', background: '#EFF6FF',
        border: '1px solid #BEDBFF', borderRadius: 10,
        padding: 16, boxSizing: 'border-box',
        height: 85, display: 'flex', alignItems: 'center',
      }}>
        <div className="mls-platform-header__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          {/* Left: platform icon + text */}
          <div className="mls-platform-header__info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <InstagramIcon />
            <div className="mls-platform-header__text" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="mls-platform-header__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#1C398E', lineHeight: '27px', letterSpacing: '-0.44px' }}>
                Instagram • Square Post
              </span>
              <span className="mls-platform-header__subtitle" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#4F46E5', lineHeight: '20px', letterSpacing: '-0.15px' }}>
                Images will be resized to 1080 × 1080px (1:1 aspect ratio)
              </span>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="mls-platform-header__actions" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            {selectedPhotos.size === 0 ? (
              /* No selection → show "Select All" green button */
              <button
                className="mls-platform-header__select-btn"
                onClick={toggleSelectAll}
                style={{
                  height: 38, padding: '9px 16px', borderRadius: 8, border: 'none',
                  background: '#2BC556', color: '#FFFFFF',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  letterSpacing: '-0.15px', lineHeight: '20px',
                }}
              >
                Select All
              </button>
            ) : (
              /* Has selection → show "Deselect All" + "Export (N)" */
              <>
                <button
                  className="mls-platform-header__deselect-btn"
                  onClick={() => setSelectedPhotos(new Set())}
                  style={{
                    height: 38, padding: '9px 16px', borderRadius: 8,
                    border: '1px solid #D1D5DC', background: 'transparent',
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#0A0A0A', cursor: 'pointer', whiteSpace: 'nowrap',
                    letterSpacing: '-0.15px', lineHeight: '20px',
                  }}
                >
                  Deselect All
                </button>
                <button
                  className="mls-platform-header__export-btn"
                  onClick={() => { /* TODO: trigger export */ }}
                  style={{
                    height: 36, padding: '0 16px', borderRadius: 8, border: 'none',
                    background: '#4F46E5', color: '#FFFFFF',
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    letterSpacing: '-0.15px', lineHeight: '20px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  {/* Download icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V10.5M8 10.5L5 7.5M8 10.5L11 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 12.5H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Export ({selectedPhotos.size})
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ─── MAIN CONTENT CARD ───────────────────────────────────────────────── */}
      <div className="mls-content-card" style={{
        background: '#FFFFFF', borderRadius: 10,
        border: '1px solid #E5E7EB', width: '100%',
        boxSizing: 'border-box', display: 'flex',
        flexDirection: 'column', gap: 36, padding: 24,
      }}>

        {/* ─── Select Images to Export ──────────────────────────────────────── */}
        <div className="mls-photo-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="mls-photo-section__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="mls-photo-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
              Select Images to Export
            </h2>
            <span className="mls-photo-section__count" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#6A7282', lineHeight: '20px', letterSpacing: '-0.15px' }}>
              {selectedPhotos.size} of {MLS_PHOTOS.length} selected
            </span>
          </div>

          {/* Photo grid — 3 columns, 3 rows */}
          <div className="mls-photo-grid" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div className="mls-photo-grid__row" style={{ display: 'flex', gap: 22 }}>
              {MLS_PHOTOS.slice(0, 3).map((photo) => (
                <PhotoCard key={photo.id} photo={photo} isSelected={selectedPhotos.has(photo.id)} onToggle={() => togglePhoto(photo.id)} />
              ))}
            </div>
            <div className="mls-photo-grid__row" style={{ display: 'flex', gap: 22 }}>
              {MLS_PHOTOS.slice(3, 6).map((photo) => (
                <PhotoCard key={photo.id} photo={photo} isSelected={selectedPhotos.has(photo.id)} onToggle={() => togglePhoto(photo.id)} />
              ))}
            </div>
            <div className="mls-photo-grid__row" style={{ display: 'flex', gap: 22 }}>
              {MLS_PHOTOS.slice(6, 9).map((photo) => (
                <PhotoCard key={photo.id} photo={photo} isSelected={selectedPhotos.has(photo.id)} onToggle={() => togglePhoto(photo.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Export Options ───────────────────────────────────────────────── */}
        <div className="mls-export-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="mls-export-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
            Export Options
          </h3>
          <button className="mls-export-section__zip-btn" style={{
            display: 'inline-flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: 16,
            border: '2px solid #4F46E5', borderRadius: 12,
            background: '#FFFDFF', cursor: 'pointer', alignSelf: 'flex-start',
          }}>
            <span className="mls-export-section__zip-label" style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#4F46E5', lineHeight: '20px', letterSpacing: '-0.15px' }}>
              Download as ZIP
            </span>
            <span className="mls-export-section__zip-meta" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#4F46E5', lineHeight: '16px' }}>
              {selectedPhotos.size > 0 ? selectedPhotos.size : MLS_PHOTOS.length} images • Square Post
            </span>
          </button>
        </div>

        {/* ─── Smart Marketing Description ──────────────────────────────────── */}
        <div className="mls-ai-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="mls-ai-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
            Smart Marketing Description
          </h3>
          <p className="mls-ai-section__description" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#858A8E', lineHeight: '27px', margin: 0, maxWidth: 429, letterSpacing: '-0.44px' }}>
            Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you
          </p>
          <div className="mls-ai-section__cta">
            <button className="mls-ai-section__cta-btn" style={{
              height: 46, padding: '12px 24px',
              borderRadius: 12, border: 'none',
              background: '#4F46E5', color: '#FFFFFF',
              fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
              textTransform: 'uppercase', cursor: 'pointer',
            }}>
              TRY OUR AI DESCRIPTION GENERATOR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
