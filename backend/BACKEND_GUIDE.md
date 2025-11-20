# Task Management Backend Guide

## Architecture Overview

```
Backend Structure:
├── server.js              # Express app & server setup
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   ├── Project.js        # Project schema
│   └── Task.js           # Task schema
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── projects.js       # Project CRUD endpoints
│   └── tasks.js          # Task CRUD endpoints
├── middleware/
│   ├── auth.js           # JWT verification
│   └── errorHandler.js   # Error handling
└── controllers/
    ├── authController.js
    ├── projectController.js
    └── taskController.js
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create .env File
```bash
# .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## Database Schema Design

### User Schema
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  profilePicture: String,
  createdDate: Date,
  updatedDate: Date
}
```

### Project Schema
```javascript
{
  _id: ObjectId,
  projectName: String,
  description: String,
  ownerId: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  tasks: [ObjectId] (ref: Task),
  createdDate: Date,
  updatedDate: Date
}
```

### Task Schema
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  title: String,
  description: String,
  status: String (TODO | IN_PROGRESS | DONE),
  priority: String (LOW | MEDIUM | HIGH),
  assignedTo: ObjectId (ref: User),
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  comments: [{
    _id: ObjectId,
    userId: ObjectId (ref: User),
    text: String,
    timestamp: Date
  }],
  createdDate: Date,
  updatedDate: Date
}
```

---

## API Endpoints

### Authentication

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "password123"
}

Response (201):
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

**GET /api/auth/me**
```
Headers: Authorization: Bearer jwt_token

Response (200):
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "john_doe",
    "profilePicture": "url"
  }
}
```

---

### Projects

**GET /api/projects**
```
Headers: Authorization: Bearer jwt_token

Response (200):
{
  "projects": [
    {
      "_id": "proj_id",
      "projectName": "Website Redesign",
      "description": "...",
      "ownerId": "user_id",
      "members": ["user_id1", "user_id2"],
      "createdDate": "2024-11-01T10:00:00Z",
      "updatedDate": "2024-11-15T10:00:00Z"
    }
  ]
}
```

**POST /api/projects**
```json
Headers: Authorization: Bearer jwt_token

Request:
{
  "projectName": "New Project",
  "description": "Project description"
}

Response (201):
{
  "project": {
    "_id": "proj_id",
    "projectName": "New Project",
    "description": "Project description",
    "ownerId": "current_user_id",
    "members": ["current_user_id"],
    "createdDate": "2024-11-19T10:00:00Z"
  }
}
```

**GET /api/projects/:id**
```
Headers: Authorization: Bearer jwt_token

Response (200):
{
  "project": { ... }
}
```

**PUT /api/projects/:id**
```json
Headers: Authorization: Bearer jwt_token

Request:
{
  "projectName": "Updated Name",
  "description": "Updated description"
}

Response (200):
{
  "project": { ... }
}
```

**DELETE /api/projects/:id**
```
Headers: Authorization: Bearer jwt_token
Response (204): No content
```

**POST /api/projects/:id/members**
```json
Headers: Authorization: Bearer jwt_token

Request:
{
  "userId": "user_id_to_add"
}

Response (200):
{
  "project": { ... }
}
```

---

### Tasks

**GET /api/projects/:projectId/tasks**
```
Headers: Authorization: Bearer jwt_token

Response (200):
{
  "tasks": [
    {
      "_id": "task_id",
      "projectId": "proj_id",
      "title": "Create wireframes",
      "description": "...",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "assignedTo": "user_id",
      "dueDate": "2024-11-20",
      "comments": [],
      "createdDate": "2024-11-01T10:00:00Z"
    }
  ]
}
```

**POST /api/projects/:projectId/tasks**
```json
Headers: Authorization: Bearer jwt_token

Request:
{
  "title": "Task title",
  "description": "Task description",
  "priority": "HIGH",
  "dueDate": "2024-11-25",
  "assignedTo": "user_id"
}

Response (201):
{
  "task": { ... }
}
```

**PUT /api/tasks/:taskId**
```json
Headers: Authorization: Bearer jwt_token

Request:
{
  "status": "DONE",
  "priority": "MEDIUM",
  "title": "Updated title"
}

Response (200):
{
  "task": { ... }
}
```

**DELETE /api/tasks/:taskId**
```
Headers: Authorization: Bearer jwt_token
Response (204): No content
```

**POST /api/tasks/:taskId/comments**
```json
Headers: Authorization: Bearer jwt_token

Request:
{
  "text": "Comment text"
}

Response (201):
{
  "comment": {
    "_id": "comment_id",
    "userId": "user_id",
    "text": "Comment text",
    "timestamp": "2024-11-19T10:00:00Z"
  }
}
```

---

## Middleware

### Authentication Middleware
```javascript
// Verify JWT token and attach user to request
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Error Handling Middleware
```javascript
// Handle all errors
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Server error'
  });
};
```

---

## Key Concepts

### Authentication Flow
1. User registers with email/password
2. Password is hashed with bcryptjs
3. JWT token created and returned
4. Token stored in localStorage on client
5. Token sent in Authorization header for protected routes
6. Server verifies token before allowing access

### Authorization
- Users can only modify their own projects
- Only project owner can delete project
- Only assigned users can modify task status

### Real-time Updates (Socket.io)
```javascript
// When task is updated:
io.to(projectId).emit('taskUpdated', {
  taskId: task._id,
  status: task.status,
  updatedBy: req.user.id
});
```

---

## Error Handling

**Standard Error Response**
```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional error details"
}
```

**Common Status Codes**
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Testing with Postman

1. **Register** → Get JWT token
2. **Set Authorization** → Use token in Bearer header
3. **Test endpoints** → Create projects, tasks, etc.

Example Postman flow:
```
1. POST /api/auth/register
2. Copy token from response
3. In Postman: Headers → Authorization: Bearer {token}
4. POST /api/projects (create project)
5. GET /api/projects (verify it was created)
```

---

## Deployment Checklist

- [ ] Set environment variables on hosting platform
- [ ] Connect to MongoDB Atlas
- [ ] Enable CORS for frontend domain
- [ ] Set JWT_SECRET to strong random string
- [ ] Use HTTPS only in production
- [ ] Enable logging/monitoring
- [ ] Test all endpoints before deploying
- [ ] Set up CI/CD pipeline

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Set up database**: Create MongoDB Atlas account
3. **Create .env file**: Add database URI and JWT secret
4. **Implement models**: Create User, Project, Task schemas
5. **Implement routes**: Build CRUD endpoints
6. **Test endpoints**: Use Postman for testing
7. **Connect frontend**: Update API base URL in frontend
8. **Deploy**: Push to production
