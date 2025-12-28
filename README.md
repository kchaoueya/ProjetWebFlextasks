# FlexTasks - Student Job Marketplace

A modern web application connecting students with local job opportunities. Students can find flexible work while clients get reliable help for their tasks.

![FlexTasks](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🎯 Features

### For Students
- 🔍 **Browse Tasks** - Find jobs in various categories (cleaning, tutoring, dog walking, etc.)
- 📱 **Apply Easily** - One-click application to tasks
- 👤 **View Client Profiles** - See client ratings and reviews before applying
- 💬 **Chat with Clients** - Discuss job details and payment after acceptance
- ⭐ **Rate Clients** - Provide feedback after completing tasks
- 📊 **Track Applications** - View all your applications and their status

### For Clients
- ✍️ **Post Tasks** - Create detailed job listings with all necessary information
- 📋 **Manage Applications** - Review student profiles and select the best candidate
- 👥 **View Student Profiles** - Check ratings and past performance
- 💬 **Chat with Students** - Communicate about job specifics and payment
- ⭐ **Rate Students** - Provide feedback after task completion
- 📈 **Track Tasks** - Monitor all your posted and completed tasks

### Core Features
- 🔐 **Google OAuth** - Easy sign-up and login with Google
- 🏠 **Professional UI** - Clean, modern interface with responsive design
- 💯 **Rating System** - 4-category ratings (Punctuality, Professionalism, Quality, Communication)
- 🗺️ **Detailed Location** - Full address, city, and ZIP code for each task
- 📅 **Scheduling** - Exact date and time selection
- ⏱️ **Duration Tracking** - Estimated task duration in hours
- 💰 **Payment Discussion** - Built-in chat for payment negotiation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console account (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RizZelo/ProjetWebFlextasks.git
   cd ProjetWebFlextasks
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Configure Google OAuth** (See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions)
   - Create Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add redirect URIs
   - Update .env files

## 📖 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions including Google OAuth
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Complete list of all features and changes

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 with React Router
- **Styling**: Inline styles (can be migrated to CSS modules)
- **State Management**: React Hooks and Context API
- **Authentication**: Google OAuth 2.0 + JWT

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js + Google OAuth
- **Session Management**: express-session

### Database Models
- **User** - Profile, ratings, authentication
- **Task** - Job postings with detailed information
- **Rating** - Category-based ratings (4 categories)
- **Message** - Chat messages between users

## 📱 User Flow

### Student Journey
1. Sign up/Login (Google or Email)
2. Browse available tasks by category
3. View client profiles and ratings
4. Apply to interesting tasks
5. Wait for client acceptance
6. Chat with client about details
7. Complete the task
8. Rate the client

### Client Journey
1. Sign up/Login (Google or Email)
2. Post a new task with all details
3. Review applications from students
4. View student profiles and ratings
5. Accept a student
6. Chat with student about specifics
7. Mark task as complete
8. Rate the student

## 🔐 Security

- Environment variables for sensitive data
- Password hashing with bcrypt
- JWT token authentication
- Secure Google OAuth integration
- Input validation on all forms
- XSS protection

## 🌟 Rating System

Each user can rate the other party in 4 categories:

1. **⏱️ Punctuality** - Timeliness and reliability
2. **👔 Professionalism** - Professional behavior and attitude
3. **✨ Quality** - Quality of work performed
4. **💬 Communication** - Communication effectiveness

Overall rating is automatically calculated as the average of all categories.

## 📦 Tech Stack

### Frontend Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "prop-types": "^15.8.1"
}
```

### Backend Dependencies
```json
{
  "express": "^5.1.0",
  "mongoose": "^7.x.x",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "express-session": "^1.18.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3"
}
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flextasks
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🚧 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Push notifications
- [ ] Profile picture upload
- [ ] Advanced search and filtering
- [ ] Location-based recommendations
- [ ] Task categories management
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **RizZelo** - Initial work and enhancements

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Google for OAuth services
- All contributors and users

## 📞 Support

For support, email support@flextasks.com or open an issue in the repository.

## 🔗 Links

- [GitHub Repository](https://github.com/RizZelo/ProjetWebFlextasks)
- [Setup Guide](SETUP_GUIDE.md)
- [Changes Summary](CHANGES_SUMMARY.md)

---

**Made with ❤️ for students and clients**
