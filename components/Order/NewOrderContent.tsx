'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AiPickOption } from './AiSmartPickModal';

// ─── Constants ────────────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Condo / Apartment',
  'Townhouse',
  'Vacant Land',
  'Multi-Family',
];

export const BUYER_PROFILES = [
  'First-Time Buyer',
  'Luxury Buyer',
  'Investor',
  'Family',
  'Young Professional',
  'Empty Nester',
];

export const INTENDED_USES = [
  'For Sale',
  'For Rent',
  'Personal Use',
  'Investment',
];

export const MAX_PHOTOS = 7;

export const FIGMA_ASSET = (hash: string) => `http://localhost:3845/assets/${hash}`;

// Brand style data — background room photos + logo overlay from Figma node 14771:98640
export const BRAND_STYLES = [
  // Row 1
  {
    id: '1',  brand: 'Crate&Barrel',                 styles: 'Modern, Mid Century Modern',
    bgImg:   FIGMA_ASSET('57c748413712621c7859ff02e2573a89e26a8830.png'),
    logoImg: FIGMA_ASSET('756739506d3a97d14a1daec91f0b6904e1a6b2e2.png'),
  },
  {
    id: '2',  brand: 'ARTICLE.',                      styles: 'Modern, Modern Rustic',
    bgImg:   FIGMA_ASSET('b589c9574c13782da14ce5fc90277025ba571066.png'),
    logoImg: FIGMA_ASSET('5a5ec30ee5bebba173fc4ce61ab94e71aef11b36.png'),
  },
  {
    id: '3',  brand: 'EQ3',                           styles: 'Modern Rustic, Traditional',
    bgImg:   FIGMA_ASSET('bf6853081d97c43afedbdc850e03df46b008584e.png'),
    logoImg: FIGMA_ASSET('5506ca5148eb3d149d8e9e7f723beb4dc6e9bb71.png'),
  },
  {
    id: '4',  brand: 'ROVE CONCEPTS',                 styles: 'Contemporary, Scandinavian',
    bgImg:   FIGMA_ASSET('e64ef21dab029a1a9921191c2066fca60bf62dbc.png'),
    logoImg: FIGMA_ASSET('2f6757a0bbc58de232ba340157b96cedde48d1ac.png'),
  },
  // Row 2
  {
    id: '5',  brand: 'Gus*',                          styles: 'Scandinavian, Mid Century Modern',
    bgImg:   FIGMA_ASSET('afab1819a49eb987072ba65cc21ea22a3f41f2cb.png'),
    logoImg: FIGMA_ASSET('368a84a6a208d76d49ae175eacd6ff9ab0f631a7.png'),
  },
  {
    id: '6',  brand: 'Mitchell Gold + Bob Williams',   styles: 'Rustic',
    bgImg:   FIGMA_ASSET('b82ed35bcd8ff936868e6a269c04871a4400a8d2.png'),
    logoImg: FIGMA_ASSET('f2ae538a3fb464170248ac18cb865dcfbfca6a0b.png'),
  },
  {
    id: '7',  brand: 'rochebobois',                   styles: 'Contemporary, Nordic Boho',
    bgImg:   FIGMA_ASSET('2f113554e0a4d15846b500703f59af614d82e060.png'),
    logoImg: FIGMA_ASSET('3afca4f07a460650fca792ce9448cf98fad5d6cc.png'),
  },
  {
    id: '8',  brand: 'HOOKER',                        styles: 'Rustic',
    bgImg:   FIGMA_ASSET('dd216899e6c0633590e7f752415f6bc4be064018.png'),
    logoImg: FIGMA_ASSET('505cbc71acec53e45e2de90a1a33809b7e6906ca.png'),
  },
  // Row 3
  {
    id: '9',  brand: 'ETERNITY MODERN',               styles: 'Mid Century Modern, Contemporary',
    bgImg:   FIGMA_ASSET('3aa2430dd087b7735dcb90772eb8492bbd102183.png'),
    logoImg: FIGMA_ASSET('7fe3d395bc8d7d6a0468fef65375cf6a1f7c4a37.png'),
  },
  {
    id: '10', brand: 'sundays',                       styles: 'Scandinavian, Midcentury Modern',
    bgImg:   FIGMA_ASSET('3851778119b049f7db769265c53eb958472766a5.png'),
    logoImg: FIGMA_ASSET('17eb20db37e393f6672d017d559109861fbfc03a.png'),
  },
  {
    id: '11', brand: 'KING',                          styles: 'Rustic',
    bgImg:   FIGMA_ASSET('0e80e6e98385b4f94098653a95e7472738dc95ea.png'),
    logoImg: FIGMA_ASSET('137545ec60335cd8f3637af0b0aad1f3033ef2a5.png'),
  },
  {
    id: '12', brand: 'MOHA',                          styles: 'Modern Rustic, Modern Contemporary',
    bgImg:   FIGMA_ASSET('0a00a0dcfc9fd9c1e752360a111cb67650ee031f.png'),
    logoImg: FIGMA_ASSET('7ab30ba1a981ba190fc97b21bc16e7d82ff92c14.png'),
  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

export const ChevronDown = ({ color = '#858A8E', size = 41 }: { color?: string; size?: number }) => (
  <svg className="no-icon no-icon--chevron" width={size} height={size} viewBox="0 0 41 41" fill="none" style={{ flexShrink: 0 }}>
    <path d="M14 18L20 24L26 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HouseIcon = () => (
  <svg className="no-icon no-icon--house" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1.167 6.125L7 1.167L12.833 6.125V11.667C12.833 12.034 12.534 12.333 12.167 12.333H9.333V9.333H4.667V12.333H1.833C1.466 12.333 1.167 12.034 1.167 11.667V6.125Z" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PersonIcon = () => (
  <svg className="no-icon no-icon--person" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="4.5" r="2.5" stroke="#858A8E" strokeWidth="1.2"/>
    <path d="M1.5 12.5C1.5 10.015 4.015 8 7 8C9.985 8 12.5 10.015 12.5 12.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export const TagIcon = () => (
  <svg className="no-icon no-icon--tag" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7.583 1.167H12.833V6.417L7 12.25L1.75 7L7.583 1.167Z" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10.5" cy="3.5" r="0.875" fill="#858A8E"/>
  </svg>
);

export const LocationIcon = () => (
  <svg className="no-icon no-icon--location" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1.167C4.975 1.167 3.5 2.875 3.5 4.667C3.5 7.583 7 12.833 7 12.833C7 12.833 10.5 7.583 10.5 4.667C10.5 2.875 9.025 1.167 7 1.167Z" stroke="#858A8E" strokeWidth="1.2"/>
    <circle cx="7" cy="4.667" r="1.167" stroke="#858A8E" strokeWidth="1.2"/>
  </svg>
);

export const LinkIcon = () => (
  <svg className="no-icon no-icon--link" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5.833 8.167L8.167 5.833M6.417 3.5L7.292 2.625C8.31 1.607 9.94 1.607 10.958 2.625L11.375 3.042C12.393 4.06 12.393 5.69 11.375 6.708L10.5 7.583M3.5 6.417L2.625 7.292C1.607 8.31 1.607 9.94 2.625 10.958L3.042 11.375C4.06 12.393 5.69 12.393 6.708 11.375L7.583 10.5" stroke="#858A8E" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export const PaperclipIcon = () => (
  <svg className="no-icon no-icon--paperclip" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M10.5 5.5L5.5 10.5C4.4 11.6 2.6 11.6 1.5 10.5C0.4 9.4 0.4 7.6 1.5 6.5L7 1C7.8 0.2 9.1 0.2 9.9 1C10.7 1.8 10.7 3.1 9.9 3.9L4.4 9.4C4 9.8 3.4 9.8 3 9.4C2.6 9 2.6 8.4 3 8L7.9 3.1" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export const UploadCloudIcon = () => (
  <svg className="no-icon no-icon--upload-cloud" width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#F3F4F6"/>
    <path d="M15 29C13.067 29 11.5 27.433 11.5 25.5C11.5 23.834 12.685 22.447 14.261 22.089C14.091 21.58 14 21.051 14 20.5C14 17.462 16.462 15 19.5 15C21.481 15 23.218 16.041 24.199 17.604C24.782 17.218 25.477 17 26.222 17C28.309 17 30 18.685 30 20.778C30 20.852 29.998 20.925 29.994 20.998C31.752 21.448 33 23.036 33 24.944C33 27.184 31.185 29 28.944 29H15Z" stroke="#9CA3AF" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M22 33V25M22 25L19 28M22 25L25 28" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ExternalLinkIcon = () => (
  <svg className="no-icon no-icon--external-link" width="12" height="9" viewBox="0 0 12 9" fill="none" style={{ flexShrink: 0 }}>
    <path d="M11 1V7M11 1H5M11 1L5 7M1 8H3" stroke="#000B14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CheckRIcon = () => (
  <svg className="no-icon no-icon--checkbox" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0.75" y="0.75" width="16.5" height="16.5" rx="3.25" stroke="#D6D8D9" strokeWidth="1.5"/>
  </svg>
);

export const CheckRChecked = () => (
  <svg className="no-icon no-icon--checkbox-checked" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect width="18" height="18" rx="4" fill="#4F46E5"/>
    <path d="M5 9L7.5 11.5L13 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Responsive hooks ─────────────────────────────────────────────────────────
// Mirror the isMounted + useState(1280) pattern from MLSMarketingHubContent / projects/layout.tsx.
// Before mount (SSR + first client paint): isMounted=false → always desktop (1280).
// After mount: isMounted=true → use real window.innerWidth.
// This guarantees SSR HTML == initial client render, eliminating hydration mismatch.
export function useLayout(): 'mobile' | 'tablet' | 'desktop' {
  const [containerWidth, setContainerWidth] = React.useState<number>(1280);
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
    setContainerWidth(window.innerWidth);
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (!isMounted) return 'desktop';
  if (containerWidth < 600) return 'mobile';
  if (containerWidth < 1024) return 'tablet';
  return 'desktop';
}

export function useIsTablet() { return useLayout() === 'tablet'; }
export function useIsMobile() { return useLayout() === 'mobile'; }

// ─── Dropdown Component ───────────────────────────────────────────────────────

export function Dropdown({
  value, placeholder, options, icon, isOpen, onToggle, onSelect, compact, mobile,
}: {
  value: string;
  placeholder: string;
  options: string[];
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
  compact?: boolean;
  mobile?: boolean;
}) {
  return (
    <div className="no-dropdown" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button
        className="no-dropdown__trigger"
        type="button"
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{
          width: '100%', height: mobile ? 40 : 42,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'white',
          border: mobile ? '1px solid #ECEFF0' : '2px solid #ECEFF0',
          borderRadius: mobile ? 16 : 6,
          padding: '4px 0 4px 12px', cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <div className="no-dropdown__trigger-inner" style={{ display: 'flex', alignItems: 'center', gap: compact ? 4 : 8, flex: 1, minWidth: 0 }}>
          {icon}
          <span className="no-dropdown__value" style={{
            fontFamily: 'Inter', fontSize: compact ? 12 : (value ? 14 : 16), fontWeight: 400,
            color: '#858A8E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown size={compact ? 28 : 41} />
      </button>

      {isOpen && (
        <div
          className="no-dropdown__menu"
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
              className="no-dropdown__option"
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

export type BrandCardProps = {
  brand: typeof BRAND_STYLES[0];
  isSelected: boolean;
  onSelect: () => void;
  cardWidth?: number | string;
  cardHeight?: number;
  footerFontSize?: number;
  footerLetterSpacing?: string;
};

export function BrandCard({
  brand,
  isSelected,
  onSelect,
  cardWidth,
  cardHeight,
  footerFontSize,
  footerLetterSpacing,
}: BrandCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={`no-brand-card${isSelected ? ' no-brand-card--selected' : ''}`}
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-brand-id={brand.id}
      data-brand-name={brand.brand}
      style={{
        position: 'relative',
        /* Desktop: flex:1 fills the row. Tablet (cardWidth set): fixed width, no flex grow */
        flex: cardWidth ? `0 0 ${cardWidth}` : 1,
        width: cardWidth ?? undefined,
        minWidth: 0, height: cardHeight ?? 195,
        borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        border: cardWidth
          ? `2px solid ${isSelected ? '#4F46E5' : '#ECEFF0'}`
          : 'none',
        padding: 0,
        outline: cardWidth
          ? 'none'
          : (isSelected ? '3px solid #4F46E5' : hovered ? '3px solid #C7D2FE' : '3px solid transparent'),
        transition: 'border-color 0.15s ease, outline 0.15s ease',
      }}
    >
      {/* Room photo background */}
      <img
        className="no-brand-card__bg"
        src={brand.bgImg}
        alt={brand.brand}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          display: 'block',
        }}
      />

      {/* Brand logo overlay — top-left */}
      <img
        className="no-brand-card__logo"
        src={brand.logoImg}
        alt={`${brand.brand} logo`}
        style={{
          position: 'absolute', top: 9, left: 14,
          maxWidth: '70%', maxHeight: 32,
          objectFit: 'contain', objectPosition: 'left center',
          display: 'block',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
        }}
      />

      {/* White label footer */}
      <div className="no-brand-card__footer" style={{
        position: 'absolute', bottom: 0, left: -0.5, right: -0.5, height: 27,
        background: 'white',
        display: 'flex', alignItems: 'center', paddingLeft: 14,
      }}>
        <span className="no-brand-card__style" style={{
          fontFamily: 'Inter', fontSize: footerFontSize ?? 12, fontWeight: 400,
          color: '#000B14', whiteSpace: 'nowrap',
          letterSpacing: footerLetterSpacing ?? '0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {brand.styles}
        </span>
      </div>
    </button>
  );
}

// ─── Layout Props Interfaces ──────────────────────────────────────────────────

export interface NewOrderLayoutProps {
  propertyType: string; setPropertyType: (v: string) => void;
  buyerProfile: string; setBuyerProfile: (v: string) => void;
  intendedUse: string; setIntendedUse: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  mlsLink: string; setMlsLink: (v: string) => void;
  selectedBrand: string | null; setSelectedBrand: (v: string | null) => void;
  aiPickResult: AiPickOption | null; setAiPickResult: (v: AiPickOption | null) => void;
  agreedToTerms: boolean; setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
  uploadedFiles: File[]; setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isDragging: boolean; setIsDragging: (v: boolean) => void;
  isAiModalOpen: boolean; setIsAiModalOpen: (v: boolean) => void;
  propertyTypeOpen: boolean; setPropertyTypeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buyerProfileOpen: boolean; setBuyerProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  intendedUseOpen: boolean; setIntendedUseOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  floorPlanRef: React.RefObject<HTMLInputElement | null>;
  canSubmit: boolean;
  uploadProgress: number;
  closeAllDropdowns: () => void;
  handleFileDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface NewOrderTabletLayoutProps extends NewOrderLayoutProps {
  aiRoomsScrollRef: React.RefObject<HTMLDivElement | null>;
  aiRoomsThumbLeft: number;
  aiRoomsThumbWidth: number;
  updateAiRoomsThumb: () => void;
}

// Mobile layout uses the same base props — no extra scroll refs (shows static image + "+2")
export type NewOrderMobileLayoutProps = NewOrderLayoutProps;

// ─── Main Component ───────────────────────────────────────────────────────────
import NewOrderDesktopLayout from './NewOrderDesktopLayout';
import NewOrderTabletLayout from './NewOrderTabletLayout';
import NewOrderMobileLayout from './NewOrderMobileLayout';

export default function NewOrderContent() {
  const [propertyType, setPropertyType]   = useState('');
  const [buyerProfile, setBuyerProfile]   = useState('');
  const [intendedUse, setIntendedUse]     = useState('');
  const [address, setAddress]             = useState('');
  const [mlsLink, setMlsLink]             = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [aiPickResult, setAiPickResult]   = useState<AiPickOption | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging]       = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen]   = useState(false);
  const [buyerProfileOpen, setBuyerProfileOpen]   = useState(false);
  const [intendedUseOpen, setIntendedUseOpen]     = useState(false);

  const fileInputRef     = useRef<HTMLInputElement>(null);
  const floorPlanRef     = useRef<HTMLInputElement>(null);
  const aiRoomsScrollRef = useRef<HTMLDivElement>(null);
  const [aiRoomsThumbLeft,  setAiRoomsThumbLeft]  = useState(0);
  const [aiRoomsThumbWidth, setAiRoomsThumbWidth] = useState(100);

  const updateAiRoomsThumb = useCallback(() => {
    const el = aiRoomsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const ratio = clientWidth / scrollWidth;
    const tw    = Math.max(ratio * clientWidth, 40);
    const maxScroll = scrollWidth - clientWidth;
    const tl    = maxScroll > 0 ? (scrollLeft / maxScroll) * (clientWidth - tw) : 0;
    setAiRoomsThumbWidth(tw);
    setAiRoomsThumbLeft(tl);
  }, []);

  useEffect(() => {
    if (!aiPickResult) return;
    updateAiRoomsThumb();
    const raf = requestAnimationFrame(updateAiRoomsThumb);
    return () => cancelAnimationFrame(raf);
  }, [aiPickResult, updateAiRoomsThumb]);

  const canSubmit      = uploadedFiles.length > 0 && selectedBrand !== null && agreedToTerms;
  const uploadProgress = Math.min((uploadedFiles.length / MAX_PHOTOS) * 100, 100);

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

  // ── Breakpoint detection — inline like MLSMarketingHubContent ────────────
  // isMounted=false → render desktop (matches SSR). After mount → real width.
  const [containerWidth, setContainerWidth] = useState<number>(1280);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    setContainerWidth(window.innerWidth);
    const onResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile  = isMounted && containerWidth < 600;
  const isTablet  = isMounted && containerWidth >= 600 && containerWidth < 1024;

  const baseProps: NewOrderLayoutProps = {
    propertyType, setPropertyType,
    buyerProfile, setBuyerProfile,
    intendedUse, setIntendedUse,
    address, setAddress,
    mlsLink, setMlsLink,
    selectedBrand, setSelectedBrand,
    aiPickResult, setAiPickResult,
    agreedToTerms, setAgreedToTerms,
    uploadedFiles, setUploadedFiles,
    isDragging, setIsDragging,
    isAiModalOpen, setIsAiModalOpen,
    propertyTypeOpen, setPropertyTypeOpen,
    buyerProfileOpen, setBuyerProfileOpen,
    intendedUseOpen, setIntendedUseOpen,
    fileInputRef, floorPlanRef,
    canSubmit, uploadProgress,
    closeAllDropdowns, handleFileDrop, handleFileSelect,
  };

  if (isMobile) {
    return <NewOrderMobileLayout {...baseProps} />;
  }

  if (isTablet) {
    return (
      <NewOrderTabletLayout
        {...baseProps}
        aiRoomsScrollRef={aiRoomsScrollRef}
        aiRoomsThumbLeft={aiRoomsThumbLeft}
        aiRoomsThumbWidth={aiRoomsThumbWidth}
        updateAiRoomsThumb={updateAiRoomsThumb}
      />
    );
  }

  return <NewOrderDesktopLayout {...baseProps} />;
}
