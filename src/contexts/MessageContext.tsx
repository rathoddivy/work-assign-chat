
import { createContext, useState, useContext, ReactNode } from 'react';
import { Message, Conversation, User } from '@/types';
import { messages as initialMessages, conversations as initialConversations, users } from '@/services/dummyData';
import { useToast } from '@/hooks/use-toast';

interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  getConversationsForUser: (userId: string) => Conversation[];
  getMessagesForConversation: (conversationId: string) => Message[];
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  getUserById: (userId: string) => User | undefined;
  markMessagesAsRead: (conversationId: string, userId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const { toast } = useToast();

  const getConversationsForUser = (userId: string) => {
    return conversations.filter(conv => conv.participants.includes(userId));
  };

  const getMessagesForConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return [];
    
    const [user1, user2] = conversation.participants;
    return messages.filter(m => 
      (m.senderId === user1 && m.receiverId === user2) || 
      (m.senderId === user2 && m.receiverId === user1)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const findOrCreateConversation = (user1Id: string, user2Id: string) => {
    let conversation = conversations.find(
      c => c.participants.includes(user1Id) && c.participants.includes(user2Id)
    );
    
    if (!conversation) {
      conversation = {
        id: (conversations.length + 1).toString(),
        participants: [user1Id, user2Id],
        updatedAt: new Date()
      };
      setConversations(prev => [...prev, conversation!]);
    }
    
    return conversation;
  };

  const sendMessage = (senderId: string, receiverId: string, content: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    const conversation = findOrCreateConversation(senderId, receiverId);
    
    setConversations(prev => 
      prev.map(c => 
        c.id === conversation.id 
          ? { ...c, lastMessage: newMessage, updatedAt: new Date() } 
          : c
      )
    );

    toast({
      title: "Message sent",
      description: "Your message has been sent",
    });
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const markMessagesAsRead = (conversationId: string, userId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const otherUserId = conversation.participants.find(id => id !== userId);
    if (!otherUserId) return;
    
    setMessages(prev => 
      prev.map(message => 
        message.senderId === otherUserId && message.receiverId === userId
          ? { ...message, read: true }
          : message
      )
    );
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      conversations,
      getConversationsForUser,
      getMessagesForConversation,
      sendMessage,
      getUserById,
      markMessagesAsRead,
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}
