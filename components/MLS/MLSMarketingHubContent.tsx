'use client';

import React, { useState } from 'react';

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
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#535862" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Instagram Icon ───────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <div style={{
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
    </svg>
  </div>
);

// ─── Check Icon ──────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '342 / 176',
        border: isSelected ? '3px solid #4F46E5' : '3px solid transparent',
        transition: 'border-color 0.15s ease',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      {/* Image */}
      <img
        src={photo.url}
        alt={photo.label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: hovered || isSelected ? 'rgba(0,0,0,0.25)' : 'transparent',
          transition: 'background 0.15s ease',
        }}
      />

      {/* Selected checkbox — center */}
      {(hovered || isSelected) && (
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px', height: '32px',
            borderRadius: '6px',
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

  // Derive label from selected option for "Download as ZIP" subtitle
  const selectedOptionShort = selectedResize.split(' (')[0]; // e.g. "Instagram - Square Post"

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ─── TOP BAR: Resize to + Watermark ──────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          background: '#FFFFFF',
          borderBottom: '1px solid #E9EAEB',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>

          {/* Resize to dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '314px' }}>
            <label style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#000B14', lineHeight: '20px' }}>
              Resize to:
            </label>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: '314px', height: '38px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB', borderRadius: '6px',
                  background: '#FFFFFF', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: '14px', color: '#000B14',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedResize}
                </span>
                <ChevronDownIcon />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute', top: '40px', left: 0, zIndex: 50,
                    width: '314px', maxHeight: '280px', overflowY: 'auto',
                    background: '#FFFFFF', border: '1px solid #E9EAEB',
                    borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  }}
                >
                  {RESIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                      style={{
                        width: '100%', padding: '10px 12px', textAlign: 'left',
                        background: opt === selectedResize ? '#F5F3FF' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        fontFamily: 'Inter', fontSize: '14px',
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
          <div style={{ width: '1px', height: '60px', background: '#E9EAEB', flexShrink: 0, marginTop: '4px' }} />

          {/* Watermark toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#000B14' }}>
                Watermark:
              </span>
              {/* Toggle switch */}
              <button
                onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: watermarkEnabled ? '#4F46E5' : '#D1D5DB',
                  position: 'relative', transition: 'background 0.2s ease', flexShrink: 0,
                  padding: 0,
                }}
                aria-label="Toggle watermark"
              >
                <div
                  style={{
                    position: 'absolute', top: '3px',
                    left: watermarkEnabled ? '23px' : '3px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#FFFFFF',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#858A8E', lineHeight: '16px' }}>
              Accepted formats: png, jpeg, jpg, with maximum 10MB.
            </span>
          </div>
        </div>
      </div>

      {/* ─── PLATFORM HEADER CARD (separate card, blue tint) ────────────────── */}
      <div
        style={{
          width: '100%',
          background: '#EFF6FF',
          border: '1px solid #BEDBFF',
          borderRadius: '10px',
          padding: '16px',
          boxSizing: 'border-box',
          height: '85px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left: Instagram icon + title + subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <InstagramIcon />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, color: '#1C398E', lineHeight: '27px', letterSpacing: '-0.44px' }}>
                Instagram • Square Post
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 400, color: '#4F46E5', lineHeight: '20px', letterSpacing: '-0.15px' }}>
                Images will be resized to 1080 × 1080px (1:1 aspect ratio)
              </span>
            </div>
          </div>

          {/* Right: Select All / Deselect All button — green */}
          <button
            onClick={toggleSelectAll}
            style={{
              height: '38px', padding: '9px 16px',
              borderRadius: '8px', border: 'none',
              background: '#2BC556',
              color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', letterSpacing: '-0.15px', lineHeight: '20px',
              whiteSpace: 'nowrap',
            }}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT CARD (white card, below with 16px gap) ─────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
          padding: '24px',
        }}
      >
        {/* ─── Select Images to Export ──────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Section title + count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
              Select Images to Export
            </h2>
            <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 400, color: '#6A7282', lineHeight: '20px', letterSpacing: '-0.15px' }}>
              {selectedPhotos.size} of {MLS_PHOTOS.length} selected
            </span>
          </div>

          {/* Photo grid — 3 columns */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
            }}
          >
            {/* Row 1 */}
            <div style={{ display: 'flex', gap: '22px', alignItems: 'stretch' }}>
              {MLS_PHOTOS.slice(0, 3).map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.has(photo.id)}
                  onToggle={() => togglePhoto(photo.id)}
                />
              ))}
            </div>
            {/* Row 2 */}
            <div style={{ display: 'flex', gap: '22px', alignItems: 'stretch' }}>
              {MLS_PHOTOS.slice(3, 6).map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.has(photo.id)}
                  onToggle={() => togglePhoto(photo.id)}
                />
              ))}
            </div>
            {/* Row 3 */}
            <div style={{ display: 'flex', gap: '22px', alignItems: 'stretch' }}>
              {MLS_PHOTOS.slice(6, 9).map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.has(photo.id)}
                  onToggle={() => togglePhoto(photo.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Export Options ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
            Export Options
          </h3>

          {/* Download as ZIP button */}
          <button
            style={{
              display: 'inline-flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              border: '2px solid #4F46E5', borderRadius: '12px',
              background: '#FFFDFF', cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, color: '#4F46E5', lineHeight: '20px', letterSpacing: '-0.15px' }}>
              Download as ZIP
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 400, color: '#4F46E5', lineHeight: '16px' }}>
              {selectedPhotos.size > 0 ? selectedPhotos.size : MLS_PHOTOS.length} images • Square Post
            </span>
          </button>
        </div>

        {/* ─── Smart Marketing Description ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, color: '#0A0A0A', margin: 0, lineHeight: '27px', letterSpacing: '-0.44px' }}>
            Smart Marketing Description
          </h3>
          <p style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, color: '#858A8E', lineHeight: '27px', margin: 0, maxWidth: '429px', letterSpacing: '-0.44px' }}>
            Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you
          </p>

          {/* CTA button */}
          <div>
            <button
              style={{
                height: '46px', padding: '12px 24px',
                borderRadius: '12px', border: 'none',
                background: '#4F46E5', color: '#FFFFFF',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              TRY OUR AI DESCRIPTION GENERATOR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
