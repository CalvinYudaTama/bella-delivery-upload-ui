import React from 'react';

interface FrameAnimationProps {
  className?: string;
}

const FrameAnimation: React.FC<FrameAnimationProps> = ({ className = "" }) => {
  return (
    <div 
      className={`frame-animation ${className}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}
    />
  );
};

export default FrameAnimation;