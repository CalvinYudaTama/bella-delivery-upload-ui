import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <div 
      className="text-right montserrat-body-bold uppercase"
      style={{
        textAlign: 'right',
      }}
    >
      {/* Main Heading */}
      <h2 
        className="uppercase montserrat-h1"
        style={{
          color: 'var(--neutral-900)',
          textAlign: 'right',
        }}
      >
        DESIGN YOUR DREAM SPACE
      </h2>
      
      {/* Sub-heading */}
      <p 
        className="mt-6 montserrat-body"
        style={{
          color: 'var(--neutral-700)',
          textAlign: 'right',
        }}
      >
        Tell us about your upcoming project
      </p>
      
      {/* Contact Button */}
      <div className="mt-6 flex justify-end">
        <button 
          className="uppercase flex items-center justify-center montserrat-body-bold"
          style={{
            width: '170px',
            height: '40px',
            flexShrink: 0,
            borderRadius: '12px',
            background: 'var(--neutral-900)',
            color: 'var(--neutral-0)',
            lineHeight: 'normal',
            textTransform: 'uppercase'
          }}
        >
          CONTACT US
        </button>
      </div>
    </div>
  );
};

export default CallToAction; 