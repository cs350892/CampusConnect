// Quick OTP Test Script
require('dotenv').config({ path: './backend/.env' });
const nodemailer = require('nodemailer');

console.log('Testing OTP Email Configuration...\n');

console.log('📧 Email Config:');
console.log('  HOST:', process.env.EMAIL_HOST);
console.log('  PORT:', process.env.EMAIL_PORT);
console.log('  USER:', process.env.EMAIL_USER);
console.log('  PASS:', process.env.EMAIL_PASS ? '***set***' : 'NOT SET!');
console.log();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('🔍 Verifying SMTP connection...');

transporter.verify()
  .then(() => {
    console.log('✅ SMTP connection successful!');
    console.log('\n📤 Sending test OTP email...');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || `CampusConnect <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'Test OTP - CampusConnect',
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">🔐 Test OTP</h2>
            <p>This is a test email from CampusConnect OTP system.</p>
            <div style="background: #4F46E5; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">If you can read this, your email configuration is working correctly!</p>
          </div>
        </div>
      `
    });
  })
  .then((info) => {
    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('\n✅ ALL TESTS PASSED! OTP system is working.');
    console.log('\n📬 Check your inbox:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ ERROR:', error.message);
    console.error('\n🔧 Fix suggestions:');
    console.error('   1. Check Gmail App Password (16 characters)');
    console.error('   2. Enable 2FA in Gmail');
    console.error('   3. Generate new App Password at: https://myaccount.google.com/apppasswords');
    console.error('   4. Update EMAIL_PASS in .env file');
    process.exit(1);
  });
