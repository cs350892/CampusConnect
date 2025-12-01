const nodemailer = require('nodemailer');

/**
 * OTP SENDING UTILITIES
 * Explanation: Email aur SMS ke through OTP send karne ke functions
 */

// Create email transporter (lazy initialization)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

// Send OTP via Email
exports.sendOtpEmail = async (email, otp, userName = 'User') => {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CampusConnect <noreply@campusconnect.com>',
      to: email,
      subject: 'Your OTP for Profile Update - CampusConnect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .otp-box {
              background-color: #f0f0f0;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              margin: 20px 0;
              border-radius: 5px;
              color: #4F46E5;
            }
            .warning {
              background-color: #FEF3C7;
              padding: 15px;
              border-left: 4px solid #F59E0B;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 CampusConnect</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}! 👋</h2>
              <p>You requested to update your profile on CampusConnect.</p>
              <p>Use the following OTP to verify your identity:</p>
              
              <div class="otp-box">
                ${otp}
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This OTP is valid for <strong>5 minutes</strong></li>
                  <li>Do not share this OTP with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>
              
              <p>If you have any questions, please contact our support team.</p>
              
              <p>Best regards,<br>
              <strong>CampusConnect Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} CampusConnect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send OTP via SMS (Placeholder - implement with SMS service like Twilio)
exports.sendOtpSMS = async (phone, otp) => {
  try {
    // TODO: Implement SMS sending using Twilio, AWS SNS, or other SMS service
    
    console.log(`📱 SMS OTP for ${phone}: ${otp}`);
    console.log('⚠️  SMS sending not implemented. Configure Twilio or SMS service.');
    
    // Example with Twilio (uncomment and configure):
    /*
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
      body: `Your CampusConnect OTP is: ${otp}. Valid for 5 minutes. Do not share.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */
    
    // For development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 [DEV MODE] OTP for ${phone}: ${otp}`);
    }
    
  } catch (error) {
    console.error('❌ Error sending OTP SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
};
