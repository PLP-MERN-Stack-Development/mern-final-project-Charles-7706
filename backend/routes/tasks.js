// routes/tasks.js - Task CRUD Routes
const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get tasks for a project
router.get('/project/:projectId', authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'username email profilePicture')
      .populate('createdBy', 'username email profilePicture')
      .populate('comments.userId', 'username profilePicture')
      .sort({ dueDate: 1 });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
});

// Get single task
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email profilePicture')
      .populate('createdBy', 'username email profilePicture')
      .populate('comments.userId', 'username profilePicture');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post('/project/:projectId', authMiddleware, async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const projectId = req.params.projectId;

    // Validate input
    if (!title || !dueDate || !assignedTo) {
      return res.status(400).json({ error: 'Title, dueDate, and assignedTo are required' });
    }

    // Check project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.includes(req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const task = new Task({
      projectId,
      title,
      description: description || '',
      priority: priority || 'MEDIUM',
      dueDate,
      assignedTo,
      createdBy: req.user.id
    });

    await task.save();
    await task.populate('assignedTo', 'username email profilePicture');
    await task.populate('createdBy', 'username email profilePicture');

    // Add task to project
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check authorization (assigned user or project owner)
    const project = await Project.findById(task.projectId);
    const isOwner = project.ownerId.toString() === req.user.id;
    const isAssigned = task.assignedTo.toString() === req.user.id;

    if (!isOwner && !isAssigned) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.projectId);
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Remove task from project
    project.tasks.pull(req.params.id);
    await project.save();

    // Delete task
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Add comment to task
router.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const comment = {
      userId: req.user.id,
      text,
      timestamp: new Date()
    };

    task.comments.push(comment);
    await task.save();

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
