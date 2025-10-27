# Medical Claims Auditing Website

A professional, responsive website for a medical insurance claims auditing business with an integrated contact management system and database for marketing purposes.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design suitable for healthcare industry
- **Service Showcase**: Detailed presentation of claims auditing services
- **Contact Form with Database**: Fully functional contact form that saves submissions to a database
- **Email Notifications**: Automatic email alerts sent to coabilling@gmail.com for each new contact
- **Contact Management System**: Admin page to view, search, and export all contact submissions
- **CSV Export**: Export contacts for use in marketing campaigns and CRM systems
- **Smooth Navigation**: Smooth scrolling between sections
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Pages and Sections

### Home (Hero Section)
- Eye-catching introduction to the business
- Clear value proposition
- Call-to-action button

### Services
- Claims Review & Audit
- Compliance Assessment
- Revenue Recovery
- Denial Management
- Fraud Detection
- Performance Analytics

### Benefits
- Expert Team
- Proven Results
- Technology-Driven
- Confidential & Secure

### About
- Company background and mission
- Professional credentials

### Contact
- Contact information
- Interactive contact form
- Business hours

## File Structure

```
.
├── index.html          # Main website HTML file
├── contacts.html       # Admin page to view saved contacts
├── styles.css          # CSS styles and responsive design
├── script.js           # Frontend JavaScript for interactivity
├── server.js           # Backend Node.js server with Express
├── package.json        # Node.js dependencies
├── .gitignore          # Git ignore file
├── contacts.db         # SQLite database (auto-created)
└── README.md           # Documentation
```

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the website**:
   - Main website: `http://localhost:3000`
   - Contact list (admin): `http://localhost:3000/contacts.html`

The database (`contacts.db`) will be created automatically on first run.

## Email Notifications Setup

The contact form will save submissions to the database AND send email notifications to **coabilling@gmail.com**.

### Configure Email (Required for Notifications)

1. **Copy the environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your email credentials:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_TO=coabilling@gmail.com
   ```

### Gmail Setup (Recommended)

If using Gmail, you **must** use an App Password (regular password won't work):

1. **Enable 2-Factor Authentication** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "COA Website"
   - Click "Generate"
   - Copy the 16-character password

3. **Add to `.env` file**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop  # 16-character app password
   EMAIL_TO=coabilling@gmail.com
   ```

### Other Email Services

You can use other email providers by changing `EMAIL_SERVICE`:

**Outlook/Hotmail:**
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

**Yahoo:**
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password  # Yahoo also requires app passwords
```

**Custom SMTP:**
For other email providers, you can configure custom SMTP settings in `server.js`.

### Testing Email

After configuration:

1. Restart the server: `npm start`
2. You should see: "Email notifications enabled"
3. Submit a test contact form on your website
4. Check coabilling@gmail.com for the notification email

**Note:** If email credentials are not configured, the system will still save contacts to the database but won't send email notifications.

## Customization Guide

### 1. Update Business Information

**Company Name**: Edit the following in `index.html`:
```html
<h1>COA Auditing</h1>  <!-- Line 15 -->
```

**Contact Information**: Update in the Contact section (lines 122-124):
```html
<p><strong>Email:</strong> coabilling@gmail.com</p>
<p><strong>Phone:</strong> 214-901-1965</p>
<p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM EST</p>
```

### 2. Customize Colors

Edit the CSS variables in `styles.css` (lines 11-17):
```css
:root {
    --primary-color: #0066cc;      /* Main brand color */
    --secondary-color: #004a99;    /* Secondary brand color */
    --accent-color: #00a8e8;       /* Accent color */
    --text-dark: #333333;          /* Dark text */
    --text-light: #666666;         /* Light text */
}
```

### 3. Add Your Logo

Replace the text logo in `index.html` (line 16) with an image:
```html
<img src="logo.png" alt="Company Logo" class="logo">
```

### 4. Configure Server Port (Optional)

By default, the server runs on port 3000. To change this, set the PORT environment variable:

```bash
PORT=8080 npm start
```

Or create a `.env` file:
```
PORT=8080
```

## Contact Management

### Accessing the Contact List

Navigate to `http://localhost:3000/contacts.html` to view all submitted contacts.

**Features:**
- View all contact submissions in a sortable table
- Search contacts by name, email, organization, or message
- Click on any message to view full contact details
- Export all contacts as CSV for use in marketing tools
- Real-time statistics showing total contacts

### API Endpoints

The backend provides the following API endpoints:

#### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "organization": "ABC Healthcare",
  "message": "I need help with claims auditing"
}
```

#### Get All Contacts
```
GET /api/contacts
```

#### Get Single Contact
```
GET /api/contacts/:id
```

#### Export Contacts as CSV
```
GET /api/contacts/export/csv
```

### Database Schema

The SQLite database has a `contacts` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| name | TEXT | Contact's name (required) |
| email | TEXT | Contact's email (required) |
| organization | TEXT | Contact's organization (optional) |
| message | TEXT | Contact's message (required) |
| created_at | DATETIME | Timestamp of submission (auto) |

## Deployment Options

### Option 1: VPS or Cloud Server (Recommended)

Since this site now has a backend, you'll need a server that supports Node.js:

**Popular options:**
- DigitalOcean Droplet
- AWS EC2
- Google Cloud Compute Engine
- Linode
- Heroku (with persistent database add-on)

**Deployment steps:**
1. Push your code to a Git repository
2. SSH into your server
3. Clone the repository
4. Install Node.js and npm
5. Run `npm install`
6. Use a process manager like PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "coa-website"
   pm2 save
   pm2 startup
   ```
7. Set up a reverse proxy with Nginx or Apache
8. Configure SSL with Let's Encrypt

### Option 2: Platform as a Service (PaaS)

**Heroku:**
1. Install Heroku CLI
2. Create a new Heroku app: `heroku create`
3. Push to Heroku: `git push heroku main`
4. Your app will be live with a Heroku URL

**Railway.app:**
1. Connect your GitHub repository
2. Railway will auto-detect Node.js and deploy
3. Database persists automatically

**Render:**
1. Connect your GitHub repository
2. Configure as a Node.js web service
3. Deploy with one click

### Option 3: Static Site + Serverless Functions

If you prefer, you can split the frontend and backend:
- Deploy HTML/CSS/JS to Netlify or Vercel
- Use serverless functions for the API
- Use a managed database service

### Important Notes for Production

1. **Secure the admin page**: Add authentication to `/contacts.html`
2. **HTTPS**: Always use SSL/TLS in production
3. **Database backups**: Regularly backup `contacts.db`
4. **Environment variables**: Never commit sensitive data
5. **Rate limiting**: Add rate limiting to prevent spam
6. **Email notifications**: Consider adding email notifications for new contacts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

**Frontend:**
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js (web server framework)
- better-sqlite3 (SQLite database)
- Nodemailer (email notifications)
- CORS (cross-origin resource sharing)

## Future Enhancements

Consider adding:
- **Authentication**: Password protect the contacts admin page
- **Email notifications**: Get notified when someone submits a contact form
- **Email marketing integration**: Sync contacts with MailChimp, SendGrid, etc.
- **Advanced filtering**: Filter contacts by date range, organization, etc.
- **Tags/categories**: Tag contacts for better organization
- **Follow-up tracking**: Mark contacts as contacted, qualified, etc.
- **Blog section**: Healthcare compliance news and updates
- **Client testimonials**: Showcase success stories
- **Case studies**: Detailed examples of your work
- **Resource library**: Whitepapers and guides
- **Live chat integration**: Real-time visitor support
- **Analytics integration**: Google Analytics for visitor tracking
- **HIPAA compliance badges**: Build trust with certifications

## Security Considerations

**IMPORTANT**: The contact list page (`contacts.html`) is currently publicly accessible. For production use, you should:

1. **Add authentication**: Implement login/password protection
2. **Use environment variables**: Store sensitive configuration
3. **Add rate limiting**: Prevent spam submissions
4. **Validate and sanitize**: All user inputs are validated, but consider additional security measures
5. **Regular backups**: Set up automated database backups
6. **HTTPS only**: Always use SSL certificates in production
7. **Keep dependencies updated**: Run `npm audit` regularly

## Backup and Maintenance

### Backup the Database

The database file is `contacts.db`. To back it up:

```bash
# Manual backup
cp contacts.db contacts.backup.db

# Scheduled backup (Linux/Mac with cron)
# Add to crontab: 0 2 * * * cp /path/to/contacts.db /path/to/backups/contacts-$(date +\%Y\%m\%d).db
```

### View Database Directly

You can use any SQLite viewer or the command line:

```bash
# Install sqlite3 if not already installed
sqlite3 contacts.db

# View all contacts
SELECT * FROM contacts;

# Count contacts
SELECT COUNT(*) FROM contacts;

# Recent contacts
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;
```

## License

This website template is provided as-is for your business use.

## Support

For questions or assistance with customization, refer to standard HTML/CSS/JavaScript documentation or contact a web developer.
