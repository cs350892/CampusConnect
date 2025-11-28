const { isConfigured, uploadFromBuffer } = require('../utils/cloudinary');

// ============================================
// Upload Image to Cloudinary
// ============================================
const uploadImage = async (req, res) => {
  try {
    // 1. Validate file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please provide an image file.',
      });
    }

    // 2. Check Cloudinary configuration
    if (!isConfigured) {
      console.error('❌ Cloudinary not configured - check .env file');
      return res.status(500).json({
        success: false,
        message: 'Image upload service not configured. Contact administrator.',
      });
    }

    console.log(`📤 Uploading image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)} KB)`);

    // 3. Upload to Cloudinary
    const result = await uploadFromBuffer(req.file.buffer, {
      folder: 'campus-connect',
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      resource_type: 'image',
      format: 'jpg'
    });

    console.log(`✅ Image uploaded successfully: ${result.secure_url}`);

    // 4. Return success response
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error('❌ Upload failed:', {
      message: error.message,
      code: error.http_code,
      name: error.name
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message || 'Unknown error occurred'
    });
  }
};

// ============================================
// Delete Image from Cloudinary
// ============================================
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    // Validate input
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'public_id is required',
      });
    }

    // Check Cloudinary configuration
    if (!isConfigured) {
      return res.status(500).json({
        success: false,
        message: 'Image service not configured',
      });
    }

    console.log(`🗑️  Deleting image: ${public_id}`);

    const { cloudinary } = require('../utils/cloudinary');
    const result = await cloudinary.uploader.destroy(public_id);

    // Check result
    if (result.result === 'not found') {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    console.log(`✅ Image deleted: ${public_id}`);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Delete failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};

module.exports = { uploadImage, deleteImage };