'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HEADER_URLS } from '@/config/url.config';

const HeaderLogo: React.FC = () => {
  return (
    <div 
      className="header-logo"
      style={{
        flexShrink: 0,
        width: '350px',
        cursor: 'pointer',
      }}
    >
      <Link 
        href={HEADER_URLS.HOME}
        target="_self"
        rel="noopener noreferrer"
        style={{
          cursor: 'pointer',
          display: 'block',
        }}
      >
        <Image 
          src="/bella_virtual_black.svg"
          alt="Bella Staging Logo" 
          width={350} 
          height={87}
          unoptimized={true}
          className="header-logo-image"
          style={{
            height: '87px', // Fixed height for desktop
            width: 'auto',
            cursor: 'pointer',
            display: 'block',
          }}
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
