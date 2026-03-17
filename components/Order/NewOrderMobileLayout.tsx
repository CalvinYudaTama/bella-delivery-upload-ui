'use client';

import React from 'react';
import AiSmartPickModal from './AiSmartPickModal';
import {
  NewOrderMobileLayoutProps,
  PROPERTY_TYPES, BUYER_PROFILES, INTENDED_USES, MAX_PHOTOS, BRAND_STYLES,
  HouseIcon, PersonIcon, TagIcon, LocationIcon, LinkIcon,
  PaperclipIcon, ExternalLinkIcon, CheckRIcon, CheckRChecked,
  Dropdown, BrandCard,
} from './NewOrderContent';

// Mobile-specific upload icon: circle 48px + upload arrow SVG
function MobileUploadIcon() {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      background: '#F0F0F0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 17V9M12 9L9 12M12 9L15 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function NewOrderMobileLayout({
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
}: NewOrderMobileLayoutProps) {
  return (
    <div
      className="no-page no-page--mobile"
      onClick={closeAllDropdowns}
      style={{
        display: 'flex', flexDirection: 'column', gap: 24,
        padding: '24px 20px 40px',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box', width: '100%',
      }}
    >

      {/* ── SECTION 1: PROPERTY INFO ─────────────────────────────────────── */}
      <section className="no-section no-section--property">
        <div className="no-section__header" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <p className="no-section__title" style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 16,
            color: '#000B14', lineHeight: 1.4, margin: 0,
          }}>
            1. PROPERTY INFO
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 14,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Provide the property information will help AI designer generate better result.
          </p>
        </div>

        <div className="no-property-card" style={{
          background: '#FAFAFA', border: '1px solid #D6D8D9', borderRadius: 12,
          padding: 20, display: 'flex', flexDirection: 'column', gap: 8,
          boxSizing: 'border-box',
        }}>
          {/* Stacked dropdowns — mobile: each full width */}
          <Dropdown
            value={propertyType}
            placeholder="Property type"
            options={PROPERTY_TYPES}
            icon={<HouseIcon />}
            isOpen={propertyTypeOpen}
            onToggle={() => { closeAllDropdowns(); setPropertyTypeOpen(v => !v); }}
            onSelect={v => { setPropertyType(v); setPropertyTypeOpen(false); }}
            mobile={true}
          />
          <Dropdown
            value={buyerProfile}
            placeholder="Intended buyer profile"
            options={BUYER_PROFILES}
            icon={<PersonIcon />}
            isOpen={buyerProfileOpen}
            onToggle={() => { closeAllDropdowns(); setBuyerProfileOpen(v => !v); }}
            onSelect={v => { setBuyerProfile(v); setBuyerProfileOpen(false); }}
            mobile={true}
          />
          <Dropdown
            value={intendedUse}
            placeholder="Intended use"
            options={INTENDED_USES}
            icon={<TagIcon />}
            isOpen={intendedUseOpen}
            onToggle={() => { closeAllDropdowns(); setIntendedUseOpen(v => !v); }}
            onSelect={v => { setIntendedUse(v); setIntendedUseOpen(false); }}
            mobile={true}
          />

          {/* Property address input */}
          <div className="no-input-wrapper no-input-wrapper--address" style={{
            height: 40, display: 'flex', alignItems: 'center', gap: 8,
            background: 'white', border: '1px solid #ECEFF0', borderRadius: 16,
            padding: '4px 12px', boxSizing: 'border-box',
          }}>
            <LocationIcon />
            <input
              className="no-input no-input--address"
              type="text"
              placeholder="Property address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#858A8E',
              }}
            />
          </div>

          {/* MLS listing link input */}
          <div className="no-input-wrapper no-input-wrapper--mls" style={{
            height: 40, display: 'flex', alignItems: 'center', gap: 8,
            background: 'white', border: '1px solid #ECEFF0', borderRadius: 16,
            padding: '4px 12px', boxSizing: 'border-box',
          }}>
            <LinkIcon />
            <input
              className="no-input no-input--mls"
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

          {/* Attach floor plan */}
          <input
            className="no-floor-plan__input"
            ref={floorPlanRef}
            type="file"
            style={{ display: 'none' }}
            onChange={() => {}}
          />
          <button
            className="no-floor-plan__btn"
            type="button"
            onClick={() => floorPlanRef.current?.click()}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 16px', border: '1px solid #4F46E5',
              borderRadius: 10, background: 'white', cursor: 'pointer',
              fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#4F46E5',
            }}
          >
            <PaperclipIcon />
            Attach a floor plan
          </button>
        </div>
      </section>

      {/* ── SECTION 2: UPLOAD PHOTO ──────────────────────────────────────── */}
      <section className="no-section no-section--upload" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="no-section__header" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="no-section__title" style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 16,
            color: '#000B14', lineHeight: 1.4, margin: 0,
          }}>
            2. UPLOAD PHOTO*
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 12,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Minimum upload dimension size: 1000×1000 pixels
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 12,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Accepted file formats: png, jpeg, jpg
          </p>
        </div>

        <div className="no-upload-card" style={{
          background: '#FAFAFA', border: '1px solid #D6D8D9', borderRadius: 12,
          padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
          boxSizing: 'border-box',
        }}>
          {/* Title + counter + progress */}
          <div className="no-upload-card__info" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h3 className="no-upload-card__title" style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: '#000B14',
              margin: 0, lineHeight: 1.4,
            }}>
              Virtual Staging
            </h3>
            <div className="no-upload-card__counter-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="no-upload-card__counter" style={{
                fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#4F46E5', lineHeight: 1.4,
              }}>
                {uploadedFiles.length}/{MAX_PHOTOS} Uploaded
              </span>
              <div className="no-progress" style={{ height: 4, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
                <div className="no-progress__fill" style={{
                  height: '100%', width: `${uploadProgress}%`, background: '#4F46E5',
                  borderRadius: 99, transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </div>

          {/* Paste a link */}
          <button className="no-paste-link-btn" type="button" style={{
            display: 'flex', alignItems: 'center', gap: 4, background: 'none',
            border: 'none', cursor: 'pointer', padding: 0, alignSelf: 'flex-start',
            fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#000B14',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}>
            Or paste a link to upload
            <ExternalLinkIcon />
          </button>

          {/* Drop zone */}
          <input
            className="no-file-input"
            ref={fileInputRef}
            type="file"
            accept=".png,.jpeg,.jpg"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button
            className={`no-dropzone${isDragging ? ' no-dropzone--dragging' : ''}`}
            type="button"
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%', height: 224,
              background: isDragging ? '#F5F3FF' : 'white',
              border: `2px dashed ${isDragging ? '#4F46E5' : '#D6D8D9'}`,
              borderRadius: 16, cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 14, padding: 24, boxSizing: 'border-box',
              transition: 'all 0.15s ease',
            }}
          >
            <MobileUploadIcon />
            <div className="no-dropzone__text-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span className="no-dropzone__drag-text" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#4F46E5' }}>
                Drag &amp; drop to upload photos
              </span>
              <span className="no-dropzone__or-text" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#4F46E5' }}>
                OR
              </span>
            </div>
            <div className="no-dropzone__select-btn" style={{ background: '#4F46E5', borderRadius: 6, padding: '8px 16px' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#FFFDFF' }}>
                Select files to upload
              </span>
            </div>
          </button>

          {/* Uploaded file chips */}
          {uploadedFiles.length > 0 && (
            <div className="no-file-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {uploadedFiles.map((file, i) => (
                <div key={i} className="no-file-chip" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F5F3FF', borderRadius: 6, padding: '4px 10px',
                  border: '1px solid #C7D2FE',
                }}>
                  <span className="no-file-chip__name" style={{
                    fontFamily: 'Inter', fontSize: 12, color: '#4F46E5',
                    maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {file.name}
                  </span>
                  <button
                    className="no-file-chip__remove"
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

      {/* ── AI SMART PICK BUTTON — hidden after confirm ───────────────────── */}
      {!aiPickResult && (
        <button
          className="no-ai-smart-pick-btn"
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          style={{
            width: '100%', height: 48, background: '#4F46E5',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          AI Smart Pick
        </button>
      )}

      {/* ── AI SMART PICK MODAL ───────────────────────────────────────────── */}
      <AiSmartPickModal
        isOpen={isAiModalOpen}
        hasPropertyInfo={!!propertyType}
        onClose={() => setIsAiModalOpen(false)}
        onConfirm={(option) => {
          setAiPickResult(option);
          setIsAiModalOpen(false);
        }}
      />

      {/* ── SECTION 3: CHOOSE A BRAND WITH ITS STYLE ────────────────────── */}
      <section className="no-section no-section--brand" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="no-section__header" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="no-section__title" style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 16,
            color: '#000B14', lineHeight: 1.4, margin: 0,
          }}>
            3. CHOOSE A BRAND WITH ITS STYLE*
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 14,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            {`Select a brand with its style to present your preferences. We'll stage your uploaded photo to reflect that same furniture and aesthetic.`}
          </p>
        </div>

        {/* After AI confirm: result card */}
        {aiPickResult ? (
          <div className="no-ai-pick-result" style={{
            background: '#EFF2FE', border: '1px solid #4F46E5',
            borderRadius: 12, padding: 20,
            display: 'flex', flexDirection: 'column', gap: 16,
            boxSizing: 'border-box',
          }}>
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{
                fontFamily: 'Inter', fontSize: 16, fontWeight: 600,
                color: '#000B14', margin: 0, lineHeight: 1.4,
              }}>
                Style from AI Smart Pick
              </p>
              <button
                className="no-ai-pick-result__close"
                type="button"
                onClick={() => { setAiPickResult(null); setSelectedBrand(null); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 6, borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#000B14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Option info row */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: '#4F46E5', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{
                fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
                color: '#000B14', margin: 0, lineHeight: '22.4px',
              }}>
                Option #{aiPickResult.optionIdx}:{' '}
                <span style={{ fontWeight: 700 }}>{aiPickResult.brand}</span>
              </p>
            </div>

            {/* 1 large image + "+2" overlay — not scrollable per Figma */}
            {aiPickResult.rooms.length > 0 && (
              <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 12, overflow: 'hidden' }}>
                <img
                  src={aiPickResult.rooms[0].img}
                  alt={aiPickResult.rooms[0].label}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Room label footer */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 27,
                  background: '#FFFDFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#000B14', margin: 0 }}>
                    {aiPickResult.rooms[0].label}
                  </p>
                </div>
                {/* "+2" badge when more than 1 room */}
                {aiPickResult.rooms.length > 1 && (
                  <div style={{
                    position: 'absolute', bottom: 27, right: 0,
                    width: 40, height: 36,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: 'white',
                    }}>
                      +{aiPickResult.rooms.length - 1}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Select a Brand Manually */}
            <button
              className="no-ai-pick-result__reset-btn"
              type="button"
              onClick={() => { setAiPickResult(null); setSelectedBrand(null); }}
              style={{
                width: '100%',
                border: '1px solid #4F46E5', borderRadius: 6,
                background: 'none', cursor: 'pointer',
                padding: '12px 16px',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: '#4F46E5',
              }}
            >
              Select a Brand Manually
            </button>
          </div>

        ) : (
          /* Brand grid — Mobile: 2 per row */
          <div className="no-brand-grid no-brand-grid--mobile" style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            boxSizing: 'border-box',
          }}>
            {[0, 2, 4, 6, 8, 10].map(startIdx => (
              <div
                key={startIdx}
                className="no-brand-grid__row"
                style={{ display: 'flex', gap: 8 }}
              >
                {BRAND_STYLES.slice(startIdx, startIdx + 2).map(brand => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    isSelected={selectedBrand === brand.id}
                    onSelect={() => setSelectedBrand(brand.id === selectedBrand ? null : brand.id)}
                    cardWidth={'calc((100% - 8px) / 2)'}
                    cardHeight={150}
                    footerFontSize={10}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── TERMS CHECKBOX ───────────────────────────────────────────────── */}
      <div className="no-terms" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%' }}>
        <button
          className="no-terms__checkbox-btn"
          type="button"
          onClick={() => setAgreedToTerms(v => !v)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 1 }}
          aria-label="Agree to terms and condition"
        >
          {agreedToTerms ? <CheckRChecked /> : <CheckRIcon />}
        </button>
        <p className="no-terms__text" style={{
          fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#858A8E',
          lineHeight: 1.4, margin: 0,
        }}>
          By clicking you are confirming that you have read, understood and agree to our{' '}
          <a className="no-terms__link" href="#" style={{ color: '#858A8E', textDecoration: 'underline', fontFamily: 'Inter', fontWeight: 400, fontSize: 14 }}>
            Terms and Condition
          </a>
        </p>
      </div>

      {/* ── SUBMIT BUTTON — full width on mobile ─────────────────────────── */}
      <button
        className={`no-submit-btn${canSubmit ? ' no-submit-btn--active' : ' no-submit-btn--disabled'}`}
        type="button"
        disabled={!canSubmit}
        style={{
          width: '100%', height: 48,
          background: canSubmit ? '#000B14' : '#C1C2C3',
          border: 'none', borderRadius: 10,
          fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'white',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s ease',
        }}
      >
        Submit
      </button>

    </div>
  );
}
