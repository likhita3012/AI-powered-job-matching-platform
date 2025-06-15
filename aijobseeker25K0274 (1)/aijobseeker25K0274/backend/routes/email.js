const express = require('express');
const router = express.Router();
const { sendAcceptanceEmail } = require('../services/emailService');

// Send acceptance email
router.post('/send-acceptance', async (req, res) => {
  try {
    const { to, jobTitle, companyName, candidateName, jobLocation, salary, startDate } = req.body;

    // Validate required fields
    if (!to || !jobTitle || !companyName || !candidateName || !jobLocation || !salary || !startDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await sendAcceptanceEmail(
      to,
      jobTitle,
      companyName,
      candidateName,
      jobLocation,
      salary,
      startDate
    );

    res.json({ message: 'Acceptance email sent successfully' });
  } catch (error) {
    console.error('Error sending acceptance email:', error);
    res.status(500).json({ 
      message: 'Error sending acceptance email',
      error: error.message 
    });
  }
});

module.exports = router; 