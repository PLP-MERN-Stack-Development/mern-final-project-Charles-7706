import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './TaskCard.css';

const TaskCard = ({ task, onClick }) => {
  const { getUserById } = useContext(AppContext);
  const assignedUser = getUserById(task.assignedTo);

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: '#95a5a6',
      IN_PROGRESS: '#f39c12',
      DONE: '#27ae60',
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="task-status" style={{ backgroundColor: getStatusColor(task.status) }}>
          {task.status.replace('_', ' ')}
        </div>
        <span className="due-date">📅 {task.dueDate}</span>
      </div>

      <div className="task-footer">
        {assignedUser && (
          <div className="assigned-user">
            <img src={assignedUser.profilePicture} alt={assignedUser.username} />
            <span>{assignedUser.username}</span>
          </div>
        )}
        {task.comments.length > 0 && (
          <span className="comment-count">💬 {task.comments.length}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
