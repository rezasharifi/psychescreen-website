# PsycheScreen Website

This repository contains the frontend website for PsycheScreen - Mental Health Monitoring Solutions.

## Overview

The website provides:
- Landing page with service information
- Contact form with phone verification
- Dashboard for monitoring (sample)
- Responsive design

## Features

- **Phone Verification**: Integrated with Twilio SMS verification
- **Form Validation**: Client-side validation for all inputs
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Clean, professional design
- **Dashboard**: Sample monitoring dashboard

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome
- **Configuration**: YAML-based configuration system

## Quick Start

### Local Development

```bash
# Start local server
python3 -m http.server 8000

# Or use any static file server
# Navigate to http://localhost:8000
```

### Deployment

#### AWS Amplify (Recommended)

1. Connect this repository to AWS Amplify
2. Configure build settings (use provided `amplify.yml`)
3. Deploy automatically on git push

#### Manual Deployment

Upload files to any static hosting service:
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages

## Configuration

Update `config.yaml` with your API endpoints:

```yaml
api:
  base_url: "https://your-api-gateway-url/Prod/register"

twilio:
  verification_api_url: "https://your-api-gateway-url/Prod/send-verification"
```

## Phone Verification Flow

1. User fills out contact form
2. User enters phone number
3. System sends SMS verification code
4. User enters received code
5. Phone number verified
6. Form submission allowed

## API Integration

The website integrates with:
- **Main API**: Form submission endpoint
- **Verification API**: Phone verification endpoints

## File Structure

```
├── index.html              # Main website
├── script.js               # Frontend JavaScript
├── styles.css              # Website styling
├── config.js               # Configuration loader
├── config.yaml             # Application configuration
├── amplify.yml             # Amplify build configuration
└── dashboard/
    └── dash_sample.html    # Sample dashboard
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Features

1. Update HTML structure in `index.html`
2. Add styling in `styles.css`
3. Add functionality in `script.js`
4. Update configuration in `config.yaml` if needed

### Testing

Test the phone verification flow:
1. Use a real phone number for SMS testing
2. Verify form validation works
3. Test responsive design on mobile devices

## Deployment Notes

- Ensure CORS is configured on API endpoints
- Update API URLs in configuration for production
- Test phone verification flow after deployment
- Monitor form submissions and error rates

## Support

For issues or questions:
1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Test with different phone numbers
4. Check CORS configuration

