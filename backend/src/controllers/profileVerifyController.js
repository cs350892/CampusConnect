const User = require('../models/User');
const Student = require('../models/student');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { cloudinary } = require('../utils/cloudinary');

// Temporary OTP storage (in production, use Redis or database)
const otpStore = new Map();

/**
 * @desc    Step 1: Verify email + rollNumber and send OTP
 * @route   POST /api/profile-verify/send-otp
 * @access  Public
 */
exports.sendOTP = async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    
    // Validation
    if (!email || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and roll number'
      });
    }
    
    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRollNumber = rollNumber.trim();
    
    // Try to find in User table first
    let user = await User.findOne({ 
      email: normalizedEmail, 
      rollNumber: normalizedRollNumber 
    }).select('-password');
    
    let source = 'User';
    
    // If not found in User table, check Student table
    if (!user) {
      user = await Student.findOne({ 
        email: normalizedEmail, 
        rollNumber: normalizedRollNumber 
      });
      source = 'Student';
    }
    
    // If still not found in either table
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or roll number. Please check your credentials.'
      });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiry (10 minutes)
    const otpData = {
      otp: otp,
      email: normalizedEmail,
      rollNumber: normalizedRollNumber,
      source: source,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      userId: user._id
    };
    
    otpStore.set(`${normalizedEmail}_${normalizedRollNumber}`, otpData);
    
    // Send OTP via email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4F46E5; margin-bottom: 20px;">Profile Update Verification</h2>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Hello <strong>${user.name}</strong>,
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
            You requested to update your profile. Please use the following OTP to verify your email:
          </p>
          <div style="background-color: #4F46E5; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 30px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            This OTP is valid for <strong>10 minutes</strong>.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 10px;">
            If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            CampusConnect - HBTU Alumni & Student Network
          </p>
        </div>
      </div>
    `;
    
    console.log('📧 Attempting to send OTP email...');
    console.log('  ➜ To:', normalizedEmail);
    console.log('  ➜ OTP:', otp);
    
    await sendEmail({
      to: normalizedEmail,
      subject: 'Profile Update OTP - CampusConnect',
      html: emailHtml
    });
    
    console.log('✅ OTP email sent successfully!');
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      email: normalizedEmail
    });
    
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    console.error('  ➜ Error message:', error.message);
    console.error('  ➜ Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * @desc    Step 2: Verify OTP and return user data
 * @route   POST /api/profile-verify/verify-otp
 * @access  Public
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, rollNumber, otp } = req.body;
    
    // Validation
    if (!email || !rollNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, roll number, and OTP'
      });
    }
    
    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRollNumber = rollNumber.trim();
    
    // Get stored OTP
    const key = `${normalizedEmail}_${normalizedRollNumber}`;
    const storedOtpData = otpStore.get(key);
    
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found. Please request a new OTP.'
      });
    }
    
    // Check if OTP expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    if (storedOtpData.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    // OTP verified successfully
    // Fetch user data
    let user;
    if (storedOtpData.source === 'User') {
      user = await User.findById(storedOtpData.userId).select('-password -otp -otpExpire');
    } else {
      user = await Student.findById(storedOtpData.userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Keep OTP valid for 30 minutes after verification for update
    storedOtpData.verified = true;
    storedOtpData.expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes for update
    otpStore.set(key, storedOtpData);
    
    // Return user data for prefilling form
    res.status(200).json({
      success: true,
      verified: true,
      message: 'OTP verified successfully',
      source: storedOtpData.source,
      userData: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        batch: user.batch,
        phone: user.phone,
        isPlaced: user.isPlaced,
        image: user.image,
        imageUrl: user.imageUrl,
        cloudinaryPublicId: user.cloudinaryPublicId,
        pronouns: user.pronouns,
        location: user.location,
        headline: user.headline,
        about: user.about,
        skills: user.skills,
        socialLinks: user.socialLinks,
        resumeLink: user.resumeLink,
        techStack: user.techStack,
        company: user.company,
        role: user.role,
        dsaProblems: user.dsaProblems
      }
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: error.message
    });
  }
};

/**
 * @desc    Step 3: Update student profile after OTP verification
 * @route   POST /api/profile-verify/update
 * @access  Public (verified by OTP)
 * Fields from StudentRegistration form
 */
exports.updateProfile = async (req, res) => {
  try {
    const { 
      email, 
      rollNumber, 
      // Personal Info
      name,
      phone,
      // Academic Info
      batch,
      branch,
      dsaProblems,
      location,
      // Skills & Links
      techStack,
      github,
      linkedin,
      resumeLink,
      pronouns,
      // Image (from upload)
      image,
      imageUrl,
      cloudinaryPublicId
    } = req.body;
    
    // Validation
    if (!email || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email and roll number are required for verification'
      });
    }
    
    // Normalize
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRollNumber = rollNumber.trim();
    
    // Check if OTP was verified
    const key = `${normalizedEmail}_${normalizedRollNumber}`;
    const storedOtpData = otpStore.get(key);
    
    if (!storedOtpData || !storedOtpData.verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify OTP first before updating profile'
      });
    }
    
    // Check if OTP session expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(key);
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please verify OTP again.'
      });
    }
    
    // Try to find in User table first
    let user = await User.findOne({ 
      email: normalizedEmail, 
      rollNumber: normalizedRollNumber 
    });
    
    let isUserTable = true;
    
    // If not found in User table, check Student table
    if (!user) {
      user = await Student.findOne({ 
        email: normalizedEmail, 
        rollNumber: normalizedRollNumber 
      });
      isUserTable = false;
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or roll number'
      });
    }
    
    // Build update object - only fields from StudentRegistration form
    const updateData = {};
    
    // Personal Information
    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    
    // Academic Details
    if (batch !== undefined) updateData.batch = batch.trim();
    if (branch !== undefined) updateData.branch = branch.trim();
    if (dsaProblems !== undefined) updateData.dsaProblems = parseInt(dsaProblems) || 0;
    if (location !== undefined) updateData.location = location.trim();
    if (pronouns !== undefined) updateData.pronouns = pronouns;
    
    // Skills & Links
    if (techStack !== undefined) updateData.techStack = techStack.trim();
    if (resumeLink !== undefined) updateData.resumeLink = resumeLink.trim();
    
    // Social Links - update as nested object
    if (github !== undefined || linkedin !== undefined) {
      updateData.socialLinks = {};
      if (github !== undefined) updateData.socialLinks.github = github.trim();
      if (linkedin !== undefined) updateData.socialLinks.linkedin = linkedin.trim();
    }
    
    // Image fields (from Cloudinary upload)
    // If new image is uploaded, delete old image from Cloudinary
    if (cloudinaryPublicId !== undefined && cloudinaryPublicId !== user.cloudinaryPublicId) {
      // Delete old image from Cloudinary if exists
      if (user.cloudinaryPublicId) {
        try {
          console.log(`🗑️  Deleting old image: ${user.cloudinaryPublicId}`);
          await cloudinary.uploader.destroy(user.cloudinaryPublicId);
          console.log(`✅ Old image deleted from Cloudinary`);
        } catch (deleteError) {
          console.error('⚠️  Failed to delete old image:', deleteError.message);
          // Continue with update even if deletion fails
        }
      }
      
      // Update with new image data
      updateData.image = image;
      updateData.imageUrl = imageUrl;
      updateData.cloudinaryPublicId = cloudinaryPublicId;
    } else if (image !== undefined) {
      // If image URL provided without public_id (legacy support)
      updateData.image = image;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    }
    
    let updatedUser;
    
    // Force timestamp update for cache busting
    updateData.updatedAt = new Date();
    
    console.log('📝 Updating profile with data:', JSON.stringify(updateData, null, 2));
    
    // Update in the correct table
    if (isUserTable) {
      updatedUser = await User.findOneAndUpdate(
        { email: normalizedEmail, rollNumber: normalizedRollNumber },
        updateData,
        { new: true, runValidators: true }
      ).select('-password -otp -otpExpire');
    } else {
      updatedUser = await Student.findOneAndUpdate(
        { email: normalizedEmail, rollNumber: normalizedRollNumber },
        updateData,
        { new: true, runValidators: true }
      );
    }
    
    console.log('✅ Profile updated successfully:', {
      id: updatedUser._id,
      name: updatedUser.name,
      imageUrl: updatedUser.imageUrl,
      cloudinaryPublicId: updatedUser.cloudinaryPublicId,
      updatedAt: updatedUser.updatedAt
    });
    
    // Clear OTP after successful update
    otpStore.delete(key);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      source: isUserTable ? 'User' : 'Student',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
