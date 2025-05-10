# Full-Stack Authentication System

A complete authentication system built with Next.js for the frontend and Node.js (Express) for the backend.

## Features

- User registration (Sign-up)
- User authentication (Sign-in)
- Password hashing with bcrypt
- JWT-based authentication
- Form validations
- Protected routes
- Responsive UI
- Activity exploration through the Bored API
- Redux Toolkit for state management

## Tech Stack

### Frontend
- Next.js 13 (App Router)
- React
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Bcrypt

## Project Structure

```
├── app/ - Next.js app directory
│   ├── api/ - API routes
│   ├── dashboard/ - Dashboard (landing) page
│   ├── signin/ - Sign-in page
│   ├── signup/ - Sign-up page
│   └── layout.js - Root layout
├── backend/ - Backend server
│   ├── controllers/ - Route controllers
│   ├── middleware/ - Custom middleware
│   ├── models/ - Mongoose models
│   ├── routes/ - API routes
│   ├── tests/ - Unit tests
│   └── server.js - Server entry point
├── components/ - React components
├── public/ - Static assets
├── redux/ - Redux state management
│   ├── features/ - Redux slices
│   ├── provider.js - Redux provider
│   └── store.js - Redux store
└── services/ - API services
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB

### Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/auth-system.git
cd auth-system
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
- Create a `.env` file in the backend directory based on `.env.example`
- Configure your MongoDB connection string

5. Start MongoDB (if running locally)
```bash
mongod
```

6. Run the backend server
```bash
cd backend
npm run dev
```

7. Run the frontend development server
```bash
# From the root directory
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Authenticate a user

## License
MIT