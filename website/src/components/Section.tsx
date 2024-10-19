/*
 * Section.tsx
 * The component for displaying a section with a title and content
 * It can also display a timeline of items
 * The component is used in About and Experience
 */

import React from 'react';

interface TimelineItem {
  date?: string;
  jobTitle: string;
  title_link?: string;
  company?: string;
  company_link?: string;
  description?: string;
  skills?: string[];
}

interface SectionProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  timelineItems?: TimelineItem[];
}

const Section: React.FC<SectionProps> = ({ id, title, children, timelineItems }) => {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
      {timelineItems && (
        <div className="timeline">
          {timelineItems.map((item, index) => (
            <div key={index} className="timeline-item">
              {item.date && <div className="date">{item.date}</div>}
              {item.title_link ? (
                <div className="job-title">
                  <a href={item.title_link} className="title-link" target="_blank" rel="noopener noreferrer">
                    {item.jobTitle}
                  </a>
                </div>
              ) : (
                <div className="job-title">{item.jobTitle}</div>
              )}
              {item.company && item.company_link ? (
                <div className="company">
                  <a href={item.company_link} className="company-link" target="_blank" rel="noopener noreferrer">
                    {item.company}
                  </a>
                </div>
              ) : (
                item.company && <div className="company">{item.company}</div>
              )}
              {item.description && <div className="description">{item.description}</div>}
              {item.skills && (
                <div className="skills">
                  {item.skills.map(skill => (
                    <span key={skill} className="skill">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Section;
