import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose, project }) => {
  const { getUserById, addTaskComment, updateTaskStatus } = useContext(AppContext);
  const [newComment, setNewComment] = React.useState('');
  const assignedUser = getUserById(task.assignedTo);
  const createdByUser = getUserById(task.createdBy);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addTaskComment(task.id, newComment);
      setNewComment('');
    }
  };

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>{task.title}</h2>
          <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3>Description</h3>
            <p>{task.description}</p>
          </section>

          <section className="modal-section">
            <h3>Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Project</span>
                <span className="detail-value">{project.projectName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <select value={task.status} onChange={(e) => handleStatusChange(e.target.value)} className="status-select">
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Date</span>
                <span className="detail-value">📅 {task.dueDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created</span>
                <span className="detail-value">{task.createdDate}</span>
              </div>
            </div>
          </section>

          <section className="modal-section">
            <h3>Assigned To</h3>
            {assignedUser && (
              <div className="user-info">
                <img src={assignedUser.profilePicture} alt={assignedUser.username} />
                <div>
                  <p className="user-name">{assignedUser.username}</p>
                  <p className="user-email">{assignedUser.email}</p>
                </div>
              </div>
            )}
          </section>

          <section className="modal-section">
            <h3>Created By</h3>
            {createdByUser && (
              <div className="user-info">
                <img src={createdByUser.profilePicture} alt={createdByUser.username} />
                <div>
                  <p className="user-name">{createdByUser.username}</p>
                  <p className="user-email">{createdByUser.email}</p>
                </div>
              </div>
            )}
          </section>

          <section className="modal-section">
            <h3>Comments ({task.comments.length})</h3>
            <div className="comments-list">
              {task.comments.length > 0 ? (
                task.comments.map(comment => {
                  const commentUser = getUserById(comment.userId);
                  return (
                    <div key={comment.id} className="comment">
                      <img src={commentUser?.profilePicture} alt={commentUser?.username} />
                      <div className="comment-content">
                        <p className="comment-author">{commentUser?.username}</p>
                        <p className="comment-text">{comment.text}</p>
                        <p className="comment-time">{new Date(comment.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-comments">No comments yet</p>
              )}
            </div>

            <div className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
              />
              <button onClick={handleAddComment} className="btn-comment">
                Add Comment
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
