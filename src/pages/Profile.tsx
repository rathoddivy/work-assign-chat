
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl bg-devtask-blue text-white">
                  {currentUser?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-4 flex-1">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="text-lg">{currentUser?.name}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email Address</div>
                  <div className="text-lg">{currentUser?.email}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Role</div>
                  <div className="text-lg capitalize">{currentUser?.role}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Member Since</div>
                  <div className="text-lg">{new Date(currentUser?.createdAt || '').toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
