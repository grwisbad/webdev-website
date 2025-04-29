# Chronexa

A simple, browser-based employee scheduling application with an intuitive interface. Chronexa helps managers organize employee shifts, track availability, and maintain a clear overview of the work schedule.

![Chronexa Logo](logo.png)

## Features

- **Admin Authentication**: Secure admin login to protect scheduling data
- **Dashboard Overview**: Quick view of upcoming shifts and scheduling alerts
- **Employee Management**: Add, edit, and remove employees with their contact details
- **Shift Scheduling**: Assign shifts to employees through an intuitive calendar interface
- **Availability Tracking**: Record and view employee availability by day and time period
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: All data is stored securely in the browser's local storage

## Technology Stack

- HTML5
- CSS3         
- Vanilla JavaScript
- LocalStorage API

## Setup Instructions

1. **Clone the repository or download the files**

   ```bash
   git clone https://github.com/your-username/chronexa.git
   cd chronexa
   ```

   Or simply download and extract the ZIP file.

2. **Verify file structure**

   Ensure you have these files in your project directory:
   - index.html
   - styles.css
   - script.js
   - logo.png

3. **Launch the application**

   Open the `index.html` file in a web browser:
   - Double-click the file in your file explorer
   - Or use a local development server:
     ```bash
     # Using Python (if installed)
     python -m http.server
     
     # Or using Node.js (if installed)
     npx serve
     ```

## Usage Guide

### Login

- **Username**: admin
- **Password**: password

### Navigation

Use the sidebar menu to navigate between different sections:
- 🏠 **Dashboard**: Overview of upcoming shifts
- 👥 **Employees**: Manage employee information
- 📅 **Shifts**: Schedule and assign shifts
- ⏰ **Availability**: View and edit employee availability
- ⚙️ **Settings**: Configure application preferences

### Employee Management

1. Click on the "Employees" tab in the sidebar
2. Click "Add Employee" to create a new employee
3. Fill in the employee details and availability
4. Use the "Edit" and "Delete" buttons to modify existing employees

### Shift Scheduling

1. Navigate to the "Shifts" tab
2. Click the "+" button on any day to add a new shift
3. Select an employee, set the start and end times
4. Click "Save" to assign the shift
5. Click on existing shifts to edit them

### Availability Management

1. Go to the "Availability" tab to view all employee availability
2. Availability is displayed as M (Morning), A (Afternoon), and E (Evening)
3. Edit availability through the employee edit form

## Deployment Instructions

### Basic Web Hosting

1. Upload all files (index.html, styles.css, script.js, logo.png) to your web hosting provider using FTP or their file upload interface
2. Ensure the file structure is maintained
3. Access your site through the provided URL

### GitHub Pages

1. Push your repository to GitHub
2. Go to repository settings
3. Navigate to "Pages" section
4. Select your main branch as the source
5. Save and wait for deployment

### Local Network Deployment

To share the app within a local network:

1. Set up a simple HTTP server on your computer
2. Share the local IP address with others on the same network

## Data Persistence

All data is stored in the browser's localStorage. This means:
- Data persists between sessions on the same browser
- Data is not shared between different devices or browsers
- Clearing browser data or localStorage will reset the application

## Customization

- Replace the logo.png file with your own logo (recommended size: 60px height)
- Edit the color scheme in styles.css by modifying the root variables
- Add additional features by extending script.js


