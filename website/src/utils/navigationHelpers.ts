// src/utils/navigationHelpers.ts

import { NavigateFunction, Location } from 'react-router-dom';

export const navigateToSection = (
  sectionName: string,
  navigate: NavigateFunction,
  location: Location
) => {
  const sectionId = getSectionIdFromName(sectionName);

  // Function to scroll to section after navigation
  const scrollAfterNavigation = () => {
    const checkIfSectionExists = setInterval(() => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        clearInterval(checkIfSectionExists);
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (location.pathname !== '/') {
    navigate('/', { replace: true });
    scrollAfterNavigation();
  } else {
    scrollAfterNavigation();
  }
};

export const getSectionIdFromName = (sectionName: string): string => {
  const mapping: { [key: string]: string } = {
    about: 'about',
    projects: 'projects',
    experience: 'experience',
    certificates: 'certificates',
    education: 'education',
    // Add more sections here when adding them to the website
  };
  return mapping[sectionName.toLowerCase()] || '';
};
