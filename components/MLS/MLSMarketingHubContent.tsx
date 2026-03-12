'use client';

import React, { useState, useRef, useEffect } from 'react';
import MLSTabletLayout from './MLSTabletLayout';
import MLSMobileLayout from './MLSMobileLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MLSPhoto {
  id: string;
  url: string;
  label: string;
}

// ─── Dropdown options (from Figma comment by Violet) ─────────────────────────
export const RESIZE_OPTIONS = [
  'realtor.com – 2,000 × 1,500 px (4:3)',
  'Realtor.ca – 2,000 × 1,500 px (4:3)',
  'Zillow – 2,048 × 1,536 px (4:3)',
  'Redfin – 2,048 × 1,536 px (4:3)',
  'REW.ca – 2,400 × 1,600 px (3:2 or 4:3)',
  'Instagram – 1,080 × 1,080 px (1:1)',
];

// ─── Dummy photos (from Figma node 13563:31059) ───────────────────────────────
// TODO (Riley): replace with real API images when available
export const MLS_PHOTOS: MLSPhoto[] = [
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
// Desktop  : >= 768px
// Tablet   : 480px – 767px
// Mobile   : < 480px

// ─── Chevron Down Icon ────────────────────────────────────────────────────────
export const ChevronDownIcon = ({ color = '#535862', size = 16 }: { color?: string; size?: number }) => (
  <svg className="mls-chevron-icon" width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Instagram Icon ───────────────────────────────────────────────────────────
export const InstagramIcon = ({ size = 40 }: { size?: number }) => (
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
export const CheckIcon = () => (
  <svg className="mls-check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Photo Card ───────────────────────────────────────────────────────────────
export function PhotoCard({
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
export function WatermarkToggle({
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

// ─── Watermark Size Slider ────────────────────────────────────────────────────
// Defined OUTSIDE the main component so React never unmounts/remounts it on re-render.
// (Inline component defs inside a function body cause remount every render → drag breaks.)
export function WatermarkSizeSlider({
  watermarkSize,
  setWatermarkSize,
  sliderCSS,
}: {
  watermarkSize: number;
  setWatermarkSize: (v: number) => void;
  sliderCSS: string;
}) {
  return (
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
  );
}

// ─── Upload Button ────────────────────────────────────────────────────────────
// Also defined OUTSIDE the main component for the same remount-prevention reason.
// NOTE: Logo size slider is NOT here — it lives only in the Preview section.
export function UploadButton({
  watermarkFile,
  watermarkInputRef,
  handleWatermarkUpload,
}: {
  watermarkFile: File | null;
  watermarkInputRef: React.RefObject<HTMLInputElement | null>;
  handleWatermarkUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
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
          padding: '9.5px 17.5px',
          border: '1.5px solid #D1D5DC',
          borderRadius: 6,
          background: '#FFFFFF',
          cursor: 'pointer',
          fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
          color: '#4F46E5',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M7 9.5V2M7 2L4.5 4.5M7 2L9.5 4.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.75 10.5V11.375C1.75 11.9963 2.25368 12.5 2.875 12.5H11.125C11.7463 12.5 12.25 11.9963 12.25 11.375V10.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Upload my logo</span>
      </button>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MLSMarketingHubContent() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedResize, setSelectedResize] = useState(RESIZE_OPTIONS[0]);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  // ---------------------------------------------------------------------------
  // AI Description state
  // ---------------------------------------------------------------------------
  // generatedDescription : the current AI-generated text shown to the user.
  //                        Backend team: replace dummy text with real API response.
  // showNoInfoWarning    : shown when user clicks Generate but no property info
  //                        was submitted during the upload flow.
  // showPropertyModal    : controls the "Provide Property Info" popup form.
  // isEditingDescription : true when the user clicks the description to edit it.
  // descriptionIndex     : tracks which dummy variant is shown (frontend-only).
  //                        Backend team: remove this and use API call instead.
  // propertyFormData     : form fields collected before calling the AI generator.
  //                        Backend team: send these fields to the AI API endpoint.
  // hasPropertyInfo      : flag indicating if property info was already submitted
  //                        during upload. Backend team: derive this from the order/
  //                        project data when loading the page.
  // ---------------------------------------------------------------------------

  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const [showNoInfoWarning, setShowNoInfoWarning] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState({
    propertyType: '',
    buyerProfile: '',
    intendedUse: '',
    propertyAddress: '',
    mlsLink: '',
  });

  // TODO (backend): replace `hasPropertyInfo` with real data from the order/project.
  // Set to true if the client filled in property details during the upload step.
  const hasPropertyInfo = false;

  // ---------------------------------------------------------------------------
  // Dummy AI descriptions — frontend placeholder only.
  // TODO (backend): remove this array and call the AI generation API instead.
  // ---------------------------------------------------------------------------
  const DUMMY_DESCRIPTIONS = [
    'One of the prettiest streets in Mount Pleasant West, this beautifully maintained 2-bed, 2-bath TH offers the perfect blend of comfort and space. Surrounded by mature trees & cherry blossoms, this setting feels peaceful and established while remaining in the heart of the city. Unique floor plan offers a generous dining area with high ceilings off the kitchen, ideal for hosting. Each bdrm on its own level for some solitude with 3 private outdoor spaces to suit your mood. 4-unit strata offering a boutique feel with a strong sense of community. Walkable to Cambie Village, Main Street, Canada Line and community gardens. Easy to show.',
    'Nestled on a quiet tree-lined street, this bright and spacious 3-bed, 2-bath home is perfect for families or savvy investors. Featuring an open-concept living and dining area flooded with natural light, updated kitchen with stainless steel appliances, and a private backyard ideal for entertaining. Steps from top-rated schools, parks, and transit. This move-in ready gem won\'t last long — schedule your viewing today.',
    'Welcome to this stunning corner unit condo with panoramic city views. This 1-bed + den layout offers maximum flexibility for a home office or guest space. Enjoy a chef-inspired kitchen, spa-like bathroom, and an oversized balcony perfect for morning coffee. Building amenities include a rooftop lounge, gym, and 24/7 concierge. Located in the heart of downtown, with the best restaurants, shops, and transit at your doorstep.',
  ];
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string | null>(null);
  const [watermarkSize, setWatermarkSize] = useState(50);

  // ---------------------------------------------------------------------------
  // Logo Preview state
  // ---------------------------------------------------------------------------
  // showPreview   : true when the preview panel is expanded (visible below platform header).
  //                 Auto-closes when watermark is turned off.
  // previewIndex  : index into `photosToPreview` array for the large image shown in preview.
  // applyToAll    : whether logo settings should apply to all exported photos.
  //                 TODO (backend): use this flag when generating the export batch.
  // ---------------------------------------------------------------------------
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  // applyToAll: when true, the logo size setting applies uniformly to all exported images.
  // TODO (backend): pass applyToAll to the export API so all images use the same watermark config.
  const [applyToAll, setApplyToAll] = useState(false);

  // ---------------------------------------------------------------------------
  // AI Description handlers
  // ---------------------------------------------------------------------------

  // Whether at least one form field has been filled in.
  const isFormValid = Object.values(propertyFormData).some(v => v.trim() !== '');

  // Called when the user clicks "TRY OUR AI DESCRIPTION GENERATOR" or "TRY ANOTHER".
  // TODO (backend): replace the dummy text logic with an API call to the AI generator.
  const handleGenerateClick = () => {
    if (hasPropertyInfo || generatedDescription) {
      // Scenario 1: property info exists — generate (or re-generate) description.
      // Cycles through dummy variants so "Try Another" feels interactive.
      // TODO (backend): call AI API here and await the response.
      const nextIndex = (descriptionIndex + 1) % DUMMY_DESCRIPTIONS.length;
      setDescriptionIndex(nextIndex);
      setGeneratedDescription(DUMMY_DESCRIPTIONS[nextIndex]);
      setShowNoInfoWarning(false);
      setIsEditingDescription(false);
    } else {
      // Scenario 2: no property info — show warning bar with "Provide Info" CTA.
      setShowNoInfoWarning(true);
    }
  };

  // Called when the user submits the Property Information modal form.
  // TODO (backend): send `propertyFormData` to the AI API and use the response
  // as `generatedDescription` instead of the dummy text below.
  const handleFormSubmit = () => {
    setGeneratedDescription(DUMMY_DESCRIPTIONS[descriptionIndex]);
    setShowPropertyModal(false);
    setShowNoInfoWarning(false);
    setIsEditingDescription(false);
  };

  // ── Breakpoint detection via window resize ────────────────────────────────
  // Uses window.innerWidth so the observer is stable regardless of which
  // layout (desktop / tablet / mobile) is currently mounted.
  // Compact (tablet/mobile) : width < 768px
  // Desktop                 : width ≥ 768px
  const containerRef = useRef<HTMLDivElement>(null);
  // Mirror the same isMounted + useState(1280) pattern used in projects/layout.tsx.
  // Before mount (SSR + first client paint): isMounted=false → always desktop (1280).
  // After mount: isMounted=true → use real window.innerWidth.
  // This guarantees SSR HTML == initial client render, eliminating hydration mismatch.
  const [containerWidth, setContainerWidth] = useState<number>(1280);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    setContainerWidth(window.innerWidth);
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isCompact = isMounted && containerWidth < 768;  // tablet + mobile
  const isMobile  = isMounted && containerWidth < 480;  // mobile only

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
    if (!next) {
      handleWatermarkClear();
      setShowPreview(false); // auto-close preview when watermark turned off
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Preview photos: selected photos if any, otherwise all photos ─────────
  // Used for the preview carousel only — shows all photos when nothing is selected
  // so the user can still browse and preview the watermark placement.
  const photosToPreview = selectedPhotos.size > 0
    ? MLS_PHOTOS.filter(p => selectedPhotos.has(p.id))
    : MLS_PHOTOS;

  // ── Export selection helpers ───────────────────────────────────────────────
  // hasSelection : true when at least 1 photo is checked in the grid below.
  // selectedCount: the exact number of photos that will be exported.
  //
  // TODO (backend): use selectedCount / selectedPhotos for the export API call.
  //   Export payload (see export button onClick comments for full spec):
  //     photoIds      → Array.from(selectedPhotos)   (string[])
  //     watermarkEnabled, watermarkFile, watermarkSize, applyToAll, selectedResize
  const selectedCount = selectedPhotos.size;
  const hasSelection  = selectedCount > 0;

  // Clamp previewIndex whenever the preview list length changes
  // (e.g., user deselects a photo that was being previewed)
  useEffect(() => {
    setPreviewIndex(prev => Math.max(0, Math.min(prev, photosToPreview.length - 1)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosToPreview.length]);

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

  // ── Shared slider CSS (injected once, used only in preview section now) ──
  const sliderCSS = `
    .mls-watermark-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 4px; border-radius: 99px;
      background: linear-gradient(to right, #4F46E5 0%, #4F46E5 ${watermarkSize}%, #E5E7EB ${watermarkSize}%, #E5E7EB 100%);
      outline: none; cursor: pointer; border: none; padding: 0; margin: 0;
      touch-action: none;
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
  // Photo section select/deselect buttons — shown inside the "Select Images to Export" header
  const PhotoSectionActions = () => !allSelected ? (
    <button
      className="mls-photo-section__select-btn"
      onClick={toggleSelectAll}
      style={{
        padding: '6px 16px', borderRadius: 6,
        border: '1.5px solid #4F46E5', background: 'transparent',
        fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
        color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap',
        lineHeight: '24px', boxSizing: 'border-box',
      }}
    >
      Select all
    </button>
  ) : (
    <button
      className="mls-photo-section__deselect-btn"
      onClick={() => setSelectedPhotos(new Set())}
      style={{
        padding: '6px 16px', borderRadius: 6,
        border: '1.5px solid #D1D5DC', background: 'transparent',
        fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
        color: '#52595F', cursor: 'pointer', whiteSpace: 'nowrap',
        lineHeight: '24px', boxSizing: 'border-box',
      }}
    >
      Deselect All
    </button>
  );

  // Legacy platform header actions — kept for tablet/mobile layouts
  const PlatformActions = () => selectedPhotos.size === 0 ? (
    <button
      className="mls-platform-header__select-btn"
      onClick={toggleSelectAll}
      style={{
        height: 38, padding: '9px 16px', borderRadius: 6,
        border: '1.5px solid #4F46E5', background: 'transparent',
        color: '#4F46E5',
        fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
        cursor: 'pointer', whiteSpace: 'nowrap',
        letterSpacing: '-0.15px', lineHeight: '20px',
      }}
    >
      Select all
    </button>
  ) : (
    <>
      <button
        className="mls-platform-header__deselect-btn"
        onClick={() => setSelectedPhotos(new Set())}
        style={{
          height: 38, padding: '9px 16px', borderRadius: 6,
          border: '1.5px solid #D1D5DC', background: 'transparent',
          fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
          color: '#52595F', cursor: 'pointer', whiteSpace: 'nowrap',
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

  // ── Preview / Close Preview toggle button (shared across breakpoints) ────
  // Only visible when watermark is enabled. Always outlined gray per Figma.
  const PreviewToggleBtn = () => watermarkEnabled ? (
    <button
      className="mls-platform-header__preview-btn"
      onClick={() => setShowPreview(v => !v)}
      style={{
        height: 38, padding: '9px 16px',
        borderRadius: 8,
        border: '1.5px solid #D1D5DC',
        background: 'transparent',
        fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
        color: '#52595F',
        cursor: 'pointer', whiteSpace: 'nowrap',
        letterSpacing: '-0.15px', lineHeight: '20px',
        boxSizing: 'border-box',
      }}
    >
      {showPreview ? 'Close Preview' : 'Preview'}
    </button>
  ) : null;

  // ── Preview section — breakpoint-aware ────────────────────────────────────
  // Desktop  : side-by-side (image left, settings card right) — rendered INSIDE platform-header card
  // Tablet/Mobile: stacked card (Figma node 14469-44653) — rendered as own standalone card
  // Called as {PreviewSection()} (not <PreviewSection/>) to avoid React remount on state change.
  const PreviewSection = (): JSX.Element | null => {
    if (!showPreview || !watermarkEnabled) return null;

    // ── Shared: logo overlay (top-left, scales with watermarkSize) ─────────
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

    // ── Shared: Bella Virtual logo (bottom-right) ─────────────────────────
    const bellaLogo = (logoSize: number) => (
      <div style={{ position: 'absolute', bottom: '3%', right: '3%', pointerEvents: 'none' }}>
        <img src="/bella-staging-logo.svg" alt="Bella Virtual" style={{ width: logoSize, height: 'auto', display: 'block', opacity: 0.95 }} />
      </div>
    );

    // ── Shared: area guide (hidden — flip `false` to `true` to enable) ────
    const areaGuide = (
      <>
        {false && (
          <div style={{ position: 'absolute', inset: '9.76% 9.33%', pointerEvents: 'none' }}>
            <img src="/area-guide.svg" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
        )}
      </>
    );

    // ── Shared: pagination chips ──────────────────────────────────────────
    const pagination = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div
          onClick={() => setPreviewIndex(prev => Math.max(0, prev - 1))}
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
          onClick={() => setPreviewIndex(prev => Math.min(photosToPreview.length - 1, prev + 1))}
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

    // ── Shared: Image Settings card ───────────────────────────────────────
    const imageSettingsCard = (cardPadding: number) => (
      <div style={{
        background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14,
        padding: cardPadding, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#4F46E5', lineHeight: '1.4' }}>
          Image Settings
        </span>
        {/* Logo Size */}
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
        {/* Apply to All — TODO (backend): use applyToAll flag in export API */}
        <div
          role="button"
          onClick={() => setApplyToAll(v => !v)}
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

    // ── Shared: Export button + hint ──────────────────────────────────────
    // TODO (backend): On click, trigger the export API with this payload:
    //   photoIds         → Array.from(selectedPhotos)   // string[] of selected photo IDs
    //   watermarkEnabled → watermarkEnabled             // boolean
    //   watermarkFile    → watermarkFile                // File | null  (null = use Bella default logo)
    //   watermarkSize    → watermarkSize                // number 0–100 (logo scale %)
    //   applyToAll       → applyToAll                   // boolean (apply same size to all images)
    //   resizeOption     → selectedResize               // string  (e.g. "Instagram – 1,080 × 1,080px (1:1)")
    const exportButton = (
      <>
        <button
          disabled={!hasSelection}
          onClick={() => { /* TODO (backend): call export API — see payload comment above */ }}
          style={{
            height: 48, borderRadius: 10, border: 'none',
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
          {hasSelection ? `Export Selected (${selectedCount} Images)` : 'Select images to export'}
        </button>
        {!hasSelection && (
          <p style={{
            fontFamily: 'Inter', fontSize: 13, fontWeight: 400,
            color: '#9CA3AF', textAlign: 'center', margin: 0, lineHeight: '1.5',
          }}>
            Select photos from the grid below to export
          </p>
        )}
      </>
    );

    // ── MOBILE / TABLET: stacked layout (Figma node 14469-44653) ──────────
    if (isCompact || isMobile) {
      return (
        <div className="mls-preview-section mls-preview-section--mobile" style={{
          width: '100%', background: '#FFFFFF',
          border: '1px solid #E5E7EB', borderRadius: 10,
          padding: 16, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {/* Header: "Preview" title + close chevron */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'Inter', fontSize: 16, fontWeight: 500,
              color: '#000B14', lineHeight: '21px', letterSpacing: '-0.15px',
            }}>
              Preview
            </span>
            <button
              onClick={() => setShowPreview(false)}
              style={{
                background: 'transparent', border: 'none', padding: 4,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}
              aria-label="Close preview"
            >
              <ChevronDownIcon color="#374151" size={20} />
            </button>
          </div>

          {/* Content column: Image Settings (above) → Image → Pagination */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Image Settings card — ABOVE image per Figma */}
            {imageSettingsCard(16)}

            {/* Image (1:1 square, full width) + pagination */}
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
                {bellaLogo(90)}
                {areaGuide}
              </div>
              {pagination}
            </div>
          </div>

          {/* Export button at bottom of card */}
          {exportButton}
        </div>
      );
    }

    // ── DESKTOP: side-by-side layout ──────────────────────────────────────
    // Rendered INSIDE the combined platform-header card (no outer card wrapper needed).
    return (
      <div className="mls-preview-section" style={{
        display: 'flex', gap: 24, alignItems: 'flex-start', width: '100%',
      }}>
        {/* Left: large image (903:671 aspect ratio) + pagination */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            position: 'relative', width: '100%',
            aspectRatio: '903 / 671',
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
            {bellaLogo(130)}
            {areaGuide}
          </div>
          {pagination}
        </div>

        {/* Right: Image Settings card + Export button */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {imageSettingsCard(24)}
          {exportButton}
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────────────────────────────────
  //  MOBILE LAYOUT  (< 480px)
  // ────────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <MLSMobileLayout
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
        selectedResize={selectedResize}
        setSelectedResize={setSelectedResize}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        watermarkEnabled={watermarkEnabled}
        handleWatermarkToggle={handleWatermarkToggle}
        watermarkFile={watermarkFile}
        watermarkPreviewUrl={watermarkPreviewUrl}
        watermarkInputRef={watermarkInputRef}
        handleWatermarkUpload={handleWatermarkUpload}
        handleWatermarkClear={handleWatermarkClear}
        watermarkSize={watermarkSize}
        setWatermarkSize={setWatermarkSize}
        formatFileSize={formatFileSize}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        applyToAll={applyToAll}
        setApplyToAll={setApplyToAll}
        photosToPreview={photosToPreview}
        sliderCSS={sliderCSS}
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
        togglePhoto={togglePhoto}
        toggleSelectAll={toggleSelectAll}
        allSelected={allSelected}
        selectedCount={selectedCount}
        hasSelection={hasSelection}
        generatedDescription={generatedDescription}
        setGeneratedDescription={setGeneratedDescription}
        isEditingDescription={isEditingDescription}
        setIsEditingDescription={setIsEditingDescription}
        showNoInfoWarning={showNoInfoWarning}
        handleGenerateClick={handleGenerateClick}
        setShowPropertyModal={setShowPropertyModal}
      />
    );
  }

  // ── OLD MOBILE BLOCK REMOVED — now delegated to MLSMobileLayout above ──
  if (false) {
    return (
      <div ref={containerRef} className="mls-hub mls-hub--mobile" style={{
        width: '100%', display: 'flex', flexDirection: 'column', gap: 16,
        boxSizing: 'border-box',
      }}>

        {/* ── MOBILE: Row 1 — Platform card + Select All button ─────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            {/* Platform info card — clickable to open resize dropdown */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                flex: 1, minWidth: 0,
                background: '#EFF6FF', border: '1px solid #BEDBFF',
                borderRadius: 10,
                padding: 8, boxSizing: 'border-box',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                minHeight: 85, cursor: 'pointer',
              }}
            >
              {/* Left: icon + text */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1, minWidth: 0 }}>
                <InstagramIcon size={20} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                    color: '#1C398E', lineHeight: '21px', letterSpacing: '-0.15px',
                  }}>
                    Instagram • Square Post
                  </span>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                    color: '#4F46E5', lineHeight: '16.2px',
                  }}>
                    Images will be resized to 1080 × 1080px (1:1 aspect ratio)
                  </span>
                </div>
              </div>
              {/* Chevron — rotates when open */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 8px', alignSelf: 'stretch', flexShrink: 0,
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}>
                <ChevronDownIcon color="#4F46E5" size={16} />
              </div>
            </div>

            {/* Select All / Deselect All + Export */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              {selectedPhotos.size === 0 ? (
                <button onClick={toggleSelectAll} style={{
                  height: 38, padding: '9px 16px', borderRadius: 8, border: 'none',
                  background: '#2BC556', color: '#FFFFFF',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '-0.15px', lineHeight: '20px',
                }}>
                  Select All
                </button>
              ) : (
                <>
                  <button onClick={() => setSelectedPhotos(new Set())} style={{
                    height: 34, padding: '0 12px', borderRadius: 8,
                    border: '1px solid #D1D5DC', background: 'transparent',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                    color: '#0A0A0A', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                    Deselect
                  </button>
                  <button onClick={() => { /* TODO */ }} style={{
                    height: 34, padding: '0 12px', borderRadius: 8, border: 'none',
                    background: '#4F46E5', color: '#FFFFFF',
                    fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2V10.5M8 10.5L5 7.5M8 10.5L11 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 12.5H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Export ({selectedPhotos.size})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Resize dropdown menu — full width, appears below platform card */}
          {dropdownOpen && (
            <div style={{
              width: '100%', background: '#FFFFFF',
              border: '1px solid #BEDBFF', borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              overflow: 'hidden', boxSizing: 'border-box',
            }}>
              {RESIZE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                  style={{
                    width: '100%', padding: '10px 12px', textAlign: 'left',
                    background: opt === selectedResize ? '#F5F3FF' : 'transparent',
                    border: 'none', borderBottom: '1px solid #F3F4F6',
                    cursor: 'pointer', display: 'block', boxSizing: 'border-box',
                    fontFamily: 'Inter', fontSize: 13,
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

        {/* ── MOBILE: Row 2 — Watermark card ────────────────────────────────── */}
        <div style={{
          width: '100%', background: '#FFFFFF',
          border: '1px solid #E5E7EB', borderRadius: 12,
          padding: 13, boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 500,
                color: '#374151', lineHeight: '21px', letterSpacing: '-0.15px',
              }}>
                Watermark
              </span>
              <span style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                color: '#6B7280', lineHeight: '16.5px',
              }}>
                Accepts PNG, JPG • Max 2MB
              </span>
            </div>
            <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
          </div>

          {/* Upload button + Preview toggle — visible when watermark ON */}
          {watermarkEnabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <UploadButton
                  watermarkFile={watermarkFile}
                  watermarkInputRef={watermarkInputRef}
                  handleWatermarkUpload={handleWatermarkUpload}
                />
                <PreviewToggleBtn />
              </div>
            </div>
          )}
        </div>

        {/* Watermark file confirmation bar */}
        {watermarkFile && <WatermarkBar />}

        {/* ── MOBILE: Preview section — uses shared PreviewSection() with mobile/tablet stacked layout */}
        {PreviewSection()}

        {/* ── MOBILE: Row 3 — Select Images to Export ────────────────────────── */}
        <div className="mls-photo-section mls-photo-section--mobile" style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {/* Header */}
          <div className="mls-photo-section__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="mls-photo-section__title" style={{
              fontFamily: 'Inter', fontSize: 15, fontWeight: 600,
              color: '#111827', lineHeight: '22.5px', letterSpacing: '-0.23px',
            }}>
              Select Images to Export
            </span>
            <span className="mls-photo-section__count" style={{
              fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
              color: '#6B7280', lineHeight: '19.5px', letterSpacing: '-0.08px',
            }}>
              {selectedPhotos.size} of {MLS_PHOTOS.length} selected
            </span>
          </div>

          {/* Photo grid — 3 columns, gap 8px */}
          <div className="mls-photo-grid mls-photo-grid--mobile" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}>
            {MLS_PHOTOS.map((photo) => (
              <div
                key={photo.id}
                className="mls-photo-card mls-photo-card--mobile"
                onClick={() => togglePhoto(photo.id)}
                style={{
                  position: 'relative',
                  borderRadius: 10,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '4 / 3',
                  boxShadow: selectedPhotos.has(photo.id)
                    ? '0 0 0 2px #4F46E5'
                    : '0 0 0 1px #E5E7EB',
                  transition: 'box-shadow 0.15s ease',
                }}
              >
                <img
                  className="mls-photo-card__img"
                  src={photo.url}
                  alt={photo.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* No logo overlays on thumbnails — watermark preview is in PreviewSection only */}
                {/* Dark overlay when selected */}
                <div className="mls-photo-card__overlay" style={{
                  position: 'absolute', inset: 0,
                  background: selectedPhotos.has(photo.id) ? 'rgba(0,0,0,0.2)' : 'transparent',
                  transition: 'background 0.15s ease',
                }} />
                {/* Checkmark badge */}
                {selectedPhotos.has(photo.id) && (
                  <div className="mls-photo-card__check" style={{
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

        {/* ── MOBILE: Row 5 — Smart Marketing Description card ──────────────── */}
        <div style={{
          width: '100%', background: '#FFFFFF',
          border: '1px solid #E5E7EB', borderRadius: 12,
          padding: 17, boxSizing: 'border-box',
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
            color: '#858A8E', lineHeight: '1.4',
            margin: 0,
          }}>
            Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you.
          </p>
          <button
            onClick={handleGenerateClick}
            style={{
              height: 46, padding: '12px',
              borderRadius: 12, border: 'none',
              background: '#4F46E5', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <span style={{
              fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
              color: '#FFFFFF', lineHeight: '1.4', textTransform: 'uppercase',
            }}>
              {generatedDescription ? 'TRY ANOTHER' : 'TRY OUR AI DESCRIPTION GENERATOR'}
            </span>
          </button>

          {/* Warning: no property info */}
          {showNoInfoWarning && !generatedDescription && (
            <div style={{
              background: '#FFF3CD', border: '1px solid #FFC107',
              borderRadius: 8, padding: '17px 17px 4px 17px', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10 2L1.5 17h17L10 2z" stroke="#856404" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10 8v4M10 14.5v.5" stroke="#856404" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#856404', lineHeight: '21px' }}>No Property Information</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#856404', lineHeight: '19.5px' }}>Property information was not provided during upload.</span>
                </div>
              </div>
              <button
                onClick={() => setShowPropertyModal(true)}
                style={{
                  alignSelf: 'flex-start', marginBottom: 16,
                  height: 46, padding: '12px 24px',
                  borderRadius: 12, border: '2px solid #4F46E5',
                  background: '#FFFDFF', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                  color: '#4F46E5', textTransform: 'capitalize',
                }}
              >
                Provide Information Now
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
                  value={generatedDescription ?? ''}
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
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  TABLET LAYOUT  (480px – 767px)
  // ────────────────────────────────────────────────────────────────────────────
  if (isCompact) {
    return (
      <MLSTabletLayout
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
        selectedResize={selectedResize}
        setSelectedResize={setSelectedResize}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        watermarkEnabled={watermarkEnabled}
        handleWatermarkToggle={handleWatermarkToggle}
        watermarkFile={watermarkFile}
        watermarkPreviewUrl={watermarkPreviewUrl}
        watermarkInputRef={watermarkInputRef}
        handleWatermarkUpload={handleWatermarkUpload}
        handleWatermarkClear={handleWatermarkClear}
        watermarkSize={watermarkSize}
        setWatermarkSize={setWatermarkSize}
        formatFileSize={formatFileSize}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        applyToAll={applyToAll}
        setApplyToAll={setApplyToAll}
        photosToPreview={photosToPreview}
        sliderCSS={sliderCSS}
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
        togglePhoto={togglePhoto}
        toggleSelectAll={toggleSelectAll}
        allSelected={allSelected}
        selectedCount={selectedCount}
        hasSelection={hasSelection}
        generatedDescription={generatedDescription}
        setGeneratedDescription={setGeneratedDescription}
        isEditingDescription={isEditingDescription}
        setIsEditingDescription={setIsEditingDescription}
        showNoInfoWarning={showNoInfoWarning}
        resetNoInfoWarning={() => setShowNoInfoWarning(false)}
        handleGenerateClick={handleGenerateClick}
        setShowPropertyModal={setShowPropertyModal}
      />
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  DESKTOP LAYOUT  (≥ 768px)  — unchanged from original
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="mls-hub" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ─── PAGE TITLE ─── */}
      <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 24, fontWeight: 400, color: '#000B14', lineHeight: '1.4', margin: 0, width: '100%' }}>
        MLS Marketing Hub
      </p>

      {/* ─── TOP BAR: Resize to + Watermark (+ file confirmation bar inside) ─── */}
      <div className="mls-topbar" style={{
        width: '100%', background: '#FFFFFF',
        border: '1px solid #E5E7EB', borderRadius: 10,
        padding: 24, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Section title */}
        <span style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 600, color: '#000B14', lineHeight: '27px' }}>
          Image Resize &amp; Watermark Customization
        </span>
        {/* Row 1: controls */}
        <div className="mls-topbar__inner" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>

          {/* Resize to dropdown */}
          <div className="mls-topbar__resize" style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <label className="mls-topbar__resize-label" style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#364153', lineHeight: '24px' }}>
              Resize to:
            </label>
            <div className="mls-topbar__resize-dropdown" style={{ position: 'relative' }}>
              <button
                className="mls-topbar__resize-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: 314, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', border: '1.5px solid #99A1AF', borderRadius: 6,
                  background: '#FFFFFF', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 14, color: '#4A5565',
                  boxSizing: 'border-box',
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
          <div className="mls-topbar__divider" style={{ width: 1, height: 32, background: '#E9EAEB', flexShrink: 0 }} />

          {/* Watermark + upload area — fills remaining space */}
          <div style={{ flex: '1 0 0', display: 'flex', gap: 36, alignItems: 'center', alignSelf: 'stretch' }}>
            {/* Left col: label+toggle (top) and hint (bottom) */}
            <div className="mls-topbar__watermark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignSelf: 'stretch', flexShrink: 0 }}>
              <div className="mls-topbar__watermark-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mls-topbar__watermark-label" style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: '#364153', lineHeight: '20px', letterSpacing: '-0.1504px', whiteSpace: 'nowrap' }}>
                  Watermark:
                </span>
                <WatermarkToggle enabled={watermarkEnabled} onToggle={handleWatermarkToggle} />
              </div>
              <span className="mls-topbar__watermark-hint" style={{ fontFamily: 'Inter', fontSize: 14, color: '#858A8E', lineHeight: '19.5px', width: 224 }}>
                Accepted formats: png, jpeg, jpg, with maximum 10MB.
              </span>
            </div>

            {/* Right col: upload button + compact file info */}
            {watermarkEnabled && (
              <div className="mls-topbar__watermark-upload" style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', justifyContent: 'center', minWidth: 0 }}>
                <UploadButton
                  watermarkFile={watermarkFile}
                  watermarkInputRef={watermarkInputRef}
                  handleWatermarkUpload={handleWatermarkUpload}
                />
                {watermarkFile && (
                  <div style={{ background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 4, padding: 4 }}>
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#858A8E', lineHeight: '19.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                      {watermarkFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleWatermarkClear}
                      style={{ fontFamily: 'Inter', fontSize: 9, fontWeight: 500, color: '#858A8E', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, lineHeight: 1 }}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── PLATFORM HEADER + PREVIEW — only shown when watermark is enabled ── */}
      {watermarkEnabled && <div className="mls-platform-header" style={{
        width: '100%', background: '#FFFFFF',
        border: '1px solid #E5E7EB', borderRadius: 10,
        padding: 24, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mls-platform-header__info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* MLS purple icon — bg-[#4f46e5] rounded-[10px] size-[40px] */}
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: '#4F46E5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="mls-platform-header__text" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="mls-platform-header__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 600, color: '#1C398E', lineHeight: '27px', letterSpacing: '-0.44px' }}>
                MLS • 4:3 Ratio
              </span>
              <span className="mls-platform-header__subtitle" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#4F46E5', lineHeight: '20px', letterSpacing: '-0.15px' }}>
                Images will be resized to MLS standard 4:3 ratio
              </span>
            </div>
          </div>
          <div className="mls-platform-header__actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PreviewToggleBtn />
          </div>
        </div>
        {/* Preview content — called as function (not JSX element) to avoid React remounting on re-render,
            which would break slider drag because every state change creates a new function reference */}
        {PreviewSection()}
      </div>}

      {/* ─── CARD 1: Select Images to Export ────────────────────────────────── */}
      <div className="mls-content-card" style={{
        background: '#FFFFFF', borderRadius: 10,
        border: '1px solid #E5E7EB', width: '100%',
        boxSizing: 'border-box', padding: 24,
      }}>
        <div className="mls-photo-section" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="mls-photo-section__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="mls-photo-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 600, color: '#000B14', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
              Select Images to Export
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="mls-photo-section__count" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#6A7282', lineHeight: '20px' }}>
                {selectedPhotos.size} of {MLS_PHOTOS.length} selected
              </span>
              <PhotoSectionActions />
            </div>
          </div>

          {/* Photo grid — 3 columns, 3 rows; row 1 gap 16px, rows 2-3 gap 22px (Figma) */}
          <div className="mls-photo-grid" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {[MLS_PHOTOS.slice(0, 3), MLS_PHOTOS.slice(3, 6), MLS_PHOTOS.slice(6, 9)].map((row, ri) => (
              <div key={ri} className="mls-photo-grid__row" style={{ display: 'flex', gap: ri === 0 ? 16 : 22 }}>
                {row.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    isSelected={selectedPhotos.has(photo.id)}
                    onToggle={() => togglePhoto(photo.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CARD 3: Smart Marketing Description ─────────────────────────────── */}
      <div className="mls-ai-section" style={{
        background: '#FFFFFF', borderRadius: 10,
        border: '1px solid #E5E7EB', width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '32px 24px',
        gap: 32,
      }}>
        {/* Left: title + desc + button */}
        <div className="mls-ai-section__left" style={{ display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          <h3 className="mls-ai-section__title" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 600, color: '#000B14', margin: 0, lineHeight: '1.4' }}>
            Smart Marketing Description
          </h3>
          <p className="mls-ai-section__description" style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#858A8E', lineHeight: '1.4', margin: 0, maxWidth: 429 }}>
            Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you
          </p>
          <div className="mls-ai-section__cta">
            <button
              className="mls-ai-section__cta-btn"
              onClick={handleGenerateClick}
              style={{
                height: 46, padding: '12px 24px',
                borderRadius: 6, border: 'none',
                background: '#4F46E5', color: '#FFFDFF',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', lineHeight: '1.4',
              }}
            >
              {generatedDescription ? 'Try our AI description generator' : 'Try our AI description generator'}
            </button>
          </div>
        </div>

        {/* Right: warning OR AI result panel */}
        {(showNoInfoWarning && !generatedDescription) ? (
          <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Warning box */}
            <div style={{
              background: '#FFF3CD', border: '1px solid #FFC107',
              borderRadius: 8, padding: '17px 17px 1px 17px',
              boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10 2L1.5 17h17L10 2z" stroke="#856404" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10 8v4M10 14.5v.5" stroke="#856404" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#856404', lineHeight: '21px' }}>No Property Information</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#856404', lineHeight: '19.5px' }}>Property information was not provided during upload.</span>
                </div>
              </div>
            </div>
            {/* Provide Information Now button */}
            <button
              onClick={() => setShowPropertyModal(true)}
              style={{
                alignSelf: 'flex-start',
                height: 46, padding: '12px 24px',
                borderRadius: 12, border: '2px solid #4F46E5',
                background: '#FFFDFF', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 700,
                color: '#4F46E5', textTransform: 'capitalize',
              }}
            >
              Provide Information Now
            </button>
          </div>
        ) : generatedDescription ? (
          <div
            className="mls-ai-section__result"
            onClick={() => setIsEditingDescription(true)}
            style={{
              flex: '1 0 0', minWidth: 0,
              background: '#FAFAFA', borderRadius: 12,
              padding: 24, alignSelf: 'stretch',
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
                  width: '100%', height: '100%', minHeight: 160, resize: 'vertical',
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
                  color: '#0A0A0A', lineHeight: '27px', letterSpacing: '-0.44px',
                  border: 'none', background: 'transparent', outline: 'none', padding: 0,
                }}
              />
            ) : (
              <p className="mls-ai-section__result-text" style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
                color: '#0A0A0A', lineHeight: '27px',
                letterSpacing: '-0.44px', margin: 0,
              }}>
                {generatedDescription}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* ─── Property Information Modal ───────────────────────────────────────── */}
      {showPropertyModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 16,
            padding: '32px', width: '100%', maxWidth: 600,
            maxHeight: '90vh', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 24,
            boxSizing: 'border-box',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Inter', fontSize: 24, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>
                Property Information
              </h2>
              <button
                onClick={() => setShowPropertyModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6B7280', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#6B7280', margin: 0 }}>
              Please provide property details to generate an AI-powered marketing description.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Property type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB' }}>
                <span style={{ fontSize: 16 }}>🏠</span>
                <select
                  value={propertyFormData.propertyType}
                  onChange={e => setPropertyFormData(p => ({ ...p, propertyType: e.target.value }))}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: propertyFormData.propertyType ? '#0A0A0A' : '#9CA3AF', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">Property type</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Intended buyer profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB' }}>
                <span style={{ fontSize: 16 }}>👤</span>
                <select
                  value={propertyFormData.buyerProfile}
                  onChange={e => setPropertyFormData(p => ({ ...p, buyerProfile: e.target.value }))}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: propertyFormData.buyerProfile ? '#0A0A0A' : '#9CA3AF', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">Intended buyer profile</option>
                  <option value="first-time">First-time buyer</option>
                  <option value="investor">Investor</option>
                  <option value="family">Family</option>
                  <option value="professional">Young professional</option>
                  <option value="retiree">Retiree</option>
                </select>
              </div>

              {/* Intended use */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB' }}>
                <span style={{ fontSize: 16 }}>🏷️</span>
                <select
                  value={propertyFormData.intendedUse}
                  onChange={e => setPropertyFormData(p => ({ ...p, intendedUse: e.target.value }))}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: propertyFormData.intendedUse ? '#0A0A0A' : '#9CA3AF', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">Intended use</option>
                  <option value="primary">Primary residence</option>
                  <option value="rental">Rental investment</option>
                  <option value="vacation">Vacation home</option>
                  <option value="commercial">Commercial use</option>
                </select>
              </div>

              {/* Property address */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB' }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <input
                  type="text"
                  placeholder="Property address"
                  value={propertyFormData.propertyAddress}
                  onChange={e => setPropertyFormData(p => ({ ...p, propertyAddress: e.target.value }))}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: '#0A0A0A', outline: 'none' }}
                />
              </div>

              {/* MLS listing link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB' }}>
                <span style={{ fontSize: 16 }}>🔗</span>
                <input
                  type="text"
                  placeholder="MLS listing link if applicable"
                  value={propertyFormData.mlsLink}
                  onChange={e => setPropertyFormData(p => ({ ...p, mlsLink: e.target.value }))}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, color: '#0A0A0A', outline: 'none' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPropertyModal(false)}
                style={{
                  padding: '12px 24px', borderRadius: 10,
                  border: '1px solid #E5E7EB', background: '#F9FAFB',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={!isFormValid}
                style={{
                  padding: '12px 24px', borderRadius: 10,
                  border: 'none',
                  background: isFormValid ? '#4F46E5' : '#C4B5FD',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#FFFFFF',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase', letterSpacing: '0.02em',
                }}
              >
                GENERATE DESCRIPTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
