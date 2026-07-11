import { useState } from 'react';
import { BiMessage } from 'react-icons/bi';
import {
  FiCheckSquare,
  FiCompass,
  FiHome,
  FiLogOut,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   SINGLE SOURCE OF TRUTH — used by both the desktop sidebar
   and the mobile bottom bar.
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'home', name: 'Home', icon: <FiHome className="w-5 h-5" />, path: '/dashboard/overview' },
  { id: 'friends', name: 'Friends', icon: <FiUsers className="w-5 h-5" />, path: '/dashboard/friends' },
  { id: 'chat', name: 'Chat', icon: <BiMessage className="w-5 h-5" />, path: '/dashboard/chats' },
  { id: 'market', name: 'Market', icon: <FiCompass className="w-5 h-5" />, path: '/dashboard/market' },
  { id: 'task', name: 'Task', icon: <FiCheckSquare className="w-5 h-5" />, path: '/dashboard/tasks' },
  { id: 'profile', name: 'Profile', icon: <FiUser className="w-5 h-5" />, path: '/dashboard/profile' },
];

interface SideBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SideBar = ({ isOpen = true, onClose }: SideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('credentialAccessToken');
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 768) onClose();
  };

  const activeStyle = {
    background: 'rgba(251,198,7,.12)',
    borderLeft: '3px solid #FBC607',
    color: '#FBC607',
    fontWeight: 600,
  };
  const inactiveStyle = {
    background: 'transparent',
    borderLeft: '3px solid transparent',
    color: 'rgba(255,255,255,.6)',
    fontWeight: 400,
  };

  /* shared nav list for sidebar */
  const NavList = ({ collapsed = false }: { collapsed?: boolean }) => (
    <nav className="flex-1 z-50">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`py-3 px-5 flex items-center gap-3 transition-all duration-200 ${collapsed ? 'justify-center' : ''
                  }`}
                style={isActive ? activeStyle : inactiveStyle}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(251,198,7,.06)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.6)';
                  }
                }}
                title={collapsed ? item.name : ''}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <style>{`
        .bottom-nav-item { transition: color .2s; }
        .bottom-nav-market-btn {
          width: 52px; height: 52px;
          background: #FBC607;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(251,198,7,.45);
          margin-top: -20px;
          transition: box-shadow .2s, transform .15s;
          color: #000;
        }
        .bottom-nav-market-btn:hover  { transform: scale(1.06); }
        .bottom-nav-market-btn.active { box-shadow: 0 4px 28px rgba(251,198,7,.7); }
      `}</style>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 z-30"
          onClick={onClose}
        />
      )}

      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════ */}
      <div
        className={`
          hidden md:flex flex-col
          h-screen pt-6 fixed left-0 top-0 overflow-y-auto
          transition-all duration-300 ease-in-out z-40
          ${isCollapsed ? 'w-20' : 'w-60'}
        `}
        style={{
          background: '#0d0d0d',
          borderRight: '1px solid rgba(251,198,7,.15)',
        }}
      >
        {/* Logo + collapse toggle */}
        <div className="px-5 mb-8 flex items-center justify-between">
          <Link to="/">
            <h2 className="text-xl font-semibold" style={{ color: '#FBC607' }}>
              {!isCollapsed && 'KubotAI'}
            </h2>
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden p-1 rounded"
            style={{ color: '#FBC607' }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <NavList collapsed={isCollapsed} />

        <div className="grow" />
        <div className="mx-5 mb-4" style={{ height: '1px', background: 'rgba(251,198,7,.15)' }} />

        {/* Logout */}
        <div className="px-5 pb-8">
          <button
            onClick={handleLogout}
            className={`w-full py-3 rounded-lg flex items-center gap-2 transition-all duration-200 cursor-pointer ${isCollapsed ? 'justify-center px-0' : 'justify-center'
              }`}
            style={{
              background: 'rgba(251,198,7,.1)',
              border: '1px solid rgba(251,198,7,.35)',
              color: '#FBC607',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FBC607';
              (e.currentTarget as HTMLButtonElement).style.color = '#000';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,198,7,.1)';
              (e.currentTarget as HTMLButtonElement).style.color = '#FBC607';
            }}
            title={isCollapsed ? 'Logout' : ''}
          >
            <FiLogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE SIDEBAR DRAWER
      ══════════════════════════════════════ */}
      <div
        className={`
          md:hidden flex flex-col
          h-screen pt-6 fixed left-0 top-0 overflow-y-auto w-60
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: '#0d0d0d',
          borderRight: '1px solid rgba(251,198,7,.15)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded"
          style={{ color: '#FBC607' }}
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="px-5 mb-8">
          <Link to="/">
            <h2 className="text-xl font-semibold" style={{ color: '#FBC607' }}>
              KubotAI
            </h2>
          </Link>
        </div>

        <NavList />

        <div className="grow" />
        <div className="mx-5 mb-4" style={{ height: '1px', background: 'rgba(251,198,7,.15)' }} />
        <div className="px-5 pb-8">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            style={{
              background: 'rgba(251,198,7,.1)',
              border: '1px solid rgba(251,198,7,.35)',
              color: '#FBC607',
              fontWeight: 600,
            }}
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM NAV BAR
      ══════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around px-2 pb-2"
        style={{
          background: '#0d0d0d',
          borderTop: '1px solid rgba(251,198,7,.15)',
          height: 68,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const isMarket = item.id === 'market';

          if (isMarket) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`bottom-nav-market-btn ${isActive ? 'active' : ''}`}
              >
                {item.icon}
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              className="bottom-nav-item flex flex-col items-center gap-0.5 pt-2 pb-1 px-3"
              style={{ color: isActive ? '#FBC607' : 'rgba(255,255,255,.45)' }}
            >
              {item.icon}
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#FBC607' : 'rgba(255,255,255,.4)' }}
              >
                {item.name}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: '#FBC607' }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default SideBar;