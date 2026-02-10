'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';

// Delivery state types
export interface DeliveryState {
  projectId: string | null;
  isLoading: boolean;
  images: DeliveryImage[];
  completedImages: DeliveryImage[]; // All historically accepted images across all revisions
  selectedImage: DeliveryImage | null;
  statistics: {
    imagesDelivered: number;
    roomsStaged: number;
    totalFileSize: string;
  };
  highlightImages: string[];
  revisionRound: number | null;
  latestUpdate?: string | Date; // ISO date string or Date object
  resultsOrderId?: string; // Order ID for results
}

export interface DeliveryImage {
  id: string;
  revisionId?: string; // revision_id for API calls
  url: string;
  title?: string;
  revisionRound?: number;
  revisionStatus?: {
    delivered: string | null;
    accepted: string | null;
    rejected: string | null;
    revision_requested: string | null;
  };
}

// Actions
type DeliveryAction =
  | { type: 'SET_PROJECT_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_IMAGES'; payload: DeliveryImage[] }
  | { type: 'SET_COMPLETED_IMAGES'; payload: DeliveryImage[] } // Set completed images
  | { type: 'ADD_COMPLETED_IMAGE'; payload: DeliveryImage } // Add a single image to completed images
  | { type: 'ADD_COMPLETED_IMAGES'; payload: DeliveryImage[] } // Add multiple images to completed images
  | { type: 'SET_SELECTED_IMAGE'; payload: DeliveryImage | null }
  | { type: 'UPDATE_STATISTICS'; payload: Partial<DeliveryState['statistics']> }
  | { type: 'SET_HIGHLIGHT_IMAGES'; payload: string[] }
  | { type: 'SET_REVISION_ROUND'; payload: number | null }
  | { type: 'SET_LATEST_UPDATE'; payload: string | Date }
  | { type: 'SET_RESULTS_ORDER_ID'; payload: string }
  | { type: 'UPDATE_IMAGE_REVISION_STATUS'; payload: { revisionId: string; status: { accepted?: string | null; rejected?: string | null; revision_requested?: string | null } } } // Update revision status for an image
  | { type: 'RESET' };

// Initial state
const initialState: DeliveryState = {
  projectId: null,
  isLoading: false,
  images: [],
  completedImages: [],
  selectedImage: null,
  statistics: {
    imagesDelivered: 0,
    roomsStaged: 0,
    totalFileSize: '0GB',
  },
  highlightImages: [],
  revisionRound: null,
};

// Reducer
const deliveryReducer = (state: DeliveryState, action: DeliveryAction): DeliveryState => {
  switch (action.type) {
    case 'SET_PROJECT_ID':
      return { ...state, projectId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    case 'SET_COMPLETED_IMAGES':
      return { ...state, completedImages: action.payload };
    case 'ADD_COMPLETED_IMAGE':
      // Add a single image to completed images if not already present
      const imageToAdd = action.payload;
      const isAlreadyCompleted = state.completedImages.some(
        img => img.revisionId === imageToAdd.revisionId || img.id === imageToAdd.id
      );
      if (!isAlreadyCompleted) {
        return {
          ...state,
          completedImages: [...state.completedImages, imageToAdd],
        };
      }
      return state;
    case 'ADD_COMPLETED_IMAGES':
      // Add multiple images to completed images, avoiding duplicates
      const imagesToAdd = action.payload;
      const existingRevisionIds = new Set(state.completedImages.map(img => img.revisionId || img.id));
      const newImages = imagesToAdd.filter(
        img => !existingRevisionIds.has(img.revisionId || img.id)
      );
      if (newImages.length > 0) {
        return {
          ...state,
          completedImages: [...state.completedImages, ...newImages],
        };
      }
      return state;
    case 'SET_SELECTED_IMAGE':
      return { ...state, selectedImage: action.payload };
    case 'UPDATE_STATISTICS':
      return {
        ...state,
        statistics: { ...state.statistics, ...action.payload },
      };
    case 'SET_HIGHLIGHT_IMAGES':
      return { ...state, highlightImages: action.payload };
    case 'SET_REVISION_ROUND':
      return { ...state, revisionRound: action.payload };
    case 'SET_LATEST_UPDATE':
      return { ...state, latestUpdate: action.payload };
    case 'SET_RESULTS_ORDER_ID':
      return { ...state, resultsOrderId: action.payload };
    case 'UPDATE_IMAGE_REVISION_STATUS':
      // Update revision status for a specific image
      const { revisionId, status } = action.payload;
      
      // Filter out undefined values to avoid overwriting with undefined
      const cleanStatus = Object.fromEntries(
        Object.entries(status).filter(([, value]) => value !== undefined)
      ) as { accepted?: string | null; rejected?: string | null; revision_requested?: string | null };
      
      const updatedImages = state.images.map(img => {
        if (img.revisionId === revisionId && img.revisionStatus) {
          return {
            ...img,
            revisionStatus: {
              ...img.revisionStatus,
              ...cleanStatus,
            },
          };
        }
        return img;
      });
      
      // Also update selectedImage if it matches
      const updatedSelectedImage = state.selectedImage?.revisionId === revisionId && state.selectedImage.revisionStatus
        ? {
            ...state.selectedImage,
            revisionStatus: {
              ...state.selectedImage.revisionStatus,
              ...cleanStatus,
            },
          }
        : state.selectedImage;
      
      return {
        ...state,
        images: updatedImages,
        selectedImage: updatedSelectedImage,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Context
interface DeliveryContextType {
  state: DeliveryState;
  setProjectId: (projectId: string) => void;
  setLoading: (loading: boolean) => void;
  setImages: (images: DeliveryImage[]) => void;
  setSelectedImage: (image: DeliveryImage | null) => void;
  updateStatistics: (stats: Partial<DeliveryState['statistics']>) => void;
  setHighlightImages: (images: string[]) => void;
  setRevisionRound: (round: number | null) => void;
  updateImageRevisionStatus: (revisionId: string, status: { accepted?: string | null; rejected?: string | null; revision_requested?: string | null }) => void; // Update revision status for an image
  addCompletedImage: (image: DeliveryImage) => void; // Add a single image to completed images
  addCompletedImages: (images: DeliveryImage[]) => void; // Add multiple images to completed images
  loadDeliveryData: (projectId: string) => Promise<void>;
  reset: () => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

// Provider component
interface DeliveryProviderProps {
  children: ReactNode;
  projectId: string;
  revisionNumber?: number | null; // Optional revision number from URL
}

export const DeliveryProvider: React.FC<DeliveryProviderProps> = ({ 
  children, 
  projectId,
  revisionNumber = null 
}) => {
  const [state, dispatch] = useReducer(deliveryReducer, initialState);

  // Load delivery data from API
  const loadDeliveryData = useCallback(async (currentProjectId: string, revision: number | null = null) => {
    // Validate parameters
    if (!currentProjectId) {
      console.error('Project ID is required');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Build API URL with optional revision parameter
      const revisionParam = revision !== null ? `?revision=${revision}` : '';
      const apiUrl = `/api/delivery/${currentProjectId}${revisionParam}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        // Handle 404 specifically (revision might not exist)
        if (response.status === 404) {
          throw new Error(`Revision ${revision} not found for project ${currentProjectId}`);
        }
        throw new Error(`Failed to fetch delivery data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('Delivery API response:', {
        projectId: currentProjectId,
        revision,
        imagesCount: data.images?.length || 0,
        statistics: data.statistics,
        message: data.message,
      });
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Validate revisionNumber matches requested revision
      if (revision !== null && data.revisionNumber !== undefined && data.revisionNumber !== revision) {
        console.warn(`Revision mismatch: requested ${revision}, received ${data.revisionNumber}`);
      }
      
      // Transform API response to DeliveryImage format
      console.log('API Response data.images:', JSON.stringify(data.images, null, 2));
      
      const deliveryImages: DeliveryImage[] = (data.images || []).map((img: {
        id: string;
        revisionId?: string;
        url: string;
        jobId: string;
        createdAt: string;
        readyForDelivery: string | null;
        revisionStatus?: {
          delivered: string | null;
          accepted: string | null;
          rejected: string | null;
          revision_requested: string | null;
        };
      }) => {
        // Validate that revisionId is present
        if (!img.revisionId) {
          console.warn(`Missing revisionId for image ${img.id}:`, img);
        }
        
        const deliveryImage: DeliveryImage = {
          id: img.id,
          revisionId: img.revisionId, // Ensure revisionId is preserved
          url: img.url,
          title: `Image ${img.id.slice(-8)}`,
          revisionRound: data.revisionNumber,
          revisionStatus: img.revisionStatus, // Include revision status
        };
        
        console.log(`Transformed image ${img.id}:`, {
          id: deliveryImage.id,
          revisionId: deliveryImage.revisionId,
          hasRevisionId: !!deliveryImage.revisionId,
          revisionStatus: deliveryImage.revisionStatus,
        });
        
        return deliveryImage;
      });
      
      // Log summary
      const imagesWithRevisionId = deliveryImages.filter(img => img.revisionId);
      console.log(`Delivery images summary: ${deliveryImages.length} total, ${imagesWithRevisionId.length} with revisionId`);
      
      if (imagesWithRevisionId.length < deliveryImages.length) {
        console.error(`${deliveryImages.length - imagesWithRevisionId.length} images are missing revisionId!`);
      }
      
      // Set images
      dispatch({
        type: 'SET_IMAGES',
        payload: deliveryImages,
      });
      
      // Set highlight images (all image URLs)
      const imageUrls = deliveryImages.map(img => img.url).filter(Boolean);
      dispatch({
        type: 'SET_HIGHLIGHT_IMAGES',
        payload: imageUrls,
      });
      
      // Parse and set completed images (all historically accepted images)
      const completedImagesData: DeliveryImage[] = (data.completedImages || []).map((img: {
        id: string;
        revisionId?: string;
        url: string;
        jobId: string;
        createdAt: string;
        readyForDelivery: string | null;
        revisionStatus?: {
          delivered: string | null;
          accepted: string | null;
          rejected: string | null;
          revision_requested: string | null;
        };
      }) => {
        return {
          id: img.id,
          revisionId: img.revisionId,
          url: img.url,
          title: `Image ${img.id.slice(-8)}`,
          revisionRound: data.revisionNumber, // Note: completed images may be from different rounds
          revisionStatus: img.revisionStatus,
        };
      });
      
      dispatch({
        type: 'SET_COMPLETED_IMAGES',
        payload: completedImagesData,
      });
      
      // Set the first image as default selected image
      if (deliveryImages.length > 0) {
        const firstImage = deliveryImages[0];
        console.log('Setting first image as selected:', {
          id: firstImage.id,
          revisionId: firstImage.revisionId,
          hasRevisionId: !!firstImage.revisionId,
        });
        
        if (!firstImage.revisionId) {
          console.error('First image is missing revisionId!', firstImage);
        }
        
        dispatch({
          type: 'SET_SELECTED_IMAGE',
          payload: firstImage,
        });
      }
      
      // Update statistics
      dispatch({
        type: 'UPDATE_STATISTICS',
        payload: {
          imagesDelivered: data.statistics.totalImages,
          roomsStaged: data.statistics.readyCount, // Using readyCount as rooms staged
          totalFileSize: '0GB', // TODO: Calculate from image sizes if needed
        },
      });
      
      // Set latest update time (use the most recent ready_for_delivery timestamp)
      const latestReadyTime = data.images
        .map((img: { readyForDelivery: string | null }) => img.readyForDelivery)
        .filter(Boolean)
        .sort()
        .pop();
      
      if (latestReadyTime) {
        dispatch({
          type: 'SET_LATEST_UPDATE',
          payload: new Date(latestReadyTime),
        });
      } else {
        dispatch({
          type: 'SET_LATEST_UPDATE',
          payload: new Date(),
        });
      }
      
      // Set results order ID (use projectId)
      dispatch({
        type: 'SET_RESULTS_ORDER_ID',
        payload: currentProjectId,
      });
      
      // Set revision round
      dispatch({
        type: 'SET_REVISION_ROUND',
        payload: data.revisionNumber,
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to load delivery data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Set project ID and revision number on mount
  useEffect(() => {
    if (!projectId) return;

    // Ensure revisionNumber has a clear value (null or specific number)
    const effectiveRevisionNumber = revisionNumber !== undefined && revisionNumber !== null 
      ? revisionNumber 
      : 0; // Default to revision 0 (first delivery) if not specified

    dispatch({ type: 'SET_PROJECT_ID', payload: projectId });
    dispatch({ type: 'SET_REVISION_ROUND', payload: effectiveRevisionNumber });

    // Load data with the effective revision number
    loadDeliveryData(projectId, effectiveRevisionNumber);
  }, [projectId, revisionNumber, loadDeliveryData]);

  const setProjectId = (projectId: string) => {
    dispatch({ type: 'SET_PROJECT_ID', payload: projectId });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setImages = (images: DeliveryImage[]) => {
    dispatch({ type: 'SET_IMAGES', payload: images });
  };

  const setSelectedImage = (image: DeliveryImage | null) => {
    dispatch({ type: 'SET_SELECTED_IMAGE', payload: image });
  };

  const updateStatistics = (stats: Partial<DeliveryState['statistics']>) => {
    dispatch({ type: 'UPDATE_STATISTICS', payload: stats });
  };

  const setHighlightImages = (images: string[]) => {
    dispatch({ type: 'SET_HIGHLIGHT_IMAGES', payload: images });
  };

  const setRevisionRound = (round: number | null) => {
    dispatch({ type: 'SET_REVISION_ROUND', payload: round });
  };

  const updateImageRevisionStatus = (revisionId: string, status: { accepted?: string | null; rejected?: string | null; revision_requested?: string | null }) => {
    dispatch({ type: 'UPDATE_IMAGE_REVISION_STATUS', payload: { revisionId, status } });
  };

  const addCompletedImage = (image: DeliveryImage) => {
    dispatch({ type: 'ADD_COMPLETED_IMAGE', payload: image });
  };

  const addCompletedImages = (images: DeliveryImage[]) => {
    dispatch({ type: 'ADD_COMPLETED_IMAGES', payload: images });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const value: DeliveryContextType = {
    state,
    setProjectId,
    setLoading,
    setImages,
    setSelectedImage,
    updateStatistics,
    setHighlightImages,
    setRevisionRound,
    updateImageRevisionStatus,
    addCompletedImage,
    addCompletedImages,
    loadDeliveryData,
    reset,
  };

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
};

// Hook to use delivery context
export const useDeliveryContext = (): DeliveryContextType => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDeliveryContext must be used within a DeliveryProvider');
  }
  return context;
};

