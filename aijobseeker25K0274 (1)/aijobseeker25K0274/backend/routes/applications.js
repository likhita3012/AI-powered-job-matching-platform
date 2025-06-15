const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const mongoose = require('mongoose');
const axios = require('axios');

// Get all applications for a specific employer
router.get('/employer/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // First, get all jobs posted by this employer
    const jobs = await Job.find({ employerEmail: email });
    const jobIds = jobs.map(job => job._id);

    // Then, get all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate({ path: 'jobId', model: 'Job', select: 'title company location type description skills' });

    // Transform the response to match frontend expectations
    const transformedApplications = applications.map(app => ({
      _id: app._id,
      job: app.jobId,
      userEmail: app.userEmail,
      status: app.status,
      coverLetter: app.coverLetter,
      resume: app.resume,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching employer applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Get all applications for a specific user
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const applications = await Application.find({ userEmail: email })
      .populate({ path: 'jobId', model: 'Job', select: 'title company location type description skills' });

    // Transform the response to match frontend expectations
    const transformedApplications = applications.map(app => ({
      _id: app._id,
      job: app.jobId,
      userEmail: app.userEmail,
      status: app.status,
      coverLetter: app.coverLetter,
      resume: app.resume,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Get all applications for a job
router.get('/job/:jobId', async (req, res) => {
  try {
    // First check if job exists
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get applications and populate user details
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate({
        path: 'jobId',
        model: 'Job',
        select: 'title company location type description skills'
      })
      .sort({ createdAt: -1 });

    // Transform the data to match the frontend expectations
    const transformedApplications = applications.map(app => ({
      ...app.toObject(),
      job: app.jobId, // Map jobId to job for frontend compatibility
      _id: app._id,
      status: app.status,
      createdAt: app.createdAt
    }));

    res.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new application
router.post('/', async (req, res) => {
  try {
    const { jobId, userEmail, coverLetter, resume } = req.body;

    // Validate required fields
    if (!jobId || !userEmail) {
      return res.status(400).json({ message: 'Job ID and user email are required' });
    }

    // Validate jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID format' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({ jobId, userEmail });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create new application
    const application = new Application({
      jobId,
      userEmail,
      coverLetter: coverLetter || '',
      resume: resume || user.resume || '',
      status: 'pending'
    });

    // Save the application
    const savedApplication = await application.save();
    
    // Populate job details before sending response
    const populatedApplication = await Application.findById(savedApplication._id)
      .populate({ 
        path: 'jobId', 
        model: 'Job', 
        select: 'title company location type description skills' 
      });

    // Transform the response to match frontend expectations
    const transformedApplication = {
      _id: populatedApplication._id,
      jobId: populatedApplication.jobId._id,
      userEmail: populatedApplication.userEmail,
      status: populatedApplication.status,
      coverLetter: populatedApplication.coverLetter,
      resume: populatedApplication.resume,
      createdAt: populatedApplication.createdAt,
      updatedAt: populatedApplication.updatedAt,
      job: populatedApplication.jobId
    };

    res.status(201).json(transformedApplication);
  } catch (error) {
    console.error('Error creating application:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already applied for this job'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      message: 'Error creating application',
      error: error.message 
    });
  }
});

// Update application status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: pending, accepted, rejected' 
      });
    }

    // Find and update the application
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update the status
    application.status = status;
    await application.save();

    // If application is accepted, send email notification
    if (status === 'accepted') {
      // Get job details
      const job = await Job.findById(application.jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Get user details
      const user = await User.findOne({ email: application.userEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send acceptance email
      await axios.post('http://localhost:5000/api/email/send-acceptance', {
        to: application.userEmail,
        jobTitle: job.title,
        companyName: job.company,
        candidateName: `${user.firstName} ${user.lastName}`,
        jobLocation: job.location,
        salary: `${job.salary.min} - ${job.salary.max} ${job.salary.type}`,
        startDate: new Date().toISOString().split('T')[0]
      });
    }

    // Populate job details before sending response
    const populatedApplication = await Application.findById(id)
      .populate({ 
        path: 'jobId', 
        model: 'Job', 
        select: 'title company location type description skills' 
      });

    res.json(populatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      message: 'Error updating application',
      error: error.message 
    });
  }
});

// Get accepted applications for a specific user
router.get('/accepted/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const applications = await Application.find({ 
      userEmail: email,
      status: 'accepted'
    })
    .populate({ 
      path: 'jobId', 
      model: 'Job', 
      select: 'title company location type description skills salary employerEmail' 
    });

    // Transform the response to match frontend expectations
    const transformedApplications = applications.map(app => ({
      _id: app._id,
      job: app.jobId,
      userEmail: app.userEmail,
      status: app.status,
      coverLetter: app.coverLetter,
      resume: app.resume,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching accepted applications:', error);
    res.status(500).json({ message: 'Error fetching accepted applications' });
  }
});

// Get accepted applications for a specific employer
router.get('/accepted/employer/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // First, get all jobs posted by this employer
    const jobs = await Job.find({ employerEmail: email });
    const jobIds = jobs.map(job => job._id);

    // Then, get all accepted applications for these jobs
    const applications = await Application.find({ 
      jobId: { $in: jobIds },
      status: 'accepted'
    })
    .populate({ 
      path: 'jobId', 
      model: 'Job', 
      select: 'title company location type description skills salary' 
    });

    // Transform the response to match frontend expectations
    const transformedApplications = applications.map(app => ({
      _id: app._id,
      job: app.jobId,
      userEmail: app.userEmail,
      status: app.status,
      coverLetter: app.coverLetter,
      resume: app.resume,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching accepted applications:', error);
    res.status(500).json({ message: 'Error fetching accepted applications' });
  }
});

// Get a single application by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application ID format' });
    }

    // Find the application and populate job details
    const application = await Application.findById(id)
      .populate({ 
        path: 'jobId', 
        model: 'Job', 
        select: 'title company location type description skills salary employerEmail' 
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Transform the response to match frontend expectations
    const transformedApplication = {
      _id: application._id,
      jobId: application.jobId._id,
      userEmail: application.userEmail,
      status: application.status,
      coverLetter: application.coverLetter,
      resume: application.resume,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      job: application.jobId
    };

    res.json(transformedApplication);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      message: 'Error fetching application',
      error: error.message 
    });
  }
});

module.exports = router; 