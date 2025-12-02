const mongoose = require('mongoose');
const Alumni = require('./src/models/alumni');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Find all Abhishek Kumars
    const abhisheks = await Alumni.find({ 
      name: /abhishek/i
    }).sort({ createdAt: 1 });
    
    console.log(`Found ${abhisheks.length} alumni with "Abhishek" in name:\n`);
    
    abhisheks.forEach((alum, index) => {
      console.log(`${index + 1}. ${alum.name}`);
      console.log(`   Company: ${alum.company}`);
      console.log(`   Batch: ${alum.batch}`);
      console.log(`   Email: ${alum.email}`);
      console.log(`   Created: ${alum.createdAt.toLocaleString()}`);
      console.log(`   ID: ${alum._id}\n`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
