# Admin Panel - Portfolio Management Dashboard

A React.js admin dashboard for managing portfolio content including projects, skills, programming statistics, and highlights.

## Features

- **Secure Authentication** - JWT-based login system
- **Dashboard Overview** - Management dashboard with statistics
- **Project Management** - Create, read, update, and delete projects
- **Skills Management** - Manage technical skills and proficiency levels
- **Programming Stats** - Track competitive programming achievements and platforms
- **Highlights Management** - Manage featured highlights
- **CV Management** - Upload and manage CV document
- **Responsive Design** - Mobile-friendly admin interface with Tailwind CSS

## Tech Stack

- **React.js 18** - UI framework
- **React Router DOM 6** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **PostCSS** - CSS processing
- **Axios** - HTTP client for API requests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend server running (see main project README)

## Installation

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Available Scripts

### `npm start`
Runs the admin panel in development mode.
- Open [http://localhost:3001](http://localhost:3001) to view it in the browser.
- The page will reload when you make changes.

### `npm run build`
Creates an optimized production build.

### `npm test`
Launches the test runner.

## Project Structure

```
src/
├── components/          # Reusable admin components
│   └── AdminNav.js      # Admin navigation sidebar
├── pages/               # Admin page sections
│   ├── Dashboard.js     # Admin dashboard overview
│   ├── Projects.js      # Project management
│   ├── Skills.js        # Skills management
│   ├── ProgrammingStats.js  # Programming stats
│   ├── Highlights.js    # Highlights management
│   ├── CV.js            # CV management
│   ├── Login.js         # Login page
│   └── Register.js      # Registration page (if enabled)
├── styles/              # Admin-specific styles
├── App.js               # Main admin app
└── index.js             # React DOM entry point
```

## Authentication

### Login
- Access the admin panel at the specified URL
- Use your credentials to log in
- JWT token is stored for authenticated requests

### Features Protected by Auth
- All dashboard pages require authentication
- Unauthenticated users are redirected to login page

## API Endpoints Used

The admin panel communicates with the backend for:
- **Auth**: `/api/admin/login`, `/api/admin/register`
- **Projects**: `/api/projects` (CRUD operations)
- **Skills**: `/api/skills` (CRUD operations)
- **Programming Stats**: `/api/programming-stats` (CRUD operations)
- **Highlights**: `/api/highlights` (CRUD operations)
- **CV**: `/api/cv` (upload/download)

## Development Tips

1. Keep `.env.local` with the correct backend API URL
2. Ensure the backend server is running before starting the admin panel
3. Check browser console for API errors
4. Use React Developer Tools for component debugging

## Deployment

1. Build the production app:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting service
3. Update `.env` variables for production backend API URL

## Security Notes

- Never commit `.env.local` with real credentials
- Store sensitive data (API keys, secrets) in environment variables
- Ensure the backend properly validates and secures all requests
- Use HTTPS in production

