import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import './Dashboard.css';

const Dashboard = () => {
  const { projects, createProject, loadProjects } = useContext(AppContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ projectName: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.projectName.trim()) return;

    setLoading(true);
    setError('');
    const result = await createProject(formData.projectName, formData.description);
    
    if (result.success) {
      setFormData({ projectName: '', description: '' });
      setShowCreateModal(false);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>
          + New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="no-projects">
            <p>No projects yet. Create one to get started!</p>
            <button onClick={() => setShowCreateModal(true)}>Create Project</button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows="4"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
