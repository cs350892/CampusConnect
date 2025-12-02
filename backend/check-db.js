const mongoose = require('mongoose');
const Student = require('./src/models/student');
const Alumni = require('./src/models/alumni');

mongoose.connect('mongodb://localhost:27017/campus-connect')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const students = await Student.find({});
    console.log(`📚 Total Students: ${students.length}`);
    students.forEach(s => {
      console.log(`  - ${s.name} (${s.email}) - Status: ${s.status || 'NO STATUS'}`);
    });
    
    console.log('');
    
    const alumni = await Alumni.find({});
    console.log(`🎓 Total Alumni: ${alumni.length}`);
    alumni.forEach(a => {
      console.log(`  - ${a.name} (${a.email}) - Status: ${a.status || 'NO STATUS'}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
