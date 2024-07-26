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
