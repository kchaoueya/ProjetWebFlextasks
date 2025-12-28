import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  // Rating categories
  punctuality: {
    type: Number,
    required: [true, 'Please rate punctuality'],
    min: 1,
    max: 5
  },
  professionalism: {
    type: Number,
    required: [true, 'Please rate professionalism'],
    min: 1,
    max: 5
  },
  quality: {
    type: Number,
    required: [true, 'Please rate quality of work'],
    min: 1,
    max: 5
  },
  communication: {
    type: Number,
    required: [true, 'Please rate communication'],
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Ensure one rating per user per task
ratingSchema.index({ task: 1, ratedBy: 1 }, { unique: true });
// Index for user profile queries
ratingSchema.index({ ratedUser: 1 });

// Helper function to calculate rating from categories
const calculateOverallRating = (punctuality, professionalism, quality, communication) => {
  return (punctuality + professionalism + quality + communication) / 4;
};

// Calculate overall rating before saving
ratingSchema.pre('save', function(next) {
  try {
    // Calculate average of all category ratings
    this.rating = calculateOverallRating(this.punctuality, this.professionalism, this.quality, this.communication);
    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    } else {
      throw error;
    }
  }
});

// Update user's average rating after saving
// Disabled for now - causing issues with seeding
// ratingSchema.post('save', async function() {
//   try {
//     const Rating = mongoose.model('Rating');
//     const User = mongoose.model('User');
//     
//     // Calculate new average rating for the rated user
//     const ratings = await Rating.find({ ratedUser: this.ratedUser });
//     
//     // Calculate overall average from all categories
//     let totalRating = 0;
//     ratings.forEach(r => {
//       const categoryAvg = calculateOverallRating(r.punctuality, r.professionalism, r.quality, r.communication);
//       totalRating += categoryAvg;
//     });
//     const avgRating = totalRating / ratings.length;
//     
//     await User.findByIdAndUpdate(this.ratedUser, {
//       averageRating: avgRating,
//       totalRatings: ratings.length
//     });
//   } catch (error) {
//     console.error('Error updating user rating:', error);
//   }
// });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
