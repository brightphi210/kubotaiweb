import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAlertCircle, FiCheck, FiCopy, FiEdit3, FiInfo, FiUsers, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useSetInvitationCode } from '../../hooks/mutations/allMutation'
import { useGetInvitation } from '../../hooks/queries/allQueries'

const InviteCode = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [copied, setCopied] = useState(false)
    const { getInvitationToken, isLoading } = useGetInvitation()
    const { mutate, isPending } = useSetInvitationCode()

    const inviteCode = getInvitationToken?.data?.data?.referral_code

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: { referral_code: '' }
    })

    const codeValue = watch('referral_code') || ''

    useEffect(() => {
        if (inviteCode) setValue('referral_code', inviteCode)
    }, [inviteCode, setValue])

    const handleCopy = async () => {
        if (!inviteCode) return
        try {
            await navigator.clipboard.writeText(inviteCode)
            setCopied(true)
            toast.success('Invite code copied!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Failed to copy')
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        if (inviteCode) setValue('referral_code', inviteCode)
    }

    const onSubmit = (data: any) => {
        mutate(data, {
            onSuccess: () => {
                toast.success('Invite code updated!')
                setIsEditing(false)
            },
            onError: (error: any) => {
                const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Update failed'
                toast.error(msg)
            }
        })
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,198,7,0); }
          50%       { box-shadow: 0 0 24px 4px rgba(251,198,7,.15); }
        }
        .fu { animation: fade-up .45s ease both; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
        .code-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-6 pb-32">

                    {/* Hero */}
                    <div className="fu flex flex-col items-center mb-10" style={{ animationDelay: '.1s' }}>
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,198,7,.12)_0%,transparent_70%)] scale-150" />
                            <div className="relative w-16 h-16 rounded-full bg-[rgba(251,198,7,.1)] border border-[rgba(251,198,7,.3)] flex items-center justify-center">
                                <FiUsers size={26} className="text-[#FBC607]" />
                            </div>
                        </div>
                        <h2 className="text-lg font-bold mb-1">{isEditing ? 'Update Your Code' : 'Your Invitation Code'}</h2>
                        <p className="text-sm text-white/40 text-center max-w-[240px]">
                            {isEditing ? 'Set a new unique invitation code for your account' : 'Share this code with friends to invite them to the platform'}
                        </p>
                    </div>

                    {/* Display Mode */}
                    {!isEditing && (
                        <div className="fu space-y-5" style={{ animationDelay: '.15s' }}>

                            {/* Code card */}
                            <div
                                className="rounded-2xl p-5 border text-center"
                                style={{ background: 'linear-gradient(135deg, rgba(251,198,7,0.06) 0%, rgba(251,198,7,0.02) 100%)', borderColor: 'rgba(251,198,7,0.2)' }}
                            >
                                <p className="text-[0.7rem] text-[#FBC607]/60 mb-2 font-medium">INVITE CODE</p>
                                {isLoading ? (
                                    <div className="skeleton h-8 w-48 rounded mb-4" />
                                ) : (
                                    <p className="text-2xl font-bold dm-mono text-white tracking-widest mb-4">
                                        {inviteCode || '————'}
                                    </p>
                                )}
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={handleCopy}
                                        disabled={!inviteCode || isLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 ${copied
                                            ? 'bg-[rgba(74,222,128,.15)] border border-[rgba(74,222,128,.3)] text-[#4ade80]'
                                            : 'bg-[#016FEC] text-white hover:opacity-90'
                                            }`}
                                    >
                                        {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                                        {copied ? 'Copied!' : 'Copy Code'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] border border-white/[0.12] text-white/70 hover:bg-white/[0.12] hover:text-white transition-all duration-200 disabled:opacity-40"
                                    >
                                        <FiEdit3 size={13} />
                                        Edit
                                    </button>
                                </div>
                            </div>

                            {/* Info box */}
                            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-500/[0.07] border border-blue-500/[0.15]">
                                <FiInfo size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-300/80 leading-relaxed">
                                    Tap <strong className="text-blue-300">Copy Code</strong> to share with friends, or <strong className="text-blue-300">Edit</strong> to change your invitation code.
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* Copy button */}
                            <button
                                onClick={handleCopy}
                                disabled={!inviteCode || isLoading}
                                className="w-full py-3 rounded-lg font-bold text-sm text-black bg-gradient-to-br from-[#FBC607] to-[#e0a800] shadow-[0_4px_24px_rgba(251,198,7,.35)] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                                {copied ? 'Copied to Clipboard!' : 'Copy Invite Code'}
                            </button>
                        </div>
                    )}

                    {/* Edit Mode */}
                    {isEditing && (
                        <div className="fu space-y-5" style={{ animationDelay: '.15s' }}>

                            <div>
                                <label className="block text-sm font-semibold text-white/70 mb-3">New Invite Code</label>
                                <Controller
                                    name="referral_code"
                                    control={control}
                                    rules={{
                                        required: 'Invite code is required',
                                        minLength: { value: 3, message: 'Minimum 3 characters' },
                                        maxLength: { value: 20, message: 'Maximum 20 characters' },
                                        pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, and underscores only' }
                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="Enter new invite code"
                                                disabled={isPending}
                                                autoFocus
                                                maxLength={20}
                                                className={`w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/[0.06] border outline-none transition-all duration-200 focus:bg-white/[0.08] disabled:opacity-50 dm-mono tracking-wider uppercase
                          ${errors.referral_code ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/[0.1] focus:border-[rgba(251,198,7,.5)] focus:shadow-[0_0_0_3px_rgba(251,198,7,0.08)]'}`}
                                            />
                                            {codeValue.length > 0 && (
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] text-white/30 dm-mono">
                                                    {codeValue.length}/20
                                                </span>
                                            )}
                                        </div>
                                    )}
                                />
                                {errors.referral_code && (
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <FiAlertCircle size={13} className="text-red-400" />
                                        <p className="text-xs text-red-400">{errors.referral_code.message}</p>
                                    </div>
                                )}
                                <p className="text-[0.7rem] text-white/30 mt-2">3-20 characters · letters, numbers, underscores</p>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="space-y-3">
                                <button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isPending}
                                    className="w-full py-3 rounded-lg font-bold text-sm text-black bg-gradient-to-br from-[#FBC607] to-[#e0a800] shadow-[0_4px_24px_rgba(251,198,7,.35)] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Updating…
                                        </>
                                    ) : (
                                        <>
                                            <FiCheck size={16} />
                                            Update Code
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleCancel}
                                    disabled={isPending}
                                    className="w-full py-3 rounded-lg font-semibold text-sm text-white/60 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiX size={15} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default InviteCode