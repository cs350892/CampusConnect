/**
 * CAMPUSCONNECT API TEST SCRIPT
 * Complete testing for all endpoints
 * Run: node test-complete-apis.js
 */

const BASE_URL = 'http://localhost:5000/api';

let authTokens = {
  student: '',
  alumni: '',
  admin: ''
};

let testData = {
  studentId: '',
  alumniId: '',
  jobId: '',
  referralId: ''
};

// Colored console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`🧪 Testing: ${testName}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Make HTTP request
async function request(method, endpoint, data = null, token = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result, status: response.status };
    } else {
      return { success: false, error: result, status: response.status };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  logTest('Health Check');
  const result = await request('GET', '/health');
  
  if (result.success) {
    logSuccess('API is running');
    logInfo(JSON.stringify(result.data, null, 2));
  } else {
    logError('Health check failed');
  }
}

// Test 2: Register Student
async function testRegisterStudent() {
  logTest('Register Student');
  
  const studentData = {
    name: 'Test Student',
    email: 'student@test.com',
    password: 'student123',
    role: 'student',
    phone: '1234567890',
    batch: '2024',
    branch: 'CSE',
    rollNumber: '21BCS999',
    techStack: 'React, Node.js, MongoDB',
    resumeLink: 'https://drive.google.com/student-resume'
  };

  const result = await request('POST', '/auth/register', studentData);
  
  if (result.success) {
    authTokens.student = result.data.token;
    testData.studentId = result.data.user._id;
    logSuccess('Student registered successfully');
    logInfo(`Student ID: ${testData.studentId}`);
    logInfo(`Token saved for future requests`);
  } else {
    logError(`Registration failed: ${result.error.message}`);
  }
}

// Test 3: Register Alumni
async function testRegisterAlumni() {
  logTest('Register Alumni');
  
  const alumniData = {
    name: 'Test Alumni',
    email: 'alumni@test.com',
    password: 'alumni123',
    role: 'alumni',
    phone: '9876543210',
    batch: '2020',
    branch: 'IT',
    company: 'Google',
    techStack: 'Python, Go, Kubernetes'
  };

  const result = await request('POST', '/auth/register', alumniData);
  
  if (result.success) {
    authTokens.alumni = result.data.token;
    testData.alumniId = result.data.user._id;
    logSuccess('Alumni registered (pending approval)');
    logInfo(`Alumni ID: ${testData.alumniId}`);
    logInfo(`⚠️  Alumni needs admin approval to post jobs`);
  } else {
    logError(`Registration failed: ${result.error.message}`);
  }
}

// Test 4: Login Student
async function testLoginStudent() {
  logTest('Login Student');
  
  const loginData = {
    email: 'student@test.com',
    password: 'student123'
  };

  const result = await request('POST', '/auth/login', loginData);
  
  if (result.success) {
    authTokens.student = result.data.token;
    logSuccess('Login successful');
    logInfo(`Welcome: ${result.data.user.name}`);
  } else {
    logError(`Login failed: ${result.error.message}`);
  }
}

// Test 5: Get Current User
async function testGetMe() {
  logTest('Get Current User (Student)');
  
  const result = await request('GET', '/auth/me', null, authTokens.student);
  
  if (result.success) {
    logSuccess('User profile fetched');
    logInfo(JSON.stringify(result.data.user, null, 2));
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Test 6: Update Profile
async function testUpdateProfile() {
  logTest('Update Student Profile');
  
  const updates = {
    dsaProblems: 150,
    resumeLink: 'https://new-resume-link.com'
  };

  const result = await request('PUT', '/auth/profile', updates, authTokens.student);
  
  if (result.success) {
    logSuccess('Profile updated successfully');
  } else {
    logError(`Update failed: ${result.error.message}`);
  }
}

// Test 7: Get All Students
async function testGetAllStudents() {
  logTest('Get All Students');
  
  const result = await request('GET', '/students?batch=2024');
  
  if (result.success) {
    logSuccess(`Found ${result.data.count} students`);
    logInfo(`Page: ${result.data.pagination.page}/${result.data.pagination.pages}`);
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Test 8: Get All Alumni
async function testGetAllAlumni() {
  logTest('Get All Alumni');
  
  const result = await request('GET', '/alumni?isVerified=true');
  
  if (result.success) {
    logSuccess(`Found ${result.data.count} verified alumni`);
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Test 9: Create Job (Should fail - Alumni not verified)
async function testCreateJobFail() {
  logTest('Create Job (Unverified Alumni - Should Fail)');
  
  const jobData = {
    title: 'Software Engineer',
    company: 'Google',
    description: 'Great opportunity for freshers',
    requirements: ['React', 'Node.js'],
    ctc: '15-20 LPA',
    location: 'Bangalore',
    jobType: 'Full-time',
    applicationLink: 'https://apply.google.com',
    expiryDate: '2024-12-31'
  };

  const result = await request('POST', '/jobs', jobData, authTokens.alumni);
  
  if (!result.success) {
    logSuccess('Correctly blocked: Alumni not verified');
    logInfo(result.error.message);
  } else {
    logError('Should have failed - alumni is not verified!');
  }
}

// Test 10: Get All Jobs
async function testGetAllJobs() {
  logTest('Get All Jobs');
  
  const result = await request('GET', '/jobs?status=approved');
  
  if (result.success) {
    logSuccess(`Found ${result.data.count} approved jobs`);
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Test 11: Create Referral Request (Should fail - no approved jobs)
async function testCreateReferralFail() {
  logTest('Create Referral Request (Should Fail - No Jobs)');
  
  const referralData = {
    jobId: '507f1f77bcf86cd799439011', // Random ID
    message: 'Please refer me for this position'
  };

  const result = await request('POST', '/referrals', referralData, authTokens.student);
  
  if (!result.success) {
    logSuccess('Correctly failed: Job not found');
    logInfo(result.error.message);
  } else {
    logError('Should have failed!');
  }
}

// Test 12: Get Referral Stats
async function testGetReferralStats() {
  logTest('Get Referral Stats (Student)');
  
  const result = await request('GET', '/referrals/stats', null, authTokens.student);
  
  if (result.success) {
    logSuccess('Stats fetched');
    logInfo(JSON.stringify(result.data.stats, null, 2));
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Test 13: Change Password
async function testChangePassword() {
  logTest('Change Password');
  
  const passwordData = {
    currentPassword: 'student123',
    newPassword: 'newpassword123'
  };

  const result = await request('PUT', '/auth/change-password', passwordData, authTokens.student);
  
  if (result.success) {
    logSuccess('Password changed successfully');
    
    // Change it back
    const revertData = {
      currentPassword: 'newpassword123',
      newPassword: 'student123'
    };
    await request('PUT', '/auth/change-password', revertData, authTokens.student);
    logInfo('Password reverted back');
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Test 14: Logout
async function testLogout() {
  logTest('Logout');
  
  const result = await request('POST', '/auth/logout', null, authTokens.student);
  
  if (result.success) {
    logSuccess('Logged out successfully');
  } else {
    logError(`Failed: ${result.error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  console.clear();
  log('\n🚀 CAMPUSCONNECT API TESTING SUITE\n', 'yellow');
  log('Starting comprehensive API tests...', 'cyan');
  
  try {
    await testHealthCheck();
    await testRegisterStudent();
    await testRegisterAlumni();
    await testLoginStudent();
    await testGetMe();
    await testUpdateProfile();
    await testGetAllStudents();
    await testGetAllAlumni();
    await testCreateJobFail();
    await testGetAllJobs();
    await testCreateReferralFail();
    await testGetReferralStats();
    await testChangePassword();
    await testLogout();
    
    console.log('\n' + '='.repeat(60));
    log('✅ ALL TESTS COMPLETED', 'green');
    console.log('='.repeat(60));
    
    logInfo('\n📝 Test Summary:');
    logInfo(`Student Token: ${authTokens.student ? 'Generated ✅' : 'Failed ❌'}`);
    logInfo(`Alumni Token: ${authTokens.alumni ? 'Generated ✅' : 'Failed ❌'}`);
    logInfo(`Student ID: ${testData.studentId || 'N/A'}`);
    logInfo(`Alumni ID: ${testData.alumniId || 'N/A'}`);
    
    log('\n🎯 Next Steps:', 'yellow');
    logInfo('1. Create an admin user manually in MongoDB');
    logInfo('2. Use admin token to approve the alumni');
    logInfo('3. Then alumni can post jobs');
    logInfo('4. Students can request referrals');
    logInfo('5. Alumni can respond to referrals\n');
    
  } catch (error) {
    logError(`\n❌ Test suite error: ${error.message}`);
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Error: This script requires Node.js 18+ with native fetch support');
  console.log('Run: nvm use 18 or upgrade Node.js');
  process.exit(1);
}

// Run tests
runAllTests();
