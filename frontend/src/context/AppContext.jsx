import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI, projectsAPI, tasksAPI } from '../services/api';
import io from 'socket.io-client';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      const socketConnection = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:9000');
      setSocket(socketConnection);
      return () => socketConnection.close();
    }
  }, [currentUser]);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
      loadProjects();
    }
    setLoading(false);
  }, []);

  // Authentication functions
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      await loadProjects();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setProjects([]);
    setTasks([]);
    if (socket) socket.close();
  };

  // Load projects
  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  // Load tasks for project
  const loadProjectTasks = async (projectId) => {
    try {
      const response = await tasksAPI.getByProject(projectId);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Create new project
  const createProject = async (projectName, description) => {
    try {
      const response = await projectsAPI.create({ projectName, description });
      const newProject = response.data.project;
      setProjects([...projects, newProject]);
      return { success: true, project: newProject };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create project' };
    }
  };

  // Create new task
  const createTask = async (projectId, taskData) => {
    try {
      const response = await tasksAPI.create(projectId, taskData);
      const newTask = response.data.task;
      setTasks([...tasks, newTask]);
      if (socket) {
        socket.emit('taskCreated', { projectId, task: newTask });
      }
      return { success: true, task: newTask };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create task' };
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const response = await tasksAPI.update(taskId, updates);
      const updatedTask = response.data.task;
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      if (socket) {
        socket.emit('taskUpdated', { projectId: updatedTask.projectId, task: updatedTask });
      }
      return { success: true, task: updatedTask };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update task' };
    }
  };

  // Add comment to task
  const addTaskComment = async (taskId, text) => {
    try {
      const response = await tasksAPI.addComment(taskId, { text });
      const comment = response.data.comment;
      setTasks(tasks.map(task =>
        task._id === taskId
          ? { ...task, comments: [...task.comments, comment] }
          : task
      ));
      return { success: true, comment };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to add comment' };
    }
  };

  // Add member to project
  const addProjectMember = async (projectId, userId) => {
    try {
      const response = await projectsAPI.addMember(projectId, userId);
      const updatedProject = response.data.project;
      setProjects(projects.map(project =>
        project._id === projectId ? updatedProject : project
      ));
      return { success: true, project: updatedProject };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to add member' };
    }
  };

  // Get tasks for a specific project
  const getProjectTasks = useCallback((projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks]);

  const value = {
    currentUser,
    projects,
    tasks,
    selectedProject,
    setSelectedProject,
    loading,
    isAuthenticated,
    socket,
    login,
    register,
    logout,
    loadProjects,
    loadProjectTasks,
    getProjectTasks,
    createProject,
    createTask,
    updateTask,
    addTaskComment,
    addProjectMember,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
