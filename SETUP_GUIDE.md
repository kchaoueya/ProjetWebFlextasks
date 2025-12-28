# FlexTasks - Setup Guide

## Overview
FlexTasks is a platform that connects students with local job opportunities, allowing clients to post tasks and students to apply and earn money.

## Features Implemented

### 1. Footer on Home Page ✅
- Added a comprehensive footer with links to various sections
- Displays company information and social media links

### 2. Google OAuth Authentication ✅
- Users can sign up and log in using their Google accounts
- Integrated with Passport.js for secure authentication
- Alternative to traditional email/password login

### 3. Enhanced Task Posting ✅
- Detailed location fields (address, city, ZIP code)
- Exact date and time selection
- Duration field (in hours)
- Budget/payment field
- All fields are validated and required

### 4. Client Profiles & Ratings ✅
- View client profiles with their rating history
- Display average rating from previous students
- Show breakdown by rating categories:
  - Punctuality
  - Professionalism
  - Quality of Work
  - Communication

### 5. Application System ✅
- Students can apply to tasks
- Clients can view all applicants
- Clients can see student profiles and ratings before accepting
- One-click acceptance of applications

### 6. Messaging System ✅
- Real-time chat between clients and accepted students
- Discuss payment, work details, and other specifics
- Payment discussion reminders in chat interface

### 7. Rating System ✅
- After task completion, both parties can rate each other
- Four rating categories with 1-5 star ratings:
  - Punctuality
  - Professionalism
  - Quality
  - Communication
- Optional text comments
- Automatic calculation of overall rating

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Console account (for OAuth)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your values:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/flextasks
     JWT_SECRET=your-secret-key-change-this-in-production
     SESSION_SECRET=your-session-secret-change-this-in-production
     GOOGLE_CLIENT_ID=your-google-client-id-here
     GOOGLE_CLIENT_SECRET=your-google-client-secret-here
     FRONTEND_URL=http://localhost:5173
     ```

4. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Configure the OAuth consent screen
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
     - Add production URL when deploying
   - Copy the Client ID and Client Secret to your `.env` file

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:5173`

### Database Setup

The application uses MongoDB. You can either:

1. **Use local MongoDB:**
   - Install MongoDB on your machine
   - Start MongoDB service
   - The default connection string is `mongodb://localhost:27017/flextasks`

2. **Use MongoDB Atlas (Cloud):**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env` file

## Usage Flow

### For Clients:
1. Sign up/Login (via email or Google)
2. Post a new task with all required details
3. Review student applications
4. View student profiles and ratings
5. Accept an application
6. Chat with the accepted student
7. Mark task as complete
8. Rate the student

### For Students:
1. Sign up/Login (via email or Google)
2. Browse available tasks
3. View client profiles and ratings
4. Apply to tasks
5. Wait for acceptance
6. Chat with client once accepted
7. Complete the task
8. Rate the client

## Tech Stack

### Frontend:
- React 19
- React Router for navigation
- Local storage for data persistence (demo mode)
- Inline styles (can be migrated to CSS modules)

### Backend:
- Node.js with Express
- MongoDB with Mongoose
- Passport.js for authentication
- Google OAuth 2.0
- JWT for session management

## Important Notes

1. **Google OAuth Setup:**
   - Make sure to add the correct redirect URIs in Google Cloud Console
   - Keep your Client ID and Secret secure
   - Never commit `.env` file to version control

2. **Security:**
   - Change default JWT and session secrets in production
   - Use HTTPS in production
   - Implement rate limiting for API endpoints

3. **Database:**
   - The models are ready for MongoDB integration
   - Currently using localStorage for demo purposes
   - Switch to actual API calls when backend is fully connected

4. **Future Enhancements:**
   - Payment integration (Stripe, PayPal)
   - Email notifications
   - Push notifications
   - Profile picture upload
   - Task search and filtering
   - Location-based task recommendations

## Troubleshooting

### Google OAuth not working:
- Verify Client ID and Secret are correct
- Check redirect URIs match exactly
- Ensure Google+ API is enabled
- Clear browser cookies and try again

### Database connection issues:
- Verify MongoDB is running
- Check connection string format
- Ensure network access is allowed (for MongoDB Atlas)

### Port already in use:
- Change the PORT in `.env` file
- Kill the process using the port:
  ```bash
  # On Unix/Mac
  lsof -ti:5000 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
