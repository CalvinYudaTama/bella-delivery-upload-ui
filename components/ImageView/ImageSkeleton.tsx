import React from 'react';

interface ImageSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  className = "",
  height = "h-48",
  width = "w-full"
}) => (
  <div className={`${width} ${height} ${className}`}>
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg">
      <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg" />
    </div>
  </div>
);

// Product card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="relative rounded-2xl overflow-hidden">
    {/* Image placeholder */}
    <ImageSkeleton height="h-48" />

    {/* Text placeholder */}
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse" />
      <div className="h-3 bg-gray-300 rounded w-2/3 animate-pulse" />
    </div>
  </div>
); 