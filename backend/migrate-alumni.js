// Alumni Migration Script
// Migrates alumni data from alumniData.js to MongoDB

require('dotenv').config();
const mongoose = require('mongoose');
const Alumni = require('./src/models/alumni');
const alumniData = require('./src/data/alumniData');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Get the last alumni ID from the database
const getLastAlumniId = async () => {
  try {
    const lastAlumni = await Alumni.findOne().sort({ id: -1 }).limit(1);
    return lastAlumni ? lastAlumni.id : 0;
  } catch (error) {
    console.error('Error fetching last alumni ID:', error);
    return 0;
  }
};

// Check if alumni with given email already exists
const checkDuplicateEmail = async (email) => {
  try {
    const existing = await Alumni.findOne({ email });
    return existing !== null;
  } catch (error) {
    console.error('Error checking duplicate email:', error);
    return false;
  }
};

// Migrate alumni data
const migrateAlumni = async (alumniArray) => {
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  console.log(`\n🚀 Starting migration of ${alumniArray.length} alumni...\n`);

  const lastId = await getLastAlumniId();
  console.log(`📌 Last alumni ID in database: ${lastId}`);
  
  let nextId = lastId + 1;

  for (const alumniItem of alumniArray) {
    try {
      // Check for duplicate email
      const isDuplicate = await checkDuplicateEmail(alumniItem.email);
      
      if (isDuplicate) {
        console.log(`⏭️  Skipping duplicate: ${alumniItem.name} (${alumniItem.email})`);
        skipCount++;
        continue;
      }

      // Create new alumni with auto-assigned ID
      const newAlumni = new Alumni({
        ...alumniItem,
        id: nextId
      });

      await newAlumni.save();
      console.log(`✅ Migrated [ID: ${nextId}]: ${alumniItem.name} - ${alumniItem.company}`);
      successCount++;
      nextId++;

    } catch (error) {
      console.error(`❌ Failed to migrate ${alumniItem.name}:`, error.message);
      failCount++;
    }
  }

  // Get total count after migration
  const totalCount = await Alumni.countDocuments();

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Migration completed successfully!');
  console.log('='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Successfully migrated: ${successCount}`);
  console.log(`   ⏭️  Skipped (duplicates): ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📈 Total alumni in database: ${totalCount}`);
  console.log('='.repeat(60) + '\n');
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await migrateAlumni(alumniData);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

main();
