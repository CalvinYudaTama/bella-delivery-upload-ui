import React from 'react';
import Image from 'next/image';

interface FooterBottomProps {
  copyrightText?: string;
  copyrightSize?: number;
  copyrightColor?: string;
  showPaymentIcons?: boolean;
  paymentIcons?: Array<{ name: string; icon: string; width?: number; height?: number }>;
  socialLinks?: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

const FooterBottom: React.FC<FooterBottomProps> = ({
  copyrightText = `© ${new Date().getFullYear()} bella-staging. All rights reserved.`,
  copyrightSize = 12,
  copyrightColor = '#ffffff',
  showPaymentIcons = true,
  paymentIcons = [
    { name: 'American Express', icon: '/footer/paymentMethods/Payment-2/amex.svg' },
    { name: 'Apple Pay', icon: '/footer/paymentMethods/Payment-2/Img-1.svg' },
    { name: 'Diners Club', icon: '/footer/paymentMethods/Payment-2/Img-4.svg' },
    { name: 'Discover', icon: '/footer/paymentMethods/Payment-2/Img-3.svg' },
    { name: 'Google Pay', icon: '/footer/paymentMethods/Payment-2/Img-2.svg' },
    { name: 'Mastercard', icon: '/footer/paymentMethods/Payment-2/Img-5.svg' },
    { name: 'PayPal', icon: '/footer/paymentMethods/Payment-2/Img-6.svg' },
    { name: 'Shop Pay', icon: '/footer/paymentMethods/Payment-2/Img-7.svg' },
    { name: 'Visa', icon: '/footer/paymentMethods/Payment-2/Img-8.svg' }
  ],
  socialLinks = [
    { name: 'Twitter', icon: '/footer/Social-2/X_Icon.svg', url: '#' },
    { name: 'LinkedIn', icon: '/footer/Social-2/LinkedIn_Icon.svg', url: '#' },
    { name: 'Facebook', icon: '/footer/Social-2/Facebook_Icon.svg', url: '#' },
    { name: 'YouTube', icon: '/footer/Social-2/Youtube_Icon.svg', url: '#' },
    { name: 'Instagram', icon: '/footer/Social-2/Instagram_Icon.svg', url: '#' },
    { name: 'TikTok', icon: '/footer/Social-2/Tiktok_Icon.svg', url: '#' }
  ]
}) => {
  return (
    <div className="bella-footer__bottom">
      <div className="bella-footer__bottom-content">
        {/* Copyright */}
        <div className="bella-footer__copyright">
          <p
            style={{
              fontSize: `${copyrightSize}px`,
              color: copyrightColor
            }}
          >
            {copyrightText}
          </p>
        </div>

        {/* Right Section: Payment + Social */}
        <div className="bella-footer__right-section">
          {/* Payment Icons */}
          {showPaymentIcons && paymentIcons.length > 0 && (
            <div className="bella-footer__payment-icons">
              {paymentIcons.map((payment, index) => (
                <Image
                  key={index}
                  src={payment.icon}
                  alt={payment.name}
                  width={payment.width || 24}
                  height={payment.height || 24}
                  className="bella-footer__payment-icon"
                  unoptimized={true}
                />
              ))}
            </div>
          )}

          {/* Social Media Icons */}
          {socialLinks.length > 0 && (
            <div className="bella-footer__social-icons">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="bella-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="bella-footer__social-icon-img"
                    unoptimized={true}
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;

