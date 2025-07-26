const express = require('express');
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
} = require('../controllers/alumniController');
const { validateAlumni } = require('../middleware/validate');

const router = express.Router();

router.get('/alumni', getAllAlumni);
router.get('/alumni/:id', getAlumniById);
router.post('/alumni', validateAlumni, createAlumni);
router.put('/alumni/:id', validateAlumni, updateAlumni);
router.delete('/alumni/:id', deleteAlumni);

module.exports = router;