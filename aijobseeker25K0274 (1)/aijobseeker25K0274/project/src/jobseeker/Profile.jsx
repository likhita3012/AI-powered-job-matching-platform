import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, GraduationCap, Briefcase, Wrench, FileText, MapPin, Phone, Mail, Edit2, Save, X, Upload } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("No email found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/profile/${email}`);
      
      if (response.data.message === "Profile not created yet") {
        setError("Please create your profile first");
        setLoading(false);
        return;
      }
      
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.data?.message === "Profile not created yet") {
        setError("Please create your profile first");
      } else if (err.response?.status === 404) {
        setError("Profile not found. Please create your profile first.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.put(`http://localhost:5000/api/profile/${email}`, editedProfile);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await axios.post('http://localhost:5000/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const email = localStorage.getItem("email");
      await axios.put(`http://localhost:5000/api/profile/${email}`, {
        resume: response.data.filePath
      });

      setProfile(prev => ({
        ...prev,
        resume: response.data.filePath
      }));
      setResumeFile(null);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading resume:', error);
      setError('Failed to upload resume');
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.href = "/jobseeker/user-profile"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">No profile found</div>
          <button
            onClick={() => window.location.href = "/jobseeker/create-profile"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircle className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedProfile.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="border rounded px-2 py-1"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editedProfile.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="border rounded px-2 py-1 ml-2"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-gray-600">{profile.email}</p>
                  </>
                )}
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Phone Number"
                />
              ) : (
                <span className="text-gray-700">{profile.phoneNumber}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Location"
                />
              ) : (
                <span className="text-gray-700">{profile.location}</span>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Wrench className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedProfile.skills.join(", ")}
                onChange={(e) => handleChange("skills", e.target.value.split(",").map(s => s.trim()))}
                className="border rounded px-2 py-1 w-full"
                placeholder="Enter skills separated by commas"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          </div>
          <div className="space-y-6">
            {isEditing ? (
              editedProfile.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Institution"
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Field of Study"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={edu.startDate.split('T')[0]}
                      onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="date"
                      value={edu.endDate ? edu.endDate.split('T')[0] : ''}
                      onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.marks}
                      onChange={(e) => handleEducationChange(index, "marks", e.target.value)}
                      className="border rounded px-2 py-1"
                      placeholder="Marks/GPA"
                    />
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
                      className="border rounded px-2 py-1"
                      placeholder="Grade"
                    />
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={edu.isCurrentlyStudying}
                      onChange={(e) => handleEducationChange(index, "isCurrentlyStudying", e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Currently Studying</span>
                  </label>
                </div>
              ))
            ) : (
              profile.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-600">{edu.field}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{new Date(edu.startDate).toLocaleDateString()}</span>
                    {edu.isCurrentlyStudying ? (
                      <span className="ml-2">- Present</span>
                    ) : (
                      <span className="ml-2">- {new Date(edu.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Marks/GPA: {edu.marks}</span>
                    <span className="ml-4">Grade: {edu.grade}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          </div>
          <div className="space-y-6">
            {isEditing ? (
              editedProfile.workExperience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-2">
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleWorkExperienceChange(index, "position", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Position"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Company"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={exp.startDate.split('T')[0]}
                      onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="date"
                      value={exp.endDate ? exp.endDate.split('T')[0] : ''}
                      onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Description"
                    rows="3"
                  />
                  <textarea
                    value={exp.responsibilities.join("\n")}
                    onChange={(e) => handleWorkExperienceChange(index, "responsibilities", e.target.value.split("\n"))}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Responsibilities (one per line)"
                    rows="3"
                  />
                  <textarea
                    value={exp.achievements.join("\n")}
                    onChange={(e) => handleWorkExperienceChange(index, "achievements", e.target.value.split("\n"))}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Achievements (one per line)"
                    rows="3"
                  />
                  <input
                    type="text"
                    value={exp.skills.join(", ")}
                    onChange={(e) => handleWorkExperienceChange(index, "skills", e.target.value.split(",").map(s => s.trim()))}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Skills (comma-separated)"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exp.isCurrentlyWorking}
                      onChange={(e) => handleWorkExperienceChange(index, "isCurrentlyWorking", e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Currently Working</span>
                  </label>
                </div>
              ))
            ) : (
              profile.workExperience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{new Date(exp.startDate).toLocaleDateString()}</span>
                    {exp.isCurrentlyWorking ? (
                      <span className="ml-2">- Present</span>
                    ) : (
                      <span className="ml-2">- {new Date(exp.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                  
                  {exp.responsibilities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Responsibilities:</h4>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="text-gray-600">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.achievements.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Achievements:</h4>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="text-gray-600">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.skills.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Skills:</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {exp.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
            </div>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {resumeFile ? 'Change Resume' : 'Upload Resume'}
                </label>
                {resumeFile && (
                  <button
                    onClick={handleResumeUpload}
                    disabled={uploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Save Resume'}
                  </button>
                )}
              </div>
            ) : (
              profile.resume && (
                <button
                  onClick={() => window.open(`http://localhost:5000/uploads/${profile.resume.split('/').pop()}`, '_blank')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </button>
              )
            )}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            {isEditing ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {resumeFile ? (
                    <span className="text-green-600">Selected file: {resumeFile.name}</span>
                  ) : profile.resume ? (
                    "Click 'Change Resume' to update your resume"
                  ) : (
                    "Click 'Upload Resume' to add your resume"
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Only PDF files are allowed. Maximum file size: 10MB
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {profile.resume
                  ? "Your resume has been uploaded and is available for employers to view."
                  : "No resume uploaded yet. Click 'Edit Profile' to add your resume."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;