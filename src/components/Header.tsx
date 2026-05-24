import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Home, User, Apple, Bell, Award, Dumbbell, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { points } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600';
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Apple className="h-8 w-8 text-green-500" />
          <span className="text-xl font-bold text-green-600">HealthyYou</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
            <Award className="h-4 w-4 text-yellow-600 mr-1" />
            <span className="text-sm font-medium text-yellow-700">{points} points</span>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="hidden md:flex items-center text-gray-600 hover:text-red-600 transition"
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span className="text-sm">Sign Out</span>
          </button>
          
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-inner">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center py-2 ${isActive('/')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={`flex items-center py-2 ${isActive('/profile')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/diet" 
                  className={`flex items-center py-2 ${isActive('/diet')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Apple className="h-5 w-5 mr-3" />
                  <span>Diet</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/workout" 
                  className={`flex items-center py-2 ${isActive('/workout')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Dumbbell className="h-5 w-5 mr-3" />
                  <span>Workout</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/medications" 
                  className={`flex items-center py-2 ${isActive('/medications')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  <span>Medications</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/rewards" 
                  className={`flex items-center py-2 ${isActive('/rewards')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Award className="h-5 w-5 mr-3" />
                  <span>Rewards</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center py-2 text-red-600 w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      {/* Desktop navigation */}
      <nav className="bg-gray-50 py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex justify-between">
            <li>
              <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/diet" className={`flex flex-col items-center ${isActive('/diet')}`}>
                <Apple className="h-5 w-5" />
                <span className="text-xs mt-1">Diet</span>
              </Link>
            </li>
            <li>
              <Link to="/workout" className={`flex flex-col items-center ${isActive('/workout')}`}>
                <Dumbbell className="h-5 w-5" />
                <span className="text-xs mt-1">Workout</span>
              </Link>
            </li>
            <li>
              <Link to="/medications" className={`flex flex-col items-center ${isActive('/medications')}`}>
                <Bell className="h-5 w-5" />
                <span className="text-xs mt-1">Meds</span>
              </Link>
            </li>
            <li>
              <Link to="/rewards" className={`flex flex-col items-center ${isActive('/rewards')}`}>
                <Award className="h-5 w-5" />
                <span className="text-xs mt-1">Rewards</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;