import React, { useState, useEffect } from 'react';
import { ImageSkeleton } from './ImageSkeleton';

interface LocalStorageImageDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  showSkeleton?: boolean;
}

const LocalStorageImageDisplay: React.FC<LocalStorageImageDisplayProps> = ({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  className = '',
  style,
  onLoad,
  onError,
  showSkeleton = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Validate src - must be a non-empty string
    if (!src || typeof src !== 'string' || src.trim() === '') {
      setIsLoading(false);
      setHasError(true);
      setImageSrc('');
      onError?.();
      return;
    }

    // This component only accepts pre-created blob URLs or data URLs
    // The parent component (UploadPhotos) is responsible for creating blob URLs from File objects
    if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http://') || src.startsWith('https://')) {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    } else {
      console.error('Invalid URL format. Expected blob:, data:, http:, or https: URL, got:', src);
      setHasError(true);
      setIsLoading(false);
      setImageSrc('');
      onError?.();
    }
  }, [src, onLoad, onError]);


  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
    ...style
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    display: hasError ? 'none' : 'block'
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Show skeleton while loading */}
      {isLoading && showSkeleton && (
        <ImageSkeleton 
          height={height ? `${height}px` : 'h-full'} 
          width={width ? `${width}px` : 'w-full'} 
        />
      )}

      {/* Show image when loaded - only render img if we have a valid src */}
      {imageSrc && !hasError && imageSrc.trim() !== '' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Show error state */}
      {hasError && (
        <div 
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}
        >
          Failed to load
        </div>
      )}
    </div>
  );
};

export default LocalStorageImageDisplay;
