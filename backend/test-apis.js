const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

// Test Student APIs
async function testStudentAPIs() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Student APIs');
  console.log('='.repeat(50) + '\n');

  try {
    // 1. Get all students
    log.info('1. Testing GET /api/students');
    const getAllResponse = await axios.get(`${BASE_URL}/students`);
    log.success(`Got ${getAllResponse.data.length} students`);
    console.log('Sample:', getAllResponse.data[0] || 'No students found');

    // 2. Create a new student
    log.info('\n2. Testing POST /api/students (Create new student)');
    const newStudent = {
      id: Math.floor(Math.random() * 10000) + 1000,
      name: 'Test Student',
      branch: 'Computer Science',
      batch: '2024',
      pronouns: 'He/Him',
      location: 'Delhi, India',
      headline: 'Software Developer | Full Stack',
      image: 'https://i.ibb.co/TqK1XTQm/image-5.jpg',
      skills: {
        dsa: ['Arrays', 'Trees', 'Graphs'],
        development: ['React', 'Node.js', 'Express']
      },
      socialLinks: {
        github: 'https://github.com/teststudent',
        linkedin: 'https://linkedin.com/in/teststudent'
      },
      resumeLink: 'https://resume.com/test',
      dsaProblems: 150,
      rollNumber: 'CS2024999',
      email: 'test.student@example.com'
    };

    const createResponse = await axios.post(`${BASE_URL}/students`, newStudent);
    log.success(`Student created with ID: ${createResponse.data.id}`);
    console.log('Created student:', createResponse.data);

    const studentId = createResponse.data.id;

    // 3. Get student by ID
    log.info(`\n3. Testing GET /api/students/${studentId}`);
    const getByIdResponse = await axios.get(`${BASE_URL}/students/${studentId}`);
    log.success(`Found student: ${getByIdResponse.data.name}`);

    // 4. Update student
    log.info(`\n4. Testing PUT /api/students/${studentId}`);
    const updateData = {
      ...newStudent,
      name: 'Updated Test Student',
      isPlaced: true,
      headline: 'Senior Software Developer | MERN Stack'
    };
    const updateResponse = await axios.put(`${BASE_URL}/students/${studentId}`, updateData);
    log.success(`Student updated: ${updateResponse.data.name}`);
    console.log('Updated data:', updateResponse.data);

    // 5. Delete student
    log.info(`\n5. Testing DELETE /api/students/${studentId}`);
    const deleteResponse = await axios.delete(`${BASE_URL}/students/${studentId}`);
    log.success(deleteResponse.data.message);

  } catch (error) {
    log.error(`Student API Test Failed: ${error.message}`);
    if (error.response) {
      console.log('Error details:', error.response.data);
    }
  }
}

// Test Alumni APIs
async function testAlumniAPIs() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Alumni APIs');
  console.log('='.repeat(50) + '\n');

  try {
    // 1. Get all alumni
    log.info('1. Testing GET /api/alumni');
    const getAllResponse = await axios.get(`${BASE_URL}/alumni`);
    log.success(`Got ${getAllResponse.data.length} alumni`);
    console.log('Sample:', getAllResponse.data[0] || 'No alumni found');

    // 2. Create a new alumni
    log.info('\n2. Testing POST /api/alumni (Create new alumni)');
    const newAlumni = {
      id: Math.floor(Math.random() * 10000) + 2000,
      name: 'Test Alumni',
      branch: 'Information Technology',
      batch: '2020',
      pronouns: 'She/Her',
      location: 'Bangalore, India',
      headline: 'Senior Engineer at Tech Corp',
      image: 'https://i.ibb.co/TqK1XTQm/image-5.jpg',
      company: 'Tech Corp',
      techStack: ['Python', 'Django', 'PostgreSQL', 'AWS'],
      socialLinks: {
        github: 'https://github.com/testalumni',
        linkedin: 'https://linkedin.com/in/testalumni'
      },
      resumeLink: 'https://resume.com/testalumni',
      email: 'test.alumni@example.com'
    };

    const createResponse = await axios.post(`${BASE_URL}/alumni`, newAlumni);
    log.success(`Alumni created with ID: ${createResponse.data.id}`);
    console.log('Created alumni:', createResponse.data);

    const alumniId = createResponse.data.id;

    // 3. Get alumni by ID
    log.info(`\n3. Testing GET /api/alumni/${alumniId}`);
    const getByIdResponse = await axios.get(`${BASE_URL}/alumni/${alumniId}`);
    log.success(`Found alumni: ${getByIdResponse.data.name}`);

    // 4. Update alumni
    log.info(`\n4. Testing PUT /api/alumni/${alumniId}`);
    const updateData = {
      ...newAlumni,
      name: 'Updated Test Alumni',
      company: 'Google',
      headline: 'Staff Engineer at Google'
    };
    const updateResponse = await axios.put(`${BASE_URL}/alumni/${alumniId}`, updateData);
    log.success(`Alumni updated: ${updateResponse.data.name}`);
    console.log('Updated data:', updateResponse.data);

    // 5. Delete alumni
    log.info(`\n5. Testing DELETE /api/alumni/${alumniId}`);
    const deleteResponse = await axios.delete(`${BASE_URL}/alumni/${alumniId}`);
    log.success(deleteResponse.data.message);

  } catch (error) {
    log.error(`Alumni API Test Failed: ${error.message}`);
    if (error.response) {
      console.log('Error details:', error.response.data);
    }
  }
}

// Test validation errors
async function testValidation() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Validation');
  console.log('='.repeat(50) + '\n');

  try {
    log.info('1. Testing student creation with missing fields');
    const invalidStudent = {
      name: 'Invalid Student'
      // Missing required fields
    };
    await axios.post(`${BASE_URL}/students`, invalidStudent);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.success('Validation working correctly - caught missing fields');
      console.log('Validation errors:', error.response.data);
    } else {
      log.error('Unexpected error during validation test');
    }
  }

  try {
    log.info('\n2. Testing alumni creation with invalid email');
    const invalidAlumni = {
      id: 9999,
      name: 'Test Alumni',
      branch: 'CS',
      batch: '2020',
      company: 'Test Corp',
      email: 'invalid-email'
    };
    await axios.post(`${BASE_URL}/alumni`, invalidAlumni);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.success('Email validation working correctly');
      console.log('Validation errors:', error.response.data);
    } else {
      log.error('Unexpected error during email validation test');
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '🚀 Starting API Tests'.padEnd(50, '='));
  console.log('Testing backend at:', BASE_URL);

  try {
    await testStudentAPIs();
    await testAlumniAPIs();
    await testValidation();

    console.log('\n' + '='.repeat(50));
    log.success('All API tests completed!');
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    log.error('Test suite failed');
    console.error(error);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/students`);
    log.success('Server is running!');
    runAllTests();
  } catch (error) {
    log.error('Server is not running. Please start the server first:');
    console.log('  cd backend');
    console.log('  npm start');
    console.log('\nThen run this test script again.');
  }
}

checkServer();
