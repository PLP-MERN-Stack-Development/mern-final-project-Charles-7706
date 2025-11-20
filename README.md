# TaskFlow - MERN Stack Task Management Application

A comprehensive full-stack task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time collaboration, project management, and team coordination.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Project Management**: Create, update, and delete projects
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Real-time Updates**: Socket.io integration for live collaboration
- **Kanban Board**: Drag-and-drop task management interface
- **Team Collaboration**: Add team members to projects
- **Responsive Design**: Mobile-friendly interface
- **Testing**: Comprehensive test suite for both frontend and backend
- **Docker Support**: Containerized deployment
- **CI/CD Pipeline**: Automated testing and deployment

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates
- **date-fns** - Date manipulation
- **React Testing Library** - Testing utilities

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd mern-final-project-Charles-7706
```

2. Create environment file:
```bash
cp backend/.env.example backend/.env
```

3. Start with Docker Compose:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:9000

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (use existing .env file)

4. Start the server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
mern-final-project-Charles-7706/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project

### Tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `POST /api/tasks/project/:projectId` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task

## 🌐 Deployment

The application is configured for deployment on various platforms:

- **Backend**: Render, Heroku, or any Node.js hosting service
- **Frontend**: Vercel, Netlify, or any static hosting service
- **Database**: MongoDB Atlas

### Environment Variables

#### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=9000
NODE_ENV=production
CORS_ORIGIN=your_frontend_url
```

#### Frontend
```
REACT_APP_API_URL=your_backend_url/api
REACT_APP_SOCKET_URL=your_backend_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨💻 Author

Charles - Full Stack Developer

## 🙏 Acknowledgments

- PLP Academy for the comprehensive MERN stack curriculum
- The open-source community for the amazing tools and libraries

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started) 