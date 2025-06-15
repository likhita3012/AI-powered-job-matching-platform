const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["per_year", "per_month", "per_hour"],
      default: "per_year"
    }
  },
  employmentType: {
    type: String,
    enum: ["full_time", "part_time", "contract", "internship"],
    required: true
  },
  experience: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  education: {
    type: String,
    enum: ["high_school", "diploma", "bachelors", "masters", "phd", ""],
    default: ""
  },
  skills: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  applicationDeadline: {
    type: Date,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    required: true,
    trim: true
  },
  employerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["active", "closed", "draft"],
    default: "active"
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application"
  }]
});

// Index for search functionality
jobSchema.index({
  title: "text",
  description: "text",
  skills: "text"
});

// Index for filtering
jobSchema.index({
  location: 1,
  employmentType: 1,
  "salary.min": 1,
  "salary.max": 1,
  "experience.min": 1,
  "experience.max": 1,
  education: 1,
  status: 1
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job; 