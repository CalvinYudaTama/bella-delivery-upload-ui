import React from 'react';
import Image from 'next/image';

interface FooterLogoProps {
  logo?: string;
  logoWidth?: number;
  description?: string;
  descriptionSize?: number;
  descriptionColor?: string;
}

const FooterLogo: React.FC<FooterLogoProps> = ({
  logo = '/bella_virtual_white.svg', 
  logoWidth = 200,
  description = 'Bella Virtual Staging is a team of interior designers, graphic artists, and real estate experts.',
  descriptionSize = 14,
  descriptionColor = '#ffffff'
}) => {
  return (
    <div className="bella-footer__column bella-footer__column--logo">
      <div className="bella-footer__logo-wrapper">
        {logo ? (
          <Image
            src={logo}
            alt="Bella Staging Logo"
            width={logoWidth}
            height={40}
            className="bella-footer__logo"
            unoptimized={true}
          />
        ) : (
          <h2 className="bella-footer__logo-text">Bella Virtual Staging</h2>
        )}
        
        {description && (
          <p 
            className="bella-footer__description"
            style={{
              fontSize: `${descriptionSize}px`,
              color: descriptionColor
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default FooterLogo;

