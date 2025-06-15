import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Star, 
  FileText, 
  Search, 
  Filter,
  Percent,
  Building2,
  MapPin,
  Clock
} from 'lucide-react';
import axios from 'axios';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, suggested, applied
  const [searchQuery, setSearchQuery] = useState('');
  const [skillMatchFilter, setSkillMatchFilter] = useState('all'); // all, high, medium

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = localStorage.getItem('email');
        if (!userEmail) {
          setError('User email not found');
          return;
        }

        // Fetch all jobs
        const jobsResponse = await axios.get('http://localhost:5000/api/jobs');
        setJobs(jobsResponse.data);

        // Fetch user's applications
        const applicationsResponse = await axios.get(`http://localhost:5000/api/applications/user/${userEmail}`);
        setApplications(applicationsResponse.data);

        // Fetch suggested jobs based on user's skills
        const suggestedResponse = await axios.get(`http://localhost:5000/api/jobs/suggested/${userEmail}`);
        setSuggestedJobs(suggestedResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = () => {
    let data = filter === 'suggested' ? suggestedJobs : 
                filter === 'applied' ? applications.map(app => app.job) : 
                jobs;

    // Apply skill match filter for suggested jobs
    if (filter === 'suggested' || filter === 'all') {
      data = data.filter(job => {
        if (!job.skillMatchPercentage) return true;
        switch (skillMatchFilter) {
          case 'high':
            return job.skillMatchPercentage >= 90;
          case 'medium':
            return job.skillMatchPercentage >= 70 && job.skillMatchPercentage < 90;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      data = data.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return data;
  };

  const handleApply = async (jobId) => {
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        setError('User email not found');
        return;
      }

      // Get user's profile to check for resume
      const userResponse = await axios.get(`http://localhost:5000/api/profile/${userEmail}`);
      const userProfile = userResponse.data;

      // Create application
      await axios.post('http://localhost:5000/api/applications', {
        jobId,
        userEmail,
        status: 'pending',
        resume: userProfile.resume || null
      });
      
      // Refresh applications
      const applicationsResponse = await axios.get(`http://localhost:5000/api/applications/user/${userEmail}`);
      setApplications(applicationsResponse.data);
    } catch (err) {
      console.error('Error applying for job:', err);
      setError(err.response?.data?.message || 'Error applying for job');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Dashboard</h1>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              All Jobs
            </button>
            <button
              onClick={() => setFilter('suggested')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                filter === 'suggested' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Star className="w-4 h-4" />
              Suggested ({suggestedJobs.length})
            </button>
            <button
              onClick={() => setFilter('applied')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                filter === 'applied' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Applied ({applications.length})
            </button>

            {/* Skill Match Filter */}
            {(filter === 'suggested' || filter === 'all') && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSkillMatchFilter('all')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    skillMatchFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  All Match
                </button>
                <button
                  onClick={() => setSkillMatchFilter('high')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    skillMatchFilter === 'high' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  90%+
                </button>
                <button
                  onClick={() => setSkillMatchFilter('medium')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    skillMatchFilter === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  70-89%
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-6">
        {filteredData().map((job, index) => {
          const application = applications.find(app => app.job._id === job._id);
          
          return (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {job.skillMatchPercentage && (
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {Math.round(job.skillMatchPercentage)}% Match
                    </span>
                  )}
                  {application && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-600">{job.description}</p>
              </div>

              {!application && (
                <div className="mt-6">
                  <button
                    onClick={() => handleApply(job._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default JobSeekerDashboard; 