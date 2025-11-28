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

router.get('/alumni', getAllAlumni);
router.get('/alumni/:id', getAlumniById);
// Image upload middleware + validation + controller
router.post('/alumni', upload.single('image'), validateAlumni, createAlumni);
router.put('/alumni/:id', validateAlumni, updateAlumni);
router.delete('/alumni/:id', deleteAlumni);

module.exports = router;