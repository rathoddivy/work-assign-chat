
import { User, Task, Message, Conversation } from '@/types';

// Mock users
const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@devtask.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'John Developer',
    email: 'john@devtask.com',
    password: 'john123',
    role: 'user',
    createdAt: new Date('2023-01-05')
  },
  {
    id: '3',
    name: 'Sarah Designer',
    email: 'sarah@devtask.com',
    password: 'sarah123',
    role: 'user',
    createdAt: new Date('2023-01-10')
  }
];

// Mock tasks
const tasks: Task[] = [
  {
    id: '1',
    title: 'Implement User Authentication',
    description: 'Create login, signup, and password reset functionality.',
    assignedTo: '2',
    assignedBy: '1',
    status: 'approved',
    deadline: new Date('2023-02-20'),
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
  {
    id: '2',
    title: 'Design Landing Page',
    description: 'Create a responsive landing page with modern design.',
    assignedTo: '3',
    assignedBy: '1',
    status: 'completed',
    deadline: new Date('2023-02-15'),
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Connect frontend with backend APIs.',
    assignedTo: '2',
    assignedBy: '1',
    status: 'pending',
    deadline: new Date('2023-03-01'),
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
  },
  {
    id: '4',
    title: 'UI Component Library',
    description: 'Build reusable UI components for the application.',
    assignedTo: null,
    assignedBy: '1',
    status: 'pending',
    deadline: new Date('2023-03-10'),
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  }
];

// Mock messages
const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'How is the authentication task coming along?',
    read: true,
    createdAt: new Date('2023-02-05T10:30:00')
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'Almost done! Just testing edge cases now.',
    read: true,
    createdAt: new Date('2023-02-05T10:35:00')
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '3',
    content: 'Have you started on the landing page design?',
    read: true,
    createdAt: new Date('2023-02-03T14:20:00')
  },
  {
    id: '4',
    senderId: '3',
    receiverId: '1',
    content: 'Yes, I\'ll send you the mockups later today.',
    read: false,
    createdAt: new Date('2023-02-03T15:45:00')
  }
];

// Mock conversations
const conversations: Conversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: messages[1],
    updatedAt: new Date('2023-02-05T10:35:00')
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: messages[3],
    updatedAt: new Date('2023-02-03T15:45:00')
  }
];

export { users, tasks, messages, conversations };
