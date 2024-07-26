import React from 'react';

interface ContentProps {
  title?: string;
  image?: string;
  description?: string; 
  video?: string;
}

const ContentSection: React.FC<ContentProps> = ({ title, image, description, video }) => {
  const noDescription = !description;

  return (
    <div className={`content-section ${noDescription ? 'no-description' : ''}`}>
      {title && <h3 className="content-title">{title}</h3>}
      {video ? (
        <video autoPlay loop muted className="content-media">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        image && <img src={image} alt="Project content" className="content-media" />
      )}
      {description && <p className={`content-description ${!image && !video ? 'full-width' : ''}`}>{description}</p>}
    </div>
  );
};

export default ContentSection;
