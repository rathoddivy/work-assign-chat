import { createContext, useState, useContext, ReactNode } from 'react';
import { Task } from '@/types';
import { tasks as initialTasks } from '@/services/dummyData';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getUserTasks: (userId: string) => Task[];
  getAdminTasks: (adminId: string) => Task[];
  approveTask: (taskId: string, userId: string) => void;
  declineTask: (taskId: string, userId: string) => void;
  completeTask: (taskId: string, userId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { toast } = useToast();

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      // Convert "unassigned" value back to null
      assignedTo: task.assignedTo === "unassigned" ? null : task.assignedTo,
      id: (tasks.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task created",
      description: "The task has been created successfully",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
    toast({
      title: "Task updated",
      description: "The task has been updated successfully",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully",
    });
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  const getAdminTasks = (adminId: string) => {
    return tasks.filter(task => task.assignedBy === adminId);
  };

  const approveTask = (taskId: string, userId: string) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.assignedTo === userId) {
      updateTask(taskId, { status: 'approved' });
      toast({
        title: "Task approved",
        description: "You have approved the task",
      });
    }
  };

  const declineTask = (taskId: string, userId: string) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.assignedTo === userId) {
      updateTask(taskId, { status: 'declined' });
      toast({
        title: "Task declined",
        description: "You have declined the task",
      });
    }
  };

  const completeTask = (taskId: string, userId: string) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.assignedTo === userId && task.status === 'approved') {
      updateTask(taskId, { status: 'completed' });
      toast({
        title: "Task completed",
        description: "The task has been marked as completed",
      });
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask,
      getUserTasks,
      getAdminTasks,
      approveTask,
      declineTask,
      completeTask,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
