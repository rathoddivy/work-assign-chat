
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function MainLayout({ 
  children, 
  requireAuth = true,
  requireAdmin = false
}: MainLayoutProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (requireAdmin && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate, requireAuth, requireAdmin]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthenticated && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {isAuthenticated && <Header />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
