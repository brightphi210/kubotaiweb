import { HiOutlineMenuAlt2 } from 'react-icons/hi';
// import { useProfile } from '../../hooks/mutations/auth';
// import { useGetNotifications } from '../../hooks/mutations/allMutation';

interface DashboardNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const DashboardNavbar = ({ onToggleSidebar }: DashboardNavbarProps) => {

  // const {profile, isLoading} = useProfile()
  // const userProfile = profile?.data || {}
  // const { notifications: notificationsData, isLoading: isNotificationsLoading } = useGetNotifications();
  // const notifications = notificationsData?.data?.notifications || [];
  // console.log('notificationsData', notificationsData?.data)
  return (
    <div className='h-20 bg-white text-black px-4 md:px-8 flex items-center justify-between fixed top-0 left-0 md:left-60 right-0 z-20 shadow-sm'>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={onToggleSidebar}
        className='md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors'
      >
        <HiOutlineMenuAlt2 className='w-6 h-6 text-neutral-800' />
      </button>

      {/* Spacer for desktop */}
      <div className='hidden md:block flex-1'></div>

      {/* Right Side - Icons and Profile */}
      {/* <div className='flex items-center gap-3 md:gap-4 ml-auto'>
        <Link to="/dashboard/notifications" className=''>
          <button className='p-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors relative'>
            <IoMdNotificationsOutline className='w-5 h-5 md:w-6 md:h-6 text-neutral-800' />
              {!isNotificationsLoading && notifications.length > 0 && (
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              )}
          </button>
        </Link>

        <Link to="/dashboard/profile" className=''>
          <div className='flex items-center gap-3'>
            {isLoading ? (
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse" />
            ): (
                <>
                  {userProfile?.profile?.profile_image === null ? (
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                      {userProfile?.full_name.charAt(0).toUpperCase()}
                    </div>
                  ): (

                    <img 
                      src={userProfile?.profile?.profile_image}
                      alt="Profile" 
                      className='w-9 h-9 md:w-10 md:h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all'
                    />
                  )}
                <div className='hidden lg:block min-w-max'>
                  <p className='text-sm font-medium text-gray-800'>{userProfile?.full_name}</p>
                  <p className='text-xs text-gray-500'>{userProfile?.email}</p>
                </div>
                </>

            )}
          </div>
        </Link>
      </div> */}
    </div>
  )
}

export default DashboardNavbar