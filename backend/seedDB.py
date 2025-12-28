import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/users')

def connect_db():
    """Connect to MongoDB"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client['users']
        print('MongoDB Connected for seeding...')
        return client, db
    except Exception as error:
        print(f'Connection error: {error}')
        exit(1)

def seed_database():
    """Seed the database with sample data"""
    client, db = connect_db()
    
    try:
        # Clear existing data
        db['FlexTasks'].delete_many({})
        print('Cleared existing data')

        # Create sample users
        client1 = db['FlexTasks'].insert_one({
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+1234567890',
            'bio': 'Looking for help with household tasks',
            'profileImage': 'https://via.placeholder.com/150',
            'isActive': True,
            'isVerified': True
        })
        print(f'Created client: John Doe')

        client2 = db['FlexTasks'].insert_one({
            'name': 'Sarah Smith',
            'email': 'sarah@example.com',
            'password': 'password123',
            'role': 'client',
            'phone': '+0987654321',
            'bio': 'Need professional cleaning services',
            'profileImage': 'https://via.placeholder.com/150',
            'isActive': True,
            'isVerified': True
        })
        print(f'Created client: Sarah Smith')

        student1 = db['FlexTasks'].insert_one({
            'name': 'Mike Johnson',
            'email': 'mike@example.com',
            'password': 'password123',
            'role': 'student',
            'phone': '+1111111111',
            'bio': 'Experienced in cleaning and dog walking',
            'profileImage': 'https://via.placeholder.com/150',
            'skills': ['Cleaning', 'Dog Walking', 'Lawn Mowing'],
            'hourlyRate': 15,
            'availability': [
                {'day': 'Monday', 'startTime': '09:00', 'endTime': '17:00'},
                {'day': 'Tuesday', 'startTime': '09:00', 'endTime': '17:00'}
            ],
            'averageRating': 4.5,
            'totalRatings': 10,
            'isActive': True,
            'isVerified': True
        })
        print(f'Created student: Mike Johnson')

        student2 = db['FlexTasks'].insert_one({
            'name': 'Emma Wilson',
            'email': 'emma@example.com',
            'password': 'password123',
            'role': 'student',
            'phone': '+2222222222',
            'bio': 'Available for tutoring and babysitting',
            'profileImage': 'https://via.placeholder.com/150',
            'skills': ['Tutoring', 'Babysitting', 'English'],
            'hourlyRate': 20,
            'availability': [
                {'day': 'Wednesday', 'startTime': '14:00', 'endTime': '21:00'},
                {'day': 'Thursday', 'startTime': '14:00', 'endTime': '21:00'}
            ],
            'averageRating': 4.8,
            'totalRatings': 15,
            'isActive': True,
            'isVerified': True
        })
        print(f'Created student: Emma Wilson')

        # Create sample tasks
        task1 = db['FlexTasks'].insert_one({
            'title': 'House Cleaning',
            'description': 'Need deep cleaning of 3-bedroom house, including kitchen and bathrooms',
            'category': 'cleaning',
            'client': client1.inserted_id,
            'student': student1.inserted_id,
            'status': 'completed',
            'location': {
                'address': '123 Main St',
                'city': 'New York',
                'zipCode': '10001'
            },
            'budget': 150,
            'estimatedDuration': 4,
            'scheduledDate': datetime(2025, 12, 25),
            'completedDate': datetime(2025, 12, 25)
        })
        print(f'Created task: House Cleaning')

        task2 = db['FlexTasks'].insert_one({
            'title': 'Dog Walking',
            'description': 'Need someone to walk my golden retriever for 1 hour daily',
            'category': 'dog-walking',
            'client': client2.inserted_id,
            'student': student1.inserted_id,
            'status': 'in-progress',
            'location': {
                'address': '456 Oak Ave',
                'city': 'Boston',
                'zipCode': '02101'
            },
            'budget': 50,
            'estimatedDuration': 1,
            'scheduledDate': datetime(2025, 12, 28),
            'applicants': [
                {
                    'student': student2.inserted_id,
                    'message': 'I can help with dog walking, very experienced!'
                }
            ]
        })
        print(f'Created task: Dog Walking')

        task3 = db['FlexTasks'].insert_one({
            'title': 'Math Tutoring',
            'description': 'Need help with algebra for high school student',
            'category': 'tutoring',
            'client': client1.inserted_id,
            'status': 'open',
            'location': {
                'address': '789 Pine Rd',
                'city': 'Los Angeles',
                'zipCode': '90001'
            },
            'budget': 30,
            'estimatedDuration': 2,
            'applicants': [
                {
                    'student': student2.inserted_id,
                    'message': 'I specialize in math tutoring!'
                }
            ]
        })
        print(f'Created task: Math Tutoring')

        # Create sample messages
        message1 = db['FlexTasks'].insert_one({
            'task': task1.inserted_id,
            'sender': client1.inserted_id,
            'receiver': student1.inserted_id,
            'content': 'Hi Mike! Are you available for the cleaning on the 25th?',
            'isRead': True,
            'readAt': datetime.now()
        })
        print('Created message')

        message2 = db['FlexTasks'].insert_one({
            'task': task1.inserted_id,
            'sender': student1.inserted_id,
            'receiver': client1.inserted_id,
            'content': 'Yes, I am! I can start at 10 AM.',
            'isRead': True,
            'readAt': datetime.now()
        })
        print('Created message')

        # Create sample ratings
        rating1 = db['FlexTasks'].insert_one({
            'task': task1.inserted_id,
            'ratedUser': student1.inserted_id,
            'ratedBy': client1.inserted_id,
            'rating': 5,
            'comment': 'Excellent work! Very professional and thorough.',
            'punctuality': 5,
            'quality': 5,
            'communication': 5
        })
        print('Created rating')

        print('\n✅ Database seeded successfully!')
        print('Collections created:')
        print('  - Users: 4 documents')
        print('  - Tasks: 3 documents')
        print('  - Messages: 2 documents')
        print('  - Ratings: 1 document')

    except Exception as error:
        print(f'Seeding error: {error}')
    finally:
        client.close()
        print('\nDatabase connection closed')

if __name__ == '__main__':
    seed_database()
