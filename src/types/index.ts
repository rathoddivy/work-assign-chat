
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null; // User ID
  assignedBy: string; // User ID (admin)
  status: 'pending' | 'approved' | 'declined' | 'completed';
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: Message;
  updatedAt: Date;
}
