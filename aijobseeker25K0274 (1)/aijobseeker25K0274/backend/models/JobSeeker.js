const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  jobTitle: String,
  role: { type: String, enum: ['employer', 'jobseeker'], default: 'jobseeker' },
});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);
