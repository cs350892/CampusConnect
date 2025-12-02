const PendingEntry = require('../models/PendingEntry');
const Student = require('../models/student');

/**
 * SIMPLE ADMIN APPROVAL CONTROLLER
 * Simple text-based approval system
 * Admin Credentials: cs350892@gmail.com / Chandra@5009
 */

// ========== ADMIN LOGIN ==========
// @desc    Admin login with hardcoded credentials
// @route   POST /api/simple-admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = 'cs350892@gmail.com';
    const ADMIN_PASSWORD = 'Chandra@5009';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Create simple admin token
    const adminToken = Buffer.from(`${ADMIN_EMAIL}:${Date.now()}:ADMIN`).toString('base64');

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token: adminToken,
      admin: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// ========== REGISTER PENDING (Students/Alumni Form Submit) ==========
// @desc    Submit form as raw text to pendingEntries
// @route   POST /api/simple-admin/register-pending
// @access  Public
exports.registerPending = async (req, res) => {
  console.log('🔥🔥🔥 === REGISTER PENDING ENDPOINT HIT === 🔥🔥🔥');
  console.log('📍 Path:', req.path);
  console.log('📍 Full URL:', req.originalUrl);
  console.log('📍 Method:', req.method);
  console.log('🔑 Authorization Header:', req.headers.authorization);
  
  try {
    console.log('📝 Register pending request received:', req.body);
    
    const { 
      name, email, roll, branch, batch, company, role, 
      phone, techStack, resumeLink, github, linkedin, 
      location, pronouns, dsaProblems 
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Convert form data to simple raw text with all fields
    let rawText = `Name: ${name || 'N/A'}, Email: ${email || 'N/A'}, Role: ${role || 'student'}`;
    
    if (phone) rawText += `, Phone: ${phone}`;
    if (roll) rawText += `, Roll: ${roll}`;
    if (branch) rawText += `, Branch: ${branch}`;
    if (batch) rawText += `, Batch: ${batch}`;
    if (company) rawText += `, Company: ${company}`;
    if (techStack) rawText += `, TechStack: ${techStack}`;
    if (resumeLink) rawText += `, Resume: ${resumeLink}`;
    if (github) rawText += `, GitHub: ${github}`;
    if (linkedin) rawText += `, LinkedIn: ${linkedin}`;
    if (location) rawText += `, Location: ${location}`;
    if (pronouns) rawText += `, Pronouns: ${pronouns}`;
    if (dsaProblems) rawText += `, DSA: ${dsaProblems}`;

    // Save to pendingEntries collection (NOT to students)
    const pendingEntry = await PendingEntry.create({
      rawText,
      status: 'pending'
    });

    console.log('✅ Pending entry created:', pendingEntry._id);

    res.status(201).json({
      success: true,
      message: 'Form submitted! Waiting for admin approval.',
      entry: {
        id: pendingEntry._id,
        rawText: pendingEntry.rawText,
        status: pendingEntry.status,
        createdAt: pendingEntry.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form',
      error: error.message
    });
  }
};

// ========== GET PENDING ENTRIES ==========
// @desc    Get all pending entries (for admin dashboard)
// @route   GET /api/simple-admin/pending
// @access  Private (Admin)
exports.getPendingEntries = async (req, res) => {
  try {
    const pendingEntries = await PendingEntry.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingEntries.length,
      entries: pendingEntries.map(entry => ({
        id: entry._id,
        rawText: entry.rawText,
        createdAt: entry.createdAt,
        status: entry.status
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending entries',
      error: error.message
    });
  }
};

// ========== APPROVE ENTRY ==========
// @desc    Approve entry - parse rawText and move to students collection
// @route   POST /api/simple-admin/approve
// @access  Private (Admin)
exports.approveEntry = async (req, res) => {
  try {
    const { entryId } = req.body;

    if (!entryId) {
      return res.status(400).json({
        success: false,
        message: 'Entry ID is required'
      });
    }

    const pendingEntry = await PendingEntry.findById(entryId);

    if (!pendingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    if (pendingEntry.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Entry is not pending'
      });
    }

    // Parse rawText to extract data (simple parsing logic)
    const rawText = pendingEntry.rawText;
    const parsedData = parseRawText(rawText);

    // Create student entry in students collection with all fields
    const studentData = {
      name: parsedData.name || 'Unknown',
      email: parsedData.email || 'no-email@example.com',
      rollNumber: parsedData.roll || 'N/A',
      branch: parsedData.branch || 'Not Specified',
      batch: parsedData.batch || 'Not Specified',
      phone: parsedData.phone || '',
      techStack: parsedData.techStack || '',
      resumeLink: parsedData.resumeLink || '',
      location: parsedData.location || 'India',
      pronouns: parsedData.pronouns || 'They/Them',
      dsaProblems: parsedData.dsaProblems || 0,
      id: Date.now(), // Simple unique ID
      status: 'approved',
      approvedAt: new Date()
    };

    // Add social links if available
    if (parsedData.github || parsedData.linkedin) {
      studentData.socialLinks = {
        github: parsedData.github || 'https://github.com',
        linkedin: parsedData.linkedin || ''
      };
    }

    // If company exists, it might be alumni
    if (parsedData.company) {
      studentData.company = parsedData.company;
    }

    // Insert into students collection
    const student = await Student.create(studentData);

    // Delete pending entry
    await PendingEntry.findByIdAndDelete(entryId);

    res.status(200).json({
      success: true,
      message: 'Entry approved and moved to students collection',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        branch: student.branch
      }
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve entry',
      error: error.message
    });
  }
};

// ========== REJECT ENTRY ==========
// @desc    Reject entry - delete from pendingEntries
// @route   POST /api/simple-admin/reject
// @access  Private (Admin)
exports.rejectEntry = async (req, res) => {
  try {
    const { entryId } = req.body;

    if (!entryId) {
      return res.status(400).json({
        success: false,
        message: 'Entry ID is required'
      });
    }

    const pendingEntry = await PendingEntry.findById(entryId);

    if (!pendingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    // Delete pending entry
    await PendingEntry.findByIdAndDelete(entryId);

    res.status(200).json({
      success: true,
      message: 'Entry rejected and deleted',
      deletedEntryId: entryId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject entry',
      error: error.message
    });
  }
};

// ========== HELPER FUNCTION: Parse Raw Text ==========
function parseRawText(rawText) {
  const data = {};
  
  // Simple regex parsing for all fields
  const nameMatch = rawText.match(/Name:\s*([^,]+)/i);
  const emailMatch = rawText.match(/Email:\s*([^,]+)/i);
  const roleMatch = rawText.match(/Role:\s*([^,]+)/i);
  const phoneMatch = rawText.match(/Phone:\s*([^,]+)/i);
  const rollMatch = rawText.match(/Roll:\s*([^,]+)/i);
  const branchMatch = rawText.match(/Branch:\s*([^,]+)/i);
  const batchMatch = rawText.match(/Batch:\s*([^,]+)/i);
  const companyMatch = rawText.match(/Company:\s*([^,]+)/i);
  const techStackMatch = rawText.match(/TechStack:\s*([^,]+)/i);
  const resumeMatch = rawText.match(/Resume:\s*([^,]+)/i);
  const githubMatch = rawText.match(/GitHub:\s*([^,]+)/i);
  const linkedinMatch = rawText.match(/LinkedIn:\s*([^,]+)/i);
  const locationMatch = rawText.match(/Location:\s*([^,]+)/i);
  const pronounsMatch = rawText.match(/Pronouns:\s*([^,]+)/i);
  const dsaMatch = rawText.match(/DSA:\s*([^,]+)/i);
  
  if (nameMatch) data.name = nameMatch[1].trim();
  if (emailMatch) data.email = emailMatch[1].trim();
  if (roleMatch) data.role = roleMatch[1].trim();
  if (phoneMatch) data.phone = phoneMatch[1].trim();
  if (rollMatch) data.roll = rollMatch[1].trim();
  if (branchMatch) data.branch = branchMatch[1].trim();
  if (batchMatch) data.batch = batchMatch[1].trim();
  if (companyMatch) data.company = companyMatch[1].trim();
  if (techStackMatch) data.techStack = techStackMatch[1].trim();
  if (resumeMatch) data.resumeLink = resumeMatch[1].trim();
  if (githubMatch) data.github = githubMatch[1].trim();
  if (linkedinMatch) data.linkedin = linkedinMatch[1].trim();
  if (locationMatch) data.location = locationMatch[1].trim();
  if (pronounsMatch) data.pronouns = pronounsMatch[1].trim();
  if (dsaMatch) data.dsaProblems = parseInt(dsaMatch[1].trim()) || 0;
  
  return data;
}

// ========== GET STATS ==========
// @desc    Get simple stats for admin
// @route   GET /api/simple-admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const totalPending = await PendingEntry.countDocuments({ status: 'pending' });
    const totalStudents = await Student.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        pendingEntries: totalPending,
        approvedStudents: totalStudents
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};
