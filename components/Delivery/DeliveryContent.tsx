'use client';

import React, { useState, useEffect } from 'react';
import { useDeliveryContext, DeliveryImage } from './context/DeliveryContext';
import ImageDisplay from '@/components/ImageView/ImageDisplay';
// import { DeliveryStatistics } from './DeliveryStatistics';
import { DeliveryGallery } from './DeliveryGallery';
import { CompletedGallery } from './CompletedGallery';
// import { DeliveryActions } from './DeliveryActions';
import { DeliveryResultModal, DeliveryResultModalType } from './DeliveryResultModal';
import { downloadImagesAsZip } from '@/utils/downloadUtils';
import BrandPromotionCard from './BrandPromotionCard';
import DeliveryNotification from './DeliveryNotification';
import BellaStagingLoading from '@/components/Loading/BellaStagingLoading';

/**
 * Delivery Content Component
 * 
 * Main content component for the delivery view.
 * Uses DeliveryContext for state management.
 */
export const DeliveryContent: React.FC = () => {
  const { state, updateImageRevisionStatus, setSelectedImage, addCompletedImage, addCompletedImages } = useDeliveryContext();
  const [modalType, setModalType] = useState<DeliveryResultModalType>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBrandPromotion, setShowBrandPromotion] = useState(false);
  const [isShopMode, setIsShopMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'accept' | 'reject' | null>(null);
  const [isDownloadingCompleted, setIsDownloadingCompleted] = useState(false);
  const [latestRevisionNumber, setLatestRevisionNumber] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsTabletOrMobile(typeof window !== 'undefined' && window.innerWidth <= 761);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Determine if this is the first delivery (not a revision)
  const isFirstDelivery = state.revisionRound === null || state.revisionRound === 0;
  
  // Fetch latest revision number to determine if current page is history tab
  useEffect(() => {
    if (state.projectId) {
      fetch(`/api/delivery/${state.projectId}/revisions-list`)
        .then(response => response.json())
        .then(data => {
          if (!data.error && data.revisions && data.revisions.length > 0) {
            // Find the latest revision (highest revision number)
            const latest = data.revisions.reduce((latest: { revisionNumber: number }, rev: { revisionNumber: number }) => 
              rev.revisionNumber > latest.revisionNumber ? rev : latest
            );
            setLatestRevisionNumber(latest.revisionNumber);
          } else {
            // No revisions, so current (revision 0) is the latest
            setLatestRevisionNumber(0);
          }
        })
        .catch(error => {
          console.error('Failed to fetch revisions list:', error);
        });
    }
  }, [state.projectId]);
  
  // Check if current page is a history tab (not the latest revision)
  const isHistoryTab = latestRevisionNumber !== null && 
                       state.revisionRound !== null && 
                       state.revisionRound < latestRevisionNumber;
  
  // Show Brand Promotion Card only on first delivery
  useEffect(() => {
    if (isFirstDelivery) {
      setShowBrandPromotion(true);
    } else {
      setShowBrandPromotion(false);
    }
  }, [isFirstDelivery]);

  // Navigation handlers for image pagination
  const handlePreviousImage = () => {
    if (!state.selectedImage || state.images.length === 0) return;
    
    const currentIndex = state.images.findIndex(img => img.id === state.selectedImage?.id);
    if (currentIndex > 0) {
      setSelectedImage(state.images[currentIndex - 1]);
    } else {
      // Loop to last image
      setSelectedImage(state.images[state.images.length - 1]);
    }
  };

  const handleNextImage = () => {
    if (!state.selectedImage || state.images.length === 0) return;
    
    const currentIndex = state.images.findIndex(img => img.id === state.selectedImage?.id);
    if (currentIndex < state.images.length - 1) {
      setSelectedImage(state.images[currentIndex + 1]);
    } else {
      // Loop to first image
      setSelectedImage(state.images[0]);
    }
  };

  // Helper function to check if buttons should be shown
  const shouldShowButtons = (image: typeof state.selectedImage): boolean => {
    if (!image || !image.revisionStatus) return false;
    
    const { delivered, accepted, revision_requested, rejected } = image.revisionStatus;
    
    // Show buttons if:
    // 1. delivered is not null (has been delivered)
    // 2. accepted is null (not accepted yet)
    // 3. revision_requested is null (no revision requested)
    // 4. rejected is null (not rejected)
    return delivered !== null && 
           accepted === null && 
           revision_requested === null &&
           rejected === null;
  };

  // Helper function to check if there are any approvable images in current revision round
  const hasApprovableImages = (): boolean => {
    // Get current revision round images that can be approved
    // Only include images that:
    // 1. Are in the current revision round
    // 2. Have been delivered
    // 3. Have NOT been accepted
    // 4. Have NOT been rejected
    const approvableImages = state.images.filter(img => 
      img.revisionId && 
      img.revisionStatus &&
      img.revisionStatus.delivered !== null &&
      img.revisionStatus.accepted === null &&
      img.revisionStatus.rejected === null &&
      img.revisionRound === state.revisionRound
    );
    
    return approvableImages.length > 0;
  };

  // Get in-progress images (not accepted, delivered - includes rejected images)
  // Rejected images should still show in Photo In Progress gallery with sad face icon
  const inProgressImages = state.images.filter(img => {
    const status = img.revisionStatus;
    return status && 
           status.accepted === null && // Not accepted
           status.delivered !== null; // Must be delivered
    // Note: rejected images are included (they show with sad face icon)
  });

  // Handle download all completed images
  const handleDownloadCompleted = async () => {
    if (state.completedImages.length === 0) {
      alert('No completed images available to download');
      return;
    }

    const imageUrls = state.completedImages.map(img => img.url);

    try {
      setIsDownloadingCompleted(true);
      
      await downloadImagesAsZip(
        imageUrls,
        `completed-images-${state.projectId || Date.now()}.zip`,
        {
          onProgress: (progress) => {
            console.log(`Downloading completed: ${progress.percentage}% - ${progress.currentFileName}`);
          },
          onComplete: () => {
            setIsDownloadingCompleted(false);
            console.log('Download completed successfully');
          },
          onError: (error) => {
            setIsDownloadingCompleted(false);
            console.error('Download error:', error);
            alert('Download failed: ' + error.message);
          }
        }
      );
    } catch (error) {
      setIsDownloadingCompleted(false);
      console.error('Download error:', error);
      alert('Download failed: ' + (error as Error).message);
    }
  };
  
  // Monitor selectedImage changes for debugging
  useEffect(() => {
    if (state.selectedImage) {
      console.log('DeliveryContent: selectedImage changed:', {
        id: state.selectedImage.id,
        revisionId: state.selectedImage.revisionId,
        hasRevisionId: !!state.selectedImage.revisionId,
        url: state.selectedImage.url,
        fullObject: state.selectedImage,
      });
      
      if (!state.selectedImage.revisionId) {
        console.error('DeliveryContent: selectedImage is missing revisionId!', state.selectedImage);
      }
    } else {
      console.log('DeliveryContent: selectedImage is null');
    }
  }, [state.selectedImage]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BellaStagingLoading />
          <p className="mt-4 text-gray-600">Loading delivery data...</p>
        </div>
      </div>
    );
  }

  const imageUrl =
    state.selectedImage?.url ||
    'https://storage.googleapis.com/bella-staging-upload/furniture_store/Sundays/furniture_set/BDR-SUNDAYS-150.jpg';
  const imageTitle = state.selectedImage?.title || 'Delivery Highlight Room';

  const handleAccept = () => {
    setModalType('accept');
  };

  const handleReject = () => {
    setModalType('reject');
  };

  const handleModalClose = () => {
    setModalType(null);
  };

  const handleModalSubmit = async (data: { rating?: number; comment: string; action: 'accept' | 'reject' | 'skip' | 'acceptAll' }) => {
    const { rating, comment, action } = data;
    
    if (!state.projectId) {
      console.error('No project ID available');
      setModalType(null);
      return;
    }
    
    console.log('Modal submitted:', {
      action,
      rating,
      comment,
      imageId: state.selectedImage?.id,
      revisionId: state.selectedImage?.revisionId,
      projectId: state.projectId,
      selectedImage: state.selectedImage,
    });

    try {
      let rejectedRevisionIds: string[] = [];
      let acceptedRevisionIds: string[] = [];
      
      switch (action) {
        case 'accept':
          // Accept single image
          if (state.selectedImage?.revisionId) {
            acceptedRevisionIds = [state.selectedImage.revisionId];
          } else {
            console.warn('No revisionId found for accept action');
          }
          break;
          
        case 'reject':
          // Reject single image
          if (state.selectedImage?.revisionId) {
            rejectedRevisionIds = [state.selectedImage.revisionId];
          } else {
            console.warn('No revisionId found for reject action. selectedImage:', state.selectedImage);
          }
          break;
          
        case 'skip':
          // Skip this image - no action needed
          setModalType(null);
          return;
          
        case 'acceptAll':
          // Accept all images in current revision round that can be approved
          // Only include images that:
          // 1. Are in the current revision round
          // 2. Have been delivered
          // 3. Have NOT been accepted
          // 4. Have NOT been rejected (if rejected, skip them)
          acceptedRevisionIds = state.images
            .filter(img => 
              img.revisionId && 
              img.revisionStatus &&
              img.revisionStatus.delivered !== null &&
              img.revisionStatus.accepted === null &&
              img.revisionStatus.rejected === null && // Exclude rejected images
              img.revisionRound === state.revisionRound // Only current revision round
            )
            .map(img => img.revisionId!)
            .filter((id): id is string => !!id);
          break;
      }
      
      console.log('Prepared IDs:', {
        rejectedRevisionIds,
        acceptedRevisionIds,
        hasRejected: rejectedRevisionIds.length > 0,
        hasAccepted: acceptedRevisionIds.length > 0,
      });
      
      // Check if we have valid IDs to send
      if (rejectedRevisionIds.length === 0 && acceptedRevisionIds.length === 0) {
        console.error('No valid revision IDs found. Cannot submit feedback.');
        alert('Error: No revision ID found for this image. Please refresh the page and try again.');
        setModalType(null);
        return;
      }
      
      // Call API if there are rejections or acceptances
      if (rejectedRevisionIds.length > 0 || acceptedRevisionIds.length > 0) {
        const requestBody: {
          rejected_revision_ids?: string[];
          accepted_revision_ids?: string[];
          accepted_photo_urls?: { photo_id: string; url: string }[];
          comments?: { revision_id: string; comment: string }[];
        } = {};
        
        if (rejectedRevisionIds.length > 0) {
          requestBody.rejected_revision_ids = rejectedRevisionIds;
        }
        
        if (acceptedRevisionIds.length > 0) {
          requestBody.accepted_revision_ids = acceptedRevisionIds;
          // TODO: If you have watermarked URLs, add them here
          // requestBody.accepted_photo_urls = acceptedRevisionIds.map(revisionId => ({
          //   revision_id: revisionId,
          //   url: watermarkedUrl
          // }));
        }
        
        if (comment && state.selectedImage?.revisionId) {
          requestBody.comments = [{
            revision_id: state.selectedImage.revisionId,
            comment: comment,
          }];
        }
        
        console.log('Request body to send:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(`/api/delivery/${state.projectId}/revisions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to submit feedback:', {
            status: response.status,
            error: errorData,
          });
          
          // Show more detailed error message
          const errorMessage = errorData.error || 'Failed to submit feedback';
          const errorDetails = errorData.details 
            ? `\nDetails: ${typeof errorData.details === 'string' ? errorData.details : JSON.stringify(errorData.details)}`
            : '';
          alert(`${errorMessage}${errorDetails}\n\nPlease check the console for more details.`);
          return;
        }
        
        const result = await response.json();
        console.log('Feedback submitted successfully:', result);
        
        // Show success message if needed
        if (result.updated_rejected_revisions === 0 && rejectedRevisionIds.length > 0) {
          alert('Warning: No revisions were updated. Please check if the revision exists.');
        }
        
        // Show notification for accept/reject actions
        if (action === 'accept' || action === 'reject') {
          setNotificationType(action);
          setShowNotification(true);
          
          // Hide notification after 2 seconds
          setTimeout(() => {
            setShowNotification(false);
            setNotificationType(null);
          }, 2000);
        }
        
        // Optimistic update: Update revisionStatus in Context immediately
        const currentTimestamp = new Date().toISOString();
        
        if (action === 'accept' || action === 'reject') {
          // For single image accept/reject
          if (state.selectedImage?.revisionId) {
            // Update revision status immediately for UI feedback
            if (action === 'accept') {
              updateImageRevisionStatus(state.selectedImage.revisionId, {
                accepted: currentTimestamp,
                // Keep existing rejected and revision_requested values (don't override)
              });
              
              // If accepted, add to completed images immediately
              if (state.selectedImage) {
                const completedImage: DeliveryImage = {
                  ...state.selectedImage,
                  revisionStatus: {
                    delivered: state.selectedImage.revisionStatus?.delivered ?? null,
                    accepted: currentTimestamp,
                    rejected: state.selectedImage.revisionStatus?.rejected ?? null,
                    revision_requested: state.selectedImage.revisionStatus?.revision_requested ?? null,
                  },
                };
                addCompletedImage(completedImage);
                console.log('Added image to completed images:', completedImage);
              }
            } else if (action === 'reject') {
              // For reject, update rejected and revision_requested, keep accepted as null
              updateImageRevisionStatus(state.selectedImage.revisionId, {
                rejected: currentTimestamp,
                revision_requested: currentTimestamp,
                // Keep accepted as null (don't override)
              });
              
              console.log('Optimistically updated rejected status:', {
                revisionId: state.selectedImage.revisionId,
                rejected: currentTimestamp,
                revision_requested: currentTimestamp,
              });
            }
            
            console.log('Optimistically updated revision status:', {
              revisionId: state.selectedImage.revisionId,
              action,
              timestamp: currentTimestamp,
            });
          }
        } else if (action === 'acceptAll') {
          // For accept all, update all accepted revision IDs
          const acceptedImages: DeliveryImage[] = [];
          
          acceptedRevisionIds.forEach(revisionId => {
            updateImageRevisionStatus(revisionId, {
              accepted: currentTimestamp,
            });
            
            // Find the image and add to completed images
            const image = state.images.find(img => img.revisionId === revisionId);
            if (image) {
              const completedImage: DeliveryImage = {
                ...image,
                revisionStatus: {
                  delivered: image.revisionStatus?.delivered ?? null,
                  accepted: currentTimestamp,
                  rejected: image.revisionStatus?.rejected ?? null,
                  revision_requested: image.revisionStatus?.revision_requested ?? null,
                },
              };
              acceptedImages.push(completedImage);
            }
          });
          
          // Add all accepted images to completed images
          if (acceptedImages.length > 0) {
            addCompletedImages(acceptedImages);
            console.log('Added all accepted images to completed images:', acceptedImages.length);
          }
          
          console.log('Optimistically updated all accepted revisions:', acceptedRevisionIds);
        }
      } else {
        console.log('No actions to process');
      }
      
    } catch (error) {
      console.error('Error submitting revision requests:', error);
      alert('An error occurred. Please try again.');
    }

    setModalType(null);
  };

  // Handle download all images
  const handleDownloadAll = async () => {
    if (isDownloading) return;

    // Get all in-progress image URLs (only images that are not accepted/rejected)
    const imageUrls = inProgressImages.map(img => img.url);

    if (imageUrls.length === 0) {
      alert('No images available to download');
      return;
    }

    try {
      setIsDownloading(true);
      
      await downloadImagesAsZip(
        imageUrls,
        `delivery-images-${state.projectId || Date.now()}.zip`,
        {
          onProgress: (progress) => {
            // Optional: You can add a progress indicator here
            console.log(`Downloading: ${progress.percentage}% - ${progress.currentFileName}`);
          },
          onComplete: () => {
            setIsDownloading(false);
            console.log('Download completed successfully');
          },
          onError: (error) => {
            setIsDownloading(false);
            console.error('Download error:', error);
            alert('Download failed: ' + error.message);
          }
        }
      );
    } catch (error) {
      setIsDownloading(false);
      console.error('Download error:', error);
      alert('Download failed: ' + (error as Error).message);
    }
  };

  // Handle approve all images - show modal first
  const handleApproveAll = () => {
    if (isDownloading || !hasApprovableImages()) return;

    // Show approveAll modal
    setModalType('approveAll');
  };

  // Determine header text based on revision number and shop mode
  // If revisionRound is null or 0, it's Photo Delivery (first delivery)
  // If revisionRound >= 1, it's a revision
  const isRevision = state.revisionRound !== null && state.revisionRound >= 1;
  const headerText = isShopMode 
    ? 'Preview: Shop with Virtual Look'
    : (isRevision ? 'Revision Review' : 'Preview');

  // Check if current image is the first image (for showing shop button)
  const isFirstImage = state.images.length > 0 && 
                       state.selectedImage && 
                       state.images[0]?.id === state.selectedImage.id;

  return (
    <div 
      className="delivery-content-container"
      style={{ position: 'relative' }}
    >
      {/* Brand Promotion Card - shown only on first delivery (not revision), when shop mode is active or on first delivery */}
      {isFirstDelivery && (isShopMode || showBrandPromotion) && (
        <BrandPromotionCard
          isOpen={isShopMode || showBrandPromotion}
          onClose={() => {
            setIsShopMode(false);
            setShowBrandPromotion(false);
          }}
          projectId={state.projectId}
          showDefaultImmediately={isShopMode} // Show default cards immediately in shop mode
        />
      )}

      {/* Statistics Cards */}
      {/* <DeliveryStatistics /> */}

      {/* Preview Header - dynamically changes based on revision status */}
      <div
        className="delivery-preview-header"
        style={{
          marginTop: '0px',
          marginBottom: '0px',
          color: 'var(--900, #000B14)',
          fontFamily: '"Tenor Sans"',
          fontSize: '38px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '140%', /* 53.2px */
          textTransform: 'uppercase',
        }}
      >
        {headerText}
      </div>

      {/* Main delivery preview */}
      <div className="w-full delivery-preview-container" style={{ marginTop: '0' }}>
        <div
          className="delivery-preview-image-container relative flex-shrink-0 rounded-2xl shadow-lg overflow-hidden"
          style={{
            display: 'flex',
            width: '1239px',
            height: '622px',
            padding: '10px',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '8.71px',
            boxSizing: 'border-box',
          }}
        >
          {/* Main Image */}
          <div className="absolute inset-0 w-full h-full">
            <ImageDisplay
              src={imageUrl}
              alt={imageTitle}
              objectFit="cover"
              className="w-full h-full"
              lazy={false}
              showLoadingState={true}
              showErrorState={true}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1239px"
            />
          </div>

          {/* Shop Button - Center - Only show on first image and first delivery (not revision) */}
          {isFirstImage && isFirstDelivery && (
            isTabletOrMobile ? (
              /* Card UI style for tablet and mobile */
              <button
                onClick={() => setIsShopMode(true)}
                className="animate-slide-up delivery-shop-button-card"
                style={{
                  display: 'flex',
                  width: '145.156px',
                  height: '36px',
                  padding: '0 16px',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'absolute',
                  left: '50%',
                  bottom: '0px',
                  transform: 'translateX(-90%)',
                  zIndex: 5,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
                }}
                aria-label="Get The Look"
              >
                <span style={{ width: '16px', height: '16px', flexShrink: 0, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.666 4.66658H10.666V3.99992C10.666 3.29267 10.3851 2.6144 9.88497 2.1143C9.38487 1.6142 8.70659 1.33325 7.99935 1.33325C7.29211 1.33325 6.61383 1.6142 6.11373 2.1143C5.61363 2.6144 5.33268 3.29267 5.33268 3.99992V4.66658H3.33268C3.15587 4.66658 2.9863 4.73682 2.86128 4.86185C2.73625 4.98687 2.66602 5.15644 2.66602 5.33325V12.6666C2.66602 13.197 2.87673 13.7057 3.2518 14.0808C3.62687 14.4559 4.13558 14.6666 4.66602 14.6666H11.3327C11.8631 14.6666 12.3718 14.4559 12.7469 14.0808C13.122 13.7057 13.3327 13.197 13.3327 12.6666V5.33325C13.3327 5.15644 13.2624 4.98687 13.1374 4.86185C13.0124 4.73682 12.8428 4.66658 12.666 4.66658ZM6.66602 3.99992C6.66602 3.6463 6.80649 3.30716 7.05654 3.05711C7.30659 2.80706 7.64573 2.66659 7.99935 2.66659C8.35297 2.66659 8.69211 2.80706 8.94216 3.05711C9.19221 3.30716 9.33268 3.6463 9.33268 3.99992V4.66658H6.66602V3.99992ZM11.9993 12.6666C11.9993 12.8434 11.9291 13.013 11.8041 13.138C11.6791 13.263 11.5095 13.3333 11.3327 13.3333H4.66602C4.4892 13.3333 4.31964 13.263 4.19461 13.138C4.06959 13.013 3.99935 12.8434 3.99935 12.6666V5.99992H5.33268V6.66658C5.33268 6.8434 5.40292 7.01297 5.52794 7.13799C5.65297 7.26301 5.82254 7.33325 5.99935 7.33325C6.17616 7.33325 6.34573 7.26301 6.47075 7.13799C6.59578 7.01297 6.66602 6.8434 6.66602 6.66658V5.99992H9.33268V6.66658C9.33268 6.8434 9.40292 7.01297 9.52794 7.13799C9.65297 7.26301 9.82254 7.33325 9.99935 7.33325C10.1762 7.33325 10.3457 7.26301 10.4708 7.13799C10.5958 7.01297 10.666 6.8434 10.666 6.66658V5.99992H11.9993V12.6666Z" fill="black" />
                  </svg>
                </span>
                <span
                  style={{
                    color: '#000B14',
                    textAlign: 'center',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '20px',
                    letterSpacing: '-0.15px',
                  }}
                >
                  Get The Look
                </span>
              </button>
            ) : (
              /* Circular button for desktop - center of image */
              <button
                onClick={() => setIsShopMode(true)}
                className="animate-slide-up"
                style={{
                  display: 'flex',
                  width: '45px',
                  height: '45px',
                  aspectRatio: '1/1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 5,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                }}
                aria-label="Shop with Virtual Look"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  <defs>
                    <radialGradient
                      id="shop-button-gradient"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(41.5 22.5) rotate(45) scale(31.8198)"
                    >
                      <stop stopColor="#535862" stopOpacity="0" />
                      <stop offset="1" stopColor="#535862" stopOpacity="0.6" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M22.5 0.5C34.6503 0.5 44.5 10.3497 44.5 22.5C44.5 34.6503 34.6503 44.5 22.5 44.5C10.3497 44.5 0.5 34.6503 0.5 22.5C0.5 10.3497 10.3497 0.5 22.5 0.5Z"
                    fill="url(#shop-button-gradient)"
                    stroke="white"
                    strokeWidth="1"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <path
                    d="M3.64583 5.20833C3.23143 5.20833 2.834 5.04371 2.54098 4.75069C2.24795 4.45766 2.08333 4.06023 2.08333 3.64583C2.08333 3.23143 2.24795 2.834 2.54098 2.54098C2.834 2.24795 3.23143 2.08333 3.64583 2.08333C4.06023 2.08333 4.45766 2.24795 4.75069 2.54098C5.04371 2.834 5.20833 3.23143 5.20833 3.64583C5.20833 4.06023 5.04371 4.45766 4.75069 4.75069C4.45766 5.04371 4.06023 5.20833 3.64583 5.20833ZM20.2188 9.97917L10.8438 0.604167C10.4688 0.229167 9.94792 0 9.375 0H2.08333C0.927083 0 0 0.927083 0 2.08333V9.375C0 9.94792 0.229167 10.4688 0.614583 10.8438L9.97917 20.2188C10.3646 20.5938 10.8854 20.8333 11.4583 20.8333C12.0313 20.8333 12.5521 20.5938 12.9271 20.2188L20.2188 12.9271C20.6042 12.5521 20.8333 12.0313 20.8333 11.4583C20.8333 10.875 20.5938 10.3542 20.2188 9.97917Z"
                    fill="white"
                  />
                </svg>
              </button>
            )
          )}

          {/* Navigation Buttons - Left and Right */}
          {state.images.length > 1 && (
            <>
              {/* Previous Button - Left */}
              <button
                onClick={handlePreviousImage}
                style={{
                  display: 'flex',
                  width: '50px',
                  height: '50px',
                  padding: '13px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: '25px',
                  background: 'rgba(255, 255, 255, 0.80)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(0deg)',
                  zIndex: 10,
                }}
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="10"
                  viewBox="0 0 7 12"
                  fill="none"
                  style={{
                    strokeWidth: '2px',
                    stroke: '#000',
                  }}
                >
                  <path
                    d="M6 1L1 6L6 11"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Next Button - Right */}
              <button
                onClick={handleNextImage}
                style={{
                  display: 'flex',
                  width: '50px',
                  height: '50px',
                  padding: '13px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: '25px',
                  background: 'rgba(255, 255, 255, 0.80)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(180deg)',
                  zIndex: 10,
                }}
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="10"
                  viewBox="0 0 7 12"
                  fill="none"
                  style={{
                    strokeWidth: '2px',
                    stroke: '#000',
                  }}
                >
                  <path
                    d="M6 1L1 6L6 11"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Accept and Reject Buttons - Only show if image status allows */}
          {shouldShowButtons(state.selectedImage) && (
            <div className="delivery-accept-reject-wrapper absolute z-10 flex items-center gap-2" style={{ top: 12, right: 12 }}>
              {/* Accept Button (Smile Icon) */}
              <button
                onClick={handleAccept}
                className="delivery-accept-reject-button p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
                aria-label="Accept image"
              >
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
                  className="text-green-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>

              {/* Reject Button (Sad Icon) */}
              <button
                onClick={handleReject}
                className="delivery-accept-reject-button p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
                aria-label="Reject image"
              >
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
                  className="text-red-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header and Gallery Container - no spacing between them */}
      <div className="delivery-photo-in-review-container" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Header between main image and gallery */}
        <div
          style={{
            background: 'var(--Colors-Background-bg-primary)',
            marginBottom: '0',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              borderBottom: '2px solid var(--Colors-Border-border-secondary, #E9EAEB)',
            }}
          >
            {/* Photos in review container with underline */}
            <div
              style={{
                display: 'flex',
                height: '36px',
                padding: '0 var(--spacing-xs, 4px) var(--spacing-lg, 12px) var(--spacing-xs, 4px)',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--spacing-md, 8px)',
                borderBottom: '2px solid var(--Neutral-Dark900, #000B14)',
              }}
            >
              <div
                className="delivery-section-title delivery-photo-in-progress-title"
                style={{
                  color: 'var(--Neutral-Dark900, #000B14)',
                  fontFamily: 'var(--Font-family-font-family-body, Inter)',
                  fontSize: 'var(--Font-size-text-md, 16px)',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'var(--Line-height-text-md, 24px)',
                }}
              >
                Photo In Progress
              </div>
              
              {/* Image count badge */}
              <div
                style={{
                  display: 'flex',
                  padding: 'var(--spacing-xxs, 0px) 12px',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-full, 9999px)',
                  background: 'var(--Neutral-Dark900, #000B14)',
                  color: '#FFF',
                  fontFamily: 'var(--Font-family-font-family-body, Inter)',
                  fontSize: 'var(--Font-size-text-md, 16px)',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'var(--Line-height-text-md, 24px)',
                }}
              >
                {inProgressImages.length}
              </div>
            </div>
            
            {/* Description text for Photo In Progress - below title, above border */}
            <div
              className="delivery-section-description"
              style={{
                color: 'var(--Neutral-Dark500, #858A8E)',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '140%',
              }}
            >
              We will refine the images you&apos;re not satisfied with based on your comments. New versions will be delivered within 1-2 days.
            </div>
          </div>
        </div>

        {/* Image Gallery - In Progress */}
        <div className="delivery-photo-in-review-gallery-container" style={{ marginTop: '0' }}>
          <DeliveryGallery filter="in-progress" />
        </div>
      </div>

      {/* Download All and Approve All Buttons - positioned below In Progress gallery */}
      <div
        className="delivery-action-buttons-wrapper"
        style={{
          padding: '32px 20px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          className={`delivery-action-buttons-container ${hasApprovableImages() ? 'delivery-buttons-two' : 'delivery-buttons-one'}`}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '17px',
          }}
        >
          {/* Download All Button */}
          <button
          type="button"
          onClick={handleDownloadAll}
          disabled={isDownloading || inProgressImages.length === 0}
          className="delivery-action-button delivery-download-button disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            display: 'flex',
            width: '149px',
            height: '38px',
            padding: '12px 32px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '6px',
            border: '2px solid var(--Bella-Tech-Primary, #4F46E5)',
            background: 'var(--Brand-White-white, #FFFDFF)',
            color: 'var(--Bella-Tech-Primary, #4F46E5)',
            fontFamily: 'Inter',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '20px',
            letterSpacing: '0.12px',
            whiteSpace: 'nowrap',
          }}
        >
          {isDownloading ? 'Downloading...' : 'Download all'}
        </button>

        {/* Approve All Button */}
        {hasApprovableImages() && (
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => isHistoryTab && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              type="button"
              onClick={handleApproveAll}
              disabled={isDownloading || !hasApprovableImages() || isHistoryTab}
              className="delivery-action-button delivery-approve-button disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                display: 'flex',
                width: '149px',
                height: '38px',
                padding: '12px 32px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '6px',
                background: (isDownloading || !hasApprovableImages() || isHistoryTab) ? '#C1C2C3' : '#2BC556',
                color: 'var(--Neutral-Light0, #FFF)',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '20px',
                letterSpacing: '0.12px',
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: (isDownloading || !hasApprovableImages() || isHistoryTab) ? 'not-allowed' : 'pointer',
              }}
            >
              Approve all
            </button>
            
            {/* Tooltip for history tab - multi-line on tablet/mobile via CSS class */}
            {showTooltip && isHistoryTab && (
              <div
                className="delivery-approve-all-tooltip"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#000B14',
                  color: '#FFF',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  lineHeight: '16px',
                  zIndex: 1000,
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
                  pointerEvents: 'none',
                }}
              >
                You don&apos;t need to approve old versions. Newer versions have already been delivered.
                {/* Arrow pointing down */}
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #000B14',
                  }}
                />
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Completed Section */}
      {state.completedImages.length > 0 && (
        <>
          {/* Header and Completed Gallery Container */}
          <div className="delivery-photo-completed-container" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Header between sections */}
            <div
              style={{
                background: 'var(--Colors-Background-bg-primary)',
                marginBottom: '0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  borderBottom: '2px solid var(--Colors-Border-border-secondary, #E9EAEB)',
                }}
              >
                {/* Completed container with underline */}
                <div
                  style={{
                    display: 'flex',
                    height: '36px',
                    padding: '0 var(--spacing-xs, 4px) var(--spacing-lg, 12px) var(--spacing-xs, 4px)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 'var(--spacing-md, 8px)',
                    borderBottom: '2px solid var(--Neutral-Dark900, #000B14)',
                  }}
                >
                  <div
                    className="delivery-section-title delivery-photo-completed-title"
                    style={{
                      color: 'var(--Neutral-Dark900, #000B14)',
                      fontFamily: 'var(--Font-family-font-family-body, Inter)',
                      fontSize: 'var(--Font-size-text-md, 16px)',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: 'var(--Line-height-text-md, 24px)',
                    }}
                  >
                    Photo Completed
                  </div>
                  
                  {/* Image count badge */}
                  <div
                    style={{
                      display: 'flex',
                      padding: 'var(--spacing-xxs, 0px) 12px',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-full, 9999px)',
                      background: 'var(--Neutral-Dark900, #000B14)',
                      color: '#FFF',
                      fontFamily: 'var(--Font-family-font-family-body, Inter)',
                      fontSize: 'var(--Font-size-text-md, 16px)',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: 'var(--Line-height-text-md, 24px)',
                    }}
                  >
                    {state.completedImages.length}
                  </div>
                </div>
                
                {/* Description text for Photo Completed - below title, above border */}
                <div
                  className="delivery-section-description"
                  style={{
                    color: 'var(--Neutral-Dark500, #858A8E)',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '140%',
                  }}
                >
                  Thank you for approving our delivery results. We look forward to working with you again.
                </div>
              </div>
            </div>

            {/* Completed Image Gallery */}
            <div className="delivery-photo-completed-gallery-container">
              <CompletedGallery onImageClick={setSelectedImage} />
            </div>
          </div>

          {/* Download All Button for Completed - positioned below Completed gallery */}
          <div
            className="delivery-action-buttons-wrapper"
            style={{
              padding: '32px 20px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="delivery-action-buttons-container delivery-completed-buttons-container delivery-buttons-one"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '17px',
              }}
            >
              {/* Download All Button */}
              <button
                type="button"
                onClick={handleDownloadCompleted}
                disabled={isDownloadingCompleted || state.completedImages.length === 0}
                className="delivery-action-button delivery-download-button disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  display: 'flex',
                  width: '149px',
                  height: '38px',
                  padding: '12px 32px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: '6px',
                  border: '2px solid var(--Bella-Tech-Primary, #4F46E5)',
                  background: 'var(--Brand-White-white, #FFFDFF)',
                  color: 'var(--Bella-Tech-Primary, #4F46E5)',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '20px',
                  letterSpacing: '0.12px',
                  whiteSpace: 'nowrap',
                }}
              >
                {isDownloadingCompleted ? 'Downloading...' : 'Download all'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Action Cards */}
      {/* <DeliveryActions /> */}

      {/* Delivery Modal */}
      <DeliveryResultModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />

      {/* Delivery Notification */}
      {notificationType && (
        <DeliveryNotification
          show={showNotification}
          type={notificationType}
          title={
            notificationType === 'accept' 
              ? "Image accepted successfully!" 
              : "Feedback submitted successfully!"
          }
        />
      )}
    </div>
  );
};

