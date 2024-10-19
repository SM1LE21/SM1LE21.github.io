/*
 * EmbeddedWebsite.tsx
 * For projects with an embedded website
 * This component is used in the Project component
 * It takes a url prop and renders an iframe with the website embedded
 */

import React from 'react';

const EmbeddedWebsite: React.FC<{ url: string }> = ({ url }) => {
  return (
    <iframe
      src={url}
      title="Embedded Website"
      style={{ width: '100%', height: '500px', border: 'none', background: 'white', borderRadius: '8px'}}
    />
  );
};

export default EmbeddedWebsite;
