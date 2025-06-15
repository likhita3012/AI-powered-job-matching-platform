const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const emailRoutes = require('./routes/email');
require('dotenv').config();

// Import models
const Employer = require('./models/Employer');
const JobSeeker = require('./models/JobSeeker');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Import routes
const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const emailRouter = require('./routes/email');

const app = express();

// CORS Configuration - More permissive for development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both development ports
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ✅ Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/jobPortalDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// ✅ Register (Employer / Job Seeker)
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, role, companyName, jobTitle } = req.body;

  try {
    let existingUser = await Employer.findOne({ email }) || await JobSeeker.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (role === 'employer') {
      newUser = new Employer({ firstName, lastName, email, password: hashedPassword, companyName, role });
    } else if (role === 'jobseeker') {
      newUser = new JobSeeker({ firstName, lastName, email, password: hashedPassword, jobTitle, role });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await newUser.save();
    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Login (JWT Authentication)
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = role === 'employer' 
      ? await Employer.findOne({ email }) 
      : await JobSeeker.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret", // Use .env JWT_SECRET
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: 'Login successful', token, role: user.role, email: user.email });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// API Routes

// Upload Resume
app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Error uploading resume", error: error.message });
  }
});

// Get user profile by email
app.get("/api/profile/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Fetching profile for email:", email);

    // First check JobSeeker collection
    const jobSeeker = await JobSeeker.findOne({ email });
    console.log("JobSeeker found:", jobSeeker ? "Yes" : "No");

    // Then check User collection
    const user = await User.findOne({ email });
    console.log("User profile found:", user ? "Yes" : "No");

    if (!user) {
      if (!jobSeeker) {
        console.log("User not found in either collection");
        return res.status(404).json({ message: "User not found" });
      }
      console.log("User found in JobSeeker but no profile created");
      return res.status(404).json({ 
        message: "Profile not created yet",
        user: {
          email: jobSeeker.email,
          firstName: jobSeeker.firstName,
          lastName: jobSeeker.lastName
        }
      });
    }

    // If user has a resume, create a full URL for it
    if (user.resume) {
      user.resumeUrl = `http://localhost:5000/${user.resume}`;
    }

    console.log("Profile found successfully");
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Get resume file
app.get("/uploads/:filename", (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
      // Set the content type to PDF
      res.setHeader('Content-Type', 'application/pdf');
      // Set the content disposition to inline for viewing
      res.setHeader('Content-Disposition', 'inline; filename=' + req.params.filename);
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Resume not found" });
    }
  } catch (error) {
    console.error("Error serving resume:", error);
    res.status(500).json({ message: "Error serving resume" });
  }
});

// Download resume file
app.get("/download-resume/:filename", (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    console.log("Attempting to download file from:", filePath); // Debug log

    if (fs.existsSync(filePath)) {
      // Get the file stats
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        // Handle range request for streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'application/pdf',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // Handle direct download
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${req.params.filename}"`,
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
      }
    } else {
      console.log("File not found at path:", filePath); // Debug log
      res.status(404).json({ message: "Resume not found" });
    }
  } catch (error) {
    console.error("Error downloading resume:", error);
    res.status(500).json({ message: "Error downloading resume" });
  }
});

// Submit Profile
app.post("/api/submit-profile", async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      location, 
      skills, 
      education, 
      workExperience, 
      resume,
      extractedResumeText,
      isFresher
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // Process education data
    const processedEducation = Array.isArray(education) ? education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: new Date(edu.startDate),
      endDate: edu.isCurrentlyStudying ? null : new Date(edu.endDate),
      marks: edu.marks,
      grade: edu.grade,
      isCurrentlyStudying: edu.isCurrentlyStudying === true || edu.isCurrentlyStudying === "on"
    })) : [education];

    // Process work experience data
    let processedWorkExperience = [];
    if (!isFresher && Array.isArray(workExperience) && workExperience.length > 0) {
      processedWorkExperience = workExperience.map(exp => ({
        company: exp.company || 'Not specified',
        position: exp.position || 'Not specified',
        startDate: new Date(exp.startDate),
        endDate: exp.isCurrentlyWorking ? null : new Date(exp.endDate),
        isCurrentlyWorking: exp.isCurrentlyWorking === true || exp.isCurrentlyWorking === "on",
        description: exp.description || 'Not specified',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
        achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
        skills: Array.isArray(exp.skills) ? exp.skills : []
      }));
    }

    // Create new user profile
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      location,
      skills: Array.isArray(skills) ? skills : [skills],
      education: processedEducation,
      workExperience: processedWorkExperience,
      resume: resume || null,
      extractedResumeText: extractedResumeText || null,
      isFresher: isFresher || false
    });

    await newUser.save();
    res.status(201).json({ message: "Profile created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update profile endpoint
app.put("/api/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updatedData = req.body;

    // Find and update the user profile
    const updatedProfile = await User.findOneAndUpdate(
      { email },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Job Routes
app.post("/api/jobs", async (req, res) => {
  try {
    const jobData = req.body;
    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Error creating job posting" });
  }
});

// Get all jobs with filters
app.get("/api/jobs", async (req, res) => {
  try {
    const {
      search,
      location,
      employmentType,
      minSalary,
      maxSalary,
      minExperience,
      maxExperience,
      education,
      status = "active"
    } = req.query;

    let query = { status };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.location = new RegExp(location, "i");
    }

    // Employment type filter
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.min = { $gte: Number(minSalary) };
      if (maxSalary) query.salary.max = { $lte: Number(maxSalary) };
    }

    // Experience range filter
    if (minExperience || maxExperience) {
      query.experience = {};
      if (minExperience) query.experience.min = { $gte: Number(minExperience) };
      if (maxExperience) query.experience.max = { $lte: Number(maxExperience) };
    }

    // Education filter
    if (education) {
      query.education = education;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("applications", "status createdAt");

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// Get job by ID
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("applications", "status createdAt");
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Error fetching job" });
  }
});

// Update job
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Error updating job" });
  }
});

// Delete job
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Error deleting job" });
  }
});

// Get employer's jobs
app.get("/api/employer/jobs", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: "Employer email is required" });
    }

    const jobs = await Job.find({ employerEmail: email })
      .sort({ createdAt: -1 })
      .populate("applications", "status createdAt");

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching employer's jobs:", error);
    res.status(500).json({ message: "Error fetching employer's jobs" });
  }
});

// Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/users', usersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/email', emailRoutes); 

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
