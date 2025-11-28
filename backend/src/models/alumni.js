const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, default: 'Not Specified' },
  batch: { type: String, required: true },
  image: { type: String, default: 'https://i.ibb.co/TqK1XTQm/image-5.jpg' },
  pronouns: { type: String, default: 'They/Them' },
  location: { type: String, default: 'India' },
  headline: { type: String, default: 'Alumni at HBTU' },
  company: { type: String, required: true },
  techStack: [{ type: String }],
  resumeLink: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  // Cloudinary image storage
  imageUrl: { type: String, default: 'https://i.ibb.co/TqK1XTQm/image-5.jpg' },
  cloudinaryPublicId: { type: String }, // For image deletion
}, {
  timestamps: true
});

module.exports = mongoose.model('Alumni', alumniSchema);