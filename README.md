# Mini ERP & CRM System

A full-stack web application designed to manage business operations through a simple ERP and CRM platform. The application includes JWT-based authentication and role-based access control so that users can access features based on their assigned roles.

The project was developed as a full-stack application using React and Vite for the frontend, Node.js and Express for the backend, and PostgreSQL for data storage. The application is deployed using Render.

## Live Demo

**Frontend:**
https://mini-erp-crm-frontend-gpbs.onrender.com

**Backend:**
https://mini-erp-crm-backend-zpdv.onrender.com

**GitHub Repository:**
https://github.com/manideepika-komatireddy/mini-erp-crm

---

## Project Overview

The Mini ERP & CRM System is built to demonstrate how a business management application can be developed with a modern full-stack architecture.

The main focus of the project is authentication, authorization, and role-based access. After logging in, users can access different parts of the system depending on their role.

The project currently supports three main roles:

* **Admin**
* **Manager**
* **Employee**

Each role has different permissions, and access restrictions are handled on both the frontend and backend.

---

## Objectives

The main objectives of this project are:

* Build a complete full-stack web application.
* Implement secure user authentication using JWT.
* Implement role-based access control.
* Connect the application to a PostgreSQL database.
* Create protected backend API routes.
* Restrict access to specific features based on user roles.
* Deploy the frontend and backend to a cloud platform.
* Demonstrate a practical full-stack application architecture.

---

## Key Features

### User Authentication

Users can log in using their registered email and password.

The backend verifies the credentials and generates a JWT token after successful authentication.

The token is then used to access protected API routes.

### JWT Authentication

The application uses JSON Web Tokens for authentication.

The basic authentication flow is:

```text
User Login
    ↓
Frontend sends email and password
    ↓
Backend verifies user credentials
    ↓
JWT token is generated
    ↓
Token is stored on the frontend
    ↓
Token is sent with protected API requests
    ↓
Backend verifies the token
    ↓
User gets access to authorized resources
```

### Role-Based Access Control

Access to different sections of the application is controlled based on the user's role.

| Feature            | Admin | Manager | Employee |
| ------------------ | ----- | ------- | -------- |
| Main Dashboard     | Yes   | Yes     | Yes      |
| Admin Dashboard    | Yes   | No      | No       |
| Manager Dashboard  | Yes   | Yes     | No       |
| Employee Dashboard | Yes   | Yes     | Yes      |
| Sales              | Yes   | Yes     | No       |
| User Management    | Yes   | No      | No       |
| Profile            | Yes   | Yes     | Yes      |

The backend also checks permissions using middleware, so restricted APIs cannot be accessed simply by changing the frontend.

### Protected API Routes

The backend uses authentication middleware to protect API endpoints.

For example:

```text
/api/dashboard
/api/dashboard/admin
/api/dashboard/manager
/api/dashboard/employee
/api/dashboard/users
/api/dashboard/sales
/api/dashboard/profile
```

Authenticated users must provide a valid JWT token to access protected routes.

Role-specific routes also verify whether the logged-in user has the required permission.

### PostgreSQL Database

The application uses PostgreSQL as the database.

The backend connects to PostgreSQL and creates the required database tables when the application starts.

User information such as:

* User ID
* Name
* Email
* Password
* Role

is stored in the database.

Passwords are hashed using `bcryptjs` before being stored.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* HTML
* CSS

### Backend

* Node.js
* Express.js
* TypeScript
* JWT
* bcryptjs

### Database

* PostgreSQL

### Deployment

* Render

### Version Control

* Git
* GitHub

---

## System Architecture

The application follows a frontend-backend-database architecture.

```text
                   ┌──────────────────────┐
                   │       User           │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ React + Vite         │
                   │ Frontend             │
                   └──────────┬───────────┘
                              │
                         HTTP Requests
                         + JWT Token
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Node.js + Express    │
                   │ Backend API          │
                   └──────────┬───────────┘
                              │
                     Authentication
                     & Authorization
                              │
                              ▼
                   ┌──────────────────────┐
                   │ PostgreSQL Database  │
                   └──────────────────────┘
```

---

## Authentication and Authorization

The project separates authentication and authorization.

### Authentication

Authentication verifies who the user is.

The login process is:

1. User enters email and password.
2. Frontend sends login request to the backend.
3. Backend searches for the user in PostgreSQL.
4. Password is compared using bcrypt.
5. If credentials are valid, a JWT token is generated.
6. The frontend stores the token.
7. The token is sent with future protected requests.

### Authorization

Authorization determines what the user is allowed to access.

For example:

```text
Admin
    → Full access

Manager
    → Manager-level access
    → Sales access

Employee
    → Employee-level access
```

The backend uses role-based middleware to verify the user's role before allowing access.

---

## Backend Middleware

The project includes authentication and authorization middleware.

### Authentication Middleware

The `authenticateToken` middleware:

1. Reads the `Authorization` header.
2. Extracts the JWT token.
3. Verifies the token.
4. Stores the decoded user information in the request.
5. Allows the request to continue if the token is valid.

If the token is missing or invalid, the request is rejected.

### Authorization Middleware

The `authorizeRoles` middleware checks whether the logged-in user's role is allowed to access a specific route.

For example:

```typescript
authorizeRoles("admin")
```

allows only Admin users.

Similarly:

```typescript
authorizeRoles("admin", "manager")
```

allows both Admin and Manager users.

---

## API Routes

### Authentication

```text
POST /api/auth/register
```

Used to register a new user.

```text
POST /api/auth/login
```

Used to authenticate a user and receive a JWT token.

### Dashboard

```text
GET /api/dashboard
```

Accessible to authenticated users.

```text
GET /api/dashboard/admin
```

Admin-only access.

```text
GET /api/dashboard/manager
```

Accessible to Admin and Manager.

```text
GET /api/dashboard/employee
```

Accessible to Admin, Manager, and Employee.

```text
GET /api/dashboard/users
```

Admin-only user management access.

```text
GET /api/dashboard/sales
```

Accessible to Admin and Manager.

```text
GET /api/dashboard/profile
```

Accessible to authenticated users.

---

## Project Structure

The main project structure is:

```text
mini-erp-crm/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

## Running the Project Locally

### Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git

### Clone the Repository

```bash
git clone https://github.com/manideepika-komatireddy/mini-erp-crm.git
```

Move into the project directory:

```bash
cd mini-erp-crm
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start the backend in development mode:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## Production Build

To create a production build of the frontend:

```bash
npm run build
```

The build output is generated in the `dist` folder.

---

## Deployment

The application is deployed using Render.

The frontend is deployed as a static site, while the backend runs as a web service.

### Frontend Deployment

The frontend is built using:

```bash
npm run build
```

The generated `dist` folder is used for the production deployment.

### Backend Deployment

The backend runs as a Node.js service.

The backend connects to the PostgreSQL database using environment variables configured in the deployment environment.

### Deployment Flow

```text
GitHub Repository
       │
       ▼
Render
       │
       ├── Frontend Static Site
       │
       └── Backend Web Service
                │
                ▼
        PostgreSQL Database
```

Whenever updated code is pushed to the GitHub `main` branch, the Render deployment can rebuild and deploy the latest version.

---

## Security Considerations

The project includes several security-related implementations:

* Passwords are hashed using bcrypt.
* Passwords are not returned in login responses.
* JWT tokens are used for protected API access.
* Protected routes require authentication.
* Role-based middleware restricts access to sensitive routes.
* Unauthorized users receive appropriate HTTP status codes.
* Database credentials and JWT secrets are stored using environment variables.

The application is intended as a learning and portfolio project, and additional production-level security measures would be required for a real enterprise deployment.

---

## Testing

The application was tested with different user roles to verify role-based access control.

### Admin Testing

The Admin role was tested for:

* Admin Dashboard
* Manager Dashboard
* Employee Dashboard
* Sales
* User Management
* Profile

### Manager Testing

The Manager role was tested for:

* Manager Dashboard
* Employee Dashboard
* Sales
* Profile

Admin-only features were restricted.

### Employee Testing

The Employee role was tested for:

* Employee Dashboard
* Profile

Manager and Admin-only features were restricted.

The frontend was also tested with the production build command:

```bash
npm run build
```

The production build completed successfully.

---

## Challenges Faced During Development

Some of the challenges during development included:

* Connecting the frontend with the deployed backend.
* Configuring PostgreSQL for the application.
* Implementing JWT authentication.
* Adding role-based authorization without affecting existing functionality.
* Fixing API route mismatches between frontend and backend.
* Resolving TypeScript build configuration issues.
* Deploying the frontend and backend separately on Render.
* Testing protected routes with different user roles.

Working through these issues helped improve my understanding of full-stack application development, API communication, authentication, and deployment.

---

## Future Improvements

The project can be extended with additional ERP and CRM features such as:

* Customer management
* Lead management
* Employee management
* Sales and order management
* Inventory management
* Reports and analytics
* Search and filtering
* Pagination
* User profile management
* Admin user creation and management
* Password reset functionality
* Refresh tokens
* Improved dashboard analytics
* Automated testing
* More detailed audit logs

---

## What I Learned

Through this project, I gained practical experience in:

* Building a full-stack application using React and Node.js.
* Creating REST APIs with Express.
* Working with PostgreSQL.
* Implementing JWT authentication.
* Hashing passwords using bcrypt.
* Implementing role-based access control.
* Connecting a frontend application to a deployed backend.
* Managing environment variables.
* Using Git and GitHub for version control.
* Deploying full-stack applications using Render.
* Debugging frontend and backend integration issues.

---

## Project Links

**Live Application:**
https://mini-erp-crm-frontend-gpbs.onrender.com

**Backend API:**
https://mini-erp-crm-backend-zpdv.onrender.com

**GitHub Repository:**
https://github.com/manideepika-komatireddy/mini-erp-crm

---

## Author

**Manideepika Komatireddy**

Computer Science Engineering Student

GitHub:
https://github.com/manideepika-komatireddy

LinkedIn:
https://www.linkedin.com/in/manideepika-komatireddy/

---

## Conclusion

The Mini ERP & CRM System is a full-stack project that demonstrates the implementation of authentication, authorization, role-based access control, database integration, REST APIs, and cloud deployment.

The project was built as a practical way to understand how different parts of a full-stack application work together, from the user interface and API layer to authentication, database operations, and deployment.
