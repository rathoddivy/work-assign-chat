
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth();
  const { getUserTasks, getAdminTasks, approveTask, declineTask } = useTask();
  const navigate = useNavigate();

  // Get tasks based on user role
  const tasks = isAdmin 
    ? getAdminTasks(currentUser!.id)
    : getUserTasks(currentUser!.id);

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const activeTasks = tasks.filter(task => task.status === 'approved');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser?.name}
            </p>
          </div>
          {isAdmin && (
            <Button 
              className="mt-4 md:mt-0 bg-devtask-indigo hover:bg-devtask-indigo/90"
              onClick={() => navigate('/admin/tasks/new')}
            >
              Create New Task
            </Button>
          )}
        </div>

        {/* Task Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {isAdmin ? 'Pending Assignments' : 'Pending Tasks'}
              </CardTitle>
              <CardDescription>
                {isAdmin ? 'Tasks waiting for approval' : 'Tasks assigned to you'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-devtask-blue">
                {pendingTasks.length}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={() => navigate('/tasks?filter=pending')}>
                View All
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Tasks</CardTitle>
              <CardDescription>Tasks currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-devtask-indigo">
                {activeTasks.length}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={() => navigate('/tasks?filter=active')}>
                View All
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
              <CardDescription>Successfully completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-devtask-blue">
                {completedTasks.length}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={() => navigate('/tasks?filter=completed')}>
                View All
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>

          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No pending tasks available.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingTasks.slice(0, 3).map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      View Details
                    </Button>
                    
                    {!isAdmin && task.status === 'pending' && (
                      <div className="flex space-x-2">
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
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
