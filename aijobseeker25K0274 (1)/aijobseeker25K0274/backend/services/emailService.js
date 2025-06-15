const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'janakirampedireddi@gmail.com.com',
    pass: 'tbzd gldq pfhc hbdg'
  }
});

// Function to send acceptance email
const sendAcceptanceEmail = async (to, jobTitle, companyName, candidateName, jobLocation, salary, startDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Congratulations! Your Application for ${jobTitle} has been Accepted`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Congratulations ${candidateName}!</h2>
          <p>We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been accepted!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2c3e50;">Job Details:</h3>
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Location:</strong> ${jobLocation}</p>
            <p><strong>Salary:</strong> ${salary}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
          </div>

          <p>Next Steps:</p>
          <ol>
            <li>Please review the job details above</li>
            <li>We will contact you shortly with further instructions</li>
            <li>If you have any questions, please don't hesitate to reach out</li>
          </ol>

          <p>Best regards,<br>${companyName} HR Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Acceptance email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending acceptance email:', error);
    throw error;
  }
};

module.exports = {
  sendAcceptanceEmail
}; 