
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-rentpilot-600">
            RentPilot
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-colors">
            Dashboard
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-rentpilot-600 font-medium transition-colors">
            Contact
          </Link>
          <Button asChild variant="default" className="bg-rentpilot-600 hover:bg-rentpilot-700">
            <Link to="/application">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t p-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-colors px-4 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-colors px-4 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-600 hover:text-rentpilot-600 font-medium transition-colors px-4 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Button 
            asChild 
            variant="default" 
            className="bg-rentpilot-600 hover:bg-rentpilot-700 w-full"
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
