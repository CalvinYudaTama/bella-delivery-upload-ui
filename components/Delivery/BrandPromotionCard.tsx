'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { brandService, type PromotionItem } from '@/services/brandService';
import { getBrandConfig } from '@/config/brandConfig';
import { PROJECT_URLS } from '@/config/url.config';

/** Map display brand name (e.g. ROVECONCEPTS, Gus*) to config name for logo lookup */
const BRAND_NAME_TO_CONFIG: Record<string, string> = {
  'ROVECONCEPTS': 'Rove Concepts',
  'Gus*': 'Gus Modern',
  'KING': 'King Living',
};
function getLogoForBrand(brandName: string): string | null {
  const configName = BRAND_NAME_TO_CONFIG[brandName] ?? brandName;
  const config = getBrandConfig(configName);
  return config?.logo ?? null;
}

interface BrandPromotionCardProps {
  isOpen?: boolean;
  onClose?: () => void;
  projectId?: string | null;
  showDefaultImmediately?: boolean; // If true, show default cards immediately without waiting for data
}

const BrandPromotionCard: React.FC<BrandPromotionCardProps> = ({ 
  isOpen = true, 
  onClose,
  projectId,
  showDefaultImmediately = false
}) => {
  const [promotionItems, setPromotionItems] = useState<PromotionItem[]>([]);
  // Start with loading true so we don't flash default cards before fetch completes when projectId is set
  const [isLoading, setIsLoading] = useState(true);

  // Fetch promotion items from database when projectId is available
  useEffect(() => {
    const fetchPromotionItems = async () => {
      if (!projectId || !isOpen) {
        setPromotionItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const items = await brandService.getPromotionItemsByProject(projectId);
        setPromotionItems(items);
      } catch (error) {
        console.error('Error fetching promotion items:', error);
        setPromotionItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotionItems();
  }, [projectId, isOpen]);

  if (!isOpen) return null;

  // Default brand cards when no promotion items are available (discount hidden in UI; 15-60% is fixed in intro text)
  const defaultBrandCards: PromotionItem[] = [
    { brand: 'Rove Concept', room: 'Living Room', discount: '' },
    { brand: 'Gus Modern', room: 'Bedroom', discount: '' },
    { brand: 'EQ3', room: 'Dining', discount: '' },
    { brand: 'King Living', room: 'Bathroom', discount: '' },
  ];

  // While loading (with projectId) and not in shop mode: show no cards to avoid flashing default then real.
  // In shop mode (showDefaultImmediately): show default cards immediately while loading.
  // After load: show fetched brands if any, otherwise default cards.
  const displayItems =
    isLoading && projectId && !showDefaultImmediately
      ? []
      : promotionItems.length > 0
        ? promotionItems
        : defaultBrandCards;

  return (
    <div 
      className="animate-slide-down brand-promotion-card"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        display: 'flex',
        padding: '25.6px', // 32px * 0.8
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '28.8px', // 36px * 0.8
        borderRadius: '4.8px 0 0 4.8px', // 6px * 0.8
        background: 'var(--Neutral-Light100, #FAFAFA)',
        boxShadow: '0 3.2px 3.2px 0 rgba(0, 0, 0, 0.25)', // 4px * 0.8
        zIndex: 10000
      }}
    >
      {/* Header: Get The Look + close */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'stretch'
        }}
      >
        <h2
          style={{
            color: '#0A0A0A',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '140%',
            margin: 0
          }}
        >
          Get The Look
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>

      {/* Divider: 16px below header, full-bleed to card left/right edges (ignore root padding) */}
      <div
        style={{
          marginTop: '16px',
          marginLeft: '-25.6px',
          marginRight: '-25.6px',
          width: 'calc(100% + 51.2px)',
          borderBottom: '1px solid var(--Colors-Border-border-secondary, #E9EAEB)'
        }}
      />

      {/* Container: message + brand cards */}
      <div
        style={{
          display: 'flex',
          padding: '6px var(--Spacing-spacing-lg, 20px)',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 'var(--Spacing-3, 16px)',
          alignSelf: 'stretch'
        }}
      >
        {/* Intro message - Fixed 15-60% range */}
        <div
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '140%',
            alignSelf: 'stretch'
          }}
        >
          Contact us to unlock exclusive 15-60% discounts from our trusted brand partners. Terms and conditions apply.
        </div>

        {/* Scrollable container: min 1 card height, max 4 cards height, height adapts to content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--Spacing-3, 16px)',
            alignSelf: 'stretch',
            overflowY: 'auto',
            minHeight: '112px',
            maxHeight: '500px'
          }}
        >
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#52595F' }}>
            Loading...
          </div>
        ) : null}
        {displayItems.map((item, index) => {
          const logoUrl = getLogoForBrand(item.brand);
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                padding: 'var(--Spacing-spacing-md, 16px)',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--Spacing-spacing-sm, 8px)',
                alignSelf: 'stretch',
                flexShrink: 0,
                borderRadius: '8px',
                background: '#FFF',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 3px -1px rgba(0, 0, 0, 0.14)'
              }}
            >
              {/* Brand partner logo (black) - container height 20px, width auto */}
              <div style={{ height: '50px', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={item.brand}
                    width={120}
                    height={40}
                    style={{ width: 'auto', height: '50px', objectFit: 'contain' }}
                    unoptimized
                  />
                ) : (
                  <span style={{ color: '#000', fontFamily: 'Inter', fontSize: '14px', fontWeight: 700 }}>{item.brand}</span>
                )}
              </div>
              {/* Room type - S Universal body regular */}
              <div
                style={{
                  color: '#000',
                  textAlign: 'center',
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                {item.room}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Contact Us Button */}
      <a
        href={PROJECT_URLS.CONTACT_US}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '100%',
          padding: '12.8px 19.2px', // 16px 24px * 0.8
          backgroundColor: '#000B14',
          color: 'var(--Neutral-Light0, #FFF)',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '16px', // 20px * 0.8
          letterSpacing: '0.128px', // 0.16px * 0.8
          borderRadius: '6.4px', // 8px * 0.8
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          textDecoration: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#212121';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000B14';
        }}
      >
        Contact us
      </a>
    </div>
  );
};

export default BrandPromotionCard;
