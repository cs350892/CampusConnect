import React, { useState } from 'react';
import { X } from 'lucide-react';

function StudentRegistration({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    linkedin: '',
    dsaProblems: '',
    batch: '',
    techStack: '',
    resumeLink: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    if (e.target.type === 'file' && e.target.files) {
      const file = e.target.files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = ['name', 'email', 'rollNumber', 'dsaProblems', 'batch', 'techStack', 'resumeLink'];
    const missingFields = requiredFields.filter((field) => !formData[field].trim());
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    console.log('Student form submitted:', { ...formData, hasImage: image ? 'Yes' : 'No' });
    alert('Student registration submitted successfully!');
    onSuccess();
    onClose();
    setFormData({
      name: '',
      email: '',
      rollNumber: '',
      linkedin: '',
      dsaProblems: '',
      batch: '',
      techStack: '',
      resumeLink: '',
    });
    setImage(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="sticky top-0 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Student Registration
          </h2>
        </div>

        <div className="p-6 md:p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Roll Number *
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your roll number"
              />
            </div>
            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label
                htmlFor="resumeLink"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resume Drive Link *
              </label>
              <input
                type="url"
                id="resumeLink"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="https://drive.google.com"
              />
            </div>
            <div>
              <label
                htmlFor="dsaProblems"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                No. of DSA Problems Solved *
              </label>
              <input
                type="number"
                id="dsaProblems"
                name="dsaProblems"
                value={formData.dsaProblems}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter number of problems solved"
                min="0"
              />
            </div>
            <div>
              <label
                htmlFor="batch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Batch (e.g., 2024-26) *
              </label>
              <input
                type="text"
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., 2024-26"
              />
            </div>
            <div>
              <label
                htmlFor="techStack"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tech Stack and Programming Language *
              </label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., React, Node.js, Python"
              />
            </div>
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Image (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Image preview shown above.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your registration will be reviewed and added to the student directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;