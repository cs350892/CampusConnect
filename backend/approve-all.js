const mongoose = require('mongoose');
const Student = require('./src/models/student');
const Alumni = require('./src/models/alumni');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Update students without status or with pending status
    const studentUpdate = await Student.updateMany(
      { $or: [{ status: { $exists: false } }, { status: 'pending' }] },
      { $set: { status: 'approved', approvedAt: new Date() } }
    );
    
    console.log(`✅ Updated ${studentUpdate.modifiedCount} students to approved status`);
    
    // Update alumni without status or with pending status
    const alumniUpdate = await Alumni.updateMany(
      { $or: [{ status: { $exists: false } }, { status: 'pending' }] },
      { $set: { status: 'approved', approvedAt: new Date() } }
    );
    
    console.log(`✅ Updated ${alumniUpdate.modifiedCount} alumni to approved status`);
    
    // Verify
    const approvedStudents = await Student.countDocuments({ status: 'approved' });
    const approvedAlumni = await Alumni.countDocuments({ status: 'approved' });
    
    console.log(`\n📊 Final Count:`);
    console.log(`   Students (approved): ${approvedStudents}`);
    console.log(`   Alumni (approved): ${approvedAlumni}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
