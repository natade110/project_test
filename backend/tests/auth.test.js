const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

// Connect to test database before running tests
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_TEST_URI;
  console.log(`Connecting to test database: ${mongoUri}`);
  
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to test database successfully');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
});

// Clean up database after tests
afterAll(async () => {
  try {
    await User.deleteMany({ email: /example\.com$/ });    
    await mongoose.connection.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error during test cleanup:', error);
  }
});

// Clean up between tests
afterEach(async () => {
  try {
    await User.deleteMany({ email: /example\.com$/ });
    console.log('Test database cleaned between tests');
  } catch (error) {
    console.error('Error cleaning database between tests:', error);
  }
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
      expect(res.body.user).toHaveProperty('firstName', testUser.firstName);
      expect(res.body.user).toHaveProperty('lastName', testUser.lastName);
      expect(res.body.user).toHaveProperty('createdAt');
      
      // Verify user was created in database
      const dbUser = await User.findOne({ email: testUser.email });
      expect(dbUser).not.toBeNull();
      expect(dbUser.firstName).toBe(testUser.firstName);
      expect(dbUser.lastName).toBe(testUser.lastName);
      
      // Verify password was hashed (not stored as plaintext)
      expect(dbUser.password).not.toBe(testUser.password);
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

    it('should return error if firstName is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          // firstName is missing
          lastName: testUser.lastName,
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('First name is required');
    });

    it('should return error if lastName is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: testUser.firstName,
          // lastName is missing
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Last name is required');
    });

    it('should return error if email is missing', async () => {
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
      expect(res.body.error).toContain('Email is required');
    });

    it('should return error if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          // password is missing
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Password is required');
    });

    it('should return error if email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          email: 'invalid-email', // Invalid email format
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Invalid email format');
    });

    it('should return error if password length is less than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'Short1!', // 7 characters
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('at least 8 characters');
    });

    it('should return error if password does not contain uppercase letter', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'password123!', // No uppercase
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('uppercase letter');
    });

    it('should return error if password does not contain lowercase letter', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'PASSWORD123!', // No lowercase
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('lowercase letter');
    });

    it('should return error if password does not contain number', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'Password!', // No number
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('number');
    });

    it('should return error if password does not contain special character', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'Password123', // No special character
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('special character');
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

    it('should sign in a user with valid credentials and return token with user info', async () => {
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
      
      // Decode JWT token (without verification)
      const tokenParts = res.body.token.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      // Check payload contains required fields
      expect(payload).toHaveProperty('email', testUser.email);
      expect(payload).toHaveProperty('firstName', testUser.firstName);
      expect(payload).toHaveProperty('lastName', testUser.lastName);
      expect(payload).toHaveProperty('exp'); // Expiration time
      
      // Verify token expires in 1 day (with small tolerance)
      const now = Math.floor(Date.now() / 1000);
      const oneDayInSeconds = 24 * 60 * 60;
      expect(payload.exp).toBeGreaterThan(now + oneDayInSeconds - 60); // Allow 1 minute tolerance
      expect(payload.exp).toBeLessThan(now + oneDayInSeconds + 60); // Allow 1 minute tolerance
    });

    it('should update lastLogin timestamp when user signs in', async () => {
      // Get initial lastLogin
      const userBefore = await User.findOne({ email: testUser.email });
      const initialLogin = userBefore.lastLogin;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sign in
      await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      
      // Check lastLogin was updated
      const userAfter = await User.findOne({ email: testUser.email });
      expect(userAfter.lastLogin.getTime()).toBeGreaterThan(initialLogin.getTime());
    });

    it('should return error with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Invalid email or password');
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
      expect(res.body.error).toContain('Invalid email or password');
    });

    it('should return error if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          // email is missing
          password: testUser.password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Email');
    });

    it('should return error if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          // password is missing
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Password');
    });
  });
});