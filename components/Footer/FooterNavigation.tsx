import React from 'react';
import Image from 'next/image';

const FooterNavigation: React.FC = () => {
  const paymentMethods = [
    { name: 'Visa', icon: '/footer/paymentMethods/visa.svg', width: 48, height: 29 },
    { name: 'Mastercard', icon: '/footer/paymentMethods/mastercard.svg', width: 48, height: 29 },
    { name: 'Maestro', icon: '/footer/paymentMethods/maestro.svg', width: 48, height: 29 },
    { name: 'American Express', icon: '/footer/paymentMethods/American_Express_logo.svg', width: 48, height: 29 },
    { name: 'Google Pay', icon: '/footer/paymentMethods/google-pay.svg', width: 48, height: 29 },
    { name: 'Apple Pay', icon: '/footer/paymentMethods/Apple_Pay_logo.svg', width: 35, height: 14 },
    { name: 'PayPal', icon: '/footer/paymentMethods/paypal.svg', width: 48, height: 29 },
    { name: 'Amazon Pay', icon: '/footer/paymentMethods/amazon-pay.svg', width: 30, height: 19 },
    { name: 'Klarna', icon: '/footer/paymentMethods/Klarna.svg', width: 36, height: 19 }
  ];

  return (
    <section 
      style={{
        padding: '0 0 0 12'
      }}
    >
      {/* Custom border line */}
      <div 
        style={{
          width: '1232px',
          height: '1px',
          backgroundColor: 'var(--neutral-200)'
        }}
      />
      
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '3px',
          alignSelf: 'stretch'
        }}
      >
        {/* Copyright and Payment Methods Row */}
        <div className="flex justify-between items-center w-full">
          {/* Copyright */}
          <p 
            className="body-sm montserrat-body"
            style={{
              color: 'var(--neutral-500)',
            }}
          >
            © 2024, Bella Virtual Staging
          </p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex items-center justify-center"
                title={method.name}
                style={{
                  width: '48px',
                  height: '29px',
                  flexShrink: 0
                }}
              >
                <Image 
                  src={method.icon} 
                  alt={method.name}
                  width={method.width}
                  height={method.height}
                  unoptimized={true} 
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterNavigation; 