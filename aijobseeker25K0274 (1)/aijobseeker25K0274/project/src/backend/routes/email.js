const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Route to send job acceptance email
router.post('/send-acceptance', async (req, res) => {
  try {
    const { to, jobTitle, companyName, candidateName, jobLocation, salary, startDate } = req.body;

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `🎉 Congratulations! Your Application for ${jobTitle} has been Accepted`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 10px;">🎉 Congratulations ${candidateName}! 🎉</h1>
            <p style="color: #4b5563; font-size: 18px;">Your application has been accepted!</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Job Details</h2>
            <p style="margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
            <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${jobLocation}</p>
            ${salary ? `<p style="margin: 5px 0;"><strong>Salary:</strong> ${salary}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Next Steps</h2>
            <ol style="margin-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 10px;">Our HR team will contact you within 24 hours to discuss the onboarding process.</li>
              <li style="margin-bottom: 10px;">Please prepare the following documents:
                <ul style="margin-left: 20px; margin-top: 5px;">
                  <li>Government-issued ID</li>
                  <li>Educational certificates</li>
                  <li>Previous employment documents</li>
                  <li>Bank account details for salary processing</li>
                </ul>
              </li>
              <li style="margin-bottom: 10px;">Complete any pre-employment paperwork that will be sent to you.</li>
            </ol>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Important Information</h2>
            <p style="color: #4b5563; margin-bottom: 10px;">Please ensure all your contact information is up to date. If you need to make any changes, please contact our HR department immediately.</p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>If you have any questions, please don't hesitate to contact our HR department.</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>${companyName} HR Team</strong></p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

module.exports = router; 