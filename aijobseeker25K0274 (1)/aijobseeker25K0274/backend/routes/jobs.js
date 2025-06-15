const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all jobs for an employer
router.get('/employer/:email', async (req, res) => {
  try {
    const jobs = await Job.find({ employerEmail: req.params.email });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ 
      message: 'Error fetching job',
      error: error.message 
    });
  }
});

// Calculate skill match percentage
const calculateSkillMatch = (jobSkills, candidateSkills) => {
  if (!jobSkills || !candidateSkills) return 0;
  
  // Convert all skills to lowercase for case-insensitive comparison
  const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase().trim());
  const candidateSkillsLower = candidateSkills.map(skill => skill.toLowerCase().trim());
  
  // Count exact matches
  const matchedSkills = jobSkillsLower.filter(jobSkill => 
    candidateSkillsLower.some(candidateSkill => 
      candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)
    )
  );
  
  const matchPercentage = (matchedSkills.length / jobSkills.length) * 100;
  console.log('Skill Match Calculation:', {
    jobSkills,
    candidateSkills,
    matchedSkills,
    matchPercentage
  });
  
  return matchPercentage;
};

// Get suggested candidates based on job skills
router.get('/suggested/:email/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    // Get the specific job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find users with matching skills for this specific job
    const allCandidates = await User.find({
      skills: { $in: job.skills.map(skill => new RegExp(skill, 'i')) }
    });

    console.log('Found Candidates:', allCandidates.length);

    // For each candidate, calculate match percentage for this specific job
    const candidatesWithMatches = allCandidates.map(candidate => {
      const matchPercentage = calculateSkillMatch(job.skills, candidate.skills);
      
      return {
        ...candidate.toObject(),
        jobMatches: [{
          jobId: job._id,
          jobTitle: job.title,
          matchPercentage: matchPercentage
        }],
        bestMatch: {
          jobId: job._id,
          jobTitle: job.title,
          matchPercentage: matchPercentage
        },
        skillMatchPercentage: matchPercentage
      };
    });

    // Filter candidates with 70% or higher skill match
    const suggestedCandidates = candidatesWithMatches
      .filter(candidate => candidate.skillMatchPercentage >= 70)
      .sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);

    console.log('Suggested Candidates:', suggestedCandidates.length);
    
    res.json(suggestedCandidates);
  } catch (error) {
    console.error('Error in suggested candidates route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get suggested jobs for a jobseeker
router.get('/suggested/:email', async (req, res) => {
  try {
    // Get the jobseeker's profile
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all jobs
    const jobs = await Job.find();

    // Calculate match percentage for each job
    const jobsWithMatches = jobs.map(job => {
      const matchPercentage = calculateSkillMatch(job.skills, user.skills);
      
      return {
        ...job.toObject(),
        skillMatchPercentage: matchPercentage
      };
    });

    // Filter jobs with 70% or higher skill match
    const suggestedJobs = jobsWithMatches
      .filter(job => job.skillMatchPercentage >= 70)
      .sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);

    console.log('Suggested Jobs:', suggestedJobs.length);
    
    res.json(suggestedJobs);
  } catch (error) {
    console.error('Error in suggested jobs route:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 