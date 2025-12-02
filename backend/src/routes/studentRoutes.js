const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { validateStudent } = require('../middlewares/validator');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// PUBLIC ROUTES - No authentication required
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
// Image upload middleware + validation + controller (PUBLIC - for registration)
router.post('/students', upload.single('image'), validateStudent, createStudent);

// Protected routes would go below with auth middleware
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

module.exports = router;