# No-Code Platform Voting System

A simple, mobile-friendly website for voting on the best no-code platform. Features include real-time vote tracking, a live pie chart, and prevention of multiple votes from the same device.

## Features

- Modern, mobile-responsive design
- Real-time vote tracking with Chart.js
- Prevention of multiple votes using cookies
- Airtable integration for data storage
- Automatic chart updates every 30 seconds

## Setup Instructions

1. Create an Airtable account and set up a new base with the following structure:
   - Table name: `Votes`
   - Fields:
     - `platform` (Single line text)
     - `timestamp` (Date & Time)

2. Get your Airtable API key and base ID:
   - Go to [Airtable API Documentation](https://airtable.com/api)
   - Select your base
   - Copy the API key and base ID

3. Update the JavaScript file:
   - Open `script.js`
   - Replace `YOUR_AIRTABLE_API_KEY` with your actual API key
   - Replace `YOUR_AIRTABLE_BASE_ID` with your actual base ID

4. Host the files on a web server:
   - The files can be hosted on any static file hosting service
   - For local testing, you can use a simple HTTP server

## File Structure

- `index.html` - Main HTML file with the voting interface
- `styles.css` - CSS styles for the application
- `script.js` - JavaScript code for voting logic and chart updates

## Dependencies

- Chart.js (loaded via CDN)
- Airtable API

## Browser Support

The application works on all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- CSS Custom Properties (variables)

## Security Notes

- The current implementation uses client-side cookies to prevent multiple votes
- For production use, consider implementing server-side validation
- API keys should be kept secure and not exposed in client-side code 