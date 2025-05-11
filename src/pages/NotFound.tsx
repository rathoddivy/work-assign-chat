
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-devtask-indigo mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-devtask-blue hover:bg-devtask-blue/90"
            asChild
          >
            <a href={isAuthenticated ? "/dashboard" : "/"}>
              {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
            </a>
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <a href="/tasks">View Tasks</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
