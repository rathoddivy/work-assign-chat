
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessage } from '@/contexts/MessageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Messages() {
  const { currentUser } = useAuth();
  const { 
    getConversationsForUser, 
    getMessagesForConversation, 
    sendMessage, 
    getUserById,
    markMessagesAsRead,
  } = useMessage();
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeRecipient, setActiveRecipient] = useState<string | null>(null);
  
  const conversations = getConversationsForUser(currentUser!.id);
  
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
      const otherPersonId = conversations[0].participants.find(id => id !== currentUser!.id);
      setActiveRecipient(otherPersonId || null);
      
      if (otherPersonId) {
        markMessagesAsRead(conversations[0].id, currentUser!.id);
      }
    }
  }, [conversations, currentUser, activeConversationId, markMessagesAsRead]);

  const messages = activeConversationId 
    ? getMessagesForConversation(activeConversationId) 
    : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeRecipient) return;
    
    sendMessage(currentUser!.id, activeRecipient, messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const selectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      const otherPersonId = conversation.participants.find(id => id !== currentUser!.id);
      setActiveRecipient(otherPersonId || null);
      
      if (otherPersonId) {
        markMessagesAsRead(conversationId, currentUser!.id);
      }
    }
  };

  const getUnreadCount = (conversationId: string) => {
    const messages = getMessagesForConversation(conversationId);
    return messages.filter(m => !m.read && m.receiverId === currentUser!.id).length;
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-6rem)]">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100%-3rem)] gap-4">
          {/* Conversation List */}
          <Card className="p-2 overflow-hidden">
            <div className="font-medium px-3 py-2 text-sm">Conversations</div>
            <ScrollArea className="h-[calc(100%-2rem)]">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => {
                  const otherPersonId = conversation.participants.find(id => id !== currentUser!.id);
                  const otherPerson = otherPersonId ? getUserById(otherPersonId) : null;
                  const unreadCount = getUnreadCount(conversation.id);
                  
                  return (
                    <div
                      key={conversation.id}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer",
                        activeConversationId === conversation.id 
                          ? "bg-devtask-blue/10 text-devtask-blue" 
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-devtask-indigo text-white">
                          {otherPerson?.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <span className="font-medium truncate">{otherPerson?.name}</span>
                          {unreadCount > 0 && (
                            <span className="bg-devtask-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {conversations.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No conversations yet.
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Area */}
          <Card className="flex flex-col h-full overflow-hidden">
            {activeRecipient ? (
              <>
                {/* Header */}
                <div className="border-b p-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-devtask-indigo text-white">
                      {getUserById(activeRecipient)?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{getUserById(activeRecipient)?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {getUserById(activeRecipient)?.role === 'admin' ? 'Administrator' : 'Team Member'}
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.senderId === currentUser!.id;
                      
                      return (
                        <div 
                          key={message.id}
                          className={cn(
                            "flex",
                            isCurrentUser ? "justify-end" : "justify-start"
                          )}
                        >
                          <div 
                            className={cn(
                              "max-w-[80%] rounded-lg px-4 py-2 break-words",
                              isCurrentUser 
                                ? "bg-devtask-blue text-white" 
                                : "bg-gray-100 text-gray-900"
                            )}
                          >
                            <div>{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {messages.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      className="bg-devtask-blue hover:bg-devtask-blue/90"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
