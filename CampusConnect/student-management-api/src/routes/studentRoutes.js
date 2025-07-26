const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { validateStudent } = require('../middleware/validate');

const router = express.Router();

router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.post('/students', validateStudent, createStudent);
router.put('/students/:id', validateStudent, updateStudent);
router.delete('/students/:id', deleteStudent);

module.exports = router;