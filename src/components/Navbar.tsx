import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/useAuth';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg shadow-purple-500/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.img
              src="https://harisandcoacademy.com/wp-content/uploads/2025/06/tech-school-logo-white.png"
              alt="Tech School Logo"
              className="h-12 w-auto"
              whileHover={{
                x: [0, -2, 2, -2, 2, 0],
                transition: { duration: 0.5 }
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-purple-600 dark:text-purple-400' : ''
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  />
                )}
              </Link>
            ))}
            <ThemeToggle />
            {isAdmin && (
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-red-400 transition-colors duration-300"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-purple-500/20"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 ${
                    location.pathname === item.path ? 'text-purple-600 dark:text-purple-400' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-red-400 transition-colors duration-300 text-left"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;