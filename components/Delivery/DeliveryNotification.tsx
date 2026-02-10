"use client";
import { CheckCircle } from 'lucide-react';
import React from 'react';

interface DeliveryNotificationProps {
  show: boolean;
  type: 'accept' | 'reject';
  title?: string;
}

const DeliveryNotification: React.FC<DeliveryNotificationProps> = ({ 
  show, 
  type,
  title,
}) => {
  if (!show) return null;

  // Define different styles and content based on type
  const getNotificationConfig = () => {
    switch (type) {
      case 'accept':
        return {
          icon: CheckCircle,
          iconColor: '#FFFFFF',
          iconBg: '#2BC556',
          borderColor: '#2BC556',
          title: title || "Image accepted successfully!",
        };
      case 'reject':
        return {
          icon: CheckCircle,
          iconColor: '#FFFFFF',
          iconBg: '#2BC556',
          borderColor: '#2BC556',
          title: title || "Feedback submitted successfully!",
        };
      default:
        return {
          icon: CheckCircle,
          iconColor: '#FFFFFF',
          iconBg: '#2BC556',
          borderColor: '#2BC556',
          title: title || "Success!",
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  return (
    <>
      <div className="fixed top-[150px] right-4 z-1003 max-[431px]:!top-[120px] max-[431px]:!right-2">
        {/* Main notification card */}
        <div 
          className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-4 rounded-sm border-2 animate-bounce-in-delivery max-[431px]:!px-4 max-[431px]:!py-3"
          style={{ 
            borderColor: config.borderColor,
          }}
        >
          <div className="flex items-center gap-3 max-[431px]:!gap-2">
            {/* Icon */}
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center max-[431px]:!w-6 max-[431px]:!h-6"
              style={{ background: config.iconBg }}
            >
              <Icon 
                className="w-5 h-5 max-[431px]:!w-4 max-[431px]:!h-4" 
                style={{ color: config.iconColor }}
              />
            </div>
            
            {/* Text content */}
            <div className="flex-1">
              <div 
                className="font-bold text-sm opacity-90 max-[431px]:!text-xs"
                style={{
                  color: '#000B14',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '20px',
                }}
              >
                {config.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for bounce-in animation */}
      <style jsx>{`
        @keyframes bounce-in-delivery {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-bounce-in-delivery {
          animation: bounce-in-delivery 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default DeliveryNotification;

