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

// Calculate overall rating before saving
ratingSchema.pre('save', function(next) {
  // Calculate average of all category ratings
  this.rating = (this.punctuality + this.professionalism + this.quality + this.communication) / 4;
  next();
});

// Update user's average rating after saving
ratingSchema.post('save', async function() {
  const Rating = mongoose.model('Rating');
  const User = mongoose.model('User');
  
  // Calculate new average rating for the rated user
  const ratings = await Rating.find({ ratedUser: this.ratedUser });
  
  // Calculate overall average from all categories
  let totalRating = 0;
  ratings.forEach(r => {
    const categoryAvg = (r.punctuality + r.professionalism + r.quality + r.communication) / 4;
    totalRating += categoryAvg;
  });
  const avgRating = totalRating / ratings.length;
  
  await User.findByIdAndUpdate(this.ratedUser, {
    averageRating: avgRating,
    totalRatings: ratings.length
  });
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
