import React, { useState, useRef } from 'react';
import FurnitureInfoCard from '../FurnitureInfoCard/FurnitureInfoCard';
import { AbsolutePosition } from '@/utils/coordinateUtils';

interface HotspotButtonProps {
  onClick?: () => void;
  className?: string;
  productName?: string;
  productType?: string;
  price?: string;
  showInfoCard?: boolean;
  position?: AbsolutePosition;
  furnitureId?: string;
  furnitureName?: string;
  furnitureType?: string;
  furnitureDescription?: string;
  furnitureMaterial?: Record<string, unknown>;
}

const HotspotButton: React.FC<HotspotButtonProps> = ({ 
  onClick, 
  className = "", 
  productName = "",
  price = "$279.00",
  showInfoCard = true,
  position,
  // furnitureId, 
  furnitureName,
  furnitureType,
  furnitureDescription,
  furnitureMaterial
}) => {
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (showInfoCard) {
      // Get button position
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setCardPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }
      setIsButtonVisible(false);
      setIsInfoCardVisible(true);
    }
    
    // Call original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  const handleCloseInfoCard = () => {
    setIsInfoCardVisible(false);
    setIsButtonVisible(true);
  };

  // Fixed small size
  const sizeClasses = 'w-6 h-6 text-xs';

  // use the furniture information or default value
  const displayProductName = furnitureName || productName;

  // calculate button style
  const buttonStyle: React.CSSProperties = {
    animation: 'float 1s ease-out forwards'
  };

  // if there is absolute positioning, add positioning style
  if (position) {
    buttonStyle.position = 'absolute';
    buttonStyle.left = `${position.x}px`;
    buttonStyle.top = `${position.y}px`;
    buttonStyle.transform = 'translate(-50%, -50%)'; // center positioning
    buttonStyle.zIndex = 10; // ensure on top of the image
  }

  return (
    <>
      {/* Hotspot Button with floating animation */}
      {isButtonVisible && (
        <button
          ref={buttonRef}
          onClick={handleClick}
          className={`
            ${sizeClasses}
            bg-white
            rounded-full 
            flex 
            items-center 
            justify-center 
            text-black 
            font-bold 
            hover:bg-red-50
            hover:border-red-500 
            hover:text-red-500 
            transition-all 
            duration-200 
            cursor-pointer
            ${className}
          `}
          style={buttonStyle}
          type="button"
        >
          +
        </button>
      )}

      {/* Furniture Info Card */}
      {showInfoCard && (
        <div ref={cardRef}>
          <FurnitureInfoCard
            productName={displayProductName}
            price={price}
            isVisible={isInfoCardVisible}
            onClose={handleCloseInfoCard}
            position={cardPosition}
            description={furnitureDescription}
            material={furnitureMaterial}
            furnitureType={furnitureType}
          />
        </div>
      )}
    </>
  );
};

export default HotspotButton; 