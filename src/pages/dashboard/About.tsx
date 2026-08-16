import { useState } from 'react'
import { FiAlertTriangle, FiChevronRight, FiFileText, FiHelpCircle, FiTrash2, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDeleteAccount } from '../../hooks/mutations/allMutation'


const ACTION_ITEMS = [
    { label: 'Delete Account', icon: FiTrash2, href: null, danger: true, action: 'delete' },
]

const DeleteModal = ({ visible, onClose, onConfirm, isPending }: any) => {
    if (!visible) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
            <div
                className="w-full max-w-sm rounded-3xl p-5 bg-neutral-950"
            >
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <FiAlertTriangle size={28} className="text-red-400" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">Delete Account?</h3>
                <p className="text-sm text-white/50 text-center leading-relaxed mb-8">
                    This action is permanent and cannot be undone. All your data, tokens, and mining history will be permanently removed.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="w-full py-3 rounded-lg font-bold text-sm text-white bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            <>
                                <FiTrash2 size={15} />
                                Yes, Delete My Account
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full py-3 rounded-lg font-semibold text-sm text-white/60 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <FiX size={15} />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

const About = ({ navigate }: any) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const { mutate, isPending } = useDeleteAccount()

    const handleDeleteAccount = () => {
        mutate(undefined, {
            onSuccess: () => {
                localStorage.removeItem('ku_token')
                localStorage.removeItem('ku_onboarding')
                navigate?.('/login')
            },
            onError: (error) => {
                console.error('Delete error:', error)
                toast.error('Failed to delete account')
            }
        })
    }

    const handleItemClick = (item: any) => {
        if (item.action === 'delete') {
            setShowDeleteModal(true)
        } else if (item.href) {
            navigate?.(item.href)
        }
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu { animation: fade-up .45s ease both; }
        .dm-sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-10 pb-10">

                    {/* Header */}
                    <div className="fu flex items-center gap-4 mb-4" style={{ animationDelay: '.05s' }}>
                        <h1 className="text-xl font-bold">About</h1>
                    </div>

                    {/* Navigation Items */}
                    <div className="fu space-y-3 flex flex-col gap-2" style={{ animationDelay: '.1s' }}>
                        <Link to="/dashboard/profile/white-paper">
                            <button
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 group
                                                : 'bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(251,198,7,.06)]'
                                          `}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className={'w-9 h-9 rounded-xl flex items-center justify-center border bg-[rgba(251,198,7,.08)] border-[rgba(251,198,7,.2)]'}
                                    >
                                        <FiFileText size={16} className={'text-[#C9A876]'} />
                                    </div>
                                    <span className={`text-sm font-semibold text-white`}>
                                        White Paper
                                    </span>
                                </div>
                                <FiChevronRight size={16} className={`transition-transform group-hover:translate-x-0.5 text-white/30`} />
                            </button>
                        </Link>

                        <Link to="/dashboard/profile/faq">
                            <button
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 group
                                                : 'bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(251,198,7,.06)]'
                                          `}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className={'w-9 h-9 rounded-xl flex items-center justify-center border bg-[rgba(251,198,7,.08)] border-[rgba(251,198,7,.2)]'}
                                    >
                                        <FiHelpCircle size={16} className={'text-[#C9A876]'} />
                                    </div>
                                    <span className={`text-sm font-semibold text-white`}>
                                        FAQs
                                    </span>
                                </div>
                                <FiChevronRight size={16} className={`transition-transform group-hover:translate-x-0.5 text-white/30`} />
                            </button>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-10" />

                    {/* Action Items */}
                    <div className="fu space-y-3 mt-6" style={{ animationDelay: '.2s' }}>
                        {ACTION_ITEMS.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleItemClick(item)}
                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 group
                    ${item.danger
                                            ? 'bg-red-500/[0.05] border-red-500/[0.15] hover:bg-red-500/[0.1] hover:border-red-500/[0.25] hover:shadow-[0_8px_32px_rgba(239,68,68,.08)]'
                                            : 'bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(251,198,7,.06)]'
                                        }`}
                                    style={{ animationDelay: `${0.22 + i * 0.06}s` }}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border
                      ${item.danger
                                                ? 'bg-red-500/10 border-red-500/25'
                                                : 'bg-[rgba(251,198,7,.08)] border-[rgba(251,198,7,.2)]'
                                            }`}
                                        >
                                            <Icon size={16} className={item.danger ? 'text-red-400' : 'text-[#C9A876]'} />
                                        </div>
                                        <span className={`text-sm font-semibold ${item.danger ? 'text-red-400' : 'text-white'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <FiChevronRight size={16} className={`transition-transform group-hover:translate-x-0.5 ${item.danger ? 'text-red-400/50' : 'text-white/30'}`} />
                                </button>
                            )
                        })}
                    </div>

                    {/* Footer version */}
                    <div className="fu mt-6 text-center" style={{ animationDelay: '.3s' }}>
                        <p className="text-xs text-white/20">KU Network · Version 1.0</p>
                    </div>

                </div>
            </div>

            <DeleteModal
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                isPending={isPending}
            />
        </>
    )
}

export default About