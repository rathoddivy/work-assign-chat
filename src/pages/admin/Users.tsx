
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { users } from '@/services/dummyData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Filter out admin users and apply search
  const filteredUsers = users
    .filter(user => user.role === 'user')
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <MainLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Users Management</h1>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No users found
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-devtask-indigo text-white">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/admin/tasks/new', { state: { userId: user.id } })}
                        >
                          Assign Task
                        </Button>
                        <Button 
                          className="bg-devtask-blue hover:bg-devtask-blue/90"
                          size="sm"
                          onClick={() => navigate('/messages')}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>Message</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
