'use client';

import React from 'react';
import CollectionIcon from './CollectionIcon';

interface HeaderIconsProps {
  onWishlistToggle: () => void;
}

const HeaderIcons: React.FC<HeaderIconsProps> = ({ onWishlistToggle }) => {
  return (
    <div className="flex items-center header-icons" style={{ gap: '16px' }}>
      {/* Collection/Wishlist */}
      <CollectionIcon 
        onClick={onWishlistToggle} 
        isWhiteMode={true}
      />
    </div>
  );
};

export default HeaderIcons;
