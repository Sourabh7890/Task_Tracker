# Task Tracker Web Application

A simple and efficient task management web application built with React, FastAPI, and MongoDB.

## Features

✅ **Add Tasks** - Create new tasks using the input field and Add Task button  
✅ **View Tasks** - Display all tasks in a clean, organized list  
✅ **Mark as Completed** - Toggle task status from Pending to Completed  
✅ **Visual Status Indicators** - Color-coded badges (Yellow for Pending, Green for Completed)  
✅ **Data Persistence** - All tasks are stored in MongoDB database  
✅ **Responsive Design** - Clean, minimalist UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Axios
- **Backend**: FastAPI (Python), Motor (MongoDB async driver)
- **Database**: MongoDB
- **Styling**: Tailwind CSS with gradient background

## API Endpoints

### Backend API (`/api`)

1. **POST /api/tasks** - Create a new task
   - Request: `{"title": "Task description"}`
   - Response: Task object with id, title, status, created_at

2. **GET /api/tasks** - Get all tasks
   - Response: Array of task objects (sorted by newest first)

3. **PUT /api/tasks/{task_id}** - Update task status
   - Request: `{"status": "completed"}`
   - Response: Updated task object

## Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI application with task endpoints
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables (MONGO_URL, DB_NAME)
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component with task management
│   │   ├── App.css       # Minimal custom styles
│   │   └── index.css     # Tailwind CSS and theme configuration
│   ├── package.json      # Node dependencies
│   └── .env             # Environment variables (REACT_APP_BACKEND_URL)
│
└── test_reports/         # Automated test results
```

## Running the Application

The application is managed by Supervisor and runs automatically:

- **Backend**: http://localhost:8001 (internal)
- **Frontend**: http://localhost:3000
- **API Base URL**: Uses REACT_APP_BACKEND_URL from frontend/.env

### Restart Services

```bash
# Restart all services
sudo supervisorctl restart all

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

## Testing

All features have been tested and verified:

- ✅ Backend API endpoints (100% pass rate)
- ✅ Frontend UI functionality (100% pass rate)
- ✅ Database persistence
- ✅ Frontend-Backend integration

Test results available in: `/app/test_reports/iteration_1.json`

## UI Features

- **Input Field**: Enter task description
- **Add Task Button**: Submit new task (disabled when input is empty)
- **Task List**: Displays all tasks with proper formatting
- **Status Badges**: 
  - Yellow "Pending" badge for incomplete tasks
  - Green "Completed" badge for finished tasks
- **Mark as Completed Button**: Appears only for pending tasks
- **Strikethrough Text**: Completed tasks show with line-through styling
- **Task Counter**: Shows total number of tasks
- **Empty State**: User-friendly message when no tasks exist

## Data Model

### Task Object
```json
{
  "id": "uuid-string",
  "title": "Task description",
  "status": "pending" | "completed",
  "created_at": "2026-01-13T08:15:29.499064Z"
}
```

## Notes

- Tasks are sorted by creation date (newest first)
- All tasks persist in MongoDB database
- UUID is used for task IDs (not MongoDB ObjectId)
- CORS is configured to allow cross-origin requests
- Responsive design works on all screen sizes
