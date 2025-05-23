
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-6xl font-bold text-rentpilot-600">404</h1>
        <p className="text-xl text-gray-600 mb-6 mt-2">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
            <Link to="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
