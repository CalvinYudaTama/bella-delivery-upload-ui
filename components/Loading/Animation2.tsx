import React from 'react';

interface Animation2Props {
  className?: string;
  size?: number; 
}

const Animation2: React.FC<Animation2Props> = ({ 
  className = "",
  size = 260
}) => {
  return (
    <div 
      className={`animation-2 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default Animation2;

