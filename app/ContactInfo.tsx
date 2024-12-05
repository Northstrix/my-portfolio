'use client';

import React from 'react';
import linkStyles from '@/app/contact-info-styles.module.css';


interface ContainerProps {
  lines: string[];
}

const Container: React.FC<ContainerProps> = ({ lines }) => {
  return (
    <div className={linkStyles.container} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'left',
      height: '100%'
    }}>
      <div className={linkStyles.contentWrapper} style={{
        textAlign: 'left'
      }}>
        {lines.map((text, index) => (
          <div 
            key={index} 
            className={linkStyles.textLine}
            style={{
              fontSize: 'var(--font-size-medium-medium-high)',
              lineHeight: '1.5', // Adjust as needed
              padding: '5px 0' // Optional: adds some vertical spacing between lines
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

const LinkComponent: React.FC = () => {
  return (
    <div className={linkStyles.content}>
      <Container
        lines={[
          "maxim.bortnikov_fvrr@outlook.com",
          "Northstrix@emailthing.xyz",
          "Telegram: @maxim_bort", 
          "Discord: northstrix"
        ]}
      />
    </div>
  );
};

export default LinkComponent;