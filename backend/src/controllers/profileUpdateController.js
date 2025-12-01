const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * PROFILE UPDATE CONTROLLERS
 * OTP-based authentication for profile updates only
 * Uses existing User model from the system
 */

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * @desc    Send OTP to email or phone
 * @route   POST /api/profile-update/sendOtp
 * @access  Public
 */
exports.sendOtp = async (req, res) => {
  try {
    const { identifier, type } = req.body; // identifier can be email or phone
    
    // Validation
    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier (email/phone) and type'
      });
    }
    
    if (!['email', 'phone'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "email" or "phone"'
      });
    }
    
    // Normalize identifier
    const normalizedIdentifier = type === 'email' 
      ? identifier.toLowerCase().trim()
      : identifier.trim();
    
    // Find user by email or phone
    const query = type === 'email' 
      ? { email: normalizedIdentifier }
      : { phone: normalizedIdentifier };
    
    const user = await User.findOne(query).select('+otp +otpExpire');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with this ${type}. Please register first.`
      });
    }
    
    // Check rate limit (max 5 OTP per hour)
    if (!user.checkRateLimit()) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 1 hour.'
      });
    }
    
    // Generate 6-digit OTP
    const otp = user.generateOTP();
    
    // Hash OTP
    const hashedOtp = await user.hashOTP(otp);
    
    // Set OTP and expiry (5 minutes)
    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.incrementRateLimit();
    
    await user.save();
    
    // Send OTP via email or SMS
    if (type === 'email') {
      try {
        const transporter = createEmailTransporter();
        
        const mailOptions = {
          from: process.env.EMAIL_FROM || '"CampusConnect" <noreply@campusconnect.com>',
          to: user.email,
          subject: 'Profile Update OTP - CampusConnect',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔐 Profile Update OTP</h1>
                  <p>CampusConnect - HBTU MCA Department</p>
                </div>
                <div class="content">
                  <h2>Hello ${user.name}!</h2>
                  <p>You requested to update your profile. Use the OTP below to verify your identity:</p>
                  
                  <div class="otp-box">
                    <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Valid for 5 minutes</p>
                  </div>
                  
                  <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <ul style="margin: 10px 0;">
                      <li>Never share this OTP with anyone</li>
                      <li>CampusConnect will never ask for your OTP</li>
                      <li>This OTP expires in 5 minutes</li>
                    </ul>
                  </div>
                  
                  <p>If you didn't request this OTP, please ignore this email or contact support.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} CampusConnect - HBTU MCA Department</p>
                  <p>This is an automated email. Please do not reply.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };
        
        await transporter.sendMail(mailOptions);
        
      } catch (emailError) {
        console.error('Email send error:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP email. Please check email configuration.'
        });
      }
    } else {
      // SMS sending logic (placeholder - integrate Twilio or similar)
      console.log(`SMS OTP for ${user.phone}: ${otp}`);
      // TODO: Implement SMS sending via Twilio/AWS SNS
    }
    
    // Mask identifier for security
    const maskedIdentifier = type === 'email'
      ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      : user.phone.replace(/(\d{2})(\d{6})(\d{2})/, '$1******$3');
    
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${maskedIdentifier}`,
      expiresIn: 300 // 5 minutes in seconds
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

/**
 * @desc    Verify OTP and return JWT token
 * @route   POST /api/profile-update/verifyOtp
 * @access  Public
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, type, otp } = req.body;
    
    // Validation
    if (!identifier || !type || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier, type, and OTP'
      });
    }
    
    // Normalize identifier
    const normalizedIdentifier = type === 'email' 
      ? identifier.toLowerCase().trim()
      : identifier.trim();
    
    // Find user
    const query = type === 'email' 
      ? { email: normalizedIdentifier }
      : { phone: normalizedIdentifier };
    
    const user = await User.findOne(query).select('+otp +otpExpire');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP.'
      });
    }
    
    // Check if OTP is expired
    if (user.isOTPExpired()) {
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    const isOtpValid = await user.compareOTP(otp);
    
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    
    // Generate JWT token (20 minutes expiry - enough for profile update)
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        purpose: 'profile-update' // Specific purpose token
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '20m' }
    );
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      expiresIn: 1200, // 20 minutes in seconds
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

/**
 * @desc    Update user profile (requires JWT from OTP verification)
 * @route   POST /api/profile-update/updateProfile
 * @access  Private (JWT required)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, skills, linkedin, github, about } = req.body;
    
    // Get user ID from JWT (set by auth middleware)
    const userId = req.user.userId;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update allowed fields only
    if (name !== undefined) user.name = name;
    if (skills !== undefined) user.skills = skills;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;
    if (about !== undefined) user.about = about;
    
    // Save updated profile
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * @desc    Get user profile (requires JWT)
 * @route   GET /api/profile-update/getProfile
 * @access  Private (JWT required)
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};
