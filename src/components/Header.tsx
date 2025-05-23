
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-rentpilot-600 hover:text-rentpilot-700 transition-colors">
            RentPilot
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 hover:scale-105">
            Home
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 hover:scale-105">
            Pricing
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 hover:scale-105">
            Dashboard
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 hover:scale-105">
            Contact
          </Link>
          <Button asChild variant="default" className="bg-rentpilot-600 hover:bg-rentpilot-700 transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <Link to="/application">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-all duration-200" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t p-4 flex flex-col space-y-4 animate-fade-in">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/pricing" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/dashboard" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Button 
            asChild 
            variant="default" 
            className="bg-rentpilot-600 hover:bg-rentpilot-700 w-full transition-all duration-200 hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to="/application">Get Started</Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
