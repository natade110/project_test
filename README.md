# Full-Stack Authentication System

Testing Project NextInnovation

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
├── redux/ - State management
│   ├── features/ - Redux slices
│   ├── provider.js - Redux provider
│   └── store.js - Redux store
└── services/ - API services
```

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Step 1: Clone the Repository
```bash
git clone https://github.com/natade110/project_test.git
cd project_test
```

### Step 2: Install Frontend Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
# or
yarn install
cd ..
```

### Step 4: Set Up MongoDB

#### Option 1: Using MongoDB Atlas (Recommended for beginners)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient)
3. Under "Database Access", create a new database user with read and write permissions
4. Under "Network Access", add a new IP address (add your current IP or 0.0.0.0/0 for development)
5. Under "Databases", click "Connect" on your cluster and select "Connect your application"
6. Copy the provided connection string

#### Option 2: Local MongoDB Installation
1. [Download and install MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   ```bash
   mongod
   ```
3. Your connection string will be `mongodb://localhost:27017/auth-system`

### Step 5: Configure Environment Variables
1. Create a `.env` file in the backend directory:
   ```bash
   cd backend
   cp .env.example .env
   # or manually create the .env file
   ```

2. Edit the `.env` file with your MongoDB connection string and other configurations:
   ```
   # Server Configuration
   PORT=3001

   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_TEST_URI=your_mongodb_test_connection_string

   # JWT Configuration
   JWT_SECRET=your_secret_key_here

   # CORS Settings
   CORS_ORIGIN=http://localhost:3000
   ```

   > Note: Replace `your_mongodb_connection_string` with your actual MongoDB connection string. For example: `mongodb+srv://username:password@cluster.mongodb.net/auth-system` or `mongodb://localhost:27017/auth-system`

3. Create a `.env.local` file in the root project directory (optional, for frontend configuration):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Step 6: Run the Development Servers

#### Run the backend server
```bash
cd backend
npm run dev
# or
yarn dev
```

#### In a new terminal, run the frontend server
```bash
# From the root directory
npm run dev
# or
yarn dev
```

### Step 7: Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Unit Testing

### Backend Tests

The project uses Jest and Supertest for backend unit testing.

1. Make sure you have set up the testing database in your `.env` file:
   ```
   MONGODB_TEST_URI=mongodb://localhost:27017/auth-system-test
   # or your MongoDB Atlas test database
   ```

2. Run the tests:
   ```bash
   cd backend
   npm test
   # or
   yarn test
   ```

### Test Coverage

To generate test coverage reports:

```bash
cd backend
npm test -- --coverage
# or
yarn test --coverage
```

### Understanding the Test Suite

The test suite includes tests for:
- User registration (sign-up)
- User authentication (sign-in)
- Validation of required fields
- Password complexity validation
- Email format validation
- Duplicate email check

## API Endpoints

### Authentication
- **POST /api/auth/signup** - Register a new user
  - Required fields: email, password
- **POST /api/auth/signin** - Authenticate a user
  - Required fields: email, password

### Activity
- **GET /api/activity** - Get a random activity from the Bored API

## Troubleshooting

### MongoDB Connection Issues
- Make sure your MongoDB instance is running
- Check that your IP address is whitelisted in MongoDB Atlas
- Verify your connection string in the `.env` file
- Ensure your MongoDB user has the correct permissions

### JWT Authentication Issues
- Make sure you have set a strong JWT_SECRET in your `.env` file
- Check that cookies are being properly stored and sent with requests
- Inspect browser network requests to ensure the token is being included

### CORS Issues
- Check that the CORS_ORIGIN in your `.env` file matches your frontend URL
- Make sure the backend's CORS configuration is correct in `server.js`

