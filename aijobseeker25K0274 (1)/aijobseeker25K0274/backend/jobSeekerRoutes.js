const express = require("express");
const router = express.Router();
const User = require("./models/User");

// Route to create a new Job Seeker profile
router.post("/create", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, location } = req.body;

    const newJobSeeker = new JobSeeker({
      firstName,
      lastName,
      email,
      phoneNumber,
      location
    });

    await newJobSeeker.save();
    res.status(201).json({ message: "Profile created successfully", newJobSeeker });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Error creating profile" });
  }
});

// Route to add skills
router.put("/add-skills/:id", async (req, res) => {
  try {
    const { skills } = req.body;
    const jobSeeker = await JobSeeker.findById(req.params.id);

    if (!jobSeeker) {
      return res.status(404).json({ message: "Profile not found" });
    }

    jobSeeker.skills = skills;
    await jobSeeker.save();
    res.status(200).json({ message: "Skills added successfully", jobSeeker });
  } catch (error) {
    console.error("Error adding skills:", error);
    res.status(500).json({ message: "Error adding skills" });
  }
});

// Route to add education
router.put("/add-education/:id", async (req, res) => {
  try {
    const { degree, school, year } = req.body;
    const jobSeeker = await JobSeeker.findById(req.params.id);

    if (!jobSeeker) {
      return res.status(404).json({ message: "Profile not found" });
    }

    jobSeeker.education.push({ degree, school, year });
    await jobSeeker.save();
    res.status(200).json({ message: "Education added successfully", jobSeeker });
  } catch (error) {
    console.error("Error adding education:", error);
    res.status(500).json({ message: "Error adding education" });
  }
});

// Route to add work experience
router.put("/add-work-experience/:id", async (req, res) => {
  try {
    const { company, title, years, description } = req.body;
    const jobSeeker = await JobSeeker.findById(req.params.id);

    if (!jobSeeker) {
      return res.status(404).json({ message: "Profile not found" });
    }

    jobSeeker.workExperience.push({ company, title, years, description });
    await jobSeeker.save();
    res.status(200).json({ message: "Work experience added successfully", jobSeeker });
  } catch (error) {
    console.error("Error adding work experience:", error);
    res.status(500).json({ message: "Error adding work experience" });
  }
});

// Route to upload resume (Assuming you use Multer for file uploads)
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.put("/upload-resume/:id", upload.single("resume"), async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id);

    if (!jobSeeker) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Store the resume file path
    jobSeeker.resume = req.file.path; // Storing the file path in the resume field
    await jobSeeker.save();
    res.status(200).json({ message: "Resume uploaded successfully", jobSeeker });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Error uploading resume" });
  }
});

module.exports = router;
