import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Phone, Building, Calendar, MapPin, 
  Link as LinkIcon, FileText, Code, 
  Github, Linkedin, Save, CheckCircle, AlertCircle, Upload, Image as ImageIcon
} from 'lucide-react';

const UpdateProfileByRollForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [credentials, setCredentials] = useState({ email: '', rollNumber: '' });

  // Simple form - matching StudentRegistration fields only
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    batch: '',
    branch: '',
    dsaProblems: 0,
    techStack: '',
    resumeLink: '',
    github: '',
    linkedin: '',
    location: 'India',
    pronouns: 'They/Them',
    imageUrl: ''
  });

  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('verifiedUserData');
    const storedEmail = localStorage.getItem('verifiedEmail');
    const storedRollNumber = localStorage.getItem('verifiedRollNumber');

    if (!storedUserData || !storedEmail || !storedRollNumber) {
      navigate('/update-profile-by-roll');
      return;
    }

    try {
      const userData = JSON.parse(storedUserData);
      setCredentials({ email: storedEmail, rollNumber: storedRollNumber });
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        rollNumber: userData.rollNumber || '',
        batch: userData.batch || '',
        branch: userData.branch || '',
        dsaProblems: userData.dsaProblems || 0,
        techStack: userData.techStack || '',
        resumeLink: userData.resumeLink || '',
        github: userData.socialLinks?.github || '',
        linkedin: userData.socialLinks?.linkedin || '',
        location: userData.location || 'India',
        pronouns: userData.pronouns || 'They/Them',
        imageUrl: userData.imageUrl || ''
      });
      
      if (userData.imageUrl) {
        setImagePreview(userData.imageUrl);
      }
    } catch (err) {
      navigate('/update-profile-by-roll');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setUploadingImage(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const imageFormData = new FormData();
      imageFormData.append('image', selectedFile);

      const response = await axios.post(`${API_URL}/upload`, imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        return {
          image: response.data.imageUrl,
          imageUrl: response.data.imageUrl,
          cloudinaryPublicId: response.data.cloudinaryPublicId
        };
      }
      return null;
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Upload image first if new image selected
      let imageData = {};
      if (selectedFile) {
        const uploadResult = await uploadImage();
        if (uploadResult) {
          imageData = {
            image: uploadResult.image,
            imageUrl: uploadResult.imageUrl,
            cloudinaryPublicId: uploadResult.cloudinaryPublicId
          };
        }
      }
      
      const response = await axios.post(`${API_URL}/profile-verify/update`, {
        email: credentials.email,
        rollNumber: credentials.rollNumber,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        batch: formData.batch.trim(),
        branch: formData.branch.trim(),
        dsaProblems: parseInt(formData.dsaProblems) || 0,
        techStack: formData.techStack.trim(),
        resumeLink: formData.resumeLink.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        location: formData.location.trim(),
        pronouns: formData.pronouns,
        ...imageData  // Add image data if uploaded
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          localStorage.removeItem('verifiedUserData');
          localStorage.removeItem('verifiedEmail');
          localStorage.removeItem('verifiedRollNumber');
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Your Profile</h1>
          <p className="text-gray-600">Verified as: <span className="font-semibold">{formData.email}</span></p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-green-700 font-semibold">Profile Updated Successfully!</p>
              <p className="text-green-600 text-sm">Your profile has been updated with the new information.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          
          {/* Profile Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={loading || uploadingImage}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                {uploadingImage && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Read-only)</label>
                <input type="email" value={formData.email} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 XXXXXXXXXX" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Roll Number (Read-only)</label>
                <input type="text" value={formData.rollNumber} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="City, State" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pronouns</label>
                <select name="pronouns" value={formData.pronouns} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" disabled={loading}>
                  <option value="They/Them">They/Them</option>
                  <option value="He/Him">He/Him</option>
                  <option value="She/Her">She/Her</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-500" />
              Academic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Batch <span className="text-red-500">*</span></label>
                <input type="text" name="batch" value={formData.batch} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2021-2023" required disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch</label>
                <input type="text" name="branch" value={formData.branch} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MCA" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">DSA Problems Solved</label>
                <input type="number" name="dsaProblems" value={formData.dsaProblems} onChange={handleChange} min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0" disabled={loading} />
              </div>
            </div>
          </div>

          {/* Skills & Links */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-500" />
              Skills & Links
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tech Stack</label>
                <input type="text" name="techStack" value={formData.techStack} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, Python" disabled={loading} />
                <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                    <Github className="w-4 h-4 mr-1" /> GitHub
                  </label>
                  <input type="url" name="github" value={formData.github} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username" disabled={loading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                    <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
                  </label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/profile" disabled={loading} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> Resume Link
                </label>
                <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://drive.google.com/..." disabled={loading} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={loading || success || uploadingImage}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
              {uploadingImage ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading Image...</span>
                </>
              ) : loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate('/update-profile-by-roll')} disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileByRollForm;
