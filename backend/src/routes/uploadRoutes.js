const express = require('express');
const { upload } = require('../utils/cloudinary');
const { uploadImage, deleteImage } = require('../controllers/uploadController');

const router = express.Router();

// Test endpoint to verify upload route is working
router.get('/upload/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Upload route is accessible!',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME 
  });
});

// PUBLIC ROUTES - No authentication required for image upload during registration
router.post('/upload', upload.single('image'), uploadImage);

// Delete image (keep public for now, can be protected later)
router.delete('/upload', deleteImage);

module.exports = router;
