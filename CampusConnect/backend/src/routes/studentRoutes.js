const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { validateStudent } = require('../middlewares/validator');

const router = express.Router();

router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.post('/students', validateStudent, createStudent);
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

module.exports = router;