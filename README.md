# Medical Claims Auditing Website

A professional, responsive website for a medical insurance claims auditing business. This site showcases services, provides company information, and includes a contact form for potential clients.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design suitable for healthcare industry
- **Service Showcase**: Detailed presentation of claims auditing services
- **Contact Form**: Client-side validated contact form
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
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript for interactivity
└── README.md          # Documentation
```

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

### 4. Connect Contact Form to Backend

The current contact form is client-side only. To make it functional:

1. Set up a backend endpoint (e.g., using Node.js, PHP, or a service like Formspree)
2. Update the form submission in `script.js` (around line 23):
```javascript
// Send data to your backend
fetch('YOUR_BACKEND_URL', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    showSuccessMessage();
    this.reset();
})
.catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
});
```

## Deployment Options

### Option 1: GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select your branch and root folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify
1. Sign up at [Netlify](https://www.netlify.com)
2. Drag and drop your project folder
3. Your site will be deployed instantly with a custom URL

### Option 3: Traditional Web Hosting
1. Upload all files to your web hosting via FTP
2. Ensure `index.html` is in the root directory
3. Access your site via your domain

### Option 4: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- No external dependencies or frameworks

## Future Enhancements

Consider adding:
- Blog section for healthcare compliance news
- Client testimonials
- Case studies
- Resource library (whitepapers, guides)
- Live chat integration
- Analytics integration (Google Analytics)
- Email newsletter signup
- HIPAA compliance certification badges

## License

This website template is provided as-is for your business use.

## Support

For questions or assistance with customization, refer to standard HTML/CSS/JavaScript documentation or contact a web developer.
