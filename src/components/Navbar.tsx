import { useEffect, useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { SolidBtn } from '../btns/AllBtns';
import { generalImages } from '../utils/images';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Tasks', href: '#tasks' },
    { name: 'About', href: '#about' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: 'all 0.3s',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(255,255,255,0.04)',
          background: scrolled
            ? 'rgba(10,10,10,0.92)'
            : 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

            {/* Logo */}
            <Link
              to="/"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            >
              <img src={generalImages.logo} alt="Kubotai Logo" style={{ width: 32, height: 32 }} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FBC607', letterSpacing: '-0.01em' }}>
                Kubotai
              </span>
            </Link>

            {/* Desktop nav links */}
            <div style={{ display: 'none' }} className="md-flex-center">
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#FBC607'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
                onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'}
              >
                Log In
              </Link>
              <div style={{ width: '140px' }}>
                <Link to="/register">
                  <SolidBtn text="Get Started" />
                </Link>
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  width: 40, height: 40,
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
                aria-label="Toggle menu"
              >
                {isOpen
                  ? <IoClose style={{ width: 20, height: 20 }} />
                  : <HiMenuAlt3 style={{ width: 20, height: 20 }} />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s, visibility 0.3s',
        }}
        className="md:hidden"
      />

      {/* Mobile drawer */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: '80%', maxWidth: '320px',
          background: '#111111',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={generalImages.logo} alt="Kubotai Logo" style={{ width: 28, height: 28 }} />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#FBC607' }}>Kubotai</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: 36, height: 36,
              borderRadius: '9px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <IoClose style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Drawer links */}
        <div style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              style={{
                display: 'block',
                padding: '0.9rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                borderLeft: '3px solid transparent',
                transition: 'all 0.2s',
                animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.07}s both` : 'none',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = '#FBC607';
                el.style.borderLeftColor = '#FBC607';
                el.style.background = 'rgba(251,198,7,0.05)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = 'rgba(255,255,255,0.6)';
                el.style.borderLeftColor = 'transparent';
                el.style.background = 'transparent';
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Drawer CTA */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}>
          <Link
            to="/login"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Log In
          </Link>
          <Link to="/register">
            <SolidBtn text="Get Started" />
          </Link>
        </div>
      </div>

      <style>{`
        .hidden { display: none; }
        @media (min-width: 768px) {
          .hidden.md\\:flex { display: flex !important; }
          .flex.md\\:hidden { display: none !important; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;