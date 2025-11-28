const nodemailer = require('nodemailer');

/**
 * EMAIL SERVICE
 * Explanation: Nodemailer use karke emails bhejta hai
 * Gmail SMTP use kar rahe hain (you can use any SMTP service)
 * 
 * Setup:
 * 1. Gmail account me "App Password" generate karo (2FA enable hona chahiye)
 * 2. .env me EMAIL_USER aur EMAIL_PASS add karo
 */

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * SEND EMAIL
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `AlumniConnect <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * EMAIL TEMPLATES
 */

// Alumni Approval Email
exports.sendAlumniApprovalEmail = async (alumni) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">🎉 Congratulations! Your Alumni Account is Approved</h2>
      <p>Dear ${alumni.name},</p>
      <p>Your alumni registration has been approved by the admin team.</p>
      <p>You can now:</p>
      <ul>
        <li>Post job opportunities</li>
        <li>Help students with referrals</li>
        <li>Connect with other alumni</li>
      </ul>
      <p>Login to your account and start contributing to the HBTU community!</p>
      <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Login Now
      </a>
      <p style="margin-top: 20px; color: #666;">
        Best regards,<br/>
        HBTU AlumniConnect Team
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: alumni.email,
    subject: 'Alumni Account Approved - HBTU AlumniConnect',
    html: html
  });
};

// Alumni Rejection Email
exports.sendAlumniRejectionEmail = async (alumni, reason) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f44336;">Alumni Registration Not Approved</h2>
      <p>Dear ${alumni.name},</p>
      <p>We regret to inform you that your alumni registration could not be approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you believe this is a mistake, please contact the admin team at: 
        <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>
      </p>
      <p style="margin-top: 20px; color: #666;">
        Best regards,<br/>
        HBTU AlumniConnect Team
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: alumni.email,
    subject: 'Alumni Registration Update - HBTU AlumniConnect',
    html: html
  });
};

// Job Approval Email
exports.sendJobApprovalEmail = async (job, alumni) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">✅ Your Job Post is Live!</h2>
      <p>Dear ${alumni.name},</p>
      <p>Your job posting has been approved and is now visible to all students.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Type:</strong> ${job.jobType}</p>
      </div>
      <p>Students can now view and request referrals for this position.</p>
      <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        View Job Post
      </a>
      <p style="margin-top: 20px; color: #666;">
        Best regards,<br/>
        HBTU AlumniConnect Team
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: alumni.email,
    subject: `Job Post Approved: ${job.title}`,
    html: html
  });
};

// Job Rejection Email
exports.sendJobRejectionEmail = async (job, alumni, reason) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f44336;">Job Post Not Approved</h2>
      <p>Dear ${alumni.name},</p>
      <p>Your job posting could not be approved at this time.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
      </div>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>You can edit and resubmit your job post if needed.</p>
      <p style="margin-top: 20px; color: #666;">
        Best regards,<br/>
        HBTU AlumniConnect Team
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: alumni.email,
    subject: `Job Post Update: ${job.title}`,
    html: html
  });
};

// Referral Request Email (to Alumni)
exports.sendReferralRequestEmail = async (referral, job, student, alumni) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">🤝 New Referral Request</h2>
      <p>Dear ${alumni.name},</p>
      <p>A student has requested a referral for your job posting:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${job.title}</h3>
        <p><strong>Student:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        ${student.phone ? `<p><strong>Phone:</strong> ${student.phone}</p>` : ''}
        <p><strong>Batch:</strong> ${student.batch}</p>
        <p><strong>Branch:</strong> ${student.branch}</p>
      </div>
      <div style="background-color: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Message from Student:</strong></p>
        <p style="font-style: italic;">"${referral.message}"</p>
      </div>
      <p><strong>Resume:</strong> <a href="${referral.resumeLink}">View Resume</a></p>
      <a href="${process.env.FRONTEND_URL}/referrals/${referral._id}" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        View & Respond
      </a>
      <p style="margin-top: 20px; color: #666;">
        Best regards,<br/>
        HBTU AlumniConnect Team
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: alumni.email,
    subject: `New Referral Request: ${job.title}`,
    html: html
  });
};

// Referral Response Email (to Student)
exports.sendReferralResponseEmail = async (referral, job, student, alumni, accepted) => {
  const statusColor = accepted ? '#4CAF50' : '#f44336';
  const statusText = accepted ? 'Accepted' : 'Rejected';
  const statusEmoji = accepted ? '✅' : '❌';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColor};">${statusEmoji} Referral Request ${statusText}</h2>
      <p>Dear ${student.name},</p>
      <p>The alumni has responded to your referral request:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Alumni:</strong> ${alumni.name}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
      </div>
      ${referral.alumniResponse ? `
        <div style="background-color: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Alumni's Response:</strong></p>
          <p style="font-style: italic;">"${referral.alumniResponse}"</p>
        </div>
      ` : ''}
      ${accepted ? `
        <p>Congratulations! The alumni has agreed to refer you. They will be in touch with further steps.</p>
      ` : `
        <p>Unfortunately, the alumni couldn't provide a referral at this time. Keep exploring other opportunities!</p>
      `}
      <p style="margin-top: 20px; color: #666;">
        Best regards,<br/>
        HBTU AlumniConnect Team
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: student.email,
    subject: `Referral ${statusText}: ${job.title}`,
    html: html
  });
};

module.exports = sendEmail;
