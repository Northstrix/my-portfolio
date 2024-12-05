"use client"
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FileContainerProps {
  id: string;
  title: string;
  color: string;
  description: string;
  metadataIntegrity?: boolean;
  imageUrl: string;
  link: string;
}

const FileContainer: React.FC<FileContainerProps> = ({ 
  title, 
  color, 
  description, 
  metadataIntegrity,
  imageUrl,
  link
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverColor = (color === "#feea00") ? '#242424' : 'white';
  const displayedTitle = title.length > 27 ? title.slice(0, 24) + '...' : title;
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.setProperty('--backgroundGradient', backgroundGradient);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const angle = Math.atan2(-x, y);
      container.style.setProperty("--rotation", `${angle}rad`);
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const backgroundGradient = metadataIntegrity
    ? `linear-gradient(var(--rotation), var(--sharedFilesDefaultColor), var(--sharedFilesDefaultColor) 20%, var(--sharedFilesSecondColor) 80%, var(--sharedFilesSecondColor))`
    : `linear-gradient(var(--rotation), var(--generalErrorColor), var(--generalErrorColor))`;

  const handleClick = () => {
    window.open(link, '_blank');
  };

  return (
    <div className="file-container" ref={containerRef} onClick={handleClick}>
      <div className="inner-container">
        <div className="image-container">
        <img src={imageUrl} alt={title} className="file-image" />
        </div>
        <div className="content">
          <h1 className="text">
            <span className="title" title={title}>{displayedTitle}</span>
            <span className="text-effect" style={{ backgroundColor: color }}></span>
          </h1>
          <p className="description" style={{ 
                  direction: isRTL ? 'rtl' : 'ltr'
                }}>{description}</p>
        </div>
      </div>
      <style jsx>{`
        .file-container {
          --rotation: 2.5rad;
          width: 388px;
          height: 378px;
          border: 3px solid transparent;
          border-radius: var(--generalBorderRadius);
          background-image: linear-gradient(var(--loginFormBackground), var(--loginFormBackground)), var(--backgroundGradient);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          position: relative;
          overflow: hidden;
          padding: 14px;
          cursor: pointer;
        }
        .inner-container {
          width: 354px;
          height: 344px;
          background-color: black;
          border-radius: var(--generalBorderRadiusInner);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(45deg, rgba(230, 230, 230, 0.15) 25%, transparent 25%, transparent 75%, rgba(240, 240, 240, 0.15) 75%), 
                      linear-gradient(-45deg, rgba(240, 240, 240, 0.15) 25%, transparent 25%, transparent 75%, rgba(230, 230, 230, 0.15) 75%);
          background-size: 20.84px 18.71px;
        }
        .image-container {
          width: 100%;
          height: 236px; /* Aspect ratio of 1316:876 */
          position: relative;
          overflow: hidden;
        }
        .content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 16px;
        }
        .text {
          font-size: 27px;
          font-weight: bold;
          letter-spacing: -.01em;
          line-height: normal;
          margin-bottom: 5px;
          width: auto;
          color: ${color};
          transition: color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .text:hover {
          color: ${hoverColor} !important;
        }
        .title {
          position: relative;
          z-index: 10;
          padding: 2px 4px;
        }
        .text-effect {
          clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
          transform-origin: center;
          transition: all cubic-bezier(.1,.5,.5,1) 0.4s;
          position: absolute;
          left: -4px;
          right: -4px;
          top: -4px;
          bottom: -4px;
          z-index: 0;
        }
        .text:hover > .text-effect {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }
        .description {
          font-size: 18px;
          color: white;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .file-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default FileContainer;