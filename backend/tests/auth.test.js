const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Connect to test database before running tests
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_TEST_URI;
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up database after tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

// Clean up between tests
afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  // Test user data
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
  };

  // Test signup endpoint
  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return error if email already exists', async () => {
      // First create a user
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      // Try to create another user with the same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });

    it('should return error if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          // email is missing
          password: testUser.password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return error if password does not meet requirements', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'simple', // Password doesn't meet complexity requirements
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test signin endpoint
  describe('POST /api/auth/signin', () => {
    beforeEach(async () => {
      // Create a test user before each signin test
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should sign in a user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('firstName', testUser.firstName);
      expect(res.body).toHaveProperty('lastName', testUser.lastName);
    });

    it('should return error with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return error if user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return error if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          // password is missing
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});