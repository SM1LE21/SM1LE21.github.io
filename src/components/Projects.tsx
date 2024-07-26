import React from 'react';
import { Link } from 'react-router-dom';

interface Project {
  title: string;
  description: string;
  image?: string;
  video?: string;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="projects">
      <h2>PROJECTS</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-item">
            {project.video ? (
              <div className="project-background">
                <video autoPlay loop muted playsInline>
                  <source src={project.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              project.image && (
                <div className="project-background" style={{ backgroundImage: `url(${project.image})` }}></div>
              )
            )}
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <Link to={`/project/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="landingpage-project-link" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
