// Test Email + Roll Number Profile Update System
// Save this as: backend/test-email-roll-system.js
// Run with: node test-email-roll-system.js

const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`)
};

// Test data - CHANGE THESE TO MATCH YOUR DATABASE
const testUser = {
  email: 'student@example.com',      // Use real email from your DB
  rollNumber: '12345678'              // Use real roll number from your DB
};

const updateData = {
  name: 'Test User Updated',
  phone: '+91 9876543210',
  location: 'Mumbai, India',
  headline: 'Full Stack Developer | MERN Stack',
  about: 'Passionate software developer with expertise in web development.',
  skills: {
    dsa: ['Arrays', 'Trees', 'Dynamic Programming', 'Graphs'],
    development: ['React', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript']
  },
  techStack: ['MERN Stack', 'Python', 'AWS', 'Docker', 'Git'],
  socialLinks: {
    github: 'https://github.com/testuser',
    linkedin: 'https://linkedin.com/in/testuser'
  },
  resumeLink: 'https://drive.google.com/file/d/xyz123/view',
  isPlaced: true,
  company: 'TechCorp Solutions'
};

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test 1: Verify user with valid credentials
async function testVerifyValidUser() {
  log.title('TEST 1: Verify User with Valid Credentials');
  
  try {
    log.info(`Testing with email: ${testUser.email}, rollNumber: ${testUser.rollNumber}`);
    
    const response = await axios.post(
      `${API_URL}/api/profile-verify/verify`,
      {
        email: testUser.email,
        rollNumber: testUser.rollNumber
      }
    );
    
    if (response.data.success && response.data.verified) {
      log.success('User verified successfully!');
      log.info(`User Name: ${response.data.userData.name}`);
      log.info(`User Email: ${response.data.userData.email}`);
      log.info(`Roll Number: ${response.data.userData.rollNumber}`);
      return true;
    } else {
      log.error('Verification failed - success flag is false');
      return false;
    }
  } catch (error) {
    log.error(`Verification failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.status === 404) {
      log.warning('User not found in database. Please update testUser object with valid credentials.');
    }
    return false;
  }
}

// Test 2: Verify user with invalid credentials
async function testVerifyInvalidUser() {
  log.title('TEST 2: Verify User with Invalid Credentials');
  
  try {
    const response = await axios.post(
      `${API_URL}/api/profile-verify/verify`,
      {
        email: 'invalid@example.com',
        rollNumber: '00000000'
      }
    );
    
    log.error('Expected 404 error but got success response');
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      log.success('Invalid credentials correctly rejected!');
      log.info(`Error message: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Test 3: Update profile with valid credentials
async function testUpdateProfile() {
  log.title('TEST 3: Update Profile with Valid Credentials');
  
  try {
    log.info('Updating profile with new data...');
    
    const response = await axios.post(
      `${API_URL}/api/profile-verify/update`,
      {
        email: testUser.email,
        rollNumber: testUser.rollNumber,
        ...updateData
      }
    );
    
    if (response.data.success) {
      log.success('Profile updated successfully!');
      log.info(`Updated Name: ${response.data.user.name}`);
      log.info(`Updated Phone: ${response.data.user.phone}`);
      log.info(`Updated Location: ${response.data.user.location}`);
      log.info(`DSA Skills: ${response.data.user.skills.dsa.length} skills`);
      log.info(`Dev Skills: ${response.data.user.skills.development.length} skills`);
      log.info(`Tech Stack: ${response.data.user.techStack.length} technologies`);
      return true;
    } else {
      log.error('Update failed - success flag is false');
      return false;
    }
  } catch (error) {
    log.error(`Update failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 4: Try to update with invalid credentials
async function testUpdateWithInvalidCredentials() {
  log.title('TEST 4: Update Profile with Invalid Credentials');
  
  try {
    const response = await axios.post(
      `${API_URL}/api/profile-verify/update`,
      {
        email: 'invalid@example.com',
        rollNumber: '00000000',
        name: 'Should Not Update'
      }
    );
    
    log.error('Expected 404 error but got success response');
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      log.success('Update correctly rejected for invalid credentials!');
      log.info(`Error message: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Test 5: Missing required fields
async function testMissingFields() {
  log.title('TEST 5: Verify with Missing Fields');
  
  try {
    const response = await axios.post(
      `${API_URL}/api/profile-verify/verify`,
      {
        email: testUser.email
        // Missing rollNumber
      }
    );
    
    log.error('Expected 400 error but got success response');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Missing fields correctly rejected!');
      log.info(`Error message: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Main test runner
async function runAllTests() {
  log.title('🚀 Email + Roll Number Profile Update System - API Tests');
  log.info(`Testing API at: ${API_URL}`);
  log.warning('Make sure backend server is running on port 5000!');
  log.warning('Update testUser object with valid database credentials!');
  
  await delay(2000);
  
  const results = [];
  
  // Run all tests
  results.push(await testVerifyValidUser());
  await delay(1000);
  
  results.push(await testVerifyInvalidUser());
  await delay(1000);
  
  results.push(await testUpdateProfile());
  await delay(1000);
  
  results.push(await testUpdateWithInvalidCredentials());
  await delay(1000);
  
  results.push(await testMissingFields());
  
  // Summary
  log.title('📊 Test Results Summary');
  
  const passed = results.filter(r => r === true).length;
  const failed = results.filter(r => r === false).length;
  const total = results.length;
  
  console.log(`\nTotal Tests: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  
  if (failed === 0) {
    log.success('\n🎉 All tests passed! System is working correctly!');
  } else {
    log.error(`\n⚠️ ${failed} test(s) failed. Please check the errors above.`);
  }
  
  log.title('');
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  if (error.code === 'ECONNREFUSED') {
    log.warning('Connection refused - Is the backend server running on port 5000?');
    log.info('Start backend with: cd backend && npm start');
  }
});
