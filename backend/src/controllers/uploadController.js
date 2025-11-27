const path = require('path');
const fs = require('fs');

/**
 * UPLOAD CONTROLLER
 * Explanation: File upload handling for images
 * - Stores files locally in uploads directory
 * - Returns URL to access the uploaded file
 */

// @desc    Upload an image
// @route   POST /api/upload
// @access  Public (can be changed to Private if needed)
exports.uploadImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        error: 'Please select an image to upload'
      });
    }

    // Construct the URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: imageUrl
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message || 'Unknown error'
    });
  }
};

// @desc    Delete an uploaded image
// @route   DELETE /api/upload/:filename
// @access  Public (can be changed to Private if needed)
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message || 'Unknown error'
    });
  }
};
