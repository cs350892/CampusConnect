const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  batch: { type: String, required: true },
  isPlaced: { type: Boolean, default: false },
  image: { type: String, required: true },
  pronouns: { type: String, required: true },
  location: { type: String, required: true },
  headline: { type: String, required: true },
  skills: {
    dsa: [{ type: String }],
    development: [{ type: String }],
  },
  socialLinks: {
    github: { type: String, required: true },
    linkedin: { type: String, required: true },
  },
  resumeLink: { type: String },
  dsaProblems: { type: Number },
  rollNumber: { type: String },
  email: { type: String },
});

module.exports = mongoose.model('Student', studentSchema);