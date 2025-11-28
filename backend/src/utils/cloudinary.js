const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// ============================================
// Cloudinary Configuration (from .env)
// ============================================
const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✓ Cloudinary configured successfully');
} else {
  console.warn('⚠ Cloudinary credentials missing in .env - image uploads will fail');
}

// ============================================
// Multer Configuration (Memory Storage)
// ============================================
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// ============================================
// Helper: Upload Buffer to Cloudinary
// ============================================
const uploadFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isConfigured) {
      return reject(new Error('Cloudinary not configured. Check environment variables.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = { 
  cloudinary, 
  upload, 
  isConfigured, 
  uploadFromBuffer 
};
