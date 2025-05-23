
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:p-6 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
          <Link to="/privacy" className="text-rentpilot-600 hover:underline ml-1">
            Learn more
          </Link>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={acceptCookies}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
