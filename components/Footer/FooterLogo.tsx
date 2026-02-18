import React from 'react';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

interface FooterLogoProps {
  logo?: string;
  logoWidth?: number;
  description?: string;
  descriptionSize?: number;
  descriptionColor?: string;
  email?: string;
  phone?: string;
  showContactInfo?: boolean;
}

/**
 * FooterLogo Component
 * Logo section with description and contact info (from Shopify theme)
 */
const FooterLogo: React.FC<FooterLogoProps> = ({
  logo = '/bella_virtual_white.svg',
  logoWidth = 200,
  description = 'Bella Virtual Staging is a team of interior designers, graphic artists, and real estate experts.',
  descriptionSize = 14,
  descriptionColor = '#ffffff',
  email = 'hello@bellavirtual.com',
  phone = '+1 (234) 567-8900',
  showContactInfo = true,
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
              color: descriptionColor,
              marginBottom: showContactInfo ? '24px' : '0',
            }}
          >
            {description}
          </p>
        )}

        {/* Contact Info (from Shopify theme) */}
        {showContactInfo && (
          <div
            className="bella-footer__contact"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Email */}
            <div
              className="bella-footer__contact-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Mail
                style={{
                  width: '20px',
                  height: '20px',
                  color: descriptionColor,
                  opacity: 0.9,
                }}
              />
              <a
                href={`mailto:${email}`}
                style={{
                  color: descriptionColor,
                  fontSize: `${descriptionSize}px`,
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
              >
                {email}
              </a>
            </div>

            {/* Phone */}
            <div
              className="bella-footer__contact-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Phone
                style={{
                  width: '20px',
                  height: '20px',
                  color: descriptionColor,
                  opacity: 0.9,
                }}
              />
              <a
                href={`tel:${phone}`}
                style={{
                  color: descriptionColor,
                  fontSize: `${descriptionSize}px`,
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
              >
                {phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterLogo;

