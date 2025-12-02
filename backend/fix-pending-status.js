const mongoose = require('mongoose');
const Student = require('./src/models/student');
const Alumni = require('./src/models/alumni');

// Load environment variables
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Check students
    const allStudents = await Student.find({});
    const approvedStudents = await Student.find({ status: 'approved' });
    const pendingStudents = await Student.find({ status: 'pending' });
    
    console.log(`📚 Students:`);
    console.log(`   Total: ${allStudents.length}`);
    console.log(`   Approved: ${approvedStudents.length}`);
    console.log(`   Pending: ${pendingStudents.length}`);
    
    if (pendingStudents.length > 0) {
      console.log('\n   Pending Students:');
      pendingStudents.forEach(s => {
        console.log(`   - ${s.name} (${s.email})`);
      });
    }
    
    console.log('');
    
    // Check alumni
    const allAlumni = await Alumni.find({});
    const approvedAlumni = await Alumni.find({ status: 'approved' });
    const pendingAlumni = await Alumni.find({ status: 'pending' });
    
    console.log(`🎓 Alumni:`);
    console.log(`   Total: ${allAlumni.length}`);
    console.log(`   Approved: ${approvedAlumni.length}`);
    console.log(`   Pending: ${pendingAlumni.length}`);
    
    if (pendingAlumni.length > 0) {
      console.log('\n   Pending Alumni:');
      pendingAlumni.forEach(a => {
        console.log(`   - ${a.name} (${a.email})`);
      });
    }
    
    // Update all pending to approved
    if (pendingStudents.length > 0 || pendingAlumni.length > 0) {
      console.log('\n🔄 Updating all pending entries to approved...');
      
      const studentUpdate = await Student.updateMany(
        { status: 'pending' },
        { status: 'approved', approvedAt: new Date() }
      );
      
      const alumniUpdate = await Alumni.updateMany(
        { status: 'pending' },
        { status: 'approved', approvedAt: new Date() }
      );
      
      console.log(`   ✅ Updated ${studentUpdate.modifiedCount} students`);
      console.log(`   ✅ Updated ${alumniUpdate.modifiedCount} alumni`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
