# Study Group Finder

A web application that connects students with study groups based on their academic interests, schedules, and preferences. Built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS for styling.

## Features

### User Profiles & Authentication

- User registration and login with email verification
- Secure authentication using JWT
- Profile customization
- Study preferences (time, learning style, group size)

### Study Group Management

- Create and join study groups by subject
- Group size limits and member management
- Group descriptions and rules
- Group roles (owner, moderator, member)

### Real-time Chat & Communication

- Group chat rooms with socket.io
- Message editing and deletion
- Chat history

### Resource Sharing

- Study material upload/download via AWS S3
- File management within groups

## Tech Stack

### Backend

- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ORM
- **Socket.io** - Real-time communication
- **JSON Web Tokens (JWT)** - Authentication
- **bcrypt** - Password hashing
- **AWS SDK** - S3 integration for file storage
- **Multer** - File upload handling
- **Nodemailer** - Email sending for verification
- **Redis** - Caching for S3 signed URLs
- **Swagger UI Express** - API documentation
- **Express Rate Limit** - API request limiting
- **Helmet** - HTTP security headers

### Frontend

- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** with **DaisyUI** - Styling components
- **Axios** - API requests
- **Socket.io Client** - Real-time communication with server
- **React Hook Form** - Form handling
- **React Toastify** - Toast notifications
- **Redux Toolkit** - State management
- **FilePond** - File upload UI components
- **Vite** - Build tool and development server

## Getting Started

### Prerequisites

> [!NOTE]
>
> Make sure you have all prerequisites installed before proceeding with setup.

- Node.js (v16 or higher)
- MongoDB (local or Atlas connection)
- Redis (for caching)
- AWS S3 bucket for file storage
- WSL (Windows Subsystem for Linux) for Redis CLI (Windows users)

### Environment Setup

1. Clone the repository

   ```
   git clone https://github.com/yourusername/study-group-finder.git
   cd study-group-finder
   ```

2. Install dependencies for both backend and frontend

   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create `.env` file in the server and client directory using the `.env.example` as a template

### Running the Application

#### Development Mode

1. Start the backend server

   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server

   ```
   cd client
   npm run dev
   ```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

#### Production Mode

1. Build the frontend

   ```
   cd client
   npm run build
   ```

2. Start the backend server in production mode
   ```
   cd server
   npm run start
   ```

## Project Structure

```
study-group-finder/
│
├── client
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       │   ├── ChatApp         # Real-time chat components
│       │   ├── Group           # Group management components
│       │   ├── Login           # Authentication components
│       │   ├── Profile         # User profile components
│       │   ├── SignUp          # Registration components
│       │   └── YourGroup       # User's group components
│       ├── context             # React context providers
│       ├── data                # Mock data and constants
│       ├── features            # Feature-specific code
│       ├── hooks               # Custom React hooks
│       ├── page                # Page components
│       ├── provider            # Context providers
│       ├── redux               # Redux state management
│       │   └── reducer         # Redux reducers
│       ├── services            # Service layer
│       │   └── api             # API service functions
│       └── utils               # Utility functions
├── documentation               # Project documentation
└── server                      # Backend Express application
    ├── config
    ├── controllers             # Route handlers
    ├── middleware              # Express middleware
    ├── models                  # MongoDB models
    ├── routes                  # Express routes
    ├── services                # Business logic
    └── test                    # API tests
```

## API Documentation

> [!TIP]
>
> The API is fully documented using Swagger UI. When running backend in dev the application, you can access the documentation at:
>
> ```
> http://localhost:3000/api-docs
> ```

### API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email` - Verify email address

### Users

- `GET /api/users` - Get all users
- `GET /api/users/profile/:userId` - Get public profile of user
- `GET /api/users/profile` - Get own profile (authenticated)
- `GET /api/users/groups/joined` - Get groups joined by user
- `PUT /api/users/settings` - Update user settings
- `DELETE /api/users/settings` - Delete user account

### Groups

- `GET /api/groups` - Get all groups
- `GET /api/groups/:groupId` - Get group information
- `POST /api/groups` - Create a new group
- `PUT /api/groups/:groupId` - Update group information
- `PUT /api/groups/:groupId/join` - Join a group
- `PUT /api/groups/:groupId/leave` - Leave a group
- `DELETE /api/groups/:groupId` - Delete a group

### Files

- `POST /api/files/upload/profile-picture` - Upload profile picture
- `DELETE /api/files/delete/profile-picture` - Delete profile picture
- `GET /api/files/profile-pictures` - Get profile pictures
- `POST /api/files/upload/group/:groupId` - Upload file to group
- `GET /api/files/group/:groupId` - Get all files in a group
- `GET /api/files/group/:groupId/:fileId` - Download a specific file
- `DELETE /api/files/group/:groupId/:fileId` - Delete a specific file

## Security Considerations

- JWT authentication with secure validation
- Rate limiting for API protection
- Password hashing with bcrypt
- Email verification for new accounts
- Permission-based access control for groups
- AWS S3 signed URLs for secure file access
- CORS configuration for secure client-server communication

## Testing

The application includes a test suite built with Jest and Supertest for backend API testing.

To run tests:

```

cd server
npm test

```

## Possible Enhancements

- Academic calendar integration
- Session scheduling with time slots
- Attendance tracking
- Recurring session setup
- Reminder notifications
- Session notes/agenda
- Advanced search functionality
- Bookmarking system
- Rating system for resources
- Notification center
- Expanded analytics for group activity
- Contacts list
- Public/private group and profile options
- @mentions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
