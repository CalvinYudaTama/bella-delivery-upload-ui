import React from 'react';
import Image from 'next/image';

const CompanyInfo: React.FC = () => {
  const socialMedia = [
    { name: 'Facebook', icon: '/footer/companyInfo/FACEBOOK.svg', url: '#' },
    { name: 'Instagram', icon: '/footer/companyInfo/INSTAGRAM.svg', url: '#' },
    { name: 'TikTok', icon: '/footer/companyInfo/TIKTOK.svg', url: '#' },
    { name: 'LinkedIn', icon: '/footer/companyInfo/LINKEDIN.svg', url: '#' },
    { name: 'Pinterest', icon: '/footer/companyInfo/PINTEREST.svg', url: '#' },
    { name: 'YouTube', icon: '/footer/companyInfo/YOUTUBE.svg', url: '#' }
  ];

  const navigationLinks = [
    { name: 'Contact Us', url: '#' },
    { name: 'Services', url: '#' },
    { name: 'Privacy Policy', url: '#' },
    { name: 'Blog', url: '#' },
    { name: 'FAQ', url: '#' }
  ];

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Image 
          src="/logoBlack.svg"
          alt="BELLA STAGING Logo"
          width={203.655}
          height={40.003}
          unoptimized={true} // SVG do not need optimized
        />
      </div>
      
      {/* Company Description */}
      <div 
        style={{
          width: '332px',
          height: '81px'
        }}
      >
        <p 
          className="leading-[27px] montserrat-body"
          style={{
            color: 'var(--neutral-700)',
            marginTop: '55px',
            alignSelf: 'stretch'
          }}
        >
          We are a team of interior designers, graphic designers and real estate experts located in the heart of Vancouver
        </p>
      </div>
      
      {/* Social Media Icons */}
      <div className="flex space-x-2.5" style={{ marginTop: '17px' }}>
        {socialMedia.map((social) => (
          <a
            key={social.name}
            href={social.url}
            className=" rounded-full flex items-center justify-center text-white"
            aria-label={social.name}
            style={{
              width: '34px',
              height: '33px'
            }}
          >
            <Image 
              src={social.icon} 
              alt={social.name}
              width={34}
              height={33}
              unoptimized={true} 
            />
          </a>
        ))}
      </div>

      {/* Navigation Links */}
      <div 
        className="flex flex-wrap" 
        style={{ 
          gap: '15px',
          marginTop: '55px',
          marginBottom: '8px'
        }}
      >
        {navigationLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            className="montserrat-body-bold"
            style={{
              color: 'var(--neutral-700)',
            }}
          >
            {link.name}
          </a>
        ))}
      </div>

    </div>
  );
};

export default CompanyInfo; 