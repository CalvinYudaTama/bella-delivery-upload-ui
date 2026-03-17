'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Responsive hook — same isMounted + useState(1280) pattern as MLS / projects/layout ──
function useLayout(): 'mobile' | 'tablet' | 'desktop' {
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

// ── Figma asset URLs ──────────────────────────────────────────────────────────
export const ASSET = (h: string) => `http://localhost:3845/assets/${h}`;

export const ICONS = {
  // SVG icons from Figma localhost (images/svgs)
  circleEmpty:   ASSET('b639e156d926f5293b592fd2351e728e3ff52746.svg'),
  circleChecked: ASSET('976f18450f3f7e0b977dae8d33fbaea1d5016019.svg'),
  reload:        ASSET('69b282de8ac445e94f994527491daddd81068d0b.svg'),
  reasonIcon:    ASSET('c48fe998c0d60e8a1ff17114615884ceb81b7e2c.svg'),
  houseReason:   ASSET('3f9631f3a524d36dcb9c294abba16a194420c1be.svg'),
  noInfoIcon:    ASSET('23255b2234986fdd014134ff6d02417a4494290a.svg'),
};

// Inline X close icon — matches Figma exactly (24×24, stroke #000B14)
export const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#000B14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Mock AI recommendation options (in production: fetched from API)
export const AI_OPTIONS = [
  {
    id: '1',
    brand: 'Rove Concept',
    tag: 'Condo × Sell',
    rooms: [
      { img: ASSET('57c748413712621c7859ff02e2573a89e26a8830.png'), label: 'Living room' },
      { img: ASSET('b589c9574c13782da14ce5fc90277025ba571066.png'), label: 'Dinning room' },
      { img: ASSET('4f895dfc8468e75baef957bc95fd5cad261dc10b.png'), label: 'Bedroom' },
    ],
  },
  {
    id: '2',
    brand: 'Mobital',
    tag: 'Condo × Sell',
    rooms: [
      { img: ASSET('57c748413712621c7859ff02e2573a89e26a8830.png'), label: 'Living room' },
      { img: ASSET('b589c9574c13782da14ce5fc90277025ba571066.png'), label: 'Dinning room' },
      { img: ASSET('4f895dfc8468e75baef957bc95fd5cad261dc10b.png'), label: 'Bedroom' },
    ],
  },
  {
    id: '3',
    brand: 'Article',
    tag: 'Condo × Sell',
    rooms: [
      { img: ASSET('57c748413712621c7859ff02e2573a89e26a8830.png'), label: 'Living room' },
      { img: ASSET('b589c9574c13782da14ce5fc90277025ba571066.png'), label: 'Dinning room' },
      { img: ASSET('4f895dfc8468e75baef957bc95fd5cad261dc10b.png'), label: 'Bedroom' },
    ],
  },
];

type ModalState = 'loading' | 'options' | 'no-info';

export interface AiPickOption {
  optionIdx: number;
  brand: string;
  tag: string;
  rooms: { img: string; label: string }[];
}

export interface AiSmartPickModalProps {
  isOpen: boolean;
  /** true when at least property type is selected */
  hasPropertyInfo: boolean;
  onClose: () => void;
  /** Called with full selected option data on confirm */
  onConfirm: (option: AiPickOption) => void;
}

// ── Tablet option card (needs own ref for scroll slider) ──────────────────────

export function TabletOptionCard({
  option,
  idx,
  isSelected,
  isDisabled,
  onSelectOption,
}: {
  option: typeof AI_OPTIONS[0];
  idx: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelectOption: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(100);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const ratio = clientWidth / scrollWidth;                   // visible fraction
    const tw = Math.max(ratio * clientWidth, 40);              // thumb width (px), min 40
    const maxScroll = scrollWidth - clientWidth;
    const tl = maxScroll > 0 ? (scrollLeft / maxScroll) * (clientWidth - tw) : 0;
    setThumbWidth(tw);
    setThumbLeft(tl);
  }, []);

  // Recalculate after mount (images may not be laid out yet)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateThumb();
    // Also update once images are loaded / layout settled
    const raf = requestAnimationFrame(updateThumb);
    return () => cancelAnimationFrame(raf);
  }, [updateThumb]);

  return (
    <div
      className={`asp-option${isSelected ? ' asp-option--selected' : ''}${isDisabled ? ' asp-option--disabled' : ''}`}
      onClick={() => onSelectOption(option.id)}
      style={{
        width: '100%',
        background: isSelected ? '#EFF2FE' : '#FAFAFA',
        border: `1px solid ${isSelected ? '#4F46E5' : '#D6D8D9'}`,
        borderRadius: 12, padding: 16,
        display: 'flex', flexDirection: 'column', gap: 16,
        cursor: 'pointer',
        opacity: isDisabled ? 0.3 : 1,
        transition: 'opacity 0.2s ease, border-color 0.15s ease, background 0.15s ease',
        boxSizing: 'border-box',
      }}
    >
      {/* Option label row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
          border: isSelected ? 'none' : '1.5px solid #C1C2C3',
          background: isSelected ? '#4F46E5' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 2,
        }}>
          {isSelected && (
            <img src={ICONS.circleChecked} alt="" style={{ width: 20, height: 20, display: 'block' }} />
          )}
        </div>
        <p style={{
          fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
          color: '#000B14', margin: 0, lineHeight: '22.4px',
        }}>
          {`Option #${idx + 1}: `}
          <span style={{ fontWeight: 700 }}>{option.brand}</span>
          {' × '}{option.tag}
        </p>
      </div>

      {/* Images — horizontally scrollable, native scrollbar hidden */}
      <div style={{ overflow: 'hidden' }}>
        <div
          ref={scrollRef}
          onScroll={updateThumb}
          style={{
            display: 'flex', gap: 16,
            overflowX: 'auto',
            paddingBottom: 20,   /* push native scrollbar below clip boundary */
            marginBottom: -20,   /* pull outer back so height stays 150px */
          }}
        >
          {option.rooms.map((room, rIdx) => (
            <div
              key={rIdx}
              style={{
                width: 250, height: 150, flexShrink: 0,
                borderRadius: 12, overflow: 'hidden', position: 'relative',
              }}
            >
              <img
                src={room.img}
                alt={room.label}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 27,
                background: '#FFFDFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <p style={{
                  fontFamily: 'Inter', fontSize: 12, fontWeight: 400,
                  color: '#000B14', margin: 0,
                  letterSpacing: '0.12px', lineHeight: '18px',
                }}>
                  {room.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll progress slider — thumb moves with scroll */}
      <div style={{
        height: 8, background: '#D6D8D9', borderRadius: 6,
        width: '100%', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: thumbLeft,
          height: '100%', width: thumbWidth,
          background: '#858A8E', borderRadius: 6,
          transition: 'left 0.08s linear',
        }} />
      </div>
    </div>
  );
}

// ── Loading / Reasoning view ──────────────────────────────────────────────────

export function LoadingView({ onCancel }: { onCancel: () => void }) {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const t = setInterval(() => {
      setDots(d => d.length >= 3 ? '.' : d + '.');
    }, 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="asp-loading"
      style={{
        flex: 1,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 49,
        padding: '50px 24px',
      }}
    >
      {/* Title — centered per Figma, no close button on loading state */}
      <p style={{
        fontFamily: 'Inter', fontSize: 26, fontWeight: 600,
        color: '#4F46E5', margin: 0, lineHeight: 1.4,
        textAlign: 'center', width: '100%',
      }}>
        AI Smart Pick Recommendation
      </p>

      {/* Animated icon + reasoning text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img
          src={ICONS.reasonIcon}
          alt="Reasoning…"
          style={{ width: 103, height: 103 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={ICONS.houseReason} alt="" style={{ width: 22, height: 22 }} />
          <p style={{
            fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
            color: '#818CF5', margin: 0, lineHeight: 1.4,
          }}>
            Reasoning property type {dots}
          </p>
        </div>
      </div>

      {/* Cancel — centered */}
      <button
        className="asp-cancel-btn"
        type="button"
        onClick={onCancel}
        style={{
          height: 42, padding: '8px 24px',
          border: '1px solid #4F46E5', borderRadius: 6,
          background: 'none', cursor: 'pointer',
          fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
          color: '#4F46E5',
        }}
      >
        Cancel
      </button>
    </div>
  );
}

// ── No information view ───────────────────────────────────────────────────────

export function NoInfoView({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="asp-no-info"
      style={{
        flex: 1,
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',                       /* needed for absolute X button */
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 49, padding: '50px 24px',
      }}
    >
      {/* Close X — absolute top-right, doesn't affect layout flow */}
      <button
        className="asp-close-btn"
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 6, borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <CloseIcon />
      </button>

      {/* Title */}
      <p style={{
        fontFamily: 'Inter', fontSize: 26, fontWeight: 600,
        color: '#52595F', margin: 0, lineHeight: 1.4, textAlign: 'center',
      }}>
        No Information Provided
      </p>

      {/* Icon + description */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img src={ICONS.noInfoIcon} alt="" style={{ width: 103, height: 103 }} />
        <p style={{
          fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
          color: '#52595F', margin: 0, lineHeight: 1.4, textAlign: 'center',
          maxWidth: 340,
        }}>
          Please go back to the upload page and enter the required information.
        </p>
      </div>
    </div>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────────
import DesktopOptionsView from './AiSmartPickModalDesktopOptions';
import TabletOptionsView from './AiSmartPickModalTabletOptions';
import MobileOptionsView from './AiSmartPickModalMobileOptions';

export default function AiSmartPickModal({
  isOpen,
  hasPropertyInfo,
  onClose,
  onConfirm,
}: AiSmartPickModalProps) {
  const [modalState, setModalState] = useState<ModalState>('loading');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const layout = useLayout();
  const isMobile = layout === 'mobile';
  const isTablet = layout === 'tablet';

  // Scroll lock — lock both <html> and <body>, and the root-main scroller
  useEffect(() => {
    if (isOpen) {
      // Lock the scrollable page container
      const main = document.querySelector('.root-main') as HTMLElement | null;
      const savedScrollY = window.scrollY;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // Compensate for scrollbar disappearing (prevents layout shift)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      if (main) main.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if (main) main.style.overflow = '';
        window.scrollTo(0, savedScrollY);
      };
    }
  }, [isOpen]);

  // Reset + determine initial state each time modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedOption(null);
    if (!hasPropertyInfo) {
      setModalState('no-info');
    } else {
      setModalState('loading');
      const t = setTimeout(() => setModalState('options'), 1800);
      return () => clearTimeout(t);
    }
  }, [isOpen, hasPropertyInfo]);

  const handleReload = () => {
    setSelectedOption(null);
    setModalState('loading');
    const t = setTimeout(() => setModalState('options'), 1800);
    return () => clearTimeout(t);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    const optionIdx = AI_OPTIONS.findIndex(o => o.id === selectedOption);
    const option = AI_OPTIONS[optionIdx];
    if (option) onConfirm({
      optionIdx: optionIdx + 1,
      brand: option.brand,
      tag: option.tag,
      rooms: option.rooms,
    });
    onClose();
  };

  if (!isOpen) return null;

  const optionsProps = {
    selectedOption,
    onSelectOption: setSelectedOption,
    onReload: handleReload,
    onClose,
    onConfirm: handleConfirm,
  };

  return (
    // Backdrop
    <div
      className="asp-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '16px' : '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Modal panel */}
      <div
        className="asp-modal"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #D6D8D9',
          width: '100%',
          maxWidth: 880,
          maxHeight: '90vh',
          overflow: 'hidden',          /* clip at rounded corners — no scroll here */
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {modalState === 'loading' && <LoadingView onCancel={onClose} />}
        {modalState === 'no-info' && <NoInfoView onClose={onClose} />}
        {modalState === 'options' && (
          isMobile
            ? <MobileOptionsView {...optionsProps} />
            : isTablet
              ? <TabletOptionsView {...optionsProps} />
              : <DesktopOptionsView {...optionsProps} />
        )}
      </div>
    </div>
  );
}
