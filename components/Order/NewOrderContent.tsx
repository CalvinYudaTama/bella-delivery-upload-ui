'use client';

import React, { useState, useRef, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Condo / Apartment',
  'Townhouse',
  'Vacant Land',
  'Multi-Family',
];

const BUYER_PROFILES = [
  'First-Time Buyer',
  'Luxury Buyer',
  'Investor',
  'Family',
  'Young Professional',
  'Empty Nester',
];

const INTENDED_USES = [
  'For Sale',
  'For Rent',
  'Personal Use',
  'Investment',
];

const MAX_PHOTOS = 7;

// Brand style data — images are placeholder-styled cards (Figma assets are localhost-only)
const BRAND_STYLES = [
  // Row 1
  { id: '1',  brand: 'Crate&Barrel',              styles: 'Modern, Mid Century Modern',       bg: '#C8B8A4', dark: false },
  { id: '2',  brand: 'ARTICLE.',                  styles: 'Modern, Modern Rustic',             bg: '#3D2B1F', dark: true  },
  { id: '3',  brand: 'EQ3',                       styles: 'Modern Rustic, Traditional',        bg: '#8B7B6B', dark: false },
  { id: '4',  brand: 'ROVE CONCEPTS',             styles: 'Contemporary, Scandinavian',        bg: '#D4C9BC', dark: false },
  // Row 2
  { id: '5',  brand: 'Gus*',                      styles: 'Scandinavian, Mid Century Modern',  bg: '#C4956A', dark: false },
  { id: '6',  brand: 'Mitchell Gold + Bob Williams', styles: 'Rustic',                         bg: '#A0826D', dark: false },
  { id: '7',  brand: 'rochebobois',               styles: 'Contemporary, Nordic Boho',         bg: '#8FA68E', dark: false },
  { id: '8',  brand: 'HOOKER',                    styles: 'Rustic',                            bg: '#4A3728', dark: true  },
  // Row 3
  { id: '9',  brand: 'ETERNITY MODERN',           styles: 'Mid Century Modern, Contemporary',  bg: '#C17F6B', dark: false },
  { id: '10', brand: 'sundays',                   styles: 'Scandinavian, Midcentury Modern',   bg: '#D4C4B0', dark: false },
  { id: '11', brand: 'KING',                      styles: 'Rustic',                            bg: '#F0EBE3', dark: false },
  { id: '12', brand: 'MOHA',                      styles: 'Modern Rustic, Modern Contemporary',bg: '#2D2D2D', dark: true  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ChevronDown = ({ color = '#858A8E' }: { color?: string }) => (
  <svg width="41" height="41" viewBox="0 0 41 41" fill="none" style={{ flexShrink: 0 }}>
    <path d="M14 18L20 24L26 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HouseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1.167 6.125L7 1.167L12.833 6.125V11.667C12.833 12.034 12.534 12.333 12.167 12.333H9.333V9.333H4.667V12.333H1.833C1.466 12.333 1.167 12.034 1.167 11.667V6.125Z" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="4.5" r="2.5" stroke="#858A8E" strokeWidth="1.2"/>
    <path d="M1.5 12.5C1.5 10.015 4.015 8 7 8C9.985 8 12.5 10.015 12.5 12.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7.583 1.167H12.833V6.417L7 12.25L1.75 7L7.583 1.167Z" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10.5" cy="3.5" r="0.875" fill="#858A8E"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1.167C4.975 1.167 3.5 2.875 3.5 4.667C3.5 7.583 7 12.833 7 12.833C7 12.833 10.5 7.583 10.5 4.667C10.5 2.875 9.025 1.167 7 1.167Z" stroke="#858A8E" strokeWidth="1.2"/>
    <circle cx="7" cy="4.667" r="1.167" stroke="#858A8E" strokeWidth="1.2"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5.833 8.167L8.167 5.833M6.417 3.5L7.292 2.625C8.31 1.607 9.94 1.607 10.958 2.625L11.375 3.042C12.393 4.06 12.393 5.69 11.375 6.708L10.5 7.583M3.5 6.417L2.625 7.292C1.607 8.31 1.607 9.94 2.625 10.958L3.042 11.375C4.06 12.393 5.69 12.393 6.708 11.375L7.583 10.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const PaperclipIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M10.5 5.5L5.5 10.5C4.4 11.6 2.6 11.6 1.5 10.5C0.4 9.4 0.4 7.6 1.5 6.5L7 1C7.8 0.2 9.1 0.2 9.9 1C10.7 1.8 10.7 3.1 9.9 3.9L4.4 9.4C4 9.8 3.4 9.8 3 9.4C2.6 9 2.6 8.4 3 8L7.9 3.1" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#F3F4F6"/>
    <path d="M15 29C13.067 29 11.5 27.433 11.5 25.5C11.5 23.834 12.685 22.447 14.261 22.089C14.091 21.58 14 21.051 14 20.5C14 17.462 16.462 15 19.5 15C21.481 15 23.218 16.041 24.199 17.604C24.782 17.218 25.477 17 26.222 17C28.309 17 30 18.685 30 20.778C30 20.852 29.998 20.925 29.994 20.998C31.752 21.448 33 23.036 33 24.944C33 27.184 31.185 29 28.944 29H15Z" stroke="#9CA3AF" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M22 33V25M22 25L19 28M22 25L25 28" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" style={{ flexShrink: 0 }}>
    <path d="M11 1V7M11 1H5M11 1L5 7M1 8H3" stroke="#000B14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckRIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0.75" y="0.75" width="16.5" height="16.5" rx="3.25" stroke="#D6D8D9" strokeWidth="1.5"/>
    <path d="M5 9L7.5 11.5L13 6" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckRChecked = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect width="18" height="18" rx="4" fill="#4F46E5"/>
    <path d="M5 9L7.5 11.5L13 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Dropdown Component ───────────────────────────────────────────────────────

function Dropdown({
  value, placeholder, options, icon, isOpen, onToggle, onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[];
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
}) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{
          width: '100%', height: 42,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'white', border: '2px solid #ECEFF0', borderRadius: 6,
          padding: '4px 0 4px 16px', cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {icon}
          <span style={{
            fontFamily: 'Inter', fontSize: value ? 14 : 16, fontWeight: 400,
            color: '#858A8E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown />
      </button>

      {isOpen && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: 46, left: 0, zIndex: 100,
            width: '100%', background: 'white',
            border: '1px solid #E5E7EB', borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)', overflow: 'hidden',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              style={{
                width: '100%', padding: '10px 16px', textAlign: 'left',
                background: value === opt ? '#F5F3FF' : 'transparent',
                border: 'none', cursor: 'pointer', display: 'block',
                fontFamily: 'Inter', fontSize: 14,
                color: value === opt ? '#4F46E5' : '#000B14',
                fontWeight: value === opt ? 500 : 400,
              }}
              onMouseEnter={e => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
              onMouseLeave={e => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Brand Card ───────────────────────────────────────────────────────────────

function BrandCard({
  brand,
  isSelected,
  onSelect,
}: {
  brand: typeof BRAND_STYLES[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', width: 250, height: 150,
        borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        border: 'none', padding: 0, flexShrink: 0,
        outline: isSelected ? '3px solid #4F46E5' : hovered ? '3px solid #C7D2FE' : '3px solid transparent',
        transition: 'outline 0.15s ease',
      }}
    >
      {/* Placeholder background — replace with real brand images when available */}
      <div style={{
        position: 'absolute', inset: 0,
        background: brand.bg,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
        padding: '9px 14px',
      }}>
        <span style={{
          fontFamily: 'Inter', fontSize: 11, fontWeight: 700,
          color: brand.dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,11,20,0.75)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          lineHeight: 1, userSelect: 'none',
        }}>
          {brand.brand}
        </span>
      </div>

      {/* White label footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: -0.5, right: -0.5, height: 27,
        background: 'white',
        display: 'flex', alignItems: 'center', paddingLeft: 14,
      }}>
        <span style={{
          fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
          color: '#000B14', whiteSpace: 'nowrap', letterSpacing: '0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {brand.styles}
        </span>
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewOrderContent() {
  // ── Form state ────────────────────────────────────────────────────────────
  const [propertyType, setPropertyType]   = useState('');
  const [buyerProfile, setBuyerProfile]   = useState('');
  const [intendedUse, setIntendedUse]     = useState('');
  const [address, setAddress]             = useState('');
  const [mlsLink, setMlsLink]             = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging]       = useState(false);

  // ── Dropdown open state ───────────────────────────────────────────────────
  const [propertyTypeOpen, setPropertyTypeOpen]   = useState(false);
  const [buyerProfileOpen, setBuyerProfileOpen]   = useState(false);
  const [intendedUseOpen, setIntendedUseOpen]     = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const floorPlanRef    = useRef<HTMLInputElement>(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const canSubmit      = uploadedFiles.length > 0 && selectedBrand !== null && agreedToTerms;
  const uploadProgress = Math.min((uploadedFiles.length / MAX_PHOTOS) * 100, 100);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const closeAllDropdowns = () => {
    setPropertyTypeOpen(false);
    setBuyerProfileOpen(false);
    setIntendedUseOpen(false);
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      ['image/png', 'image/jpeg', 'image/jpg'].includes(f.type)
    );
    setUploadedFiles(prev => [...prev, ...files].slice(0, MAX_PHOTOS));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files].slice(0, MAX_PHOTOS));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={closeAllDropdowns}
      style={{
        display: 'flex', flexDirection: 'column', gap: 40,
        padding: '24px 32px',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box', width: '100%',
      }}
    >

      {/* ── SECTION 1: PROPERTY INFO ────────────────────────────────────── */}
      <section>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <ol style={{ margin: 0, padding: '0 0 0 27px' }} start={1}>
            <li style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 18,
              color: '#000B14', lineHeight: 1.4,
            }}>
              PROPERTY INFO
            </li>
          </ol>
          <p style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 16,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Provide the property information will help AI designer generate better result.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FAFAFA', border: '1px solid #D6D8D9', borderRadius: 16,
          padding: 30, display: 'flex', flexDirection: 'column', gap: 16,
          boxSizing: 'border-box',
        }}>

          {/* Row 1: 3 dropdowns */}
          <div style={{ display: 'flex', gap: 16 }}>
            <Dropdown
              value={propertyType}
              placeholder="Select a property type"
              options={PROPERTY_TYPES}
              icon={<HouseIcon />}
              isOpen={propertyTypeOpen}
              onToggle={() => { closeAllDropdowns(); setPropertyTypeOpen(v => !v); }}
              onSelect={v => { setPropertyType(v); setPropertyTypeOpen(false); }}
            />
            <Dropdown
              value={buyerProfile}
              placeholder="Intended buyer profile"
              options={BUYER_PROFILES}
              icon={<PersonIcon />}
              isOpen={buyerProfileOpen}
              onToggle={() => { closeAllDropdowns(); setBuyerProfileOpen(v => !v); }}
              onSelect={v => { setBuyerProfile(v); setBuyerProfileOpen(false); }}
            />
            <Dropdown
              value={intendedUse}
              placeholder="Intended use"
              options={INTENDED_USES}
              icon={<TagIcon />}
              isOpen={intendedUseOpen}
              onToggle={() => { closeAllDropdowns(); setIntendedUseOpen(v => !v); }}
              onSelect={v => { setIntendedUse(v); setIntendedUseOpen(false); }}
            />
          </div>

          {/* Row 2: 2 text inputs */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{
              flex: 1, height: 42, display: 'flex', alignItems: 'center', gap: 8,
              background: 'white', border: '2px solid #ECEFF0', borderRadius: 6,
              padding: '4px 16px', boxSizing: 'border-box',
            }}>
              <LocationIcon />
              <input
                type="text"
                placeholder="Property address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#858A8E',
                }}
              />
            </div>
            <div style={{
              flex: 1, height: 42, display: 'flex', alignItems: 'center', gap: 8,
              background: 'white', border: '2px solid #ECEFF0', borderRadius: 6,
              padding: '4px 16px', boxSizing: 'border-box',
            }}>
              <LinkIcon />
              <input
                type="text"
                placeholder="MLS listing link if applicable"
                value={mlsLink}
                onChange={e => setMlsLink(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#858A8E',
                }}
              />
            </div>
          </div>

          {/* Attach floor plan */}
          <div>
            <input
              ref={floorPlanRef}
              type="file"
              style={{ display: 'none' }}
              onChange={() => {/* TODO: handle floor plan upload */}}
            />
            <button
              type="button"
              onClick={() => floorPlanRef.current?.click()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '8px 16px', border: '1px solid #4F46E5',
                borderRadius: 6, background: 'white', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#4F46E5',
              }}
            >
              <PaperclipIcon />
              Attach a floor plan
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: UPLOAD PHOTOS ─────────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ol style={{ margin: 0, padding: '0 0 0 27px' }} start={2}>
            <li style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 18,
              color: '#000B14', lineHeight: 1.4,
            }}>
              UPLOAD PHOTOS*
            </li>
          </ol>
          <p style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 16,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Minimum upload dimension size: 1000×1000 pixels. Accepted file formats: png, jpeg, jpg
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FAFAFA', border: '1px solid #D6D8D9', borderRadius: 16,
          padding: 30, display: 'flex', flexDirection: 'column', gap: 16,
          boxSizing: 'border-box',
        }}>
          {/* Card header row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>

            {/* Left: title + counter + progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{
                fontFamily: 'Inter', fontWeight: 600, fontSize: 18, color: '#000B14',
                margin: 0, lineHeight: 1.4,
              }}>
                Virtual Staging
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{
                  fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#4F46E5',
                  lineHeight: 1.4,
                }}>
                  {uploadedFiles.length}/ {MAX_PHOTOS} Uploaded
                </span>
                {/* Progress bar */}
                <div style={{ width: 198, height: 8, display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '100%', height: 5, background: '#D9D9D9', borderRadius: 99 }}>
                    {uploadedFiles.length > 0 && (
                      <div style={{
                        position: 'absolute', left: 0, top: 0, height: '100%',
                        width: `${uploadProgress}%`, background: '#4F46E5',
                        borderRadius: 99, transition: 'width 0.3s ease',
                      }} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: paste a link */}
            <button type="button" style={{
              display: 'flex', alignItems: 'center', gap: 4, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#000B14',
              textDecoration: 'underline',
            }}>
              Or paste a link to upload
              <ExternalLinkIcon />
            </button>
          </div>

          {/* Drop zone */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpeg,.jpg"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%', height: 315,
              background: isDragging ? '#F5F3FF' : 'white',
              border: `2px dashed ${isDragging ? '#4F46E5' : '#D6D8D9'}`,
              borderRadius: 16, cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 16, padding: 24, boxSizing: 'border-box',
              transition: 'all 0.15s ease',
            }}
          >
            <UploadCloudIcon />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#4F46E5' }}>
                Drag &amp; drop to upload photos
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#4F46E5' }}>
                OR
              </span>
            </div>
            <div style={{
              background: '#4F46E5', borderRadius: 6, padding: '8px 16px',
            }}>
              <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#FFFDFF' }}>
                Select files to upload
              </span>
            </div>
          </button>

          {/* Uploaded file chips */}
          {uploadedFiles.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {uploadedFiles.map((file, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F5F3FF', borderRadius: 6, padding: '4px 10px',
                  border: '1px solid #C7D2FE',
                }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 12, color: '#4F46E5',
                    maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setUploadedFiles(prev => prev.filter((_, idx) => idx !== i));
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 0, color: '#6B7280', fontSize: 14, lineHeight: 1,
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AI SMART PICK BUTTON ─────────────────────────────────────────── */}
      <button
        type="button"
        style={{
          width: '100%', height: 54, background: '#4F46E5',
          border: 'none', borderRadius: 6, cursor: 'pointer',
          fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#FFFDFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          letterSpacing: '-0.01em',
        }}
      >
        AI Smart Pick
      </button>

      {/* ── SECTION 3: CHOOSE A BRAND WITH ITS STYLE ────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ol style={{ margin: 0, padding: '0 0 0 27px' }} start={3}>
            <li style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 18, color: '#000B14',
              lineHeight: 1.35,
            }}>
              CHOOSE A BRAND WITH ITS STYLE*
            </li>
          </ol>
          <p style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 16,
            color: '#858A8E', lineHeight: 1.4, margin: 0, maxWidth: 1089,
          }}>
            {`Select a brand using choose Style to present your preferences. We'll stage your uploaded photo to reflect that same furniture and aesthetic.`}
          </p>
        </div>

        {/* Brand grid */}
        <div style={{
          background: '#FAFAFA', padding: 30,
          display: 'flex', flexDirection: 'column', gap: 24,
          boxSizing: 'border-box',
        }}>
          {[0, 4, 8].map(startIdx => (
            <div
              key={startIdx}
              style={{
                display: 'flex', justifyContent: 'space-between',
                gap: 7, padding: '3px 0', flexWrap: 'wrap',
              }}
            >
              {BRAND_STYLES.slice(startIdx, startIdx + 4).map(brand => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  isSelected={selectedBrand === brand.id}
                  onSelect={() => setSelectedBrand(brand.id === selectedBrand ? null : brand.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── TERMS CHECKBOX ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%' }}>
        <button
          type="button"
          onClick={() => setAgreedToTerms(v => !v)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 1 }}
          aria-label="Agree to terms and services"
        >
          {agreedToTerms ? <CheckRChecked /> : <CheckRIcon />}
        </button>
        <p style={{
          fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#000B14',
          lineHeight: 1.4, margin: 0,
        }}>
          By clicking, you are confirming that you have read, understand and agree to{' '}
          <a href="#" style={{ color: '#000B14', textDecoration: 'underline', fontFamily: 'Inter', fontWeight: 400, fontSize: 14 }}>
            Terms and Services
          </a>
        </p>
      </div>

      {/* ── SUBMIT BUTTON ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
        <button
          type="button"
          disabled={!canSubmit}
          style={{
            width: 300,
            background: canSubmit ? '#4F46E5' : '#C1C2C3',
            border: 'none', borderRadius: 6,
            padding: '12px 32px',
            fontFamily: 'Inter', fontSize: 16, fontWeight: 500, color: 'white',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            letterSpacing: '0.01em', lineHeight: '20px',
            transition: 'background 0.2s ease',
          }}
        >
          Submit
        </button>
      </div>

    </div>
  );
}
