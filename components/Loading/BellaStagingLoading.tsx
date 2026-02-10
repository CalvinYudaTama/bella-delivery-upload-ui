'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface BellaStagingLoadingProps {
  className?: string;
  size?: number;
}

// Lottie animation data type
type LottieAnimationData = Record<string, unknown>;

const BellaStagingLoading: React.FC<BellaStagingLoadingProps> = ({
  className = '',
  size = 260
}) => {
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    // Load animation JSON from public folder
    fetch('/animation/bella-staging-loading.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load animation');
        }
        return response.json();
      })
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error('Failed to load animation:', error);
      });
  }, []);

  if (!animationData) {
    // Return empty div while loading to maintain size
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default BellaStagingLoading;
