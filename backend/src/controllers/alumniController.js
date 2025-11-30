const AlumniModel = require('../models/alumni');
const { uploadFromBuffer, isConfigured } = require('../utils/cloudinary');

const getAllAlumni = async (req, res) => {
  try {
    const alumni = await AlumniModel.find();
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni', error: error.message });
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
    res.status(500).json({ message: 'Error fetching alumni', error: error.message });
  }
};

const createAlumni = async (req, res) => {
  try {
    // 1. Upload image to Cloudinary if provided
    let imageUrl = 'https://i.ibb.co/TqK1XTQm/image-5.jpg'; // Default
    let cloudinaryPublicId = null;

    if (req.file && isConfigured) {
      try {
        console.log(`📸 Uploading alumni photo: ${req.file.originalname}`);
        const uploadResult = await uploadFromBuffer(req.file.buffer, {
          folder: 'campus-connect/alumni',
          transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
          resource_type: 'image'
        });
        imageUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;
        console.log(`✅ Image uploaded: ${imageUrl}`);
      } catch (uploadError) {
        console.error('⚠️  Image upload failed:', uploadError.message);
        // Continue with default image instead of failing registration
      }
    }

    // 2. Generate unique ID
    const lastAlumni = await AlumniModel.findOne().sort({ id: -1 });
    const newId = lastAlumni ? lastAlumni.id + 1 : 1;

    // 3. Parse techStack string into array if it's a string
    let techStackArray = [];
    if (req.body.techStack && req.body.techStack.trim().length > 0) {
      if (Array.isArray(req.body.techStack)) {
        techStackArray = req.body.techStack;
      } else if (typeof req.body.techStack === 'string') {
        techStackArray = req.body.techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
      }
    }

    // 4. Prepare alumni data
    const alumniData = {
      id: newId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      batch: req.body.batch,
      company: req.body.company,
      branch: req.body.branch || 'Not Specified',
      image: imageUrl, // Legacy field for backward compatibility
      imageUrl: imageUrl, // New dedicated field
      cloudinaryPublicId: cloudinaryPublicId,
      pronouns: req.body.pronouns || 'They/Them',
      location: req.body.location || 'India',
      headline: req.body.headline || `${req.body.company} Employee`,
      techStack: techStackArray
    };

    const alumni = new AlumniModel(alumniData);
    await alumni.save();
    res.status(201).json({ 
      message: 'Alumni registered successfully',
      alumni: alumni 
    });
  } catch (error) {
    console.error('Error creating alumni:', error);
    res.status(400).json({ 
      message: 'Error creating alumni', 
      error: error.message 
    });
  }
};

const updateAlumni = async (req, res) => {
  try {
    const alumni = await AlumniModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.status(200).json(alumni);
  } catch (error) {
    res.status(400).json({ message: 'Error updating alumni', error: error.message });
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
    res.status(500).json({ message: 'Error deleting alumni', error: error.message });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
};