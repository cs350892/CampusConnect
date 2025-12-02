// Quick test for simple-admin registration endpoint

const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testRegistration() {
  try {
    console.log('🧪 Testing registration endpoint...\n');

    const testData = {
      name: 'Test Student',
      email: 'test@student.com',
      roll: '240001',
      branch: 'CSE',
      batch: '2024',
      role: 'student',
      phone: '9876543210',
      techStack: 'React, Node.js',
      resumeLink: 'https://resume.com/test',
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/test',
      location: 'India',
      pronouns: 'He/Him',
      dsaProblems: 500
    };

    console.log('📤 Sending data:', testData);

    const response = await axios.post(
      `${API_URL}/api/simple-admin/register-pending`,
      testData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ Success!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('\n❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Run test
testRegistration();
