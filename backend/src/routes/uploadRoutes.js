const express = require('express');
const { upload, isConfigured } = require('../utils/cloudinary');
const { uploadImage, deleteImage } = require('../controllers/uploadController');

const router = express.Router();

// ============================================
// Health Check / Test Endpoint
// ============================================
router.get('/upload/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Upload route is working',
    cloudinaryConfigured: isConfigured,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Upload Image (Public - for registration)
// ============================================
// Field name: 'image'
// Max size: 5MB (configured in multer)
// Accepted: image/* mime types only
router.post('/upload', upload.single('image'), uploadImage);

// ============================================
// Delete Image (Public - can add auth later)
// ============================================
// Body: { "public_id": "campus-connect/xyz123" }
router.delete('/upload', deleteImage);

module.exports = router;
