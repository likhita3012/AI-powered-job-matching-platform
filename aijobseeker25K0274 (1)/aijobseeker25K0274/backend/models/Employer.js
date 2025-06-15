const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  role: { type: String, enum: ['employer', 'jobseeker'], default: 'employer' },
});

module.exports = mongoose.model('Employer', employerSchema);
