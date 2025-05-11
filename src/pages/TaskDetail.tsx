
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { useMessage } from '@/contexts/MessageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Check, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { users } from '@/services/dummyData';

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, approveTask, declineTask, completeTask } = useTask();
  const { currentUser, isAdmin } = useAuth();
  const { sendMessage } = useMessage();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Task not found</h2>
          <Button 
            variant="link" 
            onClick={() => navigate('/tasks')}
            className="mt-4"
          >
            Back to Tasks
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const assignee = task.assignedTo 
    ? users.find(u => u.id === task.assignedTo) 
    : null;
    
  const assigner = users.find(u => u.id === task.assignedBy);
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Determine the recipient
    let recipientId;
    
    if (isAdmin) {
      // Admin is sending to the assignee
      recipientId = task.assignedTo;
    } else {
      // User is sending to the admin who assigned the task
      recipientId = task.assignedBy;
    }
    
    if (recipientId) {
      sendMessage(currentUser!.id, recipientId, message);
      setMessage('');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tasks')}
            className="mb-2"
          >
            ← Back to Tasks
          </Button>
          <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Task Details</CardTitle>
                  <div className={`px-3 py-1 rounded text-sm font-medium ${getStatusBadgeClass(task.status)}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-600">{task.description}</p>
                
                {task.deadline && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">Deadline</h3>
                    <p>{new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Created</h3>
                  <p>{new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
              {!isAdmin && task.status === 'pending' && (
                <CardFooter className="border-t pt-4 flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      declineTask(task.id, currentUser!.id);
                      navigate('/tasks');
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span>Decline</span>
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1 bg-devtask-blue hover:bg-devtask-blue/90"
                    onClick={() => {
                      approveTask(task.id, currentUser!.id);
                      navigate('/tasks');
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span>Accept</span>
                  </Button>
                </CardFooter>
              )}
              {!isAdmin && task.status === 'approved' && (
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      completeTask(task.id, currentUser!.id);
                      navigate('/tasks');
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    <span>Mark as Completed</span>
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>
                  {isAdmin 
                    ? "Send a message to the assigned team member" 
                    : "Send a message to the task creator"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-24"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => navigate('/messages')}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>View All Messages</span>
                </Button>
                <Button 
                  className="bg-devtask-blue hover:bg-devtask-blue/90"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !assignee}
                >
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            {assignee ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Assigned To</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-devtask-indigo text-white">
                        {assignee.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{assignee.name}</div>
                      <div className="text-sm text-muted-foreground">Team Member</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    Not assigned to anyone yet
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-devtask-blue text-white">
                      {assigner?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{assigner?.name}</div>
                    <div className="text-sm text-muted-foreground">Administrator</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
