import { useEffect, useState } from 'react';
import { FiAward, FiBell, FiTrendingUp } from 'react-icons/fi';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { Link } from 'react-router-dom';
import avatar from '../assets/images/Avatar.png';
import { useGetNotifications, useGetProfile } from '../hooks/queries/allQueries';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Fetch profile and notifications data
  const { getProfile, isLoading: profileLoading } = useGetProfile();
  const { getNotifications } = useGetNotifications();

  const profileData = getProfile?.data?.data;
  const notificationsData = getNotifications?.data ?? [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 lg:pl-72 lg:pr-5 lg:py-2 py-1.5 transition-all duration-300 backdrop-blur-xl
        ${scrolled
          ? 'bg-[rgba(10,10,10,0.95)] border-b border-[rgba(251,198,7,.15)]'
          : 'bg-[rgba(10,10,10,0.75)] border-b border-[rgba(251,198,7,.06)]'
        }`}
    >
      <div className="w-full px-5 h-[68px] flex items-center justify-between">

        {/* ── Left: avatar + username ── */}
        <Link to="/" className="flex items-center gap-3 no-underline cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
            {profileData?.image ? (
              <img src={profileData.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className=''>
                <img src={avatar} alt="avatar" className='w-full object-cover' />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            {profileLoading ? (
              <>
                <div className="w-16 h-3 bg-white/10 rounded animate-pulse" />
                <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-[0.65rem] text-white/40 m-0">Welcome back</p>
                <p className="text-sm font-semibold text-white/80 m-0">
                  @{profileData?.username?.toUpperCase().slice(0, 14) ?? '---'}
                </p>
              </>
            )}
          </div>
        </Link>

        {/* ── Right: action icons ── */}
        <div className="flex items-center gap-3">

          {/* Bell */}
          <button className="relative bg-transparent border-0 p-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/10 transition-colors cursor-pointer text-white/70 leading-none hover:text-white">
            <FiBell className="w-4 h-4" />
            {notificationsData.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-400" />
            )}
          </button>

          <button className="bg-transparent border-0 p-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/10 transition-colors cursor-pointer text-white/70 leading-none hover:text-white">
            <FiAward className="w-4 h-4" />
          </button>

          <button className="bg-transparent border-0 p-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/10 transition-colors cursor-pointer text-white/70 leading-none hover:text-white">
            <MdOutlineAccountBalanceWallet className="w-4 h-4" />
          </button>

          <button className="bg-transparent border-0 p-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/10 transition-colors cursor-pointer text-white/70 leading-none hover:text-white">
            <FiTrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;