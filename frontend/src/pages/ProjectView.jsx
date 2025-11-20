import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { projectsAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import './ProjectView.css';

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProjectTasks, updateTask, createTask, loadProjectTasks, currentUser, socket } = useContext(AppContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: currentUser?._id || '',
  });

  const allTasks = getProjectTasks(projectId);

  useEffect(() => {
    loadProject();
    loadProjectTasks(projectId);
    
    if (socket) {
      socket.emit('joinProject', projectId);
      
      socket.on('taskCreated', (data) => {
        if (data.projectId === projectId) {
          loadProjectTasks(projectId);
        }
      });
      
      socket.on('taskUpdated', (data) => {
        if (data.projectId === projectId) {
          loadProjectTasks(projectId);
        }
      });
      
      return () => {
        socket.off('taskCreated');
        socket.off('taskUpdated');
      };
    }
  }, [projectId, socket]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getById(projectId);
      setProject(response.data.project);
    } catch (error) {
      setError('Failed to load project');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner">Loading project...</div></div>;
  }

  if (!project) {
    return (
      <div className="project-view error">
        <p>Project not found</p>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  // Filter tasks
  let filteredTasks = allTasks;
  if (filter !== 'ALL') {
    filteredTasks = allTasks.filter(task => task.status === filter);
  }

  // Sort tasks
  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === 'priority') {
      const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'created') {
      return new Date(b.createdDate) - new Date(a.createdDate);
    }
    return 0;
  });

  // Group tasks by status for Kanban view
  const todoTasks = allTasks.filter(t => t.status === 'TODO');
  const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = allTasks.filter(t => t.status === 'DONE');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskForm.dueDate || !taskForm.assignedTo) return;

    const result = await createTask(projectId, {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      assignedTo: taskForm.assignedTo
    });

    if (result.success) {
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: currentUser?._id || '' });
      setShowTaskModal(false);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="project-view">
      <div className="project-header-section">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <div className="project-title">
          <h1>{project.projectName}</h1>
          <p>{project.description}</p>
        </div>
        <button className="btn-add-task" onClick={() => setShowTaskModal(true)}>+ Add Task</button>
      </div>

      <div className="project-stats">
        <div className="stat-item">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{allTasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">To Do</span>
          <span className="stat-value">{todoTasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgressTasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Done</span>
          <span className="stat-value">{doneTasks.length}</span>
        </div>
      </div>

      <div className="controls">
        <div className="filter-controls">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Tasks</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="sort-controls">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Recently Created</option>
          </select>
        </div>
      </div>

      {filter === 'ALL' ? (
        <div className="kanban-board">
          <KanbanColumn title="To Do" tasks={todoTasks} status="TODO" onTaskClick={setSelectedTask} onStatusChange={(taskId, status) => updateTask(taskId, { status })} />
          <KanbanColumn title="In Progress" tasks={inProgressTasks} status="IN_PROGRESS" onTaskClick={setSelectedTask} onStatusChange={(taskId, status) => updateTask(taskId, { status })} />
          <KanbanColumn title="Done" tasks={doneTasks} status="DONE" onTaskClick={setSelectedTask} onStatusChange={(taskId, status) => updateTask(taskId, { status })} />
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))
          ) : (
            <p className="no-tasks">No tasks found</p>
          )}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          project={project}
        />
      )}

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  type="text"
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date *</label>
                <input
                  type="date"
                  id="dueDate"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="assignedTo">Assign To *</label>
                <select
                  id="assignedTo"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  required
                >
                  <option value="">Select team member</option>
                  {project.members?.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.username}
                    </option>
                  ))}
                </select>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const KanbanColumn = ({ title, tasks, status, onTaskClick, onStatusChange }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (draggedTask) {
      onStatusChange(draggedTask, status);
      setDraggedTask(null);
    }
  };

  return (
    <div className="kanban-column" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <h3>{title}</h3>
      <div className="column-badge">{tasks.length}</div>
      <div className="tasks-container">
        {tasks.map(task => (
          <div
            key={task._id}
            draggable
            onDragStart={() => setDraggedTask(task._id)}
            onDragEnd={() => setDraggedTask(null)}
            onClick={() => onTaskClick(task)}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectView;
