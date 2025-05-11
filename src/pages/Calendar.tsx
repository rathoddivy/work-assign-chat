
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Calendar() {
  const { currentUser, isAdmin } = useAuth();
  const { getUserTasks, getAdminTasks } = useTask();
  
  // Get tasks based on user role
  const tasks = isAdmin 
    ? getAdminTasks(currentUser!.id)
    : getUserTasks(currentUser!.id);
    
  // Filter tasks with deadlines
  const tasksWithDeadlines = tasks.filter(task => task.deadline);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View your task deadlines</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks that need to be completed soon</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksWithDeadlines.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No upcoming deadlines
              </div>
            ) : (
              <div className="space-y-4">
                {tasksWithDeadlines
                  .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                  .map(task => (
                    <div key={task.id} className="border-b pb-4 last:border-b-0">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                      <div className="mt-2 text-sm font-medium">
                        Due: {new Date(task.deadline!).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Full calendar coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 text-muted-foreground">
              Calendar view will be implemented in the next update
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
