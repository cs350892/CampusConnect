const StudentModel = require('../models/student');

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
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
    res.status(500).json({ message: 'Error fetching student', error });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = new StudentModel({
      ...req.body,
      image: req.body.image || 'https://i.ibb.co/TqK1XTQm/image-5.jpg',
      isPlaced: false,
      socialLinks: {
        github: req.body.socialLinks?.github || 'https://github.com',
        linkedin: req.body.socialLinks?.linkedin || ''
      }
    });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error creating student', error });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await StudentModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await StudentModel.findOneAndDelete({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};