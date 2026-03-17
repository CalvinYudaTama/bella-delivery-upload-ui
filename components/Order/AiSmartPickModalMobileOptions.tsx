'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CloseIcon, ICONS, AI_OPTIONS } from './AiSmartPickModal';
import type { OptionsViewProps } from './AiSmartPickModalDesktopOptions';

// Double-chevron expand/collapse arrow — flips horizontally when expanded
function ExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20" fill="none"
      style={{
        transform: expanded ? 'scaleX(-1)' : 'none',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <path d="M8 5L13 10L8 15" stroke="#858A8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 5L9 10L4 15" stroke="#858A8E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Mobile option card — defined at module level to prevent remount bug
export function MobileOptionCard({
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
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(100);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const ratio = clientWidth / scrollWidth;
    const tw = Math.max(ratio * clientWidth, 40);
    const maxScroll = scrollWidth - clientWidth;
    const tl = maxScroll > 0 ? (scrollLeft / maxScroll) * (clientWidth - tw) : 0;
    setThumbWidth(tw);
    setThumbLeft(tl);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const raf = requestAnimationFrame(updateThumb);
    return () => cancelAnimationFrame(raf);
  }, [expanded, updateThumb]);

  return (
    <div
      className={`asp-option asp-option--mobile${isSelected ? ' asp-option--selected' : ''}${isDisabled ? ' asp-option--disabled' : ''}`}
      style={{
        width: '100%',
        background: isSelected ? '#EFF2FE' : '#FAFAFA',
        border: `1px solid ${isSelected ? '#4F46E5' : '#D6D8D9'}`,
        borderRadius: 12, padding: 16,
        display: 'flex', flexDirection: 'column', gap: 12,
        opacity: isDisabled ? 0.3 : 1,
        transition: 'opacity 0.2s ease, border-color 0.15s ease, background 0.15s ease',
        boxSizing: 'border-box',
      }}
    >
      {/* Header row: radio + label + expand chevron */}
      <div className="asp-option__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {/* Selectable area */}
        <div
          className="asp-option__select-area"
          style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer' }}
          onClick={() => onSelectOption(option.id)}
        >
          <div className="asp-option__radio" style={{
            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
            border: isSelected ? 'none' : '1.5px solid #C1C2C3',
            background: isSelected ? '#4F46E5' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isSelected && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <p className="asp-option__label" style={{
            fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
            color: '#000B14', margin: 0, lineHeight: '22.4px',
          }}>
            {`Option #${idx + 1}: `}
            <span style={{ fontWeight: 700 }}>{option.brand}</span>
          </p>
        </div>

        {/* Expand/collapse button */}
        <button
          className="asp-option__expand-btn"
          type="button"
          onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ExpandChevron expanded={expanded} />
        </button>
      </div>

      {/* Images area */}
      {!expanded ? (
        /* Collapsed: only first image, full width */
        <div
          className="asp-option__image-wrap"
          style={{ width: '100%', height: 150, borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
          onClick={() => onSelectOption(option.id)}
        >
          <img
            src={option.rooms[0].img}
            alt={option.rooms[0].label}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 27,
            background: '#FFFDFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#000B14', margin: 0 }}>
              {option.rooms[0].label}
            </p>
          </div>
        </div>
      ) : (
        /* Expanded: horizontally scrollable images + slider */
        <div className="asp-option__expanded" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="asp-option__scroll-clip" style={{ overflow: 'hidden' }}>
            <div
              className="asp-option__scroll"
              ref={scrollRef}
              onScroll={updateThumb}
              style={{
                display: 'flex', gap: 12,
                overflowX: 'auto',
                paddingBottom: 20,
                marginBottom: -20,
              }}
            >
              {option.rooms.map((room, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    width: 240, height: 150, flexShrink: 0,
                    borderRadius: 12, overflow: 'hidden', position: 'relative',
                  }}
                >
                  <img
                    src={room.img}
                    alt={room.label}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 27,
                    background: '#FFFDFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#000B14', margin: 0 }}>
                      {room.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Scroll progress slider */}
          <div className="asp-option__slider" style={{ height: 8, background: '#D6D8D9', borderRadius: 6, width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div className="asp-option__slider-thumb" style={{
              position: 'absolute', top: 0, left: thumbLeft,
              height: '100%', width: thumbWidth,
              background: '#858A8E', borderRadius: 6,
              transition: 'left 0.08s linear',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function MobileOptionsView({
  selectedOption,
  onSelectOption,
  onReload,
  onClose,
  onConfirm,
}: OptionsViewProps) {
  const hasSelection = selectedOption !== null;

  return (
    <>
      {/* ══ FIXED HEADER ══ */}
      <div
        className="asp-modal-header"
        style={{
          flexShrink: 0,
          background: 'white',
          padding: '20px 20px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        <div className="asp-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{
            fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
            color: '#000B14', margin: 0, lineHeight: '22.4px',
          }}>
            AI Smart Pick Recommendation
          </p>
          <button
            className="asp-close-btn"
            type="button"
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        <p className="asp-description" style={{
          fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
          color: '#858A8E', margin: 0, lineHeight: '20px',
        }}>
          {`We recommend three staging brands because they best match the property's region and target buyer profile. Based on local trends and buyer preferences, these options are most likely to resonate and help buyers envision their dream home.`}
        </p>
      </div>

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div
        className="asp-options-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {AI_OPTIONS.map((option, idx) => {
          const isSelected = selectedOption === option.id;
          const isDisabled = selectedOption !== null && !isSelected;
          return (
            <MobileOptionCard
              key={option.id}
              option={option}
              idx={idx}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onSelectOption={onSelectOption}
            />
          );
        })}
      </div>

      {/* ══ FIXED FOOTER ══ */}
      <div
        className="asp-modal-footer"
        style={{
          flexShrink: 0,
          background: 'white',
          padding: '14px 16px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        <p className="asp-note" style={{
          fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
          color: '#000B14', margin: 0, lineHeight: '20px',
        }}>
          <span style={{ fontWeight: 700 }}>Please note:</span>
          {' '}If you reload AI Smart Pick, you can not go back to previous AI suggestions.
        </p>

        <div className="asp-footer" style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <button
            className="asp-reload-btn"
            type="button"
            onClick={onReload}
            style={{
              height: 48, padding: '8px 16px',
              border: '1px solid #4F46E5', borderRadius: 6,
              background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#4F46E5',
              width: '100%',
            }}
          >
            <img src={ICONS.reload} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />
            Reload AI Smart pick
          </button>

          <button
            className="asp-confirm-btn"
            type="button"
            onClick={onConfirm}
            disabled={!hasSelection}
            style={{
              height: 48, padding: '8px 16px',
              background: '#4F46E5', borderRadius: 6, border: 'none',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#FFFDFF',
              opacity: hasSelection ? 1 : 0.3,
              transition: 'opacity 0.2s ease',
              width: '100%',
            }}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </>
  );
}
