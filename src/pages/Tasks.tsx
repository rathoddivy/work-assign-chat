
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, X } from 'lucide-react';

type TaskStatus = 'all' | 'pending' | 'approved' | 'declined' | 'completed';

export default function Tasks() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter') as TaskStatus | null;
  
  const [filter, setFilter] = useState<TaskStatus>(filterParam || 'all');
  const { currentUser, isAdmin } = useAuth();
  const { getUserTasks, getAdminTasks, approveTask, declineTask, completeTask } = useTask();
  const navigate = useNavigate();
  
  // Get tasks based on user role
  const allTasks = isAdmin 
    ? getAdminTasks(currentUser!.id)
    : getUserTasks(currentUser!.id);
    
  // Filter tasks based on selected filter
  const filteredTasks = filter === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.status === filter);

  const handleFilterChange = (value: TaskStatus) => {
    setFilter(value);
    navigate(`/tasks${value === 'all' ? '' : `?filter=${value}`}`);
  };

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          
          <div className="flex gap-4">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
            
            {isAdmin && (
              <Button 
                className="bg-devtask-indigo hover:bg-devtask-indigo/90"
                onClick={() => navigate('/admin/tasks/new')}
              >
                Create Task
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No tasks found with the selected filter.
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    View Details
                  </Button>
                  
                  {!isAdmin && (
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-1 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => declineTask(task.id, currentUser!.id)}
                          >
                            <X className="h-4 w-4" />
                            <span>Decline</span>
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex items-center gap-1 bg-devtask-blue hover:bg-devtask-blue/90"
                            onClick={() => approveTask(task.id, currentUser!.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span>Accept</span>
                          </Button>
                        </>
                      )}
                      
                      {task.status === 'approved' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => completeTask(task.id, currentUser!.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          <span>Mark as Completed</span>
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
