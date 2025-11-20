// routes/projects.js - Project CRUD Routes
const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all projects for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: req.user.id }, { members: req.user.id }]
    })
      .populate('ownerId', 'username email profilePicture')
      .populate('members', 'username email profilePicture')
      .sort({ updatedDate: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'username email profilePicture')
      .populate('members', 'username email profilePicture');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId._id.toString() !== req.user.id && !project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
});

// Create project
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { projectName, description } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      projectName,
      description: description || '',
      ownerId: req.user.id,
      members: [req.user.id]
    });

    await project.save();
    await project.populate('ownerId', 'username email profilePicture');

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

// Update project
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can update
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { projectName, description } = req.body;
    if (projectName) project.projectName = projectName;
    if (description !== undefined) project.description = description;

    await project.save();
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can delete
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete all tasks in project
    await Task.deleteMany({ projectId: req.params.id });
    
    // Delete project
    await Project.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Add member to project
router.post('/:id/members', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can add members
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
