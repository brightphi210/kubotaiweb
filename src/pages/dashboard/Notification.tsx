import { FiAlertTriangle, FiBell, FiCheckCircle, FiDollarSign, FiInfo, FiMessageCircle } from 'react-icons/fi'
import { useGetNotifications } from '../../hooks/queries/allQueries'

const ICON_MAP = {
    info: { icon: FiInfo, bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', color: '#60A5FA' },
    success: { icon: FiCheckCircle, bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#4ADE80' },
    warning: { icon: FiAlertTriangle, bg: 'rgba(251,198,7,0.15)', border: 'rgba(251,198,7,0.3)', color: '#C9A876' },
    message: { icon: FiMessageCircle, bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', color: '#C084FC' },
    earning: { icon: FiDollarSign, bg: 'rgba(251,198,7,0.15)', border: 'rgba(251,198,7,0.3)', color: '#C9A876' },
}

function timeAgo(dateStr: string | number | Date) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type NotificationType = keyof typeof ICON_MAP

interface NotificationItemProps {
    notification: {
        id?: string | number
        type?: NotificationType
        content?: string
        title?: string
        created_at?: string | number | Date
        timestamp?: string | number | Date
        message?: string
        read?: boolean
    }
    index: number
}

function NotificationItem({ notification, index }: NotificationItemProps) {
    const typeKey = (typeof notification.type === 'string' && notification.type in ICON_MAP ? notification.type : 'info') as NotificationType
    const cfg = ICON_MAP[typeKey] || ICON_MAP.info
    const Icon = cfg.icon

    return (
        <div
            className="fu group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.08)] transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${0.06 + index * 0.05}s` }}
        >
            <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-neutral-800 bg-neutral-800 text-white"
            >
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-white leading-snug line-clamp-1">
                        {notification.content || notification.title || 'Notification'}
                    </p>
                    <span className="flex-shrink-0 text-[0.65rem] text-white/40 mt-0.5 dm-mono">
                        {timeAgo(notification?.created_at ?? notification?.timestamp ?? Date.now())}
                    </span>
                </div>
                <p className="text-[0.75rem] text-white/50 leading-relaxed line-clamp-2">
                    {notification.content || notification.message}
                </p>
            </div>

            {!notification.read && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#C9A876] mt-1.5 shadow-[0_0_6px_rgba(251,198,7,.6)]" />
            )}
        </div>
    )
}

const Notification = () => {
    const { getNotifications, isLoading } = useGetNotifications()
    const notifications = getNotifications?.data ?? []
    const unreadCount = notifications.filter((n: any) => !n.read).length

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .fu { animation: fade-up .45s ease both; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
        .line-clamp-1 { display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-lg mx-auto px-5 pt-6 pb-32">

                    {/* Header */}
                    <div className="fu flex items-center gap-4 mb-8" style={{ animationDelay: '.05s' }}>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">Notifications</h1>
                        </div>
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)]">
                                <span className="text-xs font-semibold text-[#C9A876] dm-mono">{unreadCount} new</span>
                            </div>
                        )}
                    </div>

                    {/* Summary pill */}
                    {!isLoading && notifications.length > 0 && (
                        <div className="fu flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6" style={{ animationDelay: '.1s' }}>
                            <div className="flex items-center gap-2">
                                <FiBell size={14} className="text-[#C9A876]" />
                                <span className="text-sm text-white/60 dm-mono">{notifications.length} total notifications</span>
                            </div>
                        </div>
                    )}

                    {/* Loading skeletons */}
                    {isLoading && (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                                    <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="skeleton h-3 rounded w-3/4" />
                                        <div className="skeleton h-3 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Notifications list */}
                    {!isLoading && notifications.length > 0 && (
                        <div className="space-y-2.5">
                            {notifications.map((notif: any, i: any) => (
                                <NotificationItem key={notif.id || i} notification={notif} index={i} />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && notifications.length === 0 && (
                        <div className="fu flex flex-col items-center justify-center py-24 gap-4" style={{ animationDelay: '.15s' }}>
                            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                <FiBell size={32} className="text-white/20" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-white/60 mb-1">No notifications yet</p>
                                <p className="text-sm text-white/30">When you receive notifications, they'll appear here</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default Notification