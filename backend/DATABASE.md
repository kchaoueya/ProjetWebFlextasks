# FlexTasks Database Documentation

## Database Structure

The FlexTasks application uses MongoDB with the following collections:

### 1. Users Collection
Stores both clients and students with role-based fields.

**Fields:**
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: Either "client" or "student"
- `phone`: Contact number
- `bio`: User description
- `profileImage`: Profile picture URL
- `averageRating`: Calculated average rating (0-5)
- `totalRatings`: Number of ratings received
- `isActive`: Account status
- `isVerified`: Email verification status

**Student-specific fields:**
- `skills`: Array of skills
- `hourlyRate`: Hourly rate for services
- `availability`: Schedule availability

### 2. Tasks Collection
Stores all tasks posted by clients.

**Fields:**
- `title`: Task title
- `description`: Detailed description
- `category`: Type of task (cleaning, dog-walking, tutoring, etc.)
- `client`: Reference to User (client)
- `student`: Reference to User (assigned student)
- `status`: open, assigned, in-progress, completed, cancelled
- `location`: Address, city, zipCode
- `budget`: Task budget
- `estimatedDuration`: Time estimate in hours
- `scheduledDate`: When task is scheduled
- `completedDate`: When task was completed
- `images`: Array of image URLs
- `applicants`: Array of students who applied

### 3. Messages Collection
Stores conversations between clients and students.

**Fields:**
- `task`: Reference to Task
- `sender`: Reference to User (sender)
- `receiver`: Reference to User (receiver)
- `content`: Message text
- `isRead`: Read status
- `readAt`: Timestamp when read

### 4. Ratings Collection
Stores ratings and reviews.

**Fields:**
- `task`: Reference to Task
- `ratedUser`: User being rated
- `ratedBy`: User giving the rating
- `rating`: Overall rating (1-5)
- `comment`: Review text
- `punctuality`: Rating for punctuality (1-5)
- `quality`: Rating for work quality (1-5)
- `communication`: Rating for communication (1-5)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile/:id` - Get user profile

### Tasks (`/api/tasks`)
- `POST /` - Create task (client only)
- `GET /` - Get all tasks (with filters)
- `GET /:id` - Get single task
- `POST /:id/apply` - Apply for task (student only)
- `PUT /:id/assign` - Assign task to student (client only)
- `PUT /:id/status` - Update task status

### Messages (`/api/messages`)
- `POST /` - Send message
- `GET /task/:taskId` - Get messages for a task
- `PUT /:id/read` - Mark message as read

### Ratings (`/api/ratings`)
- `POST /` - Create rating
- `GET /user/:userId` - Get ratings for a user
- `GET /task/:taskId` - Get ratings for a task

## Environment Variables

Add these to your `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/FlexTasks
JWT_SECRET=your-secret-key-change-this-in-production
```

## Starting the Server

1. Make sure MongoDB is running
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

The API will be available at `http://localhost:5000`
