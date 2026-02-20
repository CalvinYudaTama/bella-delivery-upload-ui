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

              {/* Face icon — top right, Figma assets (consistent with Latest Revision page) */}
              {(() => {
                const status = getImageStatus(src);
                if (!status) return null;
                return (
                  <div
                    className="absolute pointer-events-none"
                    style={{ top: '8px', right: '8px', width: '40px', height: '40px', zIndex: 2 }}
                  >
                    <img
                      src={status === 'accepted'
                        ? '/images/delivery/face-happy.svg'
                        : '/images/delivery/face-sad.svg'
                      }
                      alt={status === 'accepted' ? 'approved' : 'in progress'}
                      style={{ width: '40px', height: '40px' }}
                    />
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

              {/* Action icons — bottom RIGHT, Figma-precise SVGs (consistent with Latest Revision) */}
              <div
                className={`absolute flex items-center transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ bottom: '10px', right: '10px', gap: '6px', zIndex: 3 }}
              >
                {/* View icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="pointer-events-auto"
                  aria-label="View image"
                  style={{ width: '32px', height: '32px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.8729 15.6096C25.6942 15.3652 21.4371 9.625 15.9999 9.625C10.5627 9.625 6.30539 15.3652 6.12691 15.6094C5.9577 15.8413 5.9577 16.1558 6.12691 16.3876C6.30539 16.632 10.5627 22.3723 15.9999 22.3723C21.4371 22.3723 25.6942 16.632 25.8729 16.3878C26.0423 16.156 26.0423 15.8413 25.8729 15.6096ZM15.9999 21.0536C11.9949 21.0536 8.52606 17.2437 7.49922 15.9982C8.52473 14.7516 11.9863 10.9437 15.9999 10.9437C20.0048 10.9437 23.4733 14.7529 24.5006 15.9991C23.4751 17.2456 20.0135 21.0536 15.9999 21.0536Z" fill="white"/>
                    <path d="M15.999 12.0449C13.8177 12.0449 12.043 13.8197 12.043 16.001C12.043 18.1823 13.8177 19.957 15.999 19.957C18.1804 19.957 19.9551 18.1823 19.9551 16.001C19.9551 13.8197 18.1804 12.0449 15.999 12.0449ZM15.999 18.6383C14.5447 18.6383 13.3617 17.4552 13.3617 16.001C13.3617 14.5467 14.5448 13.3636 15.999 13.3636C17.4533 13.3636 18.6364 14.5467 18.6364 16.001C18.6364 17.4552 17.4533 18.6383 15.999 18.6383Z" fill="white"/>
                  </svg>
                </button>

                {/* Link / Copy icon */}
                <button
                  onClick={(e) => handleIconClick(e, 'link', src, globalIndex)}
                  className="pointer-events-auto"
                  aria-label="Copy shareable link"
                  style={{ width: '32px', height: '32px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip_dg_link)">
                      <path d="M16.612 19.0598L14.1639 21.508C13.1514 22.5205 11.5041 22.5206 10.4916 21.5081C10.0012 21.0176 9.73111 20.3655 9.73111 19.672C9.73111 18.9785 10.0012 18.3265 10.4915 17.836L12.9397 15.3877C13.2777 15.0497 13.2777 14.5016 12.9397 14.1636C12.6017 13.8257 12.0536 13.8257 11.7156 14.1636L9.26752 16.6118C8.44997 17.4297 8 18.5163 8 19.672C8 20.8279 8.45015 21.9147 9.26758 22.7322C10.1113 23.5758 11.2195 23.9977 12.3278 23.9977C13.436 23.9977 14.5443 23.5758 15.3879 22.7322L17.836 20.2839C18.174 19.9459 18.174 19.3979 17.836 19.0598C17.4981 18.7219 16.9501 18.7219 16.612 19.0598Z" fill="white"/>
                      <path d="M23.9999 12.3277C23.9999 11.1717 23.5497 10.0849 22.7323 9.26746C21.0448 7.58009 18.2992 7.58015 16.6119 9.26746L14.1637 11.7157C13.8256 12.0537 13.8256 12.6018 14.1637 12.9398C14.5017 13.2778 15.0497 13.2778 15.3877 12.9398L17.8361 10.4915C18.8484 9.47917 20.4957 9.47912 21.5082 10.4915C21.9986 10.982 22.2688 11.6341 22.2688 12.3277C22.2688 13.0211 21.9987 13.6731 21.5084 14.1636L19.0601 16.6119C18.7221 16.9499 18.7221 17.498 19.0602 17.836C19.3982 18.174 19.9462 18.174 20.2842 17.836L22.7328 15.3873C23.5499 14.57 23.9999 13.4833 23.9999 12.3277Z" fill="white"/>
                      <path d="M12.9391 19.0613C13.3081 19.4303 13.9081 19.4303 14.1631 19.0613L19.0594 14.165C19.3974 13.8271 19.3974 13.279 19.0594 12.941C18.7214 12.603 18.1734 12.603 17.8353 12.941L12.9391 17.8372C12.601 18.1753 12.601 18.7233 12.9391 19.0613Z" fill="white"/>
                    </g>
                    <defs><clipPath id="clip_dg_link"><rect width="16" height="16" fill="white" transform="translate(8 8)"/></clipPath></defs>
                  </svg>
                </button>

                {/* Download icon */}
                <button
                  onClick={(e) => handleIconClick(e, 'download', src, globalIndex)}
                  className="pointer-events-auto"
                  aria-label="Download image"
                  style={{ width: '32px', height: '32px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 18.6813C15.9 18.6813 15.8063 18.6658 15.7188 18.6348C15.6312 18.6038 15.55 18.5505 15.475 18.475L12.775 15.775C12.625 15.625 12.553 15.45 12.559 15.25C12.565 15.05 12.637 14.875 12.775 14.725C12.925 14.575 13.1033 14.497 13.3098 14.491C13.5163 14.485 13.6943 14.5568 13.8438 14.7063L15.25 16.1125V10.75C15.25 10.5375 15.322 10.3595 15.466 10.216C15.61 10.0725 15.788 10.0005 16 10C16.212 9.9995 16.3903 10.0715 16.5347 10.216C16.6793 10.3605 16.751 10.5385 16.75 10.75V16.1125L18.1562 14.7063C18.3062 14.5563 18.4845 14.4843 18.691 14.4903C18.8975 14.4963 19.0755 14.5745 19.225 14.725C19.3625 14.875 19.4345 15.05 19.441 15.25C19.4475 15.45 19.3755 15.625 19.225 15.775L16.525 18.475C16.45 18.55 16.3688 18.6033 16.2812 18.6348C16.1937 18.6663 16.1 18.6818 16 18.6813ZM11.5 22C11.0875 22 10.7345 21.8533 10.441 21.5598C10.1475 21.2663 10.0005 20.913 10 20.5V19C10 18.7875 10.072 18.6095 10.216 18.466C10.36 18.3225 10.538 18.2505 10.75 18.25C10.962 18.2495 11.1402 18.3215 11.2847 18.466C11.4292 18.6105 11.501 18.7885 11.5 19V20.5H20.5V19C20.5 18.7875 20.572 18.6095 20.716 18.466C20.86 18.3225 21.038 18.2505 21.25 18.25C21.462 18.2495 21.6402 18.3215 21.7847 18.466C21.9292 18.6105 22.001 18.7885 22 19V20.5C22 20.9125 21.8533 21.2658 21.5597 21.5598C21.2662 21.8538 20.913 22.0005 20.5 22H11.5Z" fill="white"/>
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

