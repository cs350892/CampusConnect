const { cloudinary } = require('../utils/cloudinary');

const uploadImage = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // 2. Ensure Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured properly',
      });
    }

    // 3. CRITICAL FIX: Properly stream the buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'campus-connect',
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error); // This is KEY for debugging
            return reject(error);
          }
          resolve(result);
        }
      );

      // Properly pipe the buffer
      uploadStream.end(req.file.buffer);
    });

    // Success
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    console.error('Upload failed:', {
      message: error.message,
      http_code: error.http_code,
      error_details: error,
    });

    return res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message || 'Unknown error',
      // Optional: include more in development
      // details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Delete remains mostly fine, but fix syntax error you had
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    // Cloudinary returns { result: 'ok' } or { result: 'not found' }
    if (result.result === 'not found') {
      return res.status(404).json({
        success: false,
        message: 'Image not found on Cloudinary',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result,
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message,
    });
  }
};

module.exports = { uploadImage, deleteImage };