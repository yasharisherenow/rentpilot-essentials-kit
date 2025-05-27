
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200">
            RentPilot
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 hover:scale-105">
            Home
          </Link>
          <Link to="/pricing" className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 hover:scale-105">
            Pricing
          </Link>
          <Link to="/dashboard" className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 hover:scale-105">
            Dashboard
          </Link>
          <Link to="/contact" className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 hover:scale-105">
            Contact
          </Link>
          <Button asChild variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25">
            <Link to="/application">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 hover:bg-slate-800/50 rounded-md transition-all duration-200 text-slate-300" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-slate-950/95 backdrop-blur-sm border-t border-slate-800/50 p-4 flex flex-col space-y-4 animate-fade-in">
          <Link 
            to="/" 
            className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-slate-800/50"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/pricing" 
            className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-slate-800/50"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/dashboard" 
            className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-slate-800/50"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/contact" 
            className="text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-slate-800/50"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Button 
            asChild 
            variant="default" 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold w-full transition-all duration-200 hover:scale-105"
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
