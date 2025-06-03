# NexusEd

## Project Overview

NexusEd is a full-stack web application designed to foster collaboration among students by providing a platform to share resources, organize study groups, schedule events, and engage in social interactions. The application combines a React-based frontend with a Node.js/Express backend, offering a seamless user experience for authentication, content creation, group management, event scheduling, and profile customization.

- **Frontend**: A responsive React application with Tailwind CSS for styling, featuring components for authentication, social posts, study groups, a calendar, and user profiles.
- **Backend**: A RESTful API built with Node.js, Express, and MongoDB, handling user authentication, CRUD operations for posts and groups, event management, and file uploads.

## Features

### Frontend Features
- **User Authentication**: Register and login with username/email and password, with JWT-based session management.
- **Social Interactions**:
  - Create, view, like, comment on, and delete posts.
  - Sort user posts by newest, oldest, or popularity (likes).
- **Study Groups**:
  - Browse, create, join, leave, or delete study groups.
  - Real-time group chat with text messages and file attachments.
  - Filter groups by category (e.g., Computer Science, Mathematics).
- **Event Calendar**:
  - View and create events for study groups using an interactive calendar.
  - Display events in month, week, or day views.
  - Automatic filtering of expired events.
- **User Profiles**:
  - View and edit user details (username, bio, profile picture).
  - Display joined groups and user posts.
- **Responsive Design**: Supports light and dark modes with Tailwind CSS and Font Awesome icons.
- **Accessibility**: Includes ARIA attributes for improved screen reader compatibility.
- **Temporary Notifications**: Displays success/error messages with a 3-second fade-out animation.

### Backend Features
- **User Authentication**: Secure registration and login with JWT and bcrypt password hashing.
- **Post Management**: CRUD operations for posts, including liking and commenting functionalities.
- **Study Group Management**: Create, update, join, leave, or delete study groups with discussion boards supporting file attachments.
- **Event Scheduling**: Create and manage events within study groups, with automatic deletion of expired events via a cron job.
- **Profile Management**: Update user bio, username, and profile picture, with file upload support.
- **File Uploads**: Handle profile pictures (up to 5MB) and group message attachments (up to 10MB per file, 5 files max).
- **Error Handling**: Consistent error responses with appropriate HTTP status codes.

## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces (v19.1.0).
- **React Router**: Client-side routing (v6.22.0).
- **Axios**: HTTP client for API requests (v1.9.0).
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN).
- **React Big Calendar**: Interactive calendar component (v1.18.0).
- **React Modal**: Accessible modal dialogs (v3.16.3).
- **React Toastify**: Notification system (v11.0.5).
- **Font Awesome**: Icons for UI elements (v6.7.2).
- **date-fns**: Date manipulation library (v2.30.0).

### Backend
- **Node.js**: JavaScript runtime environment (v14.0.0 or higher).
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: JSON Web Tokens for authentication.
- **Multer**: Middleware for handling file uploads.
- **Bcrypt**: Library for password hashing.
- **Node-cron**: Scheduler for deleting expired events.

## Project Structure

### Frontend
```
frontend/
├── public/
│   └── index.html                # HTML entry point
├── src/
│   ├── components/              # React components
│   │   ├── CalendarPage.js      # Calendar view
│   │   ├── ConfirmationMessage.js # Temporary messages
│   │   ├── CreateEventModal.js  # Event creation modal
│   │   ├── CustomToolbar.js     # Calendar toolbar
│   │   ├── EventDetailsModal.js # Event details modal
│   │   ├── Footer.js            # Footer component
│   │   ├── GroupCard.js         # Study group card
│   │   ├── GroupChat.js         # Group chat interface
│   │   ├── GroupDetail.js       # Group details page
│   │   ├── GroupForm.js         # Group creation/edit form
│   │   ├── Home.js              # Homepage
│   │   ├── Login.js             # Login form
│   │   ├── Navbar.js            # Navigation bar
│   │   ├── PostCard.js          # Post display card
│   │   ├── PostForm.js          # Post creation form
│   │   ├── Profile.js           # Profile page
│   │   ├── ProfileGroups.js     # User’s joined groups
│   │   ├── ProfileHeader.js     # Profile details editor
│   │   ├── Register.js          # Registration form
│   │   ├── StudyGroups.js       # Study groups page
│   │   └── UserPosts.js         # User’s posts
│   ├── context/
│   │   └── AuthContext.js       # Authentication context
│   ├── hooks/
│   │   ├── useCalendar.js       # Calendar logic
│   │   └── useProfile.js        # Profile logic
│   ├── styles/
│   │   ├── calendarStyles.js    # Calendar CSS
│   │   └── profileStyles.js     # Profile CSS
│   ├── utils/
│   │   ├── dateUtils.js         # Date utilities
│   │   └── formatUtils.js       # Formatting utilities
│   ├── App.js                   # Main app with routing
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── .env                         # Environment variables
└── package.json                 # Dependencies and scripts
```

### Backend
```
backend/
├── models/                      # Mongoose schemas
│   ├── User.js                  # User model
│   ├── Post.js                  # Post model
│   ├── StudyGroup.js            # Study group model
│   ├── Event.js                 # Event model
├── routes/                      # Express routes
│   ├── auth.js                  # Authentication routes
│   ├── posts.js                 # Post routes
│   ├── users.js                 # User routes
│   ├── studyGroups.js           # Study group routes
│   ├── events.js                # Event routes
├── middleware/                  # Custom middleware
│   ├── auth.js                  # JWT authentication
│   ├── upload.js                # File upload handling
├── uploads/                     # Directory for file uploads
├── cron/                        # Scheduled tasks
│   └── deleteExpiredEvents.js   # Cron job for event cleanup
├── .env                         # Environment variables
├── server.js                    # Express server entry point
└── package.json                 # Dependencies and scripts
```

## Setup Instructions

### Prerequisites
- **Node.js**: Version 14.0.0 or higher.
- **MongoDB**: Local instance or a remote connection string (e.g., MongoDB Atlas).
- **Git**: For cloning the repository.

### Frontend Setup
1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```
2. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Create a `.env` file in the `frontend/` directory with:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
5. Start the frontend development server:

   ```bash
   npm start
   ```
   The frontend should be accessible at `http://localhost:3000`.

### Backend Setup
1. Navigate to the backend directory:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with:

   ```
   MONGO_URI=<your-mongodb-connection-string>
   PORT=5000
   JWT_SECRET=<your-jwt-secret-key>
   ```
4. Start the backend server:

   ```bash
   node server.js
   ```
   The backend should be running at `http://localhost:5000`.

### Running the Full Application
1. Ensure MongoDB is running (locally or remotely).
2. Start the backend server (`node server.js` in `backend/`).
3. Start the frontend server (`npm start` in `frontend/`).
4. Open `http://localhost:3000` in a browser to access NexusEd.

## Authentication
- **Frontend**: Uses `AuthContext` to manage user state and token storage in `localStorage`. Protected routes redirect unauthenticated users to the login page.
- **Backend**: Uses JWT for authentication. Tokens are issued on login/register and must be included in the `Authorization` header for protected routes. Invalid or expired tokens return a 401 status.

## File Uploads
- **Profile Pictures**:
  - Endpoint: `POST /api/users/upload-profile-picture`
  - Allowed: Images (JPEG, PNG, GIF)
  - Max Size: 5MB
  - Storage: `backend/uploads/`
- **Study Group Messages**:
  - Endpoint: `POST /api/study-groups/:groupId/messages`
  - Allowed: Images, PDFs, text files, Word documents
  - Max Size: 10MB per file, up to 5 files
  - Storage: `backend/uploads/`

## Scheduled Tasks
- A `node-cron` job runs every 5 minutes to delete events whose `end` time is in the past, ensuring the database remains clean.

## Error Handling
- **Frontend**: Displays temporary error/success messages using `react-toastify` or custom `ConfirmationMessage` component with a 3-second fade-out.
- **Backend**: Returns JSON errors with HTTP status codes:
  - 400: Bad Request (invalid input)
  - 401: Unauthorized (invalid/missing token)
  - 403: Forbidden (insufficient permissions)
  - 404: Not Found (resource missing)
  - 500: Internal Server Error (unexpected issues)

## Contributing
1. Fork the repository.
2. Create a feature branch:
   
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push to the branch:
   
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.
