import { IoNotifications, IoSettingsOutline } from "react-icons/io5";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbLayoutDashboard, TbCertificate, TbAward } from "react-icons/tb";
import { MdOutlineVerifiedUser } from "react-icons/md";

export const navigationLink = [
    {
        id: 1,
        name: 'Overview',
        path: '/dashboard/overview',
        icon: <TbLayoutDashboard />
    },
    {
        id: 2,
        name: 'Certificates',
        path: '/dashboard/certificates',
        icon: <TbCertificate />
    }, 
    {
        id: 3,
        name: 'Badges',
        path: '/dashboard/badges',
        icon: <TbAward />
    }, 
]

export const navigationLink2 = [
    {
        id: 5,
        name: 'Plans',
        path: '/dashboard/plans',
        icon: <MdOutlineVerifiedUser />
    },
]

export const navigationLink3 = [

    {
        id: 7,
        name: 'Profile Settings',
        path: '/dashboard/profile',
        icon: <IoSettingsOutline />
    },

    {
        id: 8,
        name: 'Support',
        path: '/dashboard/support',
        icon: <RiCustomerServiceLine />
    },

    {
        id: 9,
        name: 'Notifications',
        path: '/dashboard/notifications',
        icon: <IoNotifications />
    },
]