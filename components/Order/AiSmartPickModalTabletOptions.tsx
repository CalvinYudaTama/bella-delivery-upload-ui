'use client';

import React from 'react';
import { CloseIcon, ICONS, AI_OPTIONS, TabletOptionCard } from './AiSmartPickModal';
import type { OptionsViewProps } from './AiSmartPickModalDesktopOptions';

export default function TabletOptionsView({
  selectedOption,
  onSelectOption,
  onReload,
  onClose,
  onConfirm,
}: OptionsViewProps) {
  const hasSelection = selectedOption !== null;

  return (
    <>
      {/* ══ FIXED HEADER — always white, never scrolls ══ */}
      <div
        className="asp-modal-header"
        style={{
          flexShrink: 0,
          background: 'white',
          padding: '24px 24px 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {/* Title row */}
        <div
          className="asp-header"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <p style={{
            fontFamily: 'Inter', fontSize: 18, fontWeight: 600,
            color: '#000B14', margin: 0, lineHeight: '25.2px',
          }}>
            AI Smart Pick Recommendation
          </p>
          <button
            className="asp-close-btn"
            type="button"
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Description */}
        <p
          className="asp-description"
          style={{
            fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
            color: '#858A8E', margin: 0, lineHeight: '22.4px',
          }}
        >
          {`We recommend three staging brands because they best match the property's region and target buyer profile. Based on local trends and buyer preferences, these options are most likely to resonate and help buyers envision their dream home.`}
        </p>
      </div>

      {/* ══ SCROLLABLE CONTENT — only option cards scroll ══ */}
      <div
        className="asp-options-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 24px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {/* ── 3 Option cards — tablet TabletOptionCard elements ── */}
        {AI_OPTIONS.map((option, idx) => {
          const isSelected = selectedOption === option.id;
          const isDisabled = selectedOption !== null && !isSelected;

          return (
            <TabletOptionCard
              key={option.id}
              option={option}
              idx={idx}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onSelectOption={onSelectOption}
            />
          );
        })}
      </div>{/* end asp-options-scroll */}

      {/* ══ FIXED FOOTER — always white, never scrolls ══ */}
      <div
        className="asp-modal-footer"
        style={{
          flexShrink: 0,
          background: 'white',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {/* Please note */}
        <p
          className="asp-note"
          style={{
            fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
            color: '#000B14', margin: 0, lineHeight: '22.4px',
            textAlign: 'left', width: '100%',
          }}
        >
          <span style={{ fontWeight: 700 }}>Please note:</span>
          {' '}If you reload AI Smart Pick, you can not go back to previous AI suggestions.
        </p>

        {/* Footer buttons */}
        <div
          className="asp-footer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 16,
            width: '100%',
          }}
        >
          {/* Reload */}
          <button
            className="asp-reload-btn"
            type="button"
            onClick={onReload}
            style={{
              height: 54, padding: '8px 24px',
              border: '1px solid #4F46E5', borderRadius: 6,
              background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#4F46E5',
              width: '100%',
            }}
          >
            <img src={ICONS.reload} alt="" style={{ width: 18, height: 17, flexShrink: 0 }} />
            Reload AI Smart pick
          </button>

          {/* Confirm */}
          <button
            className="asp-confirm-btn"
            type="button"
            onClick={onConfirm}
            disabled={!hasSelection}
            style={{
              height: 54, padding: '8px 24px',
              background: '#4F46E5', borderRadius: 6, border: 'none',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#FFFDFF',
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
