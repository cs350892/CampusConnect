const express = require('express');
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
} = require('../controllers/alumniController');
const { validateAlumni } = require('../middlewares/validator');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// PUBLIC ROUTES - No authentication required
router.get('/alumni', getAllAlumni);
router.get('/alumni/:id', getAlumniById);
// Image upload middleware + validation + controller (PUBLIC - for registration)
router.post('/alumni', upload.single('image'), validateAlumni, createAlumni);

// Protected routes would go below with auth middleware
router.put('/alumni/:id', validateAlumni, updateAlumni);
router.delete('/alumni/:id', deleteAlumni);

module.exports = router;