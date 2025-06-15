import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Save, 
  Upload,
  AlertCircle,
  Briefcase,
  Users,
  Calendar,
  FileText,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const EmployerProfileSettings = () => {
  // Get email from localStorage immediately
  const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
  
  const [profile, setProfile] = useState({
    companyName: '',
    email: userEmail || '', // Initialize with email from localStorage
    phone: '',
    location: '',
    website: '',
    description: '',
    logo: null,
    industry: '',
    companySize: '',
    foundedYear: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if userEmail exists in localStorage
        const currentEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
        if (!currentEmail) {
          setError('Please log in to access your profile');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/${currentEmail}`);
        // Ensure email is always from localStorage
        setProfile(prev => ({
          ...response.data,
          email: currentEmail // Always use email from localStorage
        }));
        if (response.data.logo) {
          setImagePreview(`http://localhost:5000${response.data.logo}`);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Remove userEmail dependency to prevent re-fetching

  const validateForm = () => {
    const errors = {};
    
    if (!profile.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!profile.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(profile.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!profile.location.trim()) {
      errors.location = 'Location is required';
    }

    if (profile.website && !/^https?:\/\/.+/.test(profile.website)) {
      errors.website = 'Please enter a valid website URL';
    }

    if (!profile.industry.trim()) {
      errors.industry = 'Industry is required';
    }

    if (!profile.companySize.trim()) {
      errors.companySize = 'Company size is required';
    }

    if (!profile.foundedYear) {
      errors.foundedYear = 'Founded year is required';
    } else if (profile.foundedYear < 1900 || profile.foundedYear > new Date().getFullYear()) {
      errors.foundedYear = 'Please enter a valid year';
    }

    if (!profile.description.trim()) {
      errors.description = 'Company description is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setProfile(prev => ({
        ...prev,
        logo: file
      }));
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      setSaving(false);
      return;
    }

    try {
      // Get email from localStorage
      const currentEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
      
      if (!currentEmail) {
        setError('Please log in to update your profile');
        setSaving(false);
        return;
      }

      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (profile[key] !== null) {
          formData.append(key, profile[key]);
        }
      });

      // Add email to formData if not already present
      if (!formData.has('email')) {
        formData.append('email', currentEmail);
      }

      await axios.put(`http://localhost:5000/api/users/${currentEmail}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Company Profile Settings</h2>
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </motion.button>
            ) : (
              <div className="space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Company Logo"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Company Logo</h3>
                <p className="text-sm text-gray-500">Upload your company logo (PNG, JPG, max 5MB)</p>
              </div>
            </div>

            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.companyName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.email} // Use email from profile state
                    disabled
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    title="Email cannot be changed"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.location ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.website ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>
                {validationErrors.website && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.website}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="industry"
                    value={profile.industry}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.industry ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.industry && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Size</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companySize"
                    value={profile.companySize}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.companySize ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.companySize && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.companySize}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="foundedYear"
                    value={profile.foundedYear}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      validationErrors.foundedYear ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.foundedYear && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.foundedYear}</p>
                )}
              </div>
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Description</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleInputChange}
                  rows={4}
                  disabled={!isEditing}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    validationErrors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  required
                />
              </div>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileSettings; 