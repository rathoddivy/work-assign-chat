
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Calendar, Check, List, MessageCircle, User } from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 py-3 px-3 rounded-md transition-all";
    const activeClasses = "bg-devtask-blue/10 text-devtask-blue font-medium";
    const inactiveClasses = "text-gray-600 hover:bg-gray-100";
    
    return cn(
      baseClasses,
      isActive(path) ? activeClasses : inactiveClasses
    );
  };

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {!collapsed && (
            <h1 className="font-bold text-xl text-devtask-indigo">DevTask</h1>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full p-1.5 hover:bg-gray-100"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/dashboard" className={getLinkClasses("/dashboard")}>
            <List className="h-5 w-5" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/tasks" className={getLinkClasses("/tasks")}>
            <Check className="h-5 w-5" />
            {!collapsed && <span>Tasks</span>}
          </NavLink>
          
          <NavLink to="/messages" className={getLinkClasses("/messages")}>
            <MessageCircle className="h-5 w-5" />
            {!collapsed && <span>Messages</span>}
          </NavLink>
          
          <NavLink to="/calendar" className={getLinkClasses("/calendar")}>
            <Calendar className="h-5 w-5" />
            {!collapsed && <span>Calendar</span>}
          </NavLink>
          
          {isAdmin && (
            <>
              <div className={cn("my-2 border-t border-gray-200", collapsed && "mx-2")}></div>
              
              <NavLink to="/admin/users" className={getLinkClasses("/admin/users")}>
                <User className="h-5 w-5" />
                {!collapsed && <span>Users</span>}
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
