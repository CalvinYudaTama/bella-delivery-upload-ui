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
  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
    style={{ background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)' }}
  >
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
      className="relative rounded-[10px] overflow-hidden cursor-pointer flex-1 min-w-0 transition-[border-color] duration-150"
      style={{
        aspectRatio: '342 / 176',
        border: isSelected ? '3px solid #4F46E5' : '3px solid transparent',
      }}
    >
      {/* Image */}
      <img
        src={photo.url}
        alt={photo.label}
        className="w-full h-full object-cover block"
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 transition-[background] duration-150"
        style={{ background: hovered || isSelected ? 'rgba(0,0,0,0.25)' : 'transparent' }}
      />

      {/* Selected checkbox — center */}
      {(hovered || isSelected) && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-[6px] flex items-center justify-center transition-[background] duration-150"
          style={{
            background: isSelected ? '#4F46E5' : 'rgba(255,255,255,0.85)',
            border: isSelected ? 'none' : '2px solid #D1D5DB',
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

  return (
    <div className="w-full flex flex-col gap-4">

      {/* ─── TOP BAR: Resize to + Watermark ──────────────────────────────────── */}
      <div className="w-full bg-white border-b border-[#E9EAEB] p-4 box-border">
        <div className="flex items-start gap-6">

          {/* Resize to dropdown */}
          <div className="flex flex-col gap-1.5 min-w-[314px]">
            <label className="font-[Inter] text-sm font-medium text-[#000B14] leading-5">
              Resize to:
            </label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-[314px] h-[38px] flex items-center justify-between px-3 border border-[#D1D5DB] rounded-[6px] bg-white cursor-pointer font-[Inter] text-sm text-[#000B14]"
              >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedResize}
                </span>
                <ChevronDownIcon />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-10 left-0 z-50 w-[314px] max-h-[280px] overflow-y-auto bg-white border border-[#E9EAEB] rounded-lg shadow-lg">
                  {RESIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedResize(opt); setDropdownOpen(false); }}
                      className="w-full px-3 py-2.5 text-left border-none cursor-pointer font-[Inter] text-sm"
                      style={{
                        background: opt === selectedResize ? '#F5F3FF' : 'transparent',
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
          <div className="w-px h-[60px] bg-[#E9EAEB] flex-shrink-0 mt-1" />

          {/* Watermark toggle */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="font-[Inter] text-sm font-medium text-[#000B14]">
                Watermark:
              </span>
              {/* Toggle switch */}
              <button
                onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                className="w-11 h-6 rounded-full border-none cursor-pointer relative transition-[background] duration-200 flex-shrink-0 p-0"
                style={{ background: watermarkEnabled ? '#4F46E5' : '#D1D5DB' }}
                aria-label="Toggle watermark"
              >
                <div
                  className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-[left] duration-200"
                  style={{ left: watermarkEnabled ? '23px' : '3px' }}
                />
              </button>
            </div>
            <span className="font-[Inter] text-xs text-[#858A8E] leading-4">
              Accepted formats: png, jpeg, jpg, with maximum 10MB.
            </span>
          </div>
        </div>
      </div>

      {/* ─── PLATFORM HEADER CARD (separate card, blue tint) ────────────────── */}
      <div className="w-full bg-[#EFF6FF] border border-[#BEDBFF] rounded-[10px] px-4 box-border h-[85px] flex items-center">
        <div className="flex items-center justify-between w-full">

          {/* Left: Instagram icon + title + subtitle */}
          <div className="flex items-center gap-3">
            <InstagramIcon />
            <div className="flex flex-col gap-1">
              <span className="font-[Inter] text-lg font-medium text-[#1C398E] leading-[27px] tracking-[-0.44px]">
                Instagram • Square Post
              </span>
              <span className="font-[Inter] text-sm font-normal text-[#4F46E5] leading-5 tracking-[-0.15px]">
                Images will be resized to 1080 × 1080px (1:1 aspect ratio)
              </span>
            </div>
          </div>

          {/* Right: Select All / Deselect All — green */}
          <button
            onClick={toggleSelectAll}
            className="h-[38px] px-4 py-[9px] rounded-lg border-none bg-[#2BC556] text-white font-[Inter] text-sm font-medium cursor-pointer whitespace-nowrap tracking-[-0.15px] leading-5"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT CARD ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-[10px] border border-[#E5E7EB] w-full box-border flex flex-col gap-9 p-6">

        {/* ─── Select Images to Export ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Section title + count */}
          <div className="flex items-center justify-between">
            <h2 className="font-[Inter] text-lg font-medium text-[#0A0A0A] m-0 leading-[27px] tracking-[-0.44px]">
              Select Images to Export
            </h2>
            <span className="font-[Inter] text-sm font-normal text-[#6A7282] leading-5 tracking-[-0.15px]">
              {selectedPhotos.size} of {MLS_PHOTOS.length} selected
            </span>
          </div>

          {/* Photo grid — 3 columns, 3 rows */}
          <div className="flex flex-col gap-[22px]">
            {/* Row 1 */}
            <div className="flex gap-[22px] items-stretch">
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
            <div className="flex gap-[22px] items-stretch">
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
            <div className="flex gap-[22px] items-stretch">
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
        <div className="flex flex-col gap-4">
          <h3 className="font-[Inter] text-lg font-medium text-[#0A0A0A] m-0 leading-[27px] tracking-[-0.44px]">
            Export Options
          </h3>

          {/* Download as ZIP button */}
          <button
            className="inline-flex flex-col items-center justify-center gap-2 p-4 border-2 border-[#4F46E5] rounded-xl bg-[#FFFDFF] cursor-pointer self-start"
          >
            <span className="font-[Inter] text-base font-medium text-[#4F46E5] leading-5 tracking-[-0.15px]">
              Download as ZIP
            </span>
            <span className="font-[Inter] text-sm font-normal text-[#4F46E5] leading-4">
              {selectedPhotos.size > 0 ? selectedPhotos.size : MLS_PHOTOS.length} images • Square Post
            </span>
          </button>
        </div>

        {/* ─── Smart Marketing Description ──────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <h3 className="font-[Inter] text-lg font-medium text-[#0A0A0A] m-0 leading-[27px] tracking-[-0.44px]">
            Smart Marketing Description
          </h3>
          <p className="font-[Inter] text-lg font-medium text-[#858A8E] leading-[27px] m-0 max-w-[429px] tracking-[-0.44px]">
            Try our AI description generator of your property, then simply copy past to whichever the social media platform works for you
          </p>

          {/* CTA button */}
          <div>
            <button
              className="h-[46px] px-6 py-3 rounded-xl border-none bg-[#4F46E5] text-white font-[Inter] text-sm font-bold uppercase cursor-pointer"
            >
              TRY OUR AI DESCRIPTION GENERATOR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
