const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test 1: Check if upload endpoint is accessible
async function testUploadEndpoint() {
  log('blue', '\n========== TEST 1: Upload Endpoint Accessibility ==========');
  try {
    const response = await axios.get(`${BASE_URL}/upload/test`);
    log('green', '✓ Upload endpoint is accessible');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    log('red', '✗ Upload endpoint test failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

// Test 2: Upload an image (you need to have a test image)
async function testImageUpload() {
  log('blue', '\n========== TEST 2: Image Upload ==========');
  
  // Create a dummy image buffer (1x1 pixel PNG)
  const dummyImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  );
  
  try {
    const formData = new FormData();
    formData.append('image', dummyImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    log('yellow', 'Uploading test image...');
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    log('green', '✓ Image uploaded successfully');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    log('red', '✗ Image upload failed');
    console.error('Error:', error.response?.data || error.message);
    
    // Show more details about the error
    if (error.response) {
      log('yellow', `Status Code: ${error.response.status}`);
      log('yellow', `Error Message: ${error.response.data?.message || 'Unknown error'}`);
    }
    return null;
  }
}

// Test 3: Upload without file (should fail)
async function testUploadWithoutFile() {
  log('blue', '\n========== TEST 3: Upload Without File (Should Fail) ==========');
  try {
    const formData = new FormData();
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    log('red', '✗ Test failed - should have rejected empty upload');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log('green', '✓ Correctly rejected upload without file');
      console.log('Response:', error.response.data);
      return true;
    } else {
      log('red', '✗ Unexpected error');
      console.error('Error:', error.response?.data || error.message);
      return false;
    }
  }
}

// Main test runner
async function runTests() {
  log('magenta', '\n╔════════════════════════════════════════════════╗');
  log('magenta', '║     CLOUDINARY UPLOAD API TEST SUITE          ║');
  log('magenta', '╚════════════════════════════════════════════════╝');
  
  log('yellow', '\n📋 Testing Upload API at: ' + BASE_URL);
  log('yellow', '⏰ Test started at: ' + new Date().toLocaleString());
  
  const results = {
    total: 3,
    passed: 0,
    failed: 0
  };

  // Run tests
  const test1 = await testUploadEndpoint();
  if (test1) results.passed++;
  else results.failed++;

  const test2 = await testImageUpload();
  if (test2) results.passed++;
  else results.failed++;

  const test3 = await testUploadWithoutFile();
  if (test3) results.passed++;
  else results.failed++;

  // Summary
  log('magenta', '\n╔════════════════════════════════════════════════╗');
  log('magenta', '║              TEST SUMMARY                      ║');
  log('magenta', '╚════════════════════════════════════════════════╝');
  log('blue', `Total Tests: ${results.total}`);
  log('green', `Passed: ${results.passed}`);
  log('red', `Failed: ${results.failed}`);
  
  if (results.passed === results.total) {
    log('green', '\n✓ All tests passed! Upload API is working correctly.');
  } else {
    log('red', `\n✗ ${results.failed} test(s) failed. Please check the errors above.`);
  }
  
  log('yellow', '\n⏰ Test completed at: ' + new Date().toLocaleString());
}

// Run the tests
runTests().catch(error => {
  log('red', '\n❌ Test suite failed to run:');
  console.error(error);
  process.exit(1);
});
