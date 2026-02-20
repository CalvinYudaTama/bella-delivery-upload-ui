'use client';

import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MLSPhoto {
  id: string;
  url: string;
  label: string;
}

// ─── Dropdown options (from Figma node 13736:29294) ───────────────────────────
const RESIZE_OPTIONS = [
  'Instagram - Square Post (1080×1080px)',
  'Instagram - Portrait Post (1080×1350px)',
  'Instagram - Story (1080×1920px)',
  'Instagram - Landscape Post (1080×566px)',
  'Facebook - Feed Post (1200×630px)',
  'Facebook - Cover Photo (820×312px)',
  'Facebook - Story (1080×1920px)',
  'Facebook - Square Post (1200×1200px)',
  'LinkedIn - Feed Post (1200×627px)',
  'LinkedIn - Banner (1584×396px)',
  'LinkedIn - Story (1080×1920px)',
  'Twitter/X - Post Image (1200×675px)',
  'Twitter/X - Header Photo (1500×500px)',
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
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '342 / 176',
        border: isSelected ? '3px solid #4F46E5' : '3px solid transparent',
        transition: 'border-color 0.15s ease',
        flexShrink: 0,
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ─── TOP BAR: Resize to + Watermark ──────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          background: '#FFFFFF',
          borderBottom: '1px solid #E9EAEB',
          padding: '16px',
          boxSizing: 'border-box',
          marginBottom: '24px',
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

      {/* ─── MAIN CONTENT CARD ───────────────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E9EAEB',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Platform header bar — Instagram • Square Post */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px',
            background: '#EEF2FF',
            borderBottom: '1px solid #E9EAEB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <InstagramIcon />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600, color: '#4F46E5', lineHeight: '24px' }}>
                {selectedOptionShort}
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6366F1', lineHeight: '18px' }}>
                Images will be resized to 1080 × 1080px (1:1 aspect ratio)
              </span>
            </div>
          </div>

          {/* Select All button */}
          <button
            onClick={toggleSelectAll}
            style={{
              height: '38px', padding: '0 20px',
              borderRadius: '6px', border: 'none',
              background: allSelected ? '#4F46E5' : '#4F46E5',
              color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Select Images to Export */}
        <div style={{ padding: '24px' }}>

          {/* Section title + count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, color: '#000B14', margin: 0, lineHeight: '27px' }}>
              Select Images to Export
            </h2>
            <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#858A8E' }}>
              {selectedPhotos.size} of {MLS_PHOTOS.length} selected
            </span>
          </div>

          {/* Photo grid — 3 columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {MLS_PHOTOS.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.has(photo.id)}
                onToggle={() => togglePhoto(photo.id)}
              />
            ))}
          </div>

          {/* ─── Export Options ───────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid #E9EAEB', paddingTop: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600, color: '#000B14', margin: '0 0 16px 0' }}>
              Export Options
            </h3>

            {/* Download as ZIP button */}
            <button
              style={{
                display: 'inline-flex', flexDirection: 'column',
                alignItems: 'flex-start', gap: '4px',
                padding: '12px 16px',
                border: '2px solid #4F46E5', borderRadius: '10px',
                background: 'transparent', cursor: 'pointer',
              }}
              // TODO (Riley): wire to real download logic
            >
              <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#4F46E5', lineHeight: '20px' }}>
                Download as ZIP
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6366F1', lineHeight: '16px' }}>
                {selectedPhotos.size > 0 ? selectedPhotos.size : MLS_PHOTOS.length} images • {selectedOptionShort.split(' - ')[1] || selectedOptionShort}
              </span>
            </button>
          </div>

          {/* ─── Smart Marketing Description ──────────────────────────────────── */}
          <div style={{ borderTop: '1px solid #E9EAEB', paddingTop: '24px' }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600, color: '#000B14', margin: '0 0 12px 0' }}>
              Smart Marketing Description
            </h3>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#535862', lineHeight: '22px', margin: '0 0 20px 0', maxWidth: '429px' }}>
              Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you
            </p>

            {/* CTA button */}
            <button
              style={{
                height: '46px', padding: '0 24px',
                borderRadius: '8px', border: 'none',
                background: '#4F46E5', color: '#FFFFFF',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 700,
                letterSpacing: '0.5px', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              // TODO (Riley): wire to AI description generator
            >
              TRY OUR AI DESCRIPTION GENERATOR
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
