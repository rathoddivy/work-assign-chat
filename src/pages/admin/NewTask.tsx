
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { users } from '@/services/dummyData';

export default function NewTask() {
  const { currentUser } = useAuth();
  const { addTask } = useTask();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [deadline, setDeadline] = useState('');
  
  // Filter users to only get non-admin users
  const userOptions = users.filter(user => user.role === 'user');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = {
      title,
      description,
      assignedTo,
      assignedBy: currentUser!.id,
      status: 'pending' as const,
      deadline: deadline ? new Date(deadline) : undefined,
    };
    
    addTask(newTask);
    navigate('/tasks');
  };

  return (
    <MainLayout requireAdmin>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Task Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed description of the task"
                  required
                  className="min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select value={assignedTo || ''} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {userOptions.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/tasks')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-devtask-indigo hover:bg-devtask-indigo/90">
                  Create Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
