'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import linkStyles from '@/app/link-styles.module.css';

interface ContainerProps {
  icon?: React.ReactNode;
  title: string;
  count: string;
  subtitle: string;
  link: string;
}

const Container: React.FC<ContainerProps> = ({ icon, title, count, subtitle, link }) => {
  return (
    <div className={linkStyles.container}>
      <div className={linkStyles.iconContainer}>
        {icon}
        <h1 style={{
          fontSize: '25px',
          margin: 0,
          lineHeight: 1.2
        }}>{title}</h1>
      </div>
      <h2 style={{
        fontSize: '96px',
        fontWeight: '700',
        textAlign: 'left',
        marginTop: 'calc(74px - (-15px))',
        marginBottom: '-12px'
      }}>{count}</h2>
      <h3 style={{
        fontSize: '24px',
        textAlign: 'left',
        marginTop: 'calc(8px)',
        marginBottom: 'auto'
      }}>{subtitle}</h3>
      <h4 style={{
        fontSize: '20px',
        position: 'absolute',
        bottom: 'calc(31px)'
      }}>
        <a href={link} className={linkStyles.inheritColor} target="_blank" rel="noopener noreferrer">
          Learn More ➔
        </a>
      </h4>
    </div>
  );
};

const LinkComponent: React.FC = () => {
  return (
    <div className={linkStyles.content}>
      <Container
        icon={<FontAwesomeIcon icon={faGithub as IconDefinition} className={linkStyles.icon} />}
        title="GitHub"
        count="80+"
        subtitle="Repositories"
        link="https://github.com/Northstrix"
      />
      <Container
        icon={<FontAwesomeIcon icon={faMedium as IconDefinition} className={linkStyles.icon} />}
        title="Medium"
        count=">30"
        subtitle="Articles"
        link="https://medium.com/@Northstrix"
      />
      <Container
        icon={<FontAwesomeIcon icon={faTools as IconDefinition} className={linkStyles.icon} />}
        title="Instructables"
        count=">75"
        subtitle="Tutorials"
        link="https://www.instructables.com/member/Northstrix/instructables/"
      />
      <Container
        title="SourceForge"
        count="40+"
        subtitle="Projects"
        link="https://sourceforge.net/u/northstrix/profile/"
      />
    </div>
  );
};

export default LinkComponent;