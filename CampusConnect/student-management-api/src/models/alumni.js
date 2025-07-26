const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  batch: { type: String, required: true },
  image: { type: String, required: true },
  pronouns: { type: String, required: true },
  location: { type: String, required: true },
  headline: { type: String, required: true },
  company: { type: String, required: true },
  techStack: [{ type: String }],
  socialLinks: {
    github: { type: String, required: true },
    linkedin: { type: String, required: true },
  },
  resumeLink: { type: String },
  email: { type: String },
});

module.exports = mongoose.model('Alumni', alumniSchema);