const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
  try {
    // Get counts
    const employerCount = await Employer.countDocuments();
    const jobSeekerCount = await JobSeeker.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Get recent applications with status counts
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: 'jobId', model: 'Job', select: 'title company' });

    // Get application status counts
    const applicationStatusCounts = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly job posting trends
    const monthlyJobTrends = await Job.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Get top industries (based on job categories)
    const topIndustries = await Job.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      counts: {
        employers: employerCount,
        jobSeekers: jobSeekerCount,
        totalJobs,
        totalApplications
      },
      recentApplications,
      applicationStatusCounts,
      monthlyJobTrends,
      topIndustries
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

module.exports = router; 