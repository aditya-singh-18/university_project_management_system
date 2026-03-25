# University Project Management System

A comprehensive web-based platform for managing university projects, enabling seamless collaboration between students, mentors, and administrators.

## Overview

The University Project Management System is designed to streamline the entire lifecycle of academic projects within a university environment. It provides role-based access for Students, Mentors, and Administrators, facilitating project creation, team formation, mentor assignment, and project tracking.

## Features

### For Students
- **User Registration & Authentication**: Secure registration with role-based access control
- **Profile Management**: Create and edit student profiles with bio and personal information
- **Project Creation**: Submit project proposals with detailed descriptions and tech stacks
- **Team Management**: Create teams, send/receive invitations, and collaborate with peers
- **Project Tracking**: Monitor project status from submission to completion
- **Real-time Notifications**: Get instant updates on project approvals, team invitations, and mentor assignments

### For Mentors
- **Dashboard**: Overview of assigned projects and student teams
- **Project Management**: Review and guide students on their projects
- **Profile Management**: Maintain professional profile with expertise and designation
- **Communication**: Interact with students and provide feedback

### For Administrators
- **User Management**: Register new users (students, mentors, admins) with complete profile details
- **Project Approval Workflow**: Review pending projects and assign mentors
- **Mentor Assignment**: Intelligent mentor selection based on workload and expertise
- **Dashboard Analytics**: View system-wide statistics and pending approvals
- **System Oversight**: Monitor all users, projects, and teams across the platform

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19.2.3)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI, Lucide React icons
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Language**: JavaScript (ES Modules)
- **Database**: PostgreSQL
- **ORM/Query**: pg (node-postgres)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.IO 4.8.3
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## Project Structure

```
university_project_management_system/
├── backend/                          # Node.js/Express backend
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server entry point
│   │   ├── config/                  # Configuration files
│   │   │   ├── db.js                # Database connection
│   │   │   ├── env.js               # Environment variables
│   │   │   └── constants.js         # Application constants
│   │   ├── controllers/             # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── team.controller.js
│   │   │   ├── mentor.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── profile.controller.js
│   │   │   ├── student.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── invitation.controller.js
│   │   │   └── adminOverride.controller.js
│   │   ├── services/                # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── project.service.js
│   │   │   ├── team.service.js
│   │   │   ├── mentor.service.js
│   │   │   ├── admin.service.js
│   │   │   ├── profile.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── invitation.service.js
│   │   │   ├── adminOverride.service.js
│   │   │   └── email.service.js
│   │   ├── repositories/            # Data access layer
│   │   │   ├── user.repo.js
│   │   │   ├── project.repo.js
│   │   │   ├── team.repo.js
│   │   │   ├── mentor.repo.js
│   │   │   ├── admin.repo.js
│   │   │   ├── profile.repo.js
│   │   │   ├── notification.repo.js
│   │   │   ├── invitation.repo.js
│   │   │   ├── adminOverride.repo.js
│   │   │   └── audit.repo.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── team.routes.js
│   │   │   ├── mentor.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── profile.routes.js
│   │   │   ├── student.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── invitation.routes.js
│   │   │   └── adminOverride.routes.js
│   │   └── middlewares/             # Custom middleware
│   │       ├── auth.middleware.js   # JWT authentication
│   │       ├── role.middleware.js   # Role-based access control
│   │       └── error.middleware.js  # Error handling
│   ├── migrations/                  # Database migrations
│   │   └── add_bio_column.sql
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   └── README.md
│
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── (auth)/
│   │   │   │   └── login/           # Login page
│   │   │   ├── admin/               # Admin pages
│   │   │   │   ├── dashboard/
│   │   │   │   └── users/
│   │   │   ├── mentor/              # Mentor pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   └── profile/
│   │   │   ├── student/             # Student pages
│   │   │   │   ├── my-project/
│   │   │   │   └── profile/
│   │   │   ├── team/                # Team management pages
│   │   │   │   ├── create/
│   │   │   │   ├── invitations/
│   │   │   │   ├── requests/
│   │   │   │   └── my-teams/
│   │   │   ├── StudentProfile/      # Student profile component
│   │   │   ├── dashboard/           # General dashboard
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home page
│   │   │   └── globals.css          # Global styles
│   │   ├── components/              # Reusable components
│   │   │   ├── ui/                  # UI components (shadcn/ui)
│   │   │   ├── sidebar/             # Sidebar navigation
│   │   │   ├── topbar/              # Top navigation bar
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── modals/              # Modal dialogs
│   │   │   └── team/                # Team-related components
│   │   ├── services/                # API service layer
│   │   │   └── team/                # Team service
│   │   ├── lib/                     # Utility libraries
│   │   └── constants/               # Frontend constants
│   ├── components.json              # shadcn/ui configuration
│   ├── next.config.ts               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json
│   └── README.md
│
└── README.md                         # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aditya-singh-18/university_project_management_system.git
   cd university_project_management_system
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=unipro_db
   DB_PORT=5432

   # JWT Configuration
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRY=7d

   # Email Configuration (Optional)
   EMAIL_HOST=
   EMAIL_PORT=
   EMAIL_USER=
   EMAIL_PASSWORD=
   ```

5. **Setup PostgreSQL database**
   ```bash
   # Create database
   createdb unipro_db

   # Run migrations (if available)
   psql -d unipro_db -f migrations/add_bio_column.sql
   ```

6. **Start the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (if needed)**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (Admin only)
- `GET /auth/me` - Get current user info

### User Endpoints
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/notifications` - Get user notifications

### Project Endpoints
- `GET /project` - Get all projects
- `POST /project` - Create new project
- `GET /project/:id` - Get project by ID
- `PUT /project/:id` - Update project
- `DELETE /project/:id` - Delete project
- `POST /project/admin/assign-mentor` - Assign mentor to project (Admin)

### Team Endpoints
- `GET /team` - Get all teams
- `POST /team` - Create new team
- `GET /team/:id` - Get team by ID
- `POST /team/invite` - Send team invitation
- `GET /team/invitations` - Get received invitations
- `POST /team/invitations/:id/accept` - Accept invitation
- `POST /team/invitations/:id/reject` - Reject invitation

### Mentor Endpoints
- `GET /mentor/admin/active` - Get all active mentors (Admin)
- `GET /mentor/projects` - Get mentor's assigned projects
- `GET /mentor/dashboard` - Get mentor dashboard data

### Admin Endpoints
- `GET /admin/dashboard` - Get admin dashboard statistics
- `GET /admin/users` - Get all users
- `POST /admin/users` - Register new user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/projects/pending` - Get pending projects

## User Roles & Permissions

### Student
- Create and manage personal profile
- Submit project proposals
- Create and join teams
- View assigned mentor
- Track project status

### Mentor
- View assigned projects
- Provide project guidance
- Communicate with students
- Update project status

### Administrator
- Full system access
- Register new users (students, mentors, admins)
- Approve/reject projects
- Assign mentors to projects
- View system-wide analytics
- Manage all users and projects

## Database Schema

The system uses PostgreSQL with tables for:
- **users** - User authentication and basic info
- **profiles** - Extended user profile information
- **students** - Student-specific data
- **mentors** - Mentor-specific data
- **projects** - Project details and status
- **teams** - Team information
- **team_members** - Team membership
- **invitations** - Team invitations
- **notifications** - User notifications
- **audit_logs** - System audit trail

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Middleware for role verification
- **CORS Protection**: Configured CORS policies
- **Helmet**: Security headers with Helmet.js
- **Input Validation**: Server-side input validation
- **SQL Injection Prevention**: Parameterized queries with pg
- **XSS Protection**: Output sanitization

## Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Testing

To test the application:

1. **Create Admin Account**: Register the first admin user through the database
2. **Login as Admin**: Access the admin dashboard
3. **Register Users**: Add students and mentors through the user management interface
4. **Create Projects**: Login as a student and submit a project
5. **Assign Mentor**: Login as admin and assign a mentor to the project
6. **Form Teams**: Students can create teams and invite other students
7. **Track Progress**: Monitor project status through respective dashboards

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
- Backend: Change `PORT` in backend `.env`
- Frontend: Use `PORT=3001 npm run dev` or modify next.config.ts

### JWT Token Issues
- Ensure `JWT_SECRET` is set in backend `.env`
- Check token expiry settings
- Clear browser localStorage/cookies

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Update dependencies: `npm update`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/aditya-singh-18/university_project_management_system/issues)
- Email: Contact the development team

## Acknowledgments

- Built with Next.js and Express
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS

---

**Version**: 1.0.0
**Status**: Active Development
**Last Updated**: March 2026
