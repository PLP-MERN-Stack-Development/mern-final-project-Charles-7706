import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { format } from 'date-fns';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { getProjectTasks } = useContext(AppContext);
  const projectTasks = getProjectTasks(project._id);
  
  const completedTasks = projectTasks.filter(t => t.status === 'DONE').length;
  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  return (
    <Link to={`/project/${project._id}`} className="project-card-link">
      <div className="project-card">
        <div className="project-header">
          <h3>{project.projectName}</h3>
          <span className="project-badge">{projectTasks.length} Tasks</span>
        </div>

        <p className="project-description">{project.description || 'No description'}</p>

        <div className="project-progress">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{Math.round(progress)}% Complete</span>
        </div>

        <div className="project-footer">
          <div className="project-owner">
            <img 
              src={project.ownerId?.profilePicture || 'https://i.pravatar.cc/150?img=default'} 
              alt={project.ownerId?.username || 'Owner'} 
              className="owner-avatar" 
            />
            <span>{project.ownerId?.username || 'Unknown'}</span>
          </div>
          <span className="updated-date">{formatDate(project.updatedDate)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
