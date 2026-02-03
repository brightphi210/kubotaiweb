import { useState, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { FiSun, FiMoon } from 'react-icons/fi';
import { generalImages } from '../utils/images';
import { SolidBtn } from '../btns/AllBtns';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    
    if (newDarkState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Tasks', href: '#tasks' },
    { name: 'About', href: '#about' },
  ];

  const handleNavClick = (href:any) => {
    setIsOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 dark:border-neutral-900 ${
        scrolled 
          ? 'bg-white/90 dark:bg-neutral-900/60 backdrop-blur-xl border-b border-gray-200 dark:border-neutral-800' 
          : 'bg-white/80 dark:bg-neutral-900/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group" onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}>
              <img 
                src={generalImages.logo} 
                alt="Kubotai Logo" 
                className="w-8 h-8 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110" 
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-sm lg:text-sm text-gray-700 dark:text-gray-300 hover:text-[#1E6FFF] dark:hover:text-[#1E6FFF] font-medium transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1E6FFF] dark:bg-[#1E6FFF] group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* CTA & Theme Toggle */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <button
                onClick={toggleDarkMode}
                className="w-8.5 h-8.5 lg:w-8.5 lg:h-8.5 cursor-pointer rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <FiSun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-4 h-4 lg:w-5 lg:h-5 text-[#1E6FFF]" />
                )}
              </button>

              <div>
                <SolidBtn text="Get Started" onClick={() => handleNavClick('#signup')} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2 sm:gap-3">
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <FiSun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E6FFF]" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <IoClose className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <HiMenuAlt3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Blur Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-neutral-900 z-50 md:hidden shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <img 
                src={generalImages.logo} 
                alt="Kubotai Logo" 
                className="w-8 h-8" 
              />
              <span className="text-lg sm:text-xl font-bold text-[#1E6FFF] dark:text-[#1E6FFF]">
                Kubotai
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors duration-300"
            >
              <IoClose className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 overflow-y-auto py-4 sm:py-6">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-[#1E6FFF] dark:hover:text-[#1E6FFF] transition-colors duration-300 border-l-4 border-transparent hover:border-[#1E6FFF] dark:hover:border-[#1E6FFF]"
                style={{
                  animation: isOpen ? `slideInRight 0.3s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu CTA */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-neutral-800">
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#signup');
              }}
              className="block w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#1E6FFF] hover:bg-blue-700 text-white rounded-xl font-semibold text-sm sm:text-base text-center hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;