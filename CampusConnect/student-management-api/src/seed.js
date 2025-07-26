const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StudentModel = require('./models/student');
const AlumniModel = require('./models/alumni');
const { students, tprStudents } = require('./data/students');
const alumni = require('./data/alumni');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student-management';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await StudentModel.deleteMany({});
    await AlumniModel.deleteMany({});

    // Insert students and alumni
    await StudentModel.insertMany([...students, ...tprStudents]);
    await AlumniModel.insertMany(alumni);
    console.log('Database seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();