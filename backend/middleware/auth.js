const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  // Check if auth header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  
  // Verify token format (Bearer token)
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid token format' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;