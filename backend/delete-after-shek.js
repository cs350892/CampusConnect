const mongoose = require('mongoose');
const Alumni = require('./src/models/alumni');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Find abhishek samsung 1998
    const targetAlumni = await Alumni.findOne({ 
      name: /^abhishek$/i,
      company: /samsung/i,
      batch: '1998'
    }).sort({ createdAt: 1 });
    
    if (!targetAlumni) {
      console.log('❌ Abhishek (Samsung, 1998) not found!');
      process.exit(1);
    }
    
    console.log(`📍 Found Target Alumni:`);
    console.log(`   Name: ${targetAlumni.name}`);
    console.log(`   Email: ${targetAlumni.email}`);
    console.log(`   Company: ${targetAlumni.company}`);
    console.log(`   Batch: ${targetAlumni.batch}`);
    console.log(`   Created: ${targetAlumni.createdAt}`);
    console.log(`   ID: ${targetAlumni._id}\n`);
    
    // Find all alumni created after Abhishek Kumar
    const alumniToDelete = await Alumni.find({
      createdAt: { $gt: targetAlumni.createdAt }
    }).sort({ createdAt: 1 });
    
    console.log(`🗑️  Found ${alumniToDelete.length} alumni entries after Abhishek Kumar:\n`);
    
    alumniToDelete.forEach((alum, index) => {
      console.log(`${index + 1}. ${alum.name} (${alum.email}) - ${alum.createdAt.toLocaleString()}`);
    });
    
    if (alumniToDelete.length === 0) {
      console.log('\n✅ No entries to delete!');
      process.exit(0);
    }
    
    console.log(`\n⚠️  Deleting ${alumniToDelete.length} entries...`);
    
    const result = await Alumni.deleteMany({
      createdAt: { $gt: targetAlumni.createdAt }
    });
    
    console.log(`\n✅ Deleted ${result.deletedCount} alumni entries!`);
    
    // Verify
    const remainingCount = await Alumni.countDocuments();
    console.log(`📊 Remaining alumni in database: ${remainingCount}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
