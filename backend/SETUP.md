# Backend Setup Checklist

## Step-by-Step Guide

### 1. **Clone/Setup Repository**
```bash
cd backend
npm install
```

### 2. **Create Environment File**
```bash
# Copy the example file
cp .env.example .env



### 3. **MongoDB Setup**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Create a database user
- Get connection string
- Add it to `.env` file

### 4. **Start Development Server**
```bash
npm run dev
```
Server should start on `http://localhost:5000`

### 5. **Test with Postman**

#### Register a User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Create a Project
```
POST http://localhost:5000/api/projects
Content-Type: application/json
Authorization: Bearer {token_from_login}

{
  "projectName": "My First Project",
  "description": "Testing the API"
}
```

#### Get All Projects
```
GET http://localhost:5000/api/projects
Authorization: Bearer {token}
```

#### Create a Task
```
POST http://localhost:5000/api/projects/{projectId}/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Design homepage",
  "description": "Create mockups for homepage",
  "priority": "HIGH",
  "dueDate": "2024-11-25",
  "assignedTo": "{userId}"
}
```

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Project.js           # Project schema
│   └── Task.js              # Task schema
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── projects.js          # Project endpoints
│   └── tasks.js             # Task endpoints
├── server.js                # Main server file
├── package.json
├── .env.example
└── BACKEND_GUIDE.md
```

---

## Key Implementation Points

### Authentication
- Uses JWT tokens
- Passwords hashed with bcryptjs
- Token expires in 7 days
- Include token in Authorization header for protected routes

### Database Relationships
```
User (1) ─── (many) Project (with ownerId & members)
User (1) ─── (many) Task (with assignedTo & createdBy)
Project (1) ─── (many) Task
```

### Error Handling
All errors return JSON with status code:
```json
{
  "error": "Error message",
  "status": 400
}
```

### CORS
- Configured for frontend on `http://localhost:3000`
- Update `CORS_ORIGIN` in `.env` for production

---

## Common Issues & Solutions

### Issue: "Cannot find module 'mongoose'"
**Solution:** Run `npm install`

### Issue: "MONGODB_URI is not set"
**Solution:** Create `.env` file with MONGODB_URI

### Issue: "Invalid token"
**Solution:** Make sure token is in Authorization header: `Authorization: Bearer {token}`

### Issue: "CORS error from frontend"
**Solution:** Update `CORS_ORIGIN` in `.env` to match frontend URL

---

## Next: Connect Frontend to Backend

In `frontend/src/context/AppContext.jsx`, replace mock API calls:

```javascript
// Instead of using mock data
const getUserProjects = async () => {
  const response = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  });
  setProjects(response.data.projects);
};
```

---

## Deployment

For production:
1. Use environment variables from hosting platform
2. Update MongoDB connection string
3. Set `NODE_ENV=production`
4. Use strong JWT_SECRET
5. Enable HTTPS only
6. Set appropriate CORS_ORIGIN

---

Good luck building! 🚀
