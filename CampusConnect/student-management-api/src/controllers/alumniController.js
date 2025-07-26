const AlumniModel = require('../models/alumni');

const getAllAlumni = async (req, res) => {
  try {
    const alumni = await AlumniModel.find();
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni', error });
  }
};

const getAlumniById = async (req, res) => {
  try {
    const alumni = await AlumniModel.findOne({ id: req.params.id });
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni', error });
  }
};

const createAlumni = async (req, res) => {
  try {
    const alumni = new AlumniModel({
      ...req.body,
      image: req.body.image || 'https://i.ibb.co/TqK1XTQm/image-5.jpg',
      socialLinks: {
        github: req.body.socialLinks?.github || 'https://github.com',
        linkedin: req.body.socialLinks?.linkedin || ''
      }
    });
    await alumni.save();
    res.status(201).json(alumni);
  } catch (error) {
    res.status(400).json({ message: 'Error creating alumni', error });
  }
};

const updateAlumni = async (req, res) => {
  try {
    const alumni = await AlumniModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json(alumni);
  } catch (error) {
    res.status(400).json({ message: 'Error updating alumni', error });
  }
};

const deleteAlumni = async (req, res) => {
  try {
    const alumni = await AlumniModel.findOneAndDelete({ id: req.params.id });
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alumni', error });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
};