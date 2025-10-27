const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Email configuration
// You can set these via environment variables or directly in the code
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || 'gmail', // 'gmail', 'outlook', etc.
  user: process.env.EMAIL_USER || '', // Your email address
  pass: process.env.EMAIL_PASS || '', // Your email password or app password
  to: process.env.EMAIL_TO || 'coabilling@gmail.com' // Where to send notifications
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
  console.log('Email notifications enabled');
} else {
  console.log('Email notifications disabled - configure EMAIL_USER and EMAIL_PASS to enable');
}

// Initialize SQLite database
const db = new Database('contacts.db');

// Create contacts table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Function to send email notification
async function sendEmailNotification(contactData) {
  if (!transporter) {
    console.log('Email not configured, skipping notification');
    return false;
  }

  try {
    const mailOptions = {
      from: EMAIL_CONFIG.user,
      to: EMAIL_CONFIG.to,
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #666;">Name:</strong> ${contactData.name}</p>
            <p style="margin: 10px 0;"><strong style="color: #666;">Email:</strong>
              <a href="mailto:${contactData.email}" style="color: #0066cc;">${contactData.email}</a>
            </p>
            <p style="margin: 10px 0;"><strong style="color: #666;">Organization:</strong> ${contactData.organization || 'Not provided'}</p>
          </div>

          <div style="margin: 20px 0;">
            <strong style="color: #666;">Message:</strong>
            <p style="background-color: #ffffff; padding: 15px; border-left: 4px solid #0066cc; margin: 10px 0;">
              ${contactData.message}
            </p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
            <p>Submitted: ${new Date().toLocaleString()}</p>
            <p>Contact ID: ${contactData.id || 'N/A'}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent for contact: ${contactData.email}`);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

// API endpoint to submit contact form
app.post('/api/contact', async (req, res) => {
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

    // Insert contact into database
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, organization, message)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, organization || '', message);

    // Send email notification
    const contactData = {
      id: result.lastInsertRowid,
      name,
      email,
      organization: organization || '',
      message
    };

    // Send email asynchronously (don't wait for it to complete)
    sendEmailNotification(contactData).catch(err => {
      console.error('Failed to send email notification:', err);
    });

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      id: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your message. Please try again.'
    });
  }
});

// API endpoint to get all contacts (for marketing/admin purposes)
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts.'
    });
  }
});

// API endpoint to get a single contact by ID
app.get('/api/contacts/:id', (req, res) => {
  try {
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found.'
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact.'
    });
  }
});

// API endpoint to export contacts as CSV
app.get('/api/contacts/export/csv', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();

    // Create CSV header
    let csv = 'ID,Name,Email,Organization,Message,Created At\n';

    // Add contact data
    contacts.forEach(contact => {
      csv += `${contact.id},"${contact.name}","${contact.email}","${contact.organization || ''}","${contact.message.replace(/"/g, '""')}","${contact.created_at}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting contacts.'
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Contact database: contacts.db`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('\nDatabase connection closed.');
  process.exit(0);
});
