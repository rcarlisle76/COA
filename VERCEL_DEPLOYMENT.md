# Deploying to Vercel

This guide will help you deploy your COA Auditing website to Vercel with email functionality.

## Important Notes

**⚠️ Database Functionality:**
- Vercel does NOT support SQLite databases
- The contact database and admin panel (`contacts.html`) will NOT work on Vercel
- Only email notifications will work
- Contacts will be sent to your email but not saved in a database

**✅ What Works on Vercel:**
- Main website (all pages and styling)
- Contact form submission
- Email notifications to coabillings@gmail.com

**❌ What Doesn't Work on Vercel:**
- Saving contacts to database
- Viewing contacts at `/contacts.html`
- Exporting contacts to CSV

If you need the database functionality, consider using Railway.app or Render.com instead.

---

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

Make sure all your latest code is on GitHub:

```bash
git add .
git commit -m "Add Vercel configuration"
git push origin claude/create-medical-claims-site-011CUXisTk4iRRbkV4FmeAXr
```

### 2. Connect Vercel to Your Repository

1. Go to https://vercel.com/
2. Sign in (use your GitHub account)
3. Click "Add New Project"
4. Select "Import Git Repository"
5. Find and select your `COA` repository
6. Select branch: `claude/create-medical-claims-site-011CUXisTk4iRRbkV4FmeAXr`

### 3. Configure Environment Variables

**IMPORTANT:** Before deploying, add these environment variables in Vercel:

1. In the Vercel project setup, scroll to "Environment Variables"
2. Add the following variables:

| Name | Value | Description |
|------|-------|-------------|
| `EMAIL_SERVICE` | `gmail` | Email service provider |
| `EMAIL_USER` | `your-email@gmail.com` | Your Gmail address (the one sending emails) |
| `EMAIL_PASS` | `your-app-password` | Gmail App Password (NOT regular password) |
| `EMAIL_TO` | `coabillings@gmail.com` | Where contact forms are sent |

**Getting Gmail App Password:**

1. Enable 2-Factor Authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Name it "COA Website Vercel"
5. Click "Generate"
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
7. Use this password for `EMAIL_PASS` (remove spaces or keep them)

### 4. Deploy

1. Click "Deploy"
2. Wait for Vercel to build and deploy (2-3 minutes)
3. You'll get a URL like: `https://coa-xxx.vercel.app`

### 5. Add Your Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Click "Add"
4. Enter your custom domain (e.g., `coaauditing.com`)
5. Vercel will give you DNS configuration instructions
6. Update your domain's DNS settings:
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add the DNS records Vercel provides
   - Usually: Add a CNAME record pointing to `cname.vercel-dns.com`
7. Wait for DNS propagation (5 minutes to 48 hours)

### 6. Test Your Website

1. Visit your Vercel URL or custom domain
2. Try submitting the contact form
3. Check coabillings@gmail.com for the email notification

---

## Troubleshooting

### Email Not Sending

**Check Environment Variables:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all 4 variables are set correctly
3. Redeploy after changing variables (Deployments → ... → Redeploy)

**Check Gmail App Password:**
- Make sure you're using an App Password, NOT your regular Gmail password
- App passwords are 16 characters with spaces
- Make sure 2-Factor Authentication is enabled on Gmail

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Click on `/api/contact`
5. View logs for errors

### Form Shows "Failed to fetch"

This means the API endpoint isn't working:
- Check that `/api/contact.js` file exists
- Verify `vercel.json` is configured correctly
- Try redeploying

### 404 Error on Form Submission

- Make sure `vercel.json` includes the API routes
- Verify the form is posting to `/api/contact` (not `/api/contact.js`)
- Redeploy

---

## Maintenance

### Updating the Site

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel auto-deploys when you push to GitHub

### Checking Received Contacts

Since there's no database on Vercel, check your email inbox at coabillings@gmail.com for all contact form submissions.

---

## Limitations & Alternatives

### What You're Missing Without a Database:

- **No contact history** - Can't view past submissions
- **No CSV export** - Can't export for marketing
- **No admin panel** - No `/contacts.html` page
- **Only email storage** - Must manage contacts via email

### Better Alternatives:

If you need database functionality, consider:

1. **Railway.app** - Free, supports SQLite, works with your existing code
2. **Render.com** - Free tier, supports databases
3. **Vercel + Supabase** - Add Supabase database (requires code changes)
4. **Vercel + MongoDB Atlas** - Add MongoDB (requires code changes)

**With Railway or Render:**
- ✅ Everything works (database + email)
- ✅ No code changes needed
- ✅ Can still use your custom domain
- ✅ Same setup process

---

## Support

If you continue having issues:

1. Check Vercel function logs for errors
2. Verify environment variables are set
3. Test the contact form
4. Check email spam folder

For database functionality, strongly consider switching to Railway.app - it's just as easy to set up and everything will work without modifications.
