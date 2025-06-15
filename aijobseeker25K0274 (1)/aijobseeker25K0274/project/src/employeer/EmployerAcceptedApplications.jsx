import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  CheckCircle,
  Building2,
  Calendar,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const EmployerAcceptedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeError, setResumeError] = useState(null);

  useEffect(() => {
    const fetchAcceptedApplications = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || 
                         localStorage.getItem('email') || 
                         localStorage.getItem('user');
        
        if (!userEmail) {
          setError('Please log in to view applications');
          setLoading(false);
          return;
        }

        // Fetch all applications for the employer
        const response = await axios.get(`http://localhost:5000/api/applications/employer/${userEmail}`);
        
        // Filter accepted applications
        const acceptedApplications = response.data.filter(app => app.status === 'accepted');
        
        // Fetch additional candidate details for each accepted application
        const applicationsWithDetails = await Promise.all(
          acceptedApplications.map(async (app) => {
            try {
              const candidateResponse = await axios.get(`http://localhost:5000/api/users/${app.userEmail}`);
              return {
                ...app,
                candidate: candidateResponse.data
              };
            } catch (err) {
              console.error('Error fetching candidate details:', err);
              return app;
            }
          })
        );

        setApplications(applicationsWithDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
        setLoading(false);
      }
    };

    fetchAcceptedApplications();
  }, []);

  const handleResumeView = async (resumeUrl) => {
    try {
      setResumeError(null);
      if (!resumeUrl) {
        setResumeError('No resume available');
        return;
      }

      // Check if the URL is a full URL or just a path
      const fullUrl = resumeUrl.startsWith('http') 
        ? resumeUrl 
        : `http://localhost:5000/${resumeUrl.replace(/^\/+/, '')}`;

      // First check if the resume exists
      const response = await axios.head(fullUrl);
      if (response.status === 200) {
        window.open(fullUrl, '_blank');
      } else {
        setResumeError('Resume not found');
      }
    } catch (error) {
      console.error('Error viewing resume:', error);
      setResumeError('Failed to load resume. Please try again later.');
    }
  };

  const handleResumeDownload = async (resumeUrl, candidateName) => {
    try {
      setResumeError(null);
      if (!resumeUrl) {
        setResumeError('No resume available');
        return;
      }

      // Check if the URL is a full URL or just a path
      const fullUrl = resumeUrl.startsWith('http') 
        ? resumeUrl 
        : `http://localhost:5000/${resumeUrl.replace(/^\/+/, '')}`;

      const response = await axios.get(fullUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${candidateName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      setResumeError('Failed to download resume. Please try again later.');
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Accepted Applications
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            View details of candidates who have accepted job offers
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accepted applications</h3>
            <p className="mt-1 text-sm text-gray-500">There are no accepted applications at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-6">
                  {/* Job Details */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job?.title}
                      </h3>
                    </div>
                  
                  </div>

                  {/* Candidate Details */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {application.candidate?.firstName} {application.candidate?.lastName}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {application.candidate?.email}
                      </span>
                    </div>

                    {/* Phone */}
                    {application.candidate?.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {application.candidate.phoneNumber}
                        </span>
                      </div>
                    )}

                    {/* Skills */}
                    {application.candidate?.skills && application.candidate.skills.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center mb-2">
                          <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {application.candidate.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resume Actions */}
                    {(application.resume || application.candidate?.resume) && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        {resumeError && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center">
                              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                              <p className="text-sm text-red-700">{resumeError}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleResumeView(application.resume || application.candidate?.resume)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Resume
                          </button>
                          <button
                            onClick={() => handleResumeDownload(
                              application.resume || application.candidate?.resume,
                              `${application.candidate?.firstName}_${application.candidate?.lastName}`
                            )}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerAcceptedApplications; 