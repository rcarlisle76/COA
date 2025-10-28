const nodemailer = require('nodemailer');

// Email configuration from environment variables
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  to: process.env.EMAIL_TO || 'coabillings@gmail.com'
};

// Create email transporter
let transporter = null;
if (EMAIL_CONFIG.user && EMAIL_CONFIG.pass) {
  transporter = nodemailer.createTransport({
    service: EMAIL_CONFIG.service,
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.pass
    }
  });
}

// Serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { name, email, organization, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Send email notification
    if (transporter) {
      try {
        const mailOptions = {
          from: EMAIL_CONFIG.user,
          to: EMAIL_CONFIG.to,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong style="color: #666;">Name:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong style="color: #666;">Email:</strong>
                  <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
                </p>
                <p style="margin: 10px 0;"><strong style="color: #666;">Organization:</strong> ${organization || 'Not provided'}</p>
              </div>

              <div style="margin: 20px 0;">
                <strong style="color: #666;">Message:</strong>
                <p style="background-color: #ffffff; padding: 15px; border-left: 4px solid #0066cc; margin: 10px 0;">
                  ${message}
                </p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
                <p>Submitted: ${new Date().toLocaleString()}</p>
                <p>From: COA Auditing Website</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
          success: true,
          message: 'Thank you for your message! We will get back to you within 24 hours.'
        });

      } catch (emailError) {
        console.error('Error sending email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send email notification. Please try again or contact us directly.'
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: 'Email is not configured on the server.'
      });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your message. Please try again.'
    });
  }
};
