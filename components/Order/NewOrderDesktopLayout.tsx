'use client';

import React from 'react';
import AiSmartPickModal from './AiSmartPickModal';
import {
  NewOrderLayoutProps,
  PROPERTY_TYPES, BUYER_PROFILES, INTENDED_USES, MAX_PHOTOS, BRAND_STYLES,
  HouseIcon, PersonIcon, TagIcon, LocationIcon, LinkIcon,
  PaperclipIcon, UploadCloudIcon, ExternalLinkIcon, CheckRIcon, CheckRChecked,
  Dropdown, BrandCard,
} from './NewOrderContent';

export default function NewOrderDesktopLayout({
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
}: NewOrderLayoutProps) {
  return (
    <div
      className="no-page"
      onClick={closeAllDropdowns}
      style={{
        display: 'flex', flexDirection: 'column', gap: 40,
        padding: '40px 48px 60px',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box', width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >

      {/* ── SECTION 1: PROPERTY INFO ────────────────────────────────────── */}
      <section className="no-section no-section--property">
        {/* Header */}
        <div className="no-section__header" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          <p className="no-section__title" style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 18,
            color: '#000B14', lineHeight: 1.4, margin: 0,
          }}>
            1. PROPERTY INFO
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 16,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Provide the property information will help AI designer generate better result.
          </p>
        </div>

        {/* Card */}
        <div className="no-property-card" style={{
          background: '#FAFAFA', border: '1px solid #D6D8D9', borderRadius: 12,
          padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14,
          boxSizing: 'border-box',
        }}>

          {/* Row 1: 3 dropdowns */}
          <div className="no-property-card__dropdowns" style={{ display: 'flex', gap: 16 }}>
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
          <div className="no-property-card__inputs" style={{ display: 'flex', gap: 16 }}>
            <div className="no-input-wrapper no-input-wrapper--address" style={{
              flex: 1, height: 42, display: 'flex', alignItems: 'center', gap: 8,
              background: 'white', border: '2px solid #ECEFF0', borderRadius: 6,
              padding: '4px 16px', boxSizing: 'border-box',
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
                  fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#858A8E',
                }}
              />
            </div>
            <div className="no-input-wrapper no-input-wrapper--mls" style={{
              flex: 1, height: 42, display: 'flex', alignItems: 'center', gap: 8,
              background: 'white', border: '2px solid #ECEFF0', borderRadius: 6,
              padding: '4px 16px', boxSizing: 'border-box',
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
          </div>

          {/* Attach floor plan */}
          <div className="no-floor-plan">
            <input
              className="no-floor-plan__input"
              ref={floorPlanRef}
              type="file"
              style={{ display: 'none' }}
              onChange={() => {/* TODO: handle floor plan upload */}}
            />
            <button
              className="no-floor-plan__btn"
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
      <section className="no-section no-section--upload" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Header */}
        <div className="no-section__header" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="no-section__title" style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 18,
            color: '#000B14', lineHeight: 1.4, margin: 0,
          }}>
            2. UPLOAD PHOTOS*
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 16,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            Minimum upload dimension size: 1000×1000 pixels. Accepted file formats: png, jpeg, jpg
          </p>
        </div>

        {/* Card */}
        <div className="no-upload-card" style={{
          background: '#FAFAFA', border: '1px solid #D6D8D9', borderRadius: 12,
          padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16,
          boxSizing: 'border-box',
        }}>
          {/* Card header row */}
          <div className="no-upload-card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Left: title + counter + progress */}
            <div className="no-upload-card__info" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h3 className="no-upload-card__title" style={{
                fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: '#000B14',
                margin: 0, lineHeight: 1.4,
              }}>
                Virtual Staging
              </h3>
              <div className="no-upload-card__counter-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="no-upload-card__counter" style={{
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 400, color: '#4F46E5',
                  lineHeight: 1.4,
                }}>
                  {uploadedFiles.length}/{MAX_PHOTOS} Uploaded
                </span>
                {/* Progress bar */}
                <div className="no-progress" style={{ width: 180, height: 6, display: 'flex', alignItems: 'center' }}>
                  <div className="no-progress__track" style={{ position: 'relative', width: '100%', height: 4, background: '#E5E7EB', borderRadius: 99 }}>
                    <div className="no-progress__fill" style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${uploadProgress}%`, background: '#4F46E5',
                      borderRadius: 99, transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: paste a link */}
            <button className="no-paste-link-btn" type="button" style={{
              display: 'flex', alignItems: 'center', gap: 5, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#000B14',
              textDecoration: 'underline', textUnderlineOffset: 2,
            }}>
              Or paste a link to upload
              <ExternalLinkIcon />
            </button>
          </div>

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
              width: '100%', height: 260,
              background: isDragging ? '#F5F3FF' : 'white',
              border: `1.5px dashed ${isDragging ? '#4F46E5' : '#C8CACC'}`,
              borderRadius: 12, cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 14, padding: 24, boxSizing: 'border-box',
              transition: 'all 0.15s ease',
            }}
          >
            <UploadCloudIcon />
            <div className="no-dropzone__text-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span className="no-dropzone__drag-text" style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#4F46E5' }}>
                Drag &amp; drop to upload photos
              </span>
              <span className="no-dropzone__or-text" style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#4F46E5' }}>
                OR
              </span>
            </div>
            <div className="no-dropzone__select-btn" style={{
              background: '#4F46E5', borderRadius: 6, padding: '8px 16px',
            }}>
              <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#FFFDFF' }}>
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
                    maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
            width: '100%', height: 52, background: '#4F46E5',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            letterSpacing: '0.01em',
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
      <section className="no-section no-section--brand" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Header */}
        <div className="no-section__header" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="no-section__title" style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 18,
            color: '#000B14', lineHeight: 1.4, margin: 0,
          }}>
            3. CHOOSE A BRAND WITH ITS STYLE*
          </p>
          <p className="no-section__subtitle" style={{
            fontFamily: 'Inter', fontWeight: 400, fontSize: 16,
            color: '#858A8E', lineHeight: 1.4, margin: 0,
          }}>
            {`Select a brand using choose Style to present your preferences. We'll stage your uploaded photo to reflect that same furniture and aesthetic.`}
          </p>
        </div>

        {/* ── After AI Smart Pick confirm: show result card ── */}
        {aiPickResult ? (
          <div
            className="no-ai-pick-result"
            style={{
              background: '#EFF2FE',
              border: '1px solid #4F46E5',
              borderRadius: 12,
              padding: 24,
              display: 'flex', flexDirection: 'column', gap: 24,
              boxSizing: 'border-box',
            }}
          >
            {/* Card header: title + X close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{
                fontFamily: 'Inter', fontSize: 18, fontWeight: 600,
                color: '#000B14', margin: 0, lineHeight: '22.4px',
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

            {/* Card content: left info + right room images */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>

              {/* Left: option info + "Select a Brand Manually" reset button */}
              <div
                className="no-ai-pick-result__left"
                style={{
                  flex: 1, minWidth: 0,
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', gap: 16,
                  alignSelf: 'stretch',
                }}
              >
                {/* Option row: blue filled circle + option text */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#4F46E5', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <p style={{
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                      color: '#000B14', margin: 0, lineHeight: '22.4px',
                    }}>
                      Option #{aiPickResult.optionIdx}
                    </p>
                    <p style={{
                      fontFamily: 'Inter', fontSize: 16, fontWeight: 400,
                      color: '#000B14', margin: 0, lineHeight: '22.4px',
                    }}>
                      {aiPickResult.brand} × {aiPickResult.tag}
                    </p>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  className="no-ai-pick-result__reset-btn"
                  type="button"
                  onClick={() => { setAiPickResult(null); setSelectedBrand(null); }}
                  style={{
                    alignSelf: 'flex-start',
                    border: '1px solid #4F46E5', borderRadius: 6,
                    background: 'none', cursor: 'pointer',
                    padding: '8px 16px',
                    fontFamily: 'Inter', fontSize: 16, fontWeight: 700,
                    color: '#4F46E5', lineHeight: '22px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Select a Brand Manually
                </button>
              </div>

              {/* Right: 3 room images — desktop: normal flex wrap, no slider */}
              <div
                className="no-ai-pick-result__rooms"
                style={{ flex: 3, display: 'flex', gap: 12, flexWrap: 'wrap', borderRadius: 12 }}
              >
                {aiPickResult.rooms.map((room, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 0, height: 150, borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
                    <img src={room.img} alt={room.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 27, background: '#FFFDFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 400, color: '#000B14', margin: 0, letterSpacing: '0.12px', lineHeight: '18px' }}>
                        {room.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        ) : (
          /* Brand grid — Desktop: 4 per row, flex-fill cards */
          <div className="no-brand-grid" style={{
            display: 'flex', flexDirection: 'column', gap: 14,
            boxSizing: 'border-box',
          }}>
            {[0, 4, 8].map(startIdx => (
              <div
                key={startIdx}
                className="no-brand-grid__row"
                style={{ display: 'flex', gap: 14 }}
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
        )}
      </section>

      {/* ── TERMS CHECKBOX ───────────────────────────────────────────────── */}
      <div className="no-terms" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%' }}>
        <button
          className="no-terms__checkbox-btn"
          type="button"
          onClick={() => setAgreedToTerms(v => !v)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 1 }}
          aria-label="Agree to terms and services"
        >
          {agreedToTerms ? <CheckRChecked /> : <CheckRIcon />}
        </button>
        <p className="no-terms__text" style={{
          fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#000B14',
          lineHeight: 1.4, margin: 0,
        }}>
          By clicking, you are confirming that you have read, understand and agree to{' '}
          <a className="no-terms__link" href="#" style={{ color: '#000B14', textDecoration: 'underline', fontFamily: 'Inter', fontWeight: 400, fontSize: 14 }}>
            Terms and Services
          </a>
        </p>
      </div>

      {/* ── SUBMIT BUTTON ────────────────────────────────────────────────── */}
      <div className="no-submit-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button
          className={`no-submit-btn${canSubmit ? ' no-submit-btn--active' : ' no-submit-btn--disabled'}`}
          type="button"
          disabled={!canSubmit}
          style={{
            width: 140,
            background: canSubmit ? '#000B14' : '#C1C2C3',
            border: 'none', borderRadius: 8,
            padding: '12px 24px',
            fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'white',
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
