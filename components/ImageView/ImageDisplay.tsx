import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ImageSkeleton } from './ImageSkeleton';
import { imageCache } from '../../utils/imageCache';
import FrameAnimation from './FrameAnimation';

interface ImageDisplayProps {
  src: string;
  alt: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
  showLoadingState?: boolean;
  showErrorState?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  lazy?: boolean;
  unoptimized?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  objectFit = "cover",
  className = "",
  showLoadingState = false,
  showErrorState = false,
  width,
  height,
  fill = false,
  sizes,
  lazy = true,
  unoptimized = false
}) => {
  const [isLoading, setIsLoading] = useState(!imageCache.isLoaded(src));
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || imageCache.isLoaded(src));
  const [hasRendered, setHasRendered] = useState(false); 
  const imageRef = useRef<HTMLDivElement>(null);

  // Image preloading for better performance
  useEffect(() => {
    if (src && !imageCache.isLoaded(src)) {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        imageCache.set(src, true);
      };
      img.onerror = () => {
        imageCache.set(src, false);
      };
    }
  }, [src]);

  // check cache status
  useEffect(() => {
    // if image  has been rendered or cache has data,just show without rendering
    if (hasRendered || imageCache.isLoaded(src)) {
      setShouldLoad(true);
      setIsLoading(false);
      setHasError(false);
    }
  }, [src, hasRendered]);

  // Virtual scrolling with Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imageRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // observer.disconnect(); // Commented out for virtual scrolling
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px' // margin for better preloading
      }
    );

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [lazy, src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasRendered(true); // after loaded image label as rendered
    imageCache.set(src, true);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    imageCache.set(src, false);
  };

  // display loaded image without reload
  if (hasRendered || imageCache.isLoaded(src)) {
    if (fill) {
      return (
        <div className={`relative ${className}`}>
                      <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit }}
              sizes={sizes}
              onLoad={handleLoad}
              onError={handleError}
              loading="eager" // loaded image use
              unoptimized={unoptimized}
            />
        </div>
      );
    }

    if (width && height) {
      return (
        <div className={`relative ${className}`}>
                    <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
            loading="eager"
            unoptimized={unoptimized}
          />
        </div>
      );
    }

    return (
      <div className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit }}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager" 
          unoptimized={unoptimized}
        />
      </div>
    );
  }

  // Show skeleton while loading
  if (isLoading && !shouldLoad) {
    return (
      <div ref={imageRef} className={className}>
        <ImageSkeleton 
          height={height ? `${height}px` : 'h-full'} 
          width={width ? `${width}px` : 'w-full'} 
        />
      </div>
    );
  }

  if (hasError && showErrorState) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}>
        <span>Load failed</span>
      </div>
    );
  }

  // first loaded image
  if (fill) {
    return (
      <div ref={imageRef} className={`relative ${className}`}>
        {shouldLoad ? (
                      <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit }}
              sizes={sizes}
              onLoad={handleLoad}
              onError={handleError}
              loading={lazy ? "lazy" : "eager"}
              unoptimized={unoptimized}
            />
        ) : (
          <ImageSkeleton height="h-full" width="w-full" />
        )}
        {isLoading && showLoadingState && shouldLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            {/* Frame Animation  */}
            <FrameAnimation />
          </div>
        )}
      </div>
    );
  }

  if (width && height) {
    return (
      <div ref={imageRef} className={`relative ${className}`}>
        {shouldLoad ? (
                      <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{ objectFit }}
              onLoad={handleLoad}
              onError={handleError}
              loading={lazy ? "lazy" : "eager"}
              unoptimized={unoptimized}
            />
        ) : (
          <ImageSkeleton height={`${height}px`} width={`${width}px`} />
        )}
        {isLoading && showLoadingState && shouldLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#4F46E5]"
              style={{
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}
            ></div>
            {/* Frame Animation */}
            <FrameAnimation />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={imageRef} className={`relative ${className}`}>
      {shouldLoad ? (
                    <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit }}
              onLoad={handleLoad}
              onError={handleError}
              loading={lazy ? "lazy" : "eager"}
              unoptimized={unoptimized}
            />
      ) : (
        <ImageSkeleton height="h-full" width="w-full" />
      )}
      {isLoading && showLoadingState && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          {/* Frame Animation */}
          <FrameAnimation />
        </div>
      )}
    </div>
  );
};

export default ImageDisplay; 