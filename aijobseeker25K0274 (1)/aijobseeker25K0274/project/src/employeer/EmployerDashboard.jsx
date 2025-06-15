import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Settings,
  CheckCircle,
  Building2,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    acceptedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || 
                         localStorage.getItem('email') || 
                         localStorage.getItem('user');
        
        if (!userEmail) {
          setError('Please log in to view dashboard');
          setLoading(false);
          return;
        }

        // Fetch jobs
        const jobsResponse = await axios.get(`http://localhost:5000/api/jobs/employer/${userEmail}`);
        const totalJobs = jobsResponse.data.length;

        // Fetch applications
        const applicationsResponse = await axios.get(`http://localhost:5000/api/applications/employer/${userEmail}`);
        const totalApplications = applicationsResponse.data.length;
        const acceptedApplications = applicationsResponse.data.filter(app => app.status === 'accepted').length;

        setStats({
          totalJobs,
          totalApplications,
          acceptedApplications
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            Employer Dashboard
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Manage your job postings and applications
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Total Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Jobs Posted
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalJobs}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Applications
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalApplications}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accepted Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Accepted Applications
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.acceptedApplications}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Post New Job */}
          <Link to="/employer/post-job">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Post New Job</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a new job posting</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* View Applications */}
          <Link to="/employer/applications">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">View Applications</h3>
                    <p className="mt-1 text-sm text-gray-500">Review all applications</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Accepted Applications */}
          <Link to="/employer/accepted-applications">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Accepted Applications</h3>
                    <p className="mt-1 text-sm text-gray-500">View accepted candidates</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Profile Settings */}
          <Link to="/employer/profile-settings">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your profile</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard; 