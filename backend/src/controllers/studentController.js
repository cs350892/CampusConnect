const StudentModel = require('../models/student');
const { uploadFromBuffer, isConfigured } = require('../utils/cloudinary');

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    // 1. Upload image to Cloudinary if provided
    let imageUrl = 'https://i.ibb.co/TqK1XTQm/image-5.jpg'; // Default
    let cloudinaryPublicId = null;

    if (req.file && isConfigured) {
      try {
        console.log(`📸 Uploading student photo: ${req.file.originalname}`);
        const uploadResult = await uploadFromBuffer(req.file.buffer, {
          folder: 'campus-connect/students',
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
    const lastStudent = await StudentModel.findOne().sort({ id: -1 });
    const newId = lastStudent ? lastStudent.id + 1 : 1;

    // 3. Parse techStack into skills if provided
    let skills = { dsa: [], development: [] };
    if (req.body.techStack && req.body.techStack.trim().length > 0) {
      const techArray = req.body.techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
      skills.development = techArray;
    }

    // 4. Prepare student data
    const studentData = {
      id: newId,
      name: req.body.name,
      email: req.body.email,
      rollNumber: req.body.rollNumber,
      batch: req.body.batch,
      branch: req.body.branch || 'Not Specified',
      phone: req.body.phone,
      image: imageUrl, // Legacy field for backward compatibility
      imageUrl: imageUrl, // New dedicated field
      cloudinaryPublicId: cloudinaryPublicId,
      pronouns: req.body.pronouns || 'They/Them',
      location: req.body.location || 'India',
      headline: req.body.headline || 'Student at HBTU',
      skills: skills,
      socialLinks: {
        github: req.body.socialLinks?.github || req.body.github || 'https://github.com',
        linkedin: req.body.socialLinks?.linkedin || req.body.linkedin || ''
      },
      resumeLink: req.body.resumeLink,
      dsaProblems: req.body.dsaProblems || 0,
      techStack: req.body.techStack,
      isPlaced: req.body.isPlaced || false
    };

    const student = new StudentModel(studentData);
    await student.save();
    res.status(201).json({ 
      message: 'Student registered successfully',
      student: student 
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ 
      message: 'Error creating student', 
      error: error.message 
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await StudentModel.findOneAndUpdate(
      { id: Number(req.params.id)},
      req.body,
      { new: true, runValidators: false }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await StudentModel.findOneAndDelete({ id: Number(req.params.id)  });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};