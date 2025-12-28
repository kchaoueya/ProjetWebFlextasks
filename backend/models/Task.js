import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a task description'],
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['cleaning', 'dog-walking', 'tutoring', 'delivery', 'gardening', 'moving', 'handyman', 'other']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide a location address']
    },
    city: String,
    zipCode: String
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedDuration: {
    type: Number, // in hours
    min: 0
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide a scheduled date']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Please provide a scheduled time']
  },
  completedDate: {
    type: Date
  },
  images: [{
    type: String
  }],
  applicants: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    message: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ client: 1, status: 1 });
taskSchema.index({ student: 1, status: 1 });
taskSchema.index({ category: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
