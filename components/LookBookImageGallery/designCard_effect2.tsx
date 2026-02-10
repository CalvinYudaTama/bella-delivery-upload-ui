import Image from "next/image";
import { useState, useCallback} from "react";
import { useRouter } from 'next/navigation';
import CollectionButton from "@/components/Button/CollectionButton";
import { getBrandConfig } from "@/config/brandConfig";

interface DesignCardEffect2Props {
  image: string;
  imageId?: string;
  description?: string | null; 
  // likes: number;
  brandName?: string; 
  furnitureListNumbers?: string[];
  roomType?: string | null;
  style?: string | null;
  handleCollectClick: (wasInCollection: boolean) => void;
}

const DesignCardEffect2: React.FC<DesignCardEffect2Props> = ({ 
  image, 
  imageId,
  description, 
  // likes,
  brandName = "Bella Virtual Staging",
  furnitureListNumbers = [], // eslint-disable-line @typescript-eslint/no-unused-vars
  roomType = null,
  style = null,
  handleCollectClick
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);


  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleCardClick = useCallback(() => {
    if (imageId) {
      router.push(`/${imageId}`);
    }
  }, [router, imageId]);

  // Capitalize first letter of roomType
  const capitalizeFirstLetter = (str: string | null | undefined): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Get white logo for brand
  const brandConfig = brandName ? getBrandConfig(brandName) : null;
  const whiteLogo = brandConfig?.whiteLogo;

  return (
    <div 
      className="absolute inset-0 overflow-hidden rounded-lg cursor-pointer bg-white transition-all duration-500 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Image container - responsive size */}
      <div 
        className="relative transition-all duration-500 ease-in-out w-full"
        style={{
          width: '100%',
          height: isHovered ? 'calc(100% - 55px)' : '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!imageError ? (
          <>
            <Image
              src={image}
              alt={description || 'Design image'}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ zIndex: 0 }}
              onError={() => {
                setImageError(true);
              }}
            />
            {/* Gradient overlay on hover - matches the background gradient specification */}
            {isHovered && (
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            )}
            {/* Brand White Logo - Top Left (only on hover) */}
            {isHovered && whiteLogo && (
              <div
                className="max-[431px]:!p-1.5"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  zIndex: 2,
                  padding: '12px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={whiteLogo}
                  alt={brandName || 'Brand logo'}
                  width={120}
                  height={40}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="max-[431px]:!h-6"
                  style={{
                    width: 'auto',
                    height: '50px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            {/* Collection Button - Top Right */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 3,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <CollectionButton 
                imageId={imageId || ''}
                imageUrl={image}
                title={description || 'Design image'}
                brandName={brandName}
                variant="card"
                onToggle={handleCollectClick}
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center p-4">
              <div className="text-sm text-gray-500">Image failed to load</div>
              {/* <div className="text-xs mt-1 opacity-75">ID: {imageId?.slice(0, 8)}...</div> */}
            </div>
          </div>
        )}
      </div>

      {/* Text information below image (only visible on hover) */}
      <div 
        className="bg-white transition-all duration-500 ease-in-out w-full max-[431px]:!h-auto max-[431px]:!py-2 max-[431px]:!px-3"
        style={{
          display: isHovered ? 'flex' : 'none',
          width: '100%',
          height: '55px',
          padding: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FFF',
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? 'visible' : 'hidden',
        }}
      >
        <h3 
          className="max-[431px]:!text-sm"
          style={{ 
            margin: 0,
            color: 'var(--Color-Grey-900, #000B14)',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '140%', // 22.4px
          }}
        >
          {roomType && style 
            ? `${capitalizeFirstLetter(roomType)} • ${style}` 
            : capitalizeFirstLetter(roomType) || style || brandName}
        </h3>
      </div>
    </div>
  );
}

export default DesignCardEffect2; 