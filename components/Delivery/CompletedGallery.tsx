'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDeliveryContext, DeliveryImage } from './context/DeliveryContext';
import ImageDisplay from '@/components/ImageView/ImageDisplay';

interface CompletedGalleryProps {
  onImageClick?: (image: DeliveryImage) => void;
}

/**
 * CompletedGallery Component
 * 
 * Displays all historically accepted images in a vertically scrollable gallery
 * with virtual scrolling for performance (only renders visible rows).
 * 
 * Features:
 * - Virtual scrolling (renders only visible rows + buffer)
 * - 4 images per row
 * - Same styling as DeliveryGallery
 * - Link and download functionality
 * - Status icons (accepted)
 */
export const CompletedGallery: React.FC<CompletedGalleryProps> = ({ onImageClick }) => {
  const { state } = useDeliveryContext();
  const { completedImages } = state;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsTabletOrMobile(window.innerWidth <= 761);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Virtual scrolling configuration
  const IMAGES_PER_ROW = 4;
  const ROW_GAP = 40; // Matches column gap: clamp(20px, 2.78vw, 40px)
  const ROW_HEIGHT = 162 + ROW_GAP; // For scroll position calculation
  const VISIBLE_ROWS_BUFFER = 2; // Render 2 extra rows above and below viewport

  // Calculate rows from completed images
  const rows = useMemo(() => {
    const rowArray: DeliveryImage[][] = [];
    for (let i = 0; i < completedImages.length; i += IMAGES_PER_ROW) {
      rowArray.push(completedImages.slice(i, i + IMAGES_PER_ROW));
    }
    return rowArray;
  }, [completedImages]);

  // Virtual scrolling state
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

  // Calculate visible rows based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      
      const viewportHeight = container.clientHeight;
      const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - VISIBLE_ROWS_BUFFER);
      const endRow = Math.min(
        rows.length - 1,
        Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + VISIBLE_ROWS_BUFFER
      );
      
      setVisibleRange({ start: startRow, end: endRow });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [rows.length, ROW_HEIGHT, VISIBLE_ROWS_BUFFER]);

  // Auto-hide copy notification after 2 seconds
  useEffect(() => {
    if (copiedImageIndex !== null) {
      const timer = setTimeout(() => {
        setCopiedImageIndex(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedImageIndex]);

  // Generate shareable link
  const generateShareableLink = (imageUrl: string): string => {
    return imageUrl;
  };

  const handleIconClick = async (e: React.MouseEvent, action: 'link' | 'download', imageUrl: string, imageIndex: number) => {
    e.stopPropagation();
    
    switch (action) {
      case 'link':
        const shareableLink = generateShareableLink(imageUrl);
        try {
          await navigator.clipboard.writeText(shareableLink);
          setCopiedImageIndex(imageIndex);
        } catch (err) {
          console.error('Failed to copy link:', err);
          const textArea = document.createElement('textarea');
          textArea.value = shareableLink;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            setCopiedImageIndex(imageIndex);
          } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
        break;
      case 'download':
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const urlPath = new URL(imageUrl).pathname;
          const filename = urlPath.split('/').pop() || `delivery-image-${Date.now()}.jpg`;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error('Failed to download image:', err);
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `delivery-image-${Date.now()}.jpg`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        break;
    }
  };

  // Calculate total height for virtual scrolling (rows + gaps between them)
  const totalHeight = rows.length * 162 + Math.max(0, rows.length - 1) * ROW_GAP;
  
  // Calculate offset for visible rows
  const offsetY = visibleRange.start * ROW_HEIGHT;

  // Get visible rows
  const visibleRows = rows.slice(visibleRange.start, visibleRange.end + 1);

  return (
    <>
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .completed-gallery-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .completed-gallery-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .completed-gallery-scroll::-webkit-scrollbar-thumb {
          width: 10px;
          height: 425px;
          border-radius: 2px;
          background: var(--Neutral-Light300, #D6D8D9);
        }
        .completed-gallery-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--Neutral-Light300, #D6D8D9);
        }
        .completed-gallery-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--Neutral-Light300, #D6D8D9) transparent;
        }
      `}</style>

      <section 
        ref={scrollContainerRef}
        className="completed-gallery-scroll delivery-gallery-section completed-gallery-section"
        style={{
          borderRadius: '0 0 12px 12px',
          background: '#FAFAFA',
          marginTop: '0',
          position: 'relative',
        }}
      >
        {/* Virtual scrolling container */}
        <div
          style={{
            height: `${totalHeight}px`,
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Visible rows container */}
          <div
            style={{
              position: 'absolute',
              top: `${offsetY}px`,
              left: 0,
              right: 0,
            }}
          >
            {visibleRows.map((rowImages, relativeRowIndex) => {
              const absoluteRowIndex = visibleRange.start + relativeRowIndex;
              
              return (
                <div
                  key={`row-${absoluteRowIndex}`}
                >
                  {rowImages.map((image, imageIndex) => {
                    const globalIndex = absoluteRowIndex * IMAGES_PER_ROW + imageIndex;
                    const isHovered = hoveredIndex === globalIndex;
                    const isCopied = copiedImageIndex === globalIndex;
                    
                    return (
                      <figure
                        key={`${image.url}-${globalIndex}`}
                        className="delivery-gallery-image-item"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '8.71px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'lightgray',
                          position: 'relative',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxSizing: 'border-box',
                        }}
                        onMouseEnter={() => setHoveredIndex(globalIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => {
                          if (onImageClick) {
                            onImageClick(image);
                          }
                        }}
                      >
                        {/* Background Image - same class as DeliveryGallery for consistent CSS on mobile/tablet */}
                        <div
                          className="delivery-gallery-image-inner"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 0,
                          }}
                        >
                          <ImageDisplay
                            src={image.url}
                            alt={`Completed ${globalIndex + 1}`}
                            objectFit="cover"
                            className="h-full w-full"
                            fill
                            lazy={true}
                            showLoadingState={true}
                            showErrorState={true}
                            sizes={isTabletOrMobile ? "(max-width: 761px) 33vw, (max-width: 431px) 33vw, 262px" : "262px"}
                          />
                        </div>
                        
                        {/* Hover gradient overlay */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                            isHovered || isCopied ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 100%)',
                            zIndex: 1,
                          }}
                        />

                        {/* Accepted Status Icon (always shown for completed images) */}
                        <div className="absolute pointer-events-none delivery-status-icon-overlay">
                          <div
                            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md delivery-status-icon-container"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {/* Green smile icon (accepted) */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-green-500 delivery-status-icon-svg"
                              style={{
                                flexShrink: 0,
                                aspectRatio: '1 / 1',
                              }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                              <line x1="9" y1="9" x2="9.01" y2="9" />
                              <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                          </div>
                        </div>

                        {/* Link Copied notification */}
                        {isCopied && (
                          <div
                            className="absolute inset-0 flex items-end pointer-events-none transition-opacity duration-300"
                            style={{
                              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.40) 100%)',
                              zIndex: 2,
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                              }}
                            >
                              <span
                                className="delivery-link-copied-text"
                                style={{
                                  color: 'var(--Color-Grey-50, #FFF)',
                                  fontFamily: 'Inter',
                                  fontSize: '16px',
                                  fontStyle: 'normal',
                                  fontWeight: 700,
                                  lineHeight: '20px',
                                  letterSpacing: '0.16px',
                                }}
                              >
                                Link Copied!
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Icons container - bottom-right, 12px from image bottom/right */}
                        <div
                          className={`delivery-gallery-action-icons-wrapper absolute flex items-center justify-end gap-4 transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            zIndex: 3,
                          }}
                        >
                          {/* Link icon */}
                          <button
                            onClick={(e) => handleIconClick(e, 'link', image.url, globalIndex)}
                            className="delivery-gallery-action-icon pointer-events-auto p-2 rounded hover:bg-white/20 transition-colors"
                            aria-label="Copy shareable link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                          </button>

                          {/* Download icon */}
                          <button
                            onClick={(e) => handleIconClick(e, 'download', image.url, globalIndex)}
                            className="delivery-gallery-action-icon pointer-events-auto p-2 rounded hover:bg-white/20 transition-colors"
                            aria-label="Download image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        </div>
                      </figure>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
