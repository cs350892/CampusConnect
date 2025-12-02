// Simple test server to verify admin login
const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Admin login route
app.post('/api/admin-approval/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username and password'
    });
  }
  
  if (username === 'admin' && password === 'admin') {
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token: token,
      admin: {
        username: 'admin',
        role: 'admin'
      }
    });
  }
  
  res.status(401).json({
    success: false,
    message: 'Invalid admin credentials'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
});
