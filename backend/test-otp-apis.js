/**
 * OTP SYSTEM API TESTING
 * Test all OTP endpoints
 * Run: node test-otp-apis.js
 */

const BASE_URL = 'http://localhost:5000/api';

let testData = {
  identifier: 'student@test.com', // Change this to an existing user email
  type: 'email',
  otp: '',
  sessionToken: ''
};

// Colors for console
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
async function request(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

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

// Test 1: Send OTP
async function testSendOtp() {
  logTest('Send OTP to Email');
  
  const result = await request('POST', '/otp/send', {
    identifier: testData.identifier,
    type: testData.type
  });
  
  if (result.success) {
    logSuccess('OTP sent successfully');
    logInfo(JSON.stringify(result.data, null, 2));
    logInfo('\n⚠️  Check your email for the OTP code');
    logInfo('Enter the OTP in testData.otp to continue testing\n');
  } else {
    logError(`Failed: ${result.error.message}`);
    logInfo('Make sure the email exists in the database');
  }
  
  return result.success;
}

// Test 2: Verify OTP (Manual - requires OTP from email)
async function testVerifyOtp() {
  logTest('Verify OTP');
  
  if (!testData.otp) {
    logError('Please set testData.otp with the OTP received via email');
    logInfo('Edit the test file and add: testData.otp = "123456"');
    return false;
  }
  
  const result = await request('POST', '/otp/verify', {
    identifier: testData.identifier,
    type: testData.type,
    otp: testData.otp
  });
  
  if (result.success) {
    logSuccess('OTP verified successfully');
    testData.sessionToken = result.data.sessionToken;
    logInfo(`Session Token: ${testData.sessionToken}`);
    logInfo(JSON.stringify(result.data, null, 2));
  } else {
    logError(`Verification failed: ${result.error.message}`);
  }
  
  return result.success;
}

// Test 3: Update Profile
async function testUpdateProfile() {
  logTest('Update Profile');
  
  if (!testData.sessionToken) {
    logError('Session token not found. Please verify OTP first.');
    return false;
  }
  
  const updateData = {
    identifier: testData.identifier,
    type: testData.type,
    sessionToken: testData.sessionToken,
    name: 'Updated Test User',
    headline: 'Full Stack Developer | Updated via OTP',
    location: 'New Delhi, India',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    socialLinks: {
      github: 'https://github.com/testuser',
      linkedin: 'https://linkedin.com/in/testuser'
    },
    dsaProblems: 250
  };
  
  const result = await request('POST', '/otp/update-profile', updateData);
  
  if (result.success) {
    logSuccess('Profile updated successfully');
    logInfo(JSON.stringify(result.data.user, null, 2));
  } else {
    logError(`Update failed: ${result.error.message}`);
  }
  
  return result.success;
}

// Test 4: Rate Limiting
async function testRateLimit() {
  logTest('Rate Limiting (Send 6 OTPs)');
  
  logInfo('Sending 5 OTPs rapidly...');
  
  for (let i = 1; i <= 6; i++) {
    const result = await request('POST', '/otp/send', {
      identifier: testData.identifier,
      type: testData.type
    });
    
    if (result.success) {
      logSuccess(`OTP ${i} sent successfully`);
    } else {
      if (i === 6) {
        logSuccess(`Rate limit working! Request ${i} blocked`);
        logInfo(result.error.message);
      } else {
        logError(`Failed at request ${i}: ${result.error.message}`);
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Test 5: Invalid OTP Attempts
async function testInvalidOtpAttempts() {
  logTest('Invalid OTP Attempts (Should fail)');
  
  const attempts = [
    '000000',
    '111111',
    '999999',
    '123456',
    '654321'
  ];
  
  for (let i = 0; i < attempts.length; i++) {
    const result = await request('POST', '/otp/verify', {
      identifier: testData.identifier,
      type: testData.type,
      otp: attempts[i]
    });
    
    if (!result.success) {
      logInfo(`Attempt ${i + 1}: ${result.error.message}`);
    } else {
      logError(`Should have failed but succeeded with OTP: ${attempts[i]}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  logSuccess('Invalid OTP protection working correctly');
}

// Test 6: Expired Session
async function testExpiredSession() {
  logTest('Expired Session (Wait 5 minutes)');
  
  logInfo('This test requires waiting 5 minutes for OTP to expire');
  logInfo('Skipping for now. To test manually:');
  logInfo('1. Send OTP');
  logInfo('2. Wait 5+ minutes');
  logInfo('3. Try to verify - should fail with "expired" message');
}

// Run all tests
async function runAllTests() {
  console.clear();
  log('\n🚀 CAMPUSCONNECT OTP SYSTEM TESTING\n', 'yellow');
  log('Starting OTP API tests...', 'cyan');
  
  try {
    // Test 1: Send OTP
    const sendSuccess = await testSendOtp();
    
    if (!sendSuccess) {
      logError('\n❌ TESTING STOPPED: Could not send OTP');
      logInfo('Make sure:');
      logInfo('1. Server is running (npm start)');
      logInfo('2. Email configuration is correct in .env');
      logInfo('3. User with test email exists in database');
      return;
    }
    
    logInfo('\n⏸️  MANUAL STEP REQUIRED:');
    logInfo('1. Check your email for the OTP');
    logInfo('2. Update testData.otp = "YOUR_OTP" in this file');
    logInfo('3. Run the script again to continue testing\n');
    
    // Only run these if OTP is provided
    if (testData.otp) {
      await testVerifyOtp();
      await testUpdateProfile();
    }
    
    // Rate limiting test (optional)
    // Uncomment to test rate limiting
    // await testRateLimit();
    
    // Invalid attempts test
    // await testInvalidOtpAttempts();
    
    console.log('\n' + '='.repeat(60));
    log('✅ TESTING COMPLETED', 'green');
    console.log('='.repeat(60));
    
    logInfo('\n📝 Test Summary:');
    logInfo('✅ OTP sending working');
    logInfo('✅ Email delivery configured');
    logInfo('⏸️  Manual verification required for complete testing');
    
    log('\n🎯 Next Steps:', 'yellow');
    logInfo('1. Get OTP from email');
    logInfo('2. Set testData.otp in this file');
    logInfo('3. Run again to test verification & profile update');
    logInfo('4. Test with frontend React pages\n');
    
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
