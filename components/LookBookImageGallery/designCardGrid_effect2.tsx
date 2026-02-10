"use client";
import DesignCardEffect2 from "./designCard_effect2";
import AnimationNotification from "../Notification/animationNotification";

interface DesignCardProps {
  image: string;
  imageId?: string;
  description?: string | null;
  // likes: number;
  brandName?: string;
  furnitureListNumbers?: string[];
  roomType?: string | null;
  style?: string | null;
}

interface DesignCardGridEffect2Props {
  cards: DesignCardProps[];
  handleCollectClick: (wasInCollection: boolean) => void;
  showNotification: boolean;
  notificationType?: 'add' | 'remove';
}

const DesignCardGridEffect2: React.FC<DesignCardGridEffect2Props> = ({ 
  cards, 
  handleCollectClick, 
  showNotification, 
  notificationType = 'add' 
}) => {
  return (
    <div className="relative" style={{ paddingTop: 0, marginTop: 0 }}>
      <div className="flex flex-wrap -mx-4 max-[761px]:-mx-2 max-[431px]:-mx-1.2" style={{ paddingTop: 0, marginTop: 0 }}>
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="w-full md:w-1/3 p-4 max-[761px]:w-1/2 max-[761px]:p-2 max-[431px]:w-1/2 max-[431px]:p-2"
          >
            <div className="aspect-square w-full relative">
              <DesignCardEffect2
                image={card.image}
                imageId={card.imageId}
                description={card.description}
                brandName={card.brandName}
                furnitureListNumbers={card.furnitureListNumbers}
                roomType={card.roomType}
                style={card.style}
                handleCollectClick={handleCollectClick}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Animation Notification */}
      <AnimationNotification 
        show={showNotification}
        type={notificationType}
      />
    </div>
  );
};

export default DesignCardGridEffect2; 