const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  phoneNumber: { type: String, required: true },
  location: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      field: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      marks: { type: String, required: true },
      grade: { type: String, required: true },
      isCurrentlyStudying: { type: Boolean, default: false }
    }
  ],
  experience: [{
    title: String,
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  workExperience: [
    {
      company: { 
        type: String,
        required: function() { return !this.isFresher; }
      },
      position: { 
        type: String,
        required: function() { return !this.isFresher; }
      },
      startDate: { 
        type: Date,
        required: function() { return !this.isFresher; }
      },
      endDate: { 
        type: Date
      },
      isCurrentlyWorking: { 
        type: Boolean, 
        default: false 
      },
      description: { 
        type: String,
        required: function() { return !this.isFresher; }
      },
      responsibilities: [{ 
        type: String 
      }],
      achievements: [{ 
        type: String 
      }],
      skills: [{ 
        type: String 
      }]
    }
  ],
  resume: {
    type: String
  },
  extractedResumeText: {
    type: String,
    trim: true
  },
  // Employer specific fields
  companyName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  industry: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    trim: true
  },
  foundedYear: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
