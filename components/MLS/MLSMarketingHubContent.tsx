'use client';

import React, { useState, useRef, useEffect } from 'react';

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

// ─── Breakpoints ──────────────────────────────────────────────────────────────
// Desktop  : >= 1024px
// Tablet   : 768px – 1023px
// Mobile   : < 768px  (reserved for next sprint)

// ─── Chevron Down Icon ────────────────────────────────────────────────────────
const ChevronDownIcon = ({ color = '#535862', size = 16 }: { color?: string; size?: number }) => (
  <svg className="mls-chevron-icon" width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Instagram Icon ───────────────────────────────────────────────────────────
const InstagramIcon = ({ size = 40 }: { size?: number }) => (
  <div className="mls-platform-icon" style={{
    width: size, height: size, borderRadius: 10, flexShrink: 0,
    background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
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

// ─── Watermark Toggle Button (shared) ────────────────────────────────────────
function WatermarkToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="mls-topbar__watermark-toggle"
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: enabled ? '#4F46E5' : '#D1D5DB',
        position: 'relative', transition: 'background 0.2s ease',
        flexShrink: 0, padding: 0,
      }}
      aria-label="Toggle watermark"
    >
      <div className="mls-topbar__watermark-knob" style={{
        position: 'absolute', top: 3,
        left: enabled ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#FFFFFF', transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MLSMarketingHubContent() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedResize, setSelectedResize] = useState(RESIZE_OPTIONS[0]);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [aiDescVisible, setAiDescVisible] = useState(false);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string | null>(null);
  const [watermarkSize, setWatermarkSize] = useState(50);

  // ── Breakpoint detection via ResizeObserver on the container ─────────────
  // Measures the *actual rendered width* of the MLS content area,
  // so the sidebar offset is automatically accounted for.
  // Compact (tablet/mobile) : container width < 768px
  // Desktop                 : container width ≥ 768px
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(9999);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    // Set initial value immediately
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  const isCompact = containerWidth < 768;  // tablet + mobile
  const isMobile  = containerWidth < 480;  // reserved for next sprint

  // ── Refs ───────────────────────────────────────────────────────────────────
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
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
    if (!next) handleWatermarkClear();
  };

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

  // ── Shared slider CSS (injected once) ────────────────────────────────────
  const sliderCSS = `
    .mls-watermark-slider {
      -webkit-appearance: none; appearance: none;
      width: 100px; height: 4px; border-radius: 99px;
      background: linear-gradient(to right, #4F46E5 0%, #4F46E5 ${watermarkSize}%, #E5E7EB ${watermarkSize}%, #E5E7EB 100%);
      outline: none; cursor: pointer; border: none; padding: 0; margin: 0;
    }
    .mls-watermark-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 16px; height: 16px; border-radius: 50%;
      background: #4F46E5; cursor: pointer;
      border: 2px solid #FFFFFF;
      box-shadow: 0 1px 4px rgba(79,70,229,0.4), 0 0 0 1px #4F46E5;
      transition: box-shadow 0.15s ease;
    }
    .mls-watermark-slider::-moz-range-thumb {
      width: 16px; height: 16px; border-radius: 50%;
      background: #4F46E5; cursor: pointer;
      border: 2px solid #FFFFFF;
      box-shadow: 0 1px 4px rgba(79,70,229,0.4), 0 0 0 1px #4F46E5;
    }
    .mls-watermark-slider:hover::-webkit-slider-thumb {
      box-shadow: 0 1px 6px rgba(79,70,229,0.5), 0 0 0 3px rgba(79,70,229,0.15);
    }
  `;

  // ── Upload button (shared between desktop + tablet) ───────────────────────
  const UploadButton = () => (
    <>
      <input
        ref={watermarkInputRef}
        className="mls-topbar__watermark-file-input"
        type="file"
        accept=".png,.jpeg,.jpg"
        style={{ display: 'none' }}
        onChange={handleWatermarkUpload}
      />
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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M7 9.5V2M7 2L4.5 4.5M7 2L9.5 4.5" stroke={watermarkFile ? '#328048' : '#4F46E5'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.75 10.5V11.375C1.75 11.9963 2.25368 12.5 2.875 12.5H11.125C11.7463 12.5 12.25 11.9963 12.25 11.375V10.5" stroke={watermarkFile ? '#328048' : '#4F46E5'} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {watermarkFile ? watermarkFile.name : 'Upload my logo'}
        </span>
      </button>
      {watermarkFile && (
        <div className="mls-topbar__watermark-size" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <style>{sliderCSS}</style>
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#4A5565', lineHeight: '16px', whiteSpace: 'nowrap' }}>Size:</span>
          <input
            className="mls-topbar__watermark-size-slider mls-watermark-slider"
            type="range" min={0} max={100} value={watermarkSize}
            onChange={(e) => setWatermarkSize(Number(e.target.value))}
          />
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#4A5565', lineHeight: '16px', minWidth: 30, textAlign: 'right' }}>
            {watermarkSize}%
          </span>
        </div>
      )}
    </>
  );

  // ── Watermark confirmation bar (shared) ───────────────────────────────────
  const WatermarkBar = () => watermarkFile ? (
    <div className="mls-watermark-bar" style={{
      width: '100%', background: '#F0FDF4',
      border: '1px solid #B9F8CF', borderRadius: 10,
      padding: '0 17px', boxSizing: 'border-box',
      height: 62, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div className="mls-watermark-bar__info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="mls-watermark-bar__icon-wrap" style={{
          width: 32, height: 32, borderRadius: 10, background: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M9.33 1.33H4a1.33 1.33 0 0 0-1.33 1.34v10.66A1.33 1.33 0 0 0 4 14.67h8a1.33 1.33 0 0 0 1.33-1.34V5.33L9.33 1.33Z" stroke="#00A63E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.33 1.33V5.33h4" stroke="#00A63E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="mls-watermark-bar__file-meta" style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#0D542B', lineHeight: '20px', letterSpacing: '-0.15px', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {watermarkFile.name}
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#00A63E', lineHeight: '16px' }}>
            {formatFileSize(watermarkFile.size)}
          </span>
        </div>
      </div>
      <button
        className="mls-watermark-bar__remove-btn"
        type="button" onClick={handleWatermarkClear}
        aria-label="Remove watermark file"
        style={{ width: 24, height: 24, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  ) : null;

  // ── Platform header action buttons (shared logic) ─────────────────────────
  const PlatformActions = () => selectedPhotos.size === 0 ? (
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2V10.5M8 10.5L5 7.5M8 10.5L11 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.5 12.5H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Export ({selectedPhotos.size})
      </button>
    </>
  );

  // ────────────────────────────────────────────────────────────────────────────
  //  TABLET LAYOUT  (768px – 1023px)
  // ────────────────────────────────────────────────────────────────────────────
  if (isCompact) {
    return (
      <div ref={containerRef} className="mls-hub mls-hub--tablet" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── TABLET: Platform header row (compact, with chevron) ────────────── */}
        <div className="mls-platform-header mls-platform-header--tablet" style={{
          width: '100%', background: '#EFF6FF',
          border: '1px solid #BEDBFF', borderRadius: '10px 10px 0 0',
          padding: '8px 13px', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          minHeight: 57,
        }}>
          {/* Left: icon + title + subtitle + chevron */}
          <div className="mls-platform-header__info" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <InstagramIcon size={20} />
            <div className="mls-platform-header__text" style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
              <span className="mls-platform-header__title" style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                color: '#1C398E', lineHeight: '21px', letterSpacing: '-0.15px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                Instagram • Square Post
              </span>
              <span className="mls-platform-header__subtitle" style={{
                fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
                color: '#4F46E5', lineHeight: '16px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                Images will be resized to 1080 × 1080px (1:1 aspect ratio)
              </span>
            </div>
            <div style={{ flexShrink: 0, marginLeft: 4 }}>
              <ChevronDownIcon color="#4F46E5" size={24} />
            </div>
          </div>

          {/* Right: Select All / Deselect + Export */}
          <div className="mls-platform-header__actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
            <PlatformActions />
          </div>
        </div>

        {/* ── TABLET: Watermark row ─────────────────────────────────────────── */}
        <div className="mls-topbar mls-topbar--tablet" style={{
          width: '100%', background: '#FFFFFF',
          border: '1px solid #BEDBFF', borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          padding: '13px', boxSizing: 'border-box',
        }}>
          <div className="mls-topbar__watermark-row--tablet" style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          }}>
            {/* Left: label + hint */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="mls-topbar__watermark-label" style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#364153', lineHeight: '20px',
              }}>
                Watermark
              </span>
              <span className="mls-topbar__watermark-hint" style={{
                fontFamily: 'Inter', fontSize: 12, color: '#858A8E', lineHeight: '16.5px',
              }}>
                Accepts PNG, JPG • Max 2MB
              </span>
            </div>
            {/* Right: toggle */}
            <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
          </div>

          {/* Upload button + slider (visible when watermark ON) */}
          {watermarkEnabled && (
            <div className="mls-topbar__watermark-upload--tablet" style={{
              display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap',
            }}>
              <UploadButton />
            </div>
          )}
        </div>

        {/* ── TABLET: Watermark file confirmation bar ───────────────────────── */}
        {watermarkFile && (
          <div style={{ marginTop: 8 }}>
            <WatermarkBar />
          </div>
        )}

        {/* ── TABLET: Content area (no outer card border on tablet, uses inner padding) */}
        <div className="mls-content-card mls-content-card--tablet" style={{
          background: '#FFFFFF', borderRadius: 10,
          border: '1px solid #E5E7EB', width: '100%',
          boxSizing: 'border-box', display: 'flex',
          flexDirection: 'column', gap: 24,
          padding: 13, marginTop: 16,
        }}>

          {/* ── Select Images to Export ──────────────────────────────────────── */}
          <div className="mls-photo-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="mls-photo-section__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="mls-photo-section__title" style={{
                fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: '#0A0A0A',
                margin: 0, lineHeight: '22.5px', letterSpacing: '-0.15px',
              }}>
                Select Images to Export
              </h2>
              <span className="mls-photo-section__count" style={{
                fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#6A7282',
                lineHeight: '19.5px', letterSpacing: '-0.15px',
              }}>
                {selectedPhotos.size} of {MLS_PHOTOS.length} selected
              </span>
            </div>

            {/* Photo grid — 3 columns, gap 12px on tablet */}
            <div className="mls-photo-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[MLS_PHOTOS.slice(0, 3), MLS_PHOTOS.slice(3, 6), MLS_PHOTOS.slice(6, 9)].map((row, ri) => (
                <div key={ri} className="mls-photo-grid__row" style={{ display: 'flex', gap: 12 }}>
                  {row.map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} isSelected={selectedPhotos.has(photo.id)} onToggle={() => togglePhoto(photo.id)} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Export Options (tablet: full-width stacked buttons) ─────────── */}
          <div className="mls-export-section" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <h3 className="mls-export-section__title" style={{
              fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#0A0A0A',
              margin: 0, lineHeight: '21px', letterSpacing: '-0.15px',
            }}>
              Export Options
            </h3>

            {/* Download as ZIP — full width, filled */}
            <button className="mls-export-section__zip-btn mls-export-section__zip-btn--tablet" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 45, padding: '0 16px',
              border: 'none', borderRadius: 8,
              background: '#4F46E5', cursor: 'pointer', boxSizing: 'border-box',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V10.5M8 10.5L5 7.5M8 10.5L11 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.5 12.5H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#FFFFFF', lineHeight: '21px' }}>
                Download as ZIP
              </span>
            </button>

            {/* Share via Link — full width, outlined */}
            <button className="mls-export-section__share-btn" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 47, padding: '0 16px',
              border: '1px solid #E5E7EB', borderRadius: 8,
              background: '#FFFFFF', cursor: 'pointer', boxSizing: 'border-box',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.667 8.667a3.333 3.333 0 0 0 5.06.373l2-2a3.333 3.333 0 0 0-4.714-4.714L7.72 3.613" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.333 7.333a3.333 3.333 0 0 0-5.06-.373l-2 2a3.333 3.333 0 0 0 4.714 4.714l1.286-1.287" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#4F46E5', lineHeight: '21px' }}>
                Share via Link
              </span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  DESKTOP LAYOUT  (≥ 1024px)  — unchanged from original
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="mls-hub" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ─── TOP BAR: Resize to + Watermark (+ file confirmation bar inside) ─── */}
      <div className="mls-topbar" style={{
        width: '100%', background: '#FFFFFF',
        border: '1px solid #E5E7EB', borderRadius: 10,
        padding: 16, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Row 1: controls */}
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

          {/* Watermark toggle */}
          <div className="mls-topbar__watermark" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="mls-topbar__watermark-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mls-topbar__watermark-label" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#000B14' }}>
                Watermark:
              </span>
              <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
            </div>
            <span className="mls-topbar__watermark-hint" style={{ fontFamily: 'Inter', fontSize: 12, color: '#858A8E', lineHeight: '16px' }}>
              Accepted formats: png, jpeg, jpg, with maximum 10MB.
            </span>
          </div>

          {/* Upload button + size slider */}
          {watermarkEnabled && (
            <div className="mls-topbar__watermark-upload" style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <UploadButton />
            </div>
          )}
        </div>

        {/* Row 2: file confirmation bar — inside topbar card, only when file uploaded */}
        {watermarkFile && <WatermarkBar />}
      </div>

      {/* ─── PLATFORM HEADER CARD ────────────────────────────────────────────── */}
      <div className="mls-platform-header" style={{
        width: '100%', background: '#EFF6FF',
        border: '1px solid #BEDBFF', borderRadius: 10,
        padding: 16, boxSizing: 'border-box',
        height: 85, display: 'flex', alignItems: 'center',
      }}>
        <div className="mls-platform-header__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
          <div className="mls-platform-header__actions" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <PlatformActions />
          </div>
        </div>
      </div>

      {/* ─── CARD 1: Select Images to Export ────────────────────────────────── */}
      <div className="mls-content-card" style={{
        background: '#FFFFFF', borderRadius: 10,
        border: '1px solid #E5E7EB', width: '100%',
        boxSizing: 'border-box', padding: 24,
      }}>
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
            {[MLS_PHOTOS.slice(0, 3), MLS_PHOTOS.slice(3, 6), MLS_PHOTOS.slice(6, 9)].map((row, ri) => (
              <div key={ri} className="mls-photo-grid__row" style={{ display: 'flex', gap: 22 }}>
                {row.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} isSelected={selectedPhotos.has(photo.id)} onToggle={() => togglePhoto(photo.id)} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CARD 2: Export Options ───────────────────────────────────────────── */}
      <div className="mls-export-section" style={{
        background: '#FFFFFF', borderRadius: 10,
        border: '1px solid #E5E7EB', width: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 16,
        padding: '32px 24px',
      }}>
        <h3 className="mls-export-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
          Export Options
        </h3>
        <button className="mls-export-section__zip-btn" style={{
          display: 'inline-flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
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

      {/* ─── CARD 3: Smart Marketing Description ─────────────────────────────── */}
      <div className="mls-ai-section" style={{
        background: '#FFFFFF', borderRadius: 10,
        border: '1px solid #E5E7EB', width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: aiDescVisible ? 'row' : 'row',
        alignItems: 'flex-start',
        padding: '32px 24px',
        gap: 32,
      }}>
        {/* Left: title + desc + button */}
        <div className="mls-ai-section__left" style={{ display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          <h3 className="mls-ai-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
            Smart Marketing Description
          </h3>
          <p className="mls-ai-section__description" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 500, color: '#858A8E', lineHeight: '27px', margin: 0, maxWidth: 429, letterSpacing: '-0.44px' }}>
            Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you
          </p>
          <div className="mls-ai-section__cta">
            <button
              className="mls-ai-section__cta-btn"
              onClick={() => setAiDescVisible(true)}
              style={{
                height: 46, padding: '12px 24px',
                borderRadius: 12, border: 'none',
                background: '#4F46E5', color: '#FFFFFF',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                textTransform: 'uppercase', cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              TRY OUR AI DESCRIPTION GENERATOR
            </button>
          </div>
        </div>

        {/* Right: AI result panel — only shown after button click */}
        {aiDescVisible && (
          <div className="mls-ai-section__result" style={{
            flex: '1 0 0', minWidth: 0,
            background: '#FAFAFA', borderRadius: 12,
            padding: 24, alignSelf: 'stretch',
          }}>
            <p className="mls-ai-section__result-text" style={{
              fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
              color: '#0A0A0A', lineHeight: '27px',
              letterSpacing: '-0.44px', margin: 0,
            }}>
              One of the prettiest streets in Mount Pleasant West, this beautifully maintained 2-bed, 2-bath TH offers the perfect blend of comfort and space. Surrounded by mature trees &amp; cherry blossoms, this setting feels peaceful and established while remaining in the heart of the city. Unique floor plan offers a generous dining area with high ceilings off the kitchen, ideal for hosting. Each bdrm on its own level for some solitude with 3 private outdoor spaces to suit your mood. 4-unit strata offering a boutique feel with a strong sense of community. Walkable to Cambie Village, Main Street, Canada Line and community gardens. Easy to show. Open house Saturday Feb 21st 1 to 3 pm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
