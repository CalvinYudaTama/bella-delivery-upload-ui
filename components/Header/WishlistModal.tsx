import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useCollection } from '@/contexts/CollectionContext';
import { getBrandNameFromSlug } from '@/services/brandService';
// import { HomepageFilterService } from '@/services/homepageFilterService';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// interface PhotoWithRoomInfo {
//   id: string;
//   room_type: string | null;
//   style: string | null;
// }

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, itemCount } = useCollection();
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  // const [photosWithRoomInfo, setPhotosWithRoomInfo] = useState<PhotoWithRoomInfo[]>([]);
  

  // Fetch room info for all items - Commented out as room type and style are no longer displayed
  // useEffect(() => {
  //   const fetchRoomInfo = async () => {
  //     if (items.length === 0) {
  //       setPhotosWithRoomInfo([]);
  //       return;
  //     }

  //     try {
  //       const photoIds = items.map(item => item.imageId);
  //       const photos = await HomepageFilterService.getPhotosWithRoomInfo(photoIds);
  //       setPhotosWithRoomInfo(photos);
  //     } catch (error) {
  //       console.error('Error fetching photos with room info:', error);
  //       setPhotosWithRoomInfo([]);
  //     }
  //   };

  //   if (isOpen) {
  //     fetchRoomInfo();
  //     // Expand all brands by default
  //     const brandNames = new Set<string>();
  //     items.forEach(item => {
  //       const brandName = item.brandName || extractBrandFromUrl(item.imageUrl);
  //       if (brandName) {
  //         brandNames.add(brandName);
  //       }
  //     });
  //     setExpandedBrands(brandNames);
  //   }
  // }, [items, isOpen]);

  // Expand all brands by default when modal opens
  useEffect(() => {
    if (isOpen) {
      const brandNames = new Set<string>();
      items.forEach(item => {
        const brandName = item.brandName || extractBrandFromUrl(item.imageUrl);
        if (brandName) {
          brandNames.add(brandName);
        }
      });
      setExpandedBrands(brandNames);
    }
  }, [items, isOpen]);

  // Extract and normalize brand name from URL
  const extractBrandFromUrl = (imageUrl: string): string => {
    if (!imageUrl || !imageUrl.includes('furniture_store/')) {
      return 'Bella Virtual Staging';
    }
    
    try {
      const urlParts = imageUrl.split('furniture_store/');
      if (urlParts.length > 1) {
        // Extract brand slug from URL path
        // Note: URLs may contain brand names with spaces (e.g., "Gus Modern", "Hooker Furniture")
        const brandSlug = urlParts[1].split('/')[0];
        
        // Comprehensive mapping for all known URL patterns found in actual data
        // Based on actual localStorage data, URLs use various formats:
        // - With spaces: "Gus Modern", "Hooker Furniture", "Eternity Modern", "King Living", "Crate and Barrel"
        // - PascalCase: "RoveConcept", "RocheBobois"
        // - Kebab-case: "gus-modern", "hooker-furniture" (if used)
        // - Typos: "Artical" -> "Article Company"
        const brandNameMap: Record<string, string> = {
          // URLs with spaces (actual format in database)
          'Gus Modern': 'Gus Modern',
          'Hooker Furniture': 'Hooker Furniture',
          'Eternity Modern': 'Eternity Modern',
          'King Living': 'King Living',
          'Crate and Barrel': 'Crate & Barrel',
          'Crate & Barrel': 'Crate & Barrel',
          'Mitchell Gold': 'MGBW',
          'Mitchell Gold + Bob Williams': 'MGBW',
          // PascalCase variations
          'RoveConcept': 'Rove Concepts',
          'RoveConcepts': 'Rove Concepts',
          'RocheBobois': 'Rochebobois',
          'Rochebobois': 'Rochebobois',
          'GusModern': 'Gus Modern',
          'EternityModern': 'Eternity Modern',
          'HookerFurniture': 'Hooker Furniture',
          'KingLiving': 'King Living',
          'ArticleCompany': 'Article Company',
          'CrateBarrel': 'Crate & Barrel',
          'Crate&Barrel': 'Crate & Barrel',
          'MGBW': 'MGBW',
          'MitchellGoldBobWilliams': 'MGBW',
          // Typos found in actual data
          'Artical': 'Article Company',
          'Article': 'Article Company',
          // Kebab-case slugs (if used)
          'gus-modern': 'Gus Modern',
          'hooker-furniture': 'Hooker Furniture',
          'mgbw': 'MGBW',
          'eternity-modern': 'Eternity Modern',
          'king-living': 'King Living',
          'crate-and-barrel': 'Crate & Barrel',
          'rove-concepts': 'Rove Concepts',
          'article-company': 'Article Company',
          'eq3': 'EQ3',
          'sundays': 'Sundays',
          'mobital': 'Mobital',
          'rochebobois': 'Rochebobois',
          // Other common variations
          'EQ3': 'EQ3',
          'Sundays': 'Sundays',
          'Mobital': 'Mobital',
        };
        
        // First, try direct match (handles spaces, PascalCase, etc.)
        if (brandNameMap[brandSlug]) {
          return brandNameMap[brandSlug];
        }
        
        // Try with getBrandNameFromSlug (handles kebab-case slugs)
        const normalizedBrandName = getBrandNameFromSlug(brandSlug);
        if (normalizedBrandName) {
          return normalizedBrandName;
        }
        
        // Try lowercase version
        const normalizedSlug = brandSlug.toLowerCase();
        if (brandNameMap[normalizedSlug]) {
          return brandNameMap[normalizedSlug];
        }
        
        // Try getBrandNameFromSlug with lowercase
        const normalizedBrandNameLower = getBrandNameFromSlug(normalizedSlug);
        if (normalizedBrandNameLower) {
          return normalizedBrandNameLower;
        }
        
        // If no match found, return the original slug
        return brandSlug;
      }
    } catch {
      // Error extracting brand from URL
    }
    
    return 'Bella Virtual Staging';
  };

  // Group items by brand with normalized brand names
  const itemsByBrand = items.reduce((acc, item) => {
    // Use stored brandName if available, otherwise extract from URL
    let brandName = item.brandName;
    
    // If brandName is missing or doesn't match standard format, extract from URL
    if (!brandName || brandName === 'Bella Virtual Staging') {
      brandName = extractBrandFromUrl(item.imageUrl);
    }
    
    // Normalize brand name to ensure consistency (handle URL-encoded or various formats)
    // Ensure we're using the canonical brand name
    if (!acc[brandName]) {
      acc[brandName] = [];
    }
    acc[brandName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Toggle brand expansion
  const toggleBrand = (brandName: string) => {
    setExpandedBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brandName)) {
        newSet.delete(brandName);
      } else {
        newSet.add(brandName);
      }
      return newSet;
    });
  };

  // Remove all items from a brand
  const removeBrand = (brandName: string) => {
    const brandItems = itemsByBrand[brandName] || [];
    brandItems.forEach(item => {
      removeItem(item.imageId);
    });
  };

  // Get room type and style for an item - Commented out as room type and style are no longer displayed
  // const getRoomInfo = (imageId: string) => {
  //   const photoInfo = photosWithRoomInfo.find(photo => photo.id === imageId);
  //   return {
  //     roomType: photoInfo?.room_type || 'Room',
  //     style: photoInfo?.style || 'Modern'
  //   };
  // };

  // Format room type (capitalize first letter) - Commented out as room type and style are no longer displayed
  // const formatRoomType = (roomType: string): string => {
  //   if (!roomType) return 'Room';
  //   return roomType.charAt(0).toUpperCase() + roomType.slice(1).toLowerCase();
  // };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="wishlist-modal-overlay fixed inset-0 bg-black/50 transition-opacity duration-300"
        style={{ 
          zIndex: 1003,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen ? 'all' : 'none',
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="wishlist-modal fixed right-0 top-0 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
        style={{ 
          zIndex: 1004,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          visibility: isOpen ? 'visible' : 'hidden',
          display: 'flex',
          width: '691px',
          height: '100vh',
          padding: '32px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between flex-shrink-0"
          style={{
            width: '100%'
          }}
        >
          <h2 
            className="text-xl font-semibold max-[431px]:!text-lg"
            style={{
              color: '#000B14',
              fontFamily: 'Inter',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '24px'
            }}
          >
            My Inspiration ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors max-[431px]:!p-2.5"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5 max-[431px]:!w-6 max-[431px]:!h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ width: '100%', paddingBottom: '32px' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 max-[431px]:!h-48">
              <p className="text-lg font-medium mb-2 max-[431px]:!text-base max-[431px]:!mb-1.5">Your inspiration is empty</p>
              <p className="text-sm text-center max-[431px]:!text-xs">
                Browse our catalog and add items to your inspiration
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-[431px]:!space-y-3">
              {Object.entries(itemsByBrand).map(([brandName, brandItems]) => {
                const isExpanded = expandedBrands.has(brandName);
                
                return (
                  <div 
                    key={brandName}
                    style={{
                      display: 'flex',
                      padding: '12px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '11.989px',
                      alignSelf: 'stretch',
                      borderRadius: '14px',
                      background: '#FFF',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.15)',
                      width: '100%'
                    }}
                  >
                    {/* Brand Header */}
                    <div 
                      className="flex items-center max-[431px]:!mb-2"
                      style={{
                        display: 'flex',
                        height: '23.995px',
                        padding: '16px',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'stretch',
                        marginBottom: '12px'
                      }}
                    >
                      {/* Chevron and Brand Name - Left (clickable) */}
                      <div 
                        className="flex items-center gap-2 max-[431px]:!gap-1.5 cursor-pointer"
                        onClick={() => toggleBrand(brandName)}
                      >
                        <ChevronDown 
                          className={`w-5 h-5 max-[431px]:!w-4 max-[431px]:!h-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
                            isExpanded ? 'rotate-0' : '-rotate-90'
                          }`}
                        />
                        <h3 
                          className="max-[431px]:!text-sm"
                          style={{
                            color: '#000B14',
                            fontFamily: 'Inter',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: '22px'
                          }}
                        >
                          {brandName}
                        </h3>
                      </div>
                      
                      {/* Trash Icon - Delete Brand */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBrand(brandName);
                        }}
                        className="max-[431px]:!w-5 max-[431px]:!h-5 flex-shrink-0"
                        style={{
                          width: '18px',
                          height: '18px',
                          aspectRatio: '1/1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0
                        }}
                        aria-label={`Remove all items from ${brandName}`}
                      >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="18" 
                            height="18" 
                            viewBox="0 0 18 18" 
                            fill="none"
                            className="max-[431px]:!w-5 max-[431px]:!h-5"
                          >
                            <path 
                              d="M10.71 1.5C11.0248 1.50008 11.3316 1.59921 11.587 1.78336C11.8423 1.9675 12.0333 2.22731 12.1327 2.526L12.54 3.75H15C15.1989 3.75 15.3897 3.82902 15.5303 3.96967C15.671 4.11032 15.75 4.30109 15.75 4.5C15.75 4.69891 15.671 4.88968 15.5303 5.03033C15.3897 5.17098 15.1989 5.25 15 5.25L14.9977 5.30325L14.3475 14.4105C14.3069 14.978 14.0529 15.509 13.6365 15.8967C13.2202 16.2844 12.6724 16.4999 12.1035 16.5H5.8965C5.32759 16.4999 4.77983 16.2844 4.36347 15.8967C3.94712 15.509 3.69308 14.978 3.6525 14.4105L3.00225 5.3025L3 5.25C2.80109 5.25 2.61032 5.17098 2.46967 5.03033C2.32902 4.88968 2.25 4.69891 2.25 4.5C2.25 4.30109 2.32902 4.11032 2.46967 3.96967C2.61032 3.82902 2.80109 3.75 3 3.75H5.46L5.86725 2.526C5.96677 2.22719 6.15783 1.96729 6.41332 1.78314C6.66882 1.59898 6.9758 1.49992 7.29075 1.5H10.71ZM13.4977 5.25H4.50225L5.14875 14.3032C5.16221 14.4924 5.24683 14.6694 5.38557 14.7987C5.52431 14.928 5.70687 14.9999 5.8965 15H12.1035C12.2931 14.9999 12.4757 14.928 12.6144 14.7987C12.7532 14.6694 12.8378 14.4924 12.8512 14.3032L13.4977 5.25ZM7.5 7.5C7.6837 7.50002 7.861 7.56747 7.99828 7.68954C8.13556 7.81161 8.22326 7.97981 8.24475 8.16225L8.25 8.25V12C8.24979 12.1912 8.17659 12.375 8.04536 12.514C7.91414 12.653 7.73479 12.7367 7.54395 12.7479C7.35312 12.7591 7.16522 12.697 7.01863 12.5743C6.87204 12.4516 6.77783 12.2776 6.75525 12.0878L6.75 12V8.25C6.75 8.05109 6.82902 7.86032 6.96967 7.71967C7.11032 7.57902 7.30109 7.5 7.5 7.5ZM10.5 7.5C10.6989 7.5 10.8897 7.57902 11.0303 7.71967C11.171 7.86032 11.25 8.05109 11.25 8.25V12C11.25 12.1989 11.171 12.3897 11.0303 12.5303C10.8897 12.671 10.6989 12.75 10.5 12.75C10.3011 12.75 10.1103 12.671 9.96967 12.5303C9.82902 12.3897 9.75 12.1989 9.75 12V8.25C9.75 8.05109 9.82902 7.86032 9.96967 7.71967C10.1103 7.57902 10.3011 7.5 10.5 7.5ZM10.71 3H7.29L7.04025 3.75H10.9598L10.71 3Z" 
                              fill="black"
                            />
                          </svg>
                        </button>
                    </div>

                    {/* Brand Items */}
                    {isExpanded && (
                      <div 
                        className="space-y-3"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '11.989px',
                          width: '100%'
                        }}
                      >
                        {brandItems.map((item) => {
                          // const { roomType, style } = getRoomInfo(item.imageId);
                          // const formattedRoomType = formatRoomType(roomType);
                          
                          // Encode URL for CSS - escape quotes and special characters
                          // Spaces in URLs need to be URL-encoded for CSS background
                          const encodedImageUrl = item.imageUrl
                            .replace(/'/g, "%27")  // Escape single quotes
                            .replace(/"/g, "%22")  // Escape double quotes
                            .replace(/\(/g, "%28") // Escape opening parenthesis
                            .replace(/\)/g, "%29"); // Escape closing parenthesis
                          
                          return (
                            <div 
                              key={item.imageId}
                              className="relative wishlist-item-card"
                              style={{
                                display: 'flex',
                                width: '600px',
                                height: '300px',
                                padding: '8px',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: '10px',
                                borderRadius: '12px',
                                background: `url('${encodedImageUrl}') lightgray 50% / cover no-repeat`
                              }}
                            >
                              {/* Delete Button - Overlay on top-right corner */}
                              <button
                                onClick={() => removeItem(item.imageId)}
                                className="flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  zIndex: 10,
                                  width: '20px',
                                  height: '20px'
                                }}
                                aria-label={`Remove item from wishlist`}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.25))'
                                  }}
                                >
                                  {/* Background Circle */}
                                  <circle cx="10" cy="10" r="10" fill="var(--Neutral-Light0, #FFF)"/>
                                  
                                  {/* X Icon */}
                                  <g transform="translate(6.5, 6.5)">
                                    <path d="M0.5 0.5L7.5 7.5L0.5 0.5ZM7.5 0.5L0.5 7.5L7.5 0.5Z" fill="var(--Neutral-Light0, #FFF)"/>
                                    <path d="M0.5 0.5L7.5 7.5M7.5 0.5L0.5 7.5" stroke="var(--Neutral-Dark700, #52595F)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                  </g>
                                </svg>
                              </button>
                              
                              {/* Item Details - Commented out */}
                              {/* <div 
                                className="flex-shrink-0"
                                style={{
                                  alignSelf: 'stretch',
                                  marginTop: 'auto'
                                }}
                              >
                                <h4 
                                  style={{
                                    color: '#000B14',
                                    fontFamily: 'Inter',
                                    fontSize: '14px',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    lineHeight: '20px',
                                    marginBottom: '2px'
                                  }}
                                >
                                  {formattedRoomType}
                                </h4>
                                <p 
                                  style={{
                                    color: '#858A8E',
                                    fontFamily: 'Inter',
                                    fontSize: '12px',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: '16px'
                                  }}
                                >
                                  {style}
                                </p>
                              </div> */}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistModal;
