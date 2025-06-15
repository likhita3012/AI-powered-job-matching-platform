import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  UserCircle, 
  CheckCircle, 
  XCircle, 
  Star,
  Filter,
  Search,
  ChevronDown,
  Users,
  FileText,
  Percent
} from 'lucide-react';
import axios from 'axios';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [suggestedCandidates, setSuggestedCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, applied, suggested
  const [searchQuery, setSearchQuery] = useState('');
  const [skillMatchFilter, setSkillMatchFilter] = useState('all'); // all, high, medium
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerEmail = localStorage.getItem('email');
        if (!employerEmail) {
          setError('Employer email not found');
          return;
        }

        // Fetch all jobs for the employer
        const jobsResponse = await axios.get(`http://localhost:5000/api/jobs/employer/${employerEmail}`);
        setJobs(jobsResponse.data);
        
        // Set the first job as selected by default if available
        if (jobsResponse.data.length > 0) {
          setSelectedJob(jobsResponse.data[0]._id);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch applications and suggested candidates when selected job changes
  useEffect(() => {
    const fetchJobData = async () => {
      if (!selectedJob) return;

      try {
        const employerEmail = localStorage.getItem('email');
        if (!employerEmail) {
          setError('Employer email not found');
          return;
        }

        // Fetch applications for the selected job
        const applicationsResponse = await axios.get(`http://localhost:5000/api/applications/job/${selectedJob}`);
        setApplications(applicationsResponse.data);

        // Fetch suggested candidates based on the selected job's skills
        const suggestedResponse = await axios.get(`http://localhost:5000/api/jobs/suggested/${employerEmail}/${selectedJob}`);
        setSuggestedCandidates(suggestedResponse.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobData();
  }, [selectedJob]);

  const filteredData = () => {
    let data = filter === 'applied' ? applications : 
                filter === 'suggested' ? suggestedCandidates : 
                [...applications, ...suggestedCandidates];

    // Apply skill match filter for suggested candidates
    if (filter === 'suggested' || filter === 'all') {
      data = data.filter(item => {
        if (!item.skillMatchPercentage) return true; // Keep applied candidates
        switch (skillMatchFilter) {
          case 'high':
            return item.skillMatchPercentage >= 90;
          case 'medium':
            return item.skillMatchPercentage >= 70 && item.skillMatchPercentage < 90;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      data = data.filter(item => 
        (item.firstName + ' ' + item.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return data;
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      setLoading(true); // Show loading state
      setError(null);
      setSuccess(null);

      // First update the application status
      await axios.patch(`http://localhost:5000/api/applications/${applicationId}`, { status });
      
      // If the application is accepted, send email notification
      if (status === 'accepted') {
        // Get the application details to get candidate email and job details
        const applicationResponse = await axios.get(`http://localhost:5000/api/applications/${applicationId}`);
        const application = applicationResponse.data;
        
        // Get job details
        const jobResponse = await axios.get(`http://localhost:5000/api/jobs/${application.jobId}`);
        const job = jobResponse.data;

        // Send email notification
        await axios.post('http://localhost:5000/api/email/send-acceptance', {
          to: application.email,
          jobTitle: job.title,
          companyName: job.company,
          candidateName: `${application.firstName} ${application.lastName}`,
          jobLocation: job.location,
          salary: job.salary,
          startDate: new Date().toISOString().split('T')[0] // Today's date
        });

        // Show success message with animation
        setSuccess('Application accepted! An email notification has been sent to the candidate.');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      }

      // Update the applications state
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error('Error updating application status:', err);
      setError(err.response?.data?.message || 'Failed to update application status. Please try again.');
    } finally {
      setLoading(false);
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

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        {success}
      </motion.div>
    );
  }

  const selectedJobDetails = jobs.find(j => j._id === selectedJob);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Applications & Candidates</h1>
        
        {/* Job Selection Dropdown */}
        <div className="mb-6">
          <label htmlFor="job-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Job Posting
          </label>
          <div className="relative">
            <select
              id="job-select"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} - {job.company}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Selected Job Details */}
        {selectedJobDetails && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJobDetails.title}</h2>
            <p className="text-gray-600 mb-4">{selectedJobDetails.company}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{applications.length} Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">{suggestedCandidates.length} Suggested Candidates</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">{selectedJobDetails.location}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or skills..."
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
              All
            </button>
            <button
              onClick={() => setFilter('applied')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                filter === 'applied' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Applied ({applications.length})
            </button>
            <button
              onClick={() => setFilter('suggested')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                filter === 'suggested' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Star className="w-4 h-4" />
              Suggested ({suggestedCandidates.length})
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

      {/* Candidates List */}
      <div className="grid gap-6">
        {filteredData().map((candidate, index) => (
          <motion.div
            key={candidate._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <UserCircle className="w-12 h-12 text-gray-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {candidate.firstName} {candidate.lastName}
                    </h2>
                    <p className="text-gray-600">{candidate.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {candidate.jobMatches && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {Math.round(candidate.skillMatchPercentage)}% Match
                        </span>
                        <span className="text-xs text-gray-600">
                          Best match: {candidate.bestMatch.jobTitle}
                        </span>
                      </div>
                    )}
                    {candidate.status && (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        candidate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add Job Matches Section */}
                {candidate.jobMatches && candidate.jobMatches.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Job Match</h3>
                    <div className="space-y-2">
                      {candidate.jobMatches.map((match, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{match.jobTitle}</span>
                          <span className="text-sm text-blue-600">{Math.round(match.matchPercentage)}% match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {candidate.workExperience && candidate.workExperience.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
                    <div className="space-y-2">
                      {candidate.workExperience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-blue-500 pl-4">
                          <p className="font-medium">{exp.position} at {exp.company}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(exp.startDate).toLocaleDateString()} - 
                            {exp.isCurrentlyWorking ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {candidate.status && (
                  <div className="mt-6 flex gap-4">
                    {candidate.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApplicationStatus(candidate._id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(candidate._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobApplications; 