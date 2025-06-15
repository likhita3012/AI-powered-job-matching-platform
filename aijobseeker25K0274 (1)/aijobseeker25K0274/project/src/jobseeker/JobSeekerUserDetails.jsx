import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  FileText,
  Award,
  Building2,
  Clock,
  Star,
  Rocket,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

const JobSeekerUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || 
                         localStorage.getItem('email') || 
                         localStorage.getItem('user');
        
        if (!userEmail) {
          setError('Please log in to view details');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/${userEmail}`);
        setUserDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const calculateTotalExperience = (experience) => {
    if (!experience || experience.length === 0) return 0;
    
    return experience.reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = endDate.getFullYear() - startDate.getFullYear();
      const months = endDate.getMonth() - startDate.getMonth();
      return total + (years * 12 + months);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalExperienceMonths = calculateTotalExperience(userDetails?.experience);
  const isFresher = totalExperienceMonths === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Basic Information */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userDetails?.firstName} {userDetails?.lastName}
                </h2>
                <p className="text-sm text-gray-500">{userDetails?.email}</p>
                <div className="mt-2 flex items-center">
                  {isFresher ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Rocket className="h-4 w-4 mr-1" />
                      Fresher
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Star className="h-4 w-4 mr-1" />
                      {Math.floor(totalExperienceMonths / 12)} Years Experience
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{userDetails?.email}</span>
              </div>
              {userDetails?.phoneNumber && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{userDetails.phoneNumber}</span>
                </div>
              )}
              {userDetails?.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{userDetails.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Experience</h3>
            {isFresher ? (
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-green-500 mr-3" />
                  <h4 className="text-xl font-medium text-gray-900">Fresher</h4>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This candidate is a fresher, ready to start their professional journey. 
                    They bring fresh perspectives and enthusiasm to the workplace.
                  </p>
                  {userDetails?.education && userDetails.education.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Education:</h5>
                      <div className="space-y-2">
                        {userDetails.education.slice(0, 2).map((edu, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{edu.degree} from {edu.institution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {userDetails?.skills && userDetails.skills.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Key Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {userDetails.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-blue-700 font-medium">
                      Total Experience: {Math.floor(totalExperienceMonths / 12)} Years {totalExperienceMonths % 12} Months
                    </span>
                  </div>
                </div>
                {userDetails.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span>{exp.company}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{exp.description}</p>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Skills Used:</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
            {userDetails?.education && userDetails.education.length > 0 ? (
              <div className="space-y-6">
                {userDetails.education.map((edu, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-green-500">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{edu.degree}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span>{edu.institution}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{edu.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No education details available</p>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="px-6 py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
            {userDetails?.skills && userDetails.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userDetails.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No skills listed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerUserDetails; 