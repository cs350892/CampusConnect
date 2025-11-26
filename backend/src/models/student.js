const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, default: 'Not Specified' },
  batch: { type: String, required: true },
  isPlaced: { type: Boolean, default: false },
  image: { type: String, default: 'https://i.ibb.co/TqK1XTQm/image-5.jpg' },
  pronouns: { type: String, default: 'They/Them' },
  location: { type: String, default: 'India' },
  headline: { type: String, default: 'Student at HBTU' },
  skills: {
    dsa: [{ type: String }],
    development: [{ type: String }],
  },
  socialLinks: {
    github: { type: String, default: 'https://github.com' },
    linkedin: { type: String, default: '' },
  },
  resumeLink: { type: String },
  dsaProblems: { type: Number, default: 0 },
  rollNumber: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  techStack: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);