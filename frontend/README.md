# TaskFlow Frontend

A modern, responsive project and task management application built with React. Features a Kanban board, task filtering, real-time updates, and team collaboration tools.

## Features

✨ **Fully Functional Frontend with Mock Data**
- 📋 Dashboard with project cards
- 🎯 Kanban board view with drag-and-drop
- 📊 Project statistics and progress tracking
- 🔍 Task filtering and sorting
- 💬 Task comments and discussions
- 👥 Team member assignments
- 📱 Responsive design for all devices

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx        # Top navigation bar
│   │   ├── ProjectCard.jsx       # Project card component
│   │   ├── TaskCard.jsx          # Individual task card
│   │   └── TaskDetailModal.jsx   # Task detail view
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   └── ProjectView.jsx       # Project detail view
│   ├── context/
│   │   └── AppContext.jsx        # Global state management
│   ├── mockData.js               # Mock users, projects, tasks
│   ├── App.jsx                   # Main app component
│   ├── index.jsx                 # Entry point
│   └── styles (CSS files)
├── public/
│   └── index.html
└── package.json

```

## Mock Data Included

**Users (4 total):**
- john_doe
- jane_smith
- bob_johnson
- alice_williams

**Projects (3 total):**
- Website Redesign
- Mobile App Development
- API Integration

**Tasks (9 total):**
- Mix of TODO, IN_PROGRESS, and DONE statuses
- Assigned to different team members
- Various priority levels

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

The app runs at `http://localhost:3000`

## Key Features

### Dashboard
- View all projects you own or are a member of
- Create new projects with name and description
- See project progress, team members, and last update date
- Click any project to view details

### Project View
- **Kanban Board**: Organize tasks by status (To Do, In Progress, Done)
- **Drag & Drop**: Move tasks between columns (when in Kanban view)
- **Filtering**: Filter tasks by status
- **Sorting**: Sort by due date, priority, or creation date
- **Statistics**: View task counts by status

### Task Management
- Click any task to see full details
- Add comments and discussions
- Change task status
- View assigned user and due date
- See task priority levels

### User Experience
- Fully responsive design
- Smooth animations and transitions
- Real-time updates (with mock data)
- Intuitive navigation
- Color-coded priority levels (High/Medium/Low)
- Progress tracking with visual bars

## Technologies Used

- **React 18** - UI framework
- **React Router v6** - Navigation
- **Context API** - State management
- **CSS3** - Styling with modern features
- **JavaScript ES6+** - Modern JavaScript

## API Integration Ready

The frontend is structured to easily connect to a backend API. Replace mock data calls with:

```javascript
// In AppContext.jsx, replace mock data with API calls
axios.get('/api/projects').then(response => setProjects(response.data))
```

## Backend Integration

When you build the backend, update these endpoints in the context:
- `GET /api/projects` - Fetch user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id/tasks` - Fetch project tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `POST /api/tasks/:id/comments` - Add comment
- `GET /api/users` - Fetch team members

## Performance Features

✅ Efficient rendering with React Context
✅ Optimized CSS with Flexbox and Grid
✅ Lazy component loading ready
✅ Image optimization with Gravatar
✅ Responsive design for all screens

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built as a capstone project for MERN Stack Development course.
