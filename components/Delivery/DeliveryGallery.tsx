'use client';

import React, { useState, useEffect } from 'react';
import { useDeliveryContext, DeliveryImage } from './context/DeliveryContext';
import ImageDisplay from '@/components/ImageView/ImageDisplay';

interface DeliveryGalleryProps {
  filter?: 'all' | 'in-progress'; // Filter to show only in-progress images
}

export const DeliveryGallery: React.FC<DeliveryGalleryProps> = ({ filter = 'all' }) => {
  const { state, setSelectedImage } = useDeliveryContext();
  const { highlightImages, images, selectedImage } = state;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  // Check if tablet or mobile on mount and resize (match CompletedGallery)
  useEffect(() => {
    const checkViewport = () => {
      setIsTabletOrMobile(window.innerWidth <= 761);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Filter images based on filter prop
  // 'in-progress': show images that are not accepted (includes rejected images)
  // Rejected images will show with sad face icon overlay
  const filteredImages = filter === 'in-progress' 
    ? images.filter(img => {
        const status = img.revisionStatus;
        return status && 
               status.accepted === null && // Not accepted
               status.delivered !== null; // Must be delivered
        // Note: rejected images are included (they show with sad face icon)
      })
    : images;

  // Use highlightImages if available, otherwise use filtered images
  const galleryImages = filter === 'all' && highlightImages.length > 0 
    ? highlightImages 
    : filteredImages.map((img) => img.url);

  // Helper function to get image status based on revisionStatus
  // Uses the same URL matching logic as onClick handler to ensure consistency
  const getImageStatus = (imageUrl: string): 'accepted' | 'rejected' | null => {
    // Use filtered images for status lookup
    const imageObj = findImageByUrl(imageUrl);
    
    if (!imageObj?.revisionStatus) return null;
    
    const { accepted, rejected } = imageObj.revisionStatus;
    
    // Check if accepted has a timestamp (not null and not undefined)
    if (accepted !== null && accepted !== undefined) return 'accepted';
    // Check if rejected has a timestamp (not null and not undefined)
    if (rejected !== null && rejected !== undefined) return 'rejected';
    return null;
  };

  // Helper to find image object from filtered images
  const findImageByUrl = (imageUrl: string): DeliveryImage | null => {
    // First try exact URL match from filtered images
    let imageObj = filteredImages.find((img) => img.url === imageUrl);
    
    if (!imageObj) {
      // Try to find by URL pattern (in case of encoding differences)
      imageObj = filteredImages.find((img) => {
        try {
          return decodeURIComponent(img.url) === decodeURIComponent(imageUrl) || 
                 img.url === imageUrl ||
                 img.url.includes(imageUrl.split('/').pop() || '');
        } catch {
          return false;
        }
      });
    }
    
    return imageObj || null;
  };

  // Calculate how many images per row
  // Container width: 1240px, padding: 24px * 2 = 48px, available width: 1192px
  // Image width: 262px, gap: 40px
  // Calculation: (262 * 4) + (40 * 3) = 1048 + 120 = 1168px (fits)
  // (262 * 5) + (40 * 4) = 1310 + 160 = 1470px (exceeds available width)
  const imagesPerRow = 4;
  const rows: string[][] = [];
  for (let i = 0; i < galleryImages.length; i += imagesPerRow) {
    rows.push(galleryImages.slice(i, i + imagesPerRow));
  }

  /* Same wrapper structure as CompletedGallery so both use identical CSS (display: contents rules) */
  /* Row gap matches column gap: clamp(20px, 2.78vw, 40px) - use 40px for calculation */
  const ROW_GAP = 40;
  const totalHeight = rows.length * 162 + Math.max(0, rows.length - 1) * ROW_GAP;

  // Auto-hide copy notification after 2 seconds
  useEffect(() => {
    if (copiedImageIndex !== null) {
      const timer = setTimeout(() => {
        setCopiedImageIndex(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedImageIndex]);

  // Generate shareable link for the image - return the direct image src URL from photos table
  const generateShareableLink = (imageUrl: string): string => {
    // Return the direct image URL (src from photos table)
    return imageUrl;
  };

  const handleIconClick = async (e: React.MouseEvent, action: 'link' | 'download', imageUrl: string, imageIndex: number) => {
    e.stopPropagation(); // Prevent triggering the image selection
    
    switch (action) {
      case 'link':
        // Generate shareable link and copy to clipboard - returns direct image src URL from photos table
        const shareableLink = generateShareableLink(imageUrl);
        try {
          await navigator.clipboard.writeText(shareableLink);
          setCopiedImageIndex(imageIndex);
        } catch (err) {
          console.error('Failed to copy link:', err);
          // Fallback for older browsers
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
        // Download single image file
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Extract filename from URL or generate one
          const urlPath = new URL(imageUrl).pathname;
          const filename = urlPath.split('/').pop() || `delivery-image-${Date.now()}.jpg`;
          link.download = filename;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the object URL
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error('Failed to download image:', err);
          // Fallback: direct download link
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

  return (
    <>
      {/* Same scrollbar styles as CompletedGallery (same class = same CSS) */}
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

      {/* Same section class and DOM structure as CompletedGallery so both use identical global CSS */}
      <section
        className="completed-gallery-scroll delivery-gallery-section completed-gallery-section"
        style={{
          borderRadius: '0 0 12px 12px',
          background: '#FAFAFA',
          marginTop: '0',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: `${totalHeight}px`,
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {rows.map((rowImages, rowIndex) => (
              <div key={`row-${rowIndex}`}>
                {rowImages.map((src, imageIndex) => {
              const globalIndex = rowIndex * imagesPerRow + imageIndex;
              // Check if this image is currently selected
              const isSelected = selectedImage?.url === src;
              const isHovered = hoveredIndex === globalIndex;
              const isCopied = copiedImageIndex === globalIndex;
              
              return (
                <figure
                  key={`${src}-${globalIndex}`}
                  className="delivery-gallery-image-item"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8.71px',
                    borderRadius: '12px',
                    border: isSelected 
                      ? '2px solid var(--Neutral-Dark900, #000B14)' 
                      : 'none',
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
                    // Find corresponding image object by URL (more reliable than URL matching)
                    // First try exact URL match from filtered images
                    let imageObj = filteredImages.find((img) => img.url === src);
                    
                    if (!imageObj) {
                      // Try to find by URL pattern (in case of encoding differences)
                      imageObj = filteredImages.find((img) => {
                        try {
                          return decodeURIComponent(img.url) === decodeURIComponent(src) || 
                                 img.url === src ||
                                 img.url.includes(src.split('/').pop() || '');
                        } catch {
                          return false;
                        }
                      });
                    }
                    
                    if (imageObj) {
                      console.log('Gallery: Found image object by URL:', {
                        id: imageObj.id,
                        revisionId: imageObj.revisionId,
                        hasRevisionId: !!imageObj.revisionId,
                        url: imageObj.url,
                        clickedUrl: src,
                      });
                      
                      if (!imageObj.revisionId) {
                        console.error('Gallery: Found image object but missing revisionId!', imageObj);
                      }
                      
                      setSelectedImage(imageObj);
                    } else {
                      console.warn('Gallery: Could not find image object by URL, creating temporary object:', {
                        clickedUrl: src,
                        index: globalIndex,
                        availableImages: filteredImages.map(img => ({ 
                          id: img.id, 
                          url: img.url, 
                          revisionId: img.revisionId,
                          urlMatch: img.url === src,
                        })),
                      });
                      
                      // Try to find any image with similar filename to copy revisionId
                      const srcFilename = src.split('/').pop() || '';
                      const similarImage = filteredImages.find((img) => {
                        const imgFilename = img.url.split('/').pop() || '';
                        return srcFilename === imgFilename || 
                               img.url.includes(srcFilename) ||
                               srcFilename.includes(imgFilename);
                      });
                      
                      const tempImage: DeliveryImage = {
                        id: `temp-${globalIndex}`,
                        url: src,
                        title: `Gallery ${globalIndex + 1}`,
                        ...(similarImage?.revisionId && { revisionId: similarImage.revisionId }), // Copy revisionId if found
                      };
                      
                      if (tempImage.revisionId) {
                        console.log('Gallery: Copied revisionId from similar image:', tempImage.revisionId);
                      } else {
                        console.error('Gallery: Created temporary image without revisionId!', {
                          tempImage,
                          similarImage: similarImage ? { id: similarImage.id, revisionId: similarImage.revisionId } : null,
                        });
                      }
                      
                      setSelectedImage(tempImage);
                    }
                  }}
            >
              {/* Background Image - wrapper needs class for CSS so fill image has defined size on mobile/tablet */}
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
                  src={src}
                  alt={`Gallery ${globalIndex + 1}`}
                  objectFit="cover"
                  className="h-full w-full"
                  fill
                  lazy={false}
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

              {/* Status Icon Overlay - same structure as CompletedGallery (accepted/rejected) */}
              {(() => {
                const status = getImageStatus(src);
                if (!status) return null;
                
                return (
                  <div className="absolute pointer-events-none delivery-status-icon-overlay">
                    <div
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md delivery-status-icon-container"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {status === 'accepted' ? (
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
                          style={{ flexShrink: 0, aspectRatio: '1 / 1' }}
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" y1="9" x2="9.01" y2="9" />
                          <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg>
                      ) : (
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
                          className="text-red-500 delivery-status-icon-svg"
                          style={{ flexShrink: 0, aspectRatio: '1 / 1' }}
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                          <line x1="9" y1="9" x2="9.01" y2="9" />
                          <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Link Copied notification overlay - shown when link is copied */}
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
                  onClick={(e) => handleIconClick(e, 'link', src, globalIndex)}
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
                  onClick={(e) => handleIconClick(e, 'download', src, globalIndex)}
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

              {/* Selected indicator overlay - removed since border is now handled in container style */}
            </figure>
          );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

