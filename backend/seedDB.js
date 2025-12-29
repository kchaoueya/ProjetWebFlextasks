import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Task from './models/Task.js';
import Message from './models/Message.js';
import Rating from './models/Rating.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect( 'mongodb://localhost:27017/FlexTasks');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Message.deleteMany({});
    await Rating.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const client3 = await User.create({
      name: 'eya',
      email: 'eya@example.com',
      password: 'password123',
      role: 'client',
      phone: '+1234565555',
      bio: 'Looking for help with household tasks',
      profileImage: 'https://via.placeholder.com/150',
      isActive: true,
      isVerified: true
    });
    console.log('Created client:', client3.name);
    const client1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'client',
      phone: '+1234567890',
      bio: 'Looking for help with household tasks',
      profileImage: 'https://via.placeholder.com/150',
      isActive: true,
      isVerified: true
    });
    console.log('Created client:', client1.name);

    const client2 = await User.create({
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'client',
      phone: '+0987654321',
      bio: 'Need professional cleaning services',
      profileImage: 'https://via.placeholder.com/150',
      isActive: true,
      isVerified: true
    });
    console.log('Created client:', client2.name);

    const student1 = await User.create({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'password123',
      role: 'student',
      phone: '+1111111111',
      bio: 'Experienced in cleaning and dog walking',
      profileImage: 'https://via.placeholder.com/150',
      skills: ['Cleaning', 'Dog Walking', 'Lawn Mowing'],
      hourlyRate: 15,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' }
      ],
      averageRating: 4.5,
      totalRatings: 10,
      isActive: true,
      isVerified: true
    });
    console.log('Created student:', student1.name);

    const student2 = await User.create({
      name: 'Emma Wilson',
      email: 'emma@example.com',
      password: 'password123',
      role: 'student',
      phone: '+2222222222',
      bio: 'Available for tutoring and babysitting',
      profileImage: 'https://via.placeholder.com/150',
      skills: ['Tutoring', 'Babysitting', 'English'],
      hourlyRate: 20,
      availability: [
        { day: 'Wednesday', startTime: '14:00', endTime: '21:00' },
        { day: 'Thursday', startTime: '14:00', endTime: '21:00' }
      ],
      averageRating: 4.8,
      totalRatings: 15,
      isActive: true,
      isVerified: true
    });
    console.log('Created student:', student2.name);

    // Create sample tasks
    const task1 = await Task.create({
      title: 'House Cleaning',
      description: 'Need deep cleaning of 3-bedroom house, including kitchen and bathrooms',
      category: 'cleaning',
      client: client1._id,
      student: student1._id,
      status: 'completed',
      location: {
        address: '123 Main St',
        city: 'New York',
        zipCode: '10001'
      },
      budget: 150,
      estimatedDuration: 4,
      scheduledDate: new Date('2025-12-25'),
      scheduledTime: '10:00',
      completedDate: new Date('2025-12-25')
    });
    console.log('Created task:', task1.title);

    const task2 = await Task.create({
      title: 'Dog Walking',
      description: 'Need someone to walk my golden retriever for 1 hour daily',
      category: 'dog-walking',
      client: client2._id,
      student: student1._id,
      status: 'in-progress',
      location: {
        address: '456 Oak Ave',
        city: 'Boston',
        zipCode: '02101'
      },
      budget: 50,
      estimatedDuration: 1,
      scheduledDate: new Date('2025-12-28'),
      scheduledTime: '14:00',
      applicants: [
        {
          student: student2._id,
          message: 'I can help with dog walking, very experienced!'
        }
      ]
    });
    console.log('Created task:', task2.title);

    const task3 = await Task.create({
      title: 'Math Tutoring',
      description: 'Need help with algebra for high school student',
      category: 'tutoring',
      client: client1._id,
      status: 'open',
      location: {
        address: '789 Pine Rd',
        city: 'Los Angeles',
        zipCode: '90001'
      },
      budget: 30,
      estimatedDuration: 2,
      scheduledDate: new Date('2025-12-30'),
      scheduledTime: '16:00',
      applicants: [
        {
          student: student2._id,
          message: 'I specialize in math tutoring!'
        }
      ]
    });
    console.log('Created task:', task3.title);

    // Create sample messages
    const message1 = await Message.create({
      task: task1._id,
      sender: client1._id,
      receiver: student1._id,
      content: 'Hi Mike! Are you available for the cleaning on the 25th?',
      isRead: true,
      readAt: new Date()
    });
    console.log('Created message');

    const message2 = await Message.create({
      task: task1._id,
      sender: student1._id,
      receiver: client1._id,
      content: 'Yes, I am! I can start at 10 AM.',
      isRead: true,
      readAt: new Date()
    });
    console.log('Created message');

    // Create sample ratings
    const rating1 = await Rating.create({
      task: task1._id,
      ratedUser: student1._id,
      ratedBy: client1._id,
      rating: 5,
      comment: 'Excellent work! Very professional and thorough.',
      punctuality: 5,
      professionalism: 5,
      quality: 5,
      communication: 5
    });
    console.log('Created rating');

    console.log('\n✅ Database seeded successfully!');
    console.log('Collections created:');
    console.log('  - Users: 4 documents');
    console.log('  - Tasks: 3 documents');
    console.log('  - Messages: 2 documents');
    console.log('  - Ratings: 1 document');

  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

connectDB().then(() => seedDatabase());
