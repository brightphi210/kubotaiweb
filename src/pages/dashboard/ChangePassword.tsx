import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAlertCircle, FiCheck, FiEye, FiEyeOff, FiLock, FiShield } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useChangePassword } from '../../hooks/mutations/allMutation'

function PasswordField({ label, name, control, errors, placeholder, rules, showPw, togglePw, disabled }: any) {
    const hasError = !!errors?.[name]

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">{label}</label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                            <FiLock size={16} />
                        </div>
                        <input
                            {...field}
                            type={showPw ? 'text' : 'password'}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/[0.06] border transition-all duration-200 outline-none focus:bg-white/[0.08] disabled:opacity-50
                ${hasError
                                    ? 'border-red-500/60 focus:border-red-500/80 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                                    : 'border-white/[0.1] focus:border-[rgba(251,198,7,.5)] focus:shadow-[0_0_0_3px_rgba(251,198,7,0.08)]'
                                }`}
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                        <button
                            type="button"
                            onClick={togglePw}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                            {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                )}
            />
            {errors?.[name] && (
                <div className="flex items-center gap-1.5">
                    <FiAlertCircle size={13} className="text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-400">{errors[name].message}</p>
                </div>
            )}
        </div>
    )
}

const ChangePassword = () => {
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const { mutate, isPending } = useChangePassword()

    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: { old_password: '', new_password: '', confirm_password: '' }
    })

    const newPw = watch('new_password')

    const tips = [
        { label: 'At least 6 characters', done: newPw?.length >= 6 },
        { label: 'Mix of letters & numbers', done: /[a-zA-Z]/.test(newPw) && /[0-9]/.test(newPw) },
        { label: 'Avoid common passwords', done: newPw?.length >= 8 },
    ]

    const navigate = useNavigate()

    const onSubmit = (data: any) => {
        mutate(data, {
            onSuccess: () => {
                toast.success('Password changed successfully')
                reset()
                localStorage.removeItem("ku_token");
                localStorage.removeItem("ku_onboarding");
                navigate("/login");
            },
            onError: (error: any) => {
                const msg = error?.response?.data?.detail || 'Failed to change password'
                console.error('Change password error:', error?.response?.data?.detail)
                toast.error(msg)
            }
        })
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
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-6 pb-32">
                    <ToastContainer theme='dark' />

                    {/* Shield icon hero */}
                    <div className="fu flex flex-col items-center mb-10" style={{ animationDelay: '.1s' }}>
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,198,7,.15)_0%,transparent_70%)] scale-150" />
                            <div className="relative w-16 h-16 rounded-full bg-[rgba(251,198,7,.1)] border border-[rgba(251,198,7,.3)] flex items-center justify-center">
                                <FiShield size={28} className="text-[#C9A876]" />
                            </div>
                        </div>
                        <p className="text-sm text-white/40 text-center max-w-[220px]">Keep your account secure with a strong password</p>
                    </div>

                    {/* Form */}
                    <div className="fu space-y-5" style={{ animationDelay: '.15s' }}>
                        <PasswordField
                            label="Current Password"
                            name="old_password"
                            control={control}
                            errors={errors}
                            placeholder="Enter current password"
                            rules={{ required: 'Current password is required' }}
                            showPw={showOld}
                            togglePw={() => setShowOld(v => !v)}
                            disabled={isPending}
                        />

                        <PasswordField
                            label="New Password"
                            name="new_password"
                            control={control}
                            errors={errors}
                            placeholder="Enter new password"
                            rules={{ required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
                            showPw={showNew}
                            togglePw={() => setShowNew(v => !v)}
                            disabled={isPending}
                        />

                        {/* Password strength hints */}
                        {newPw?.length > 0 && (
                            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                                {tips.map((tip, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${tip.done ? 'bg-[rgba(74,222,128,.2)] border border-[rgba(74,222,128,.4)]' : 'bg-white/[0.05] border border-white/[0.1]'}`}>
                                            {tip.done && <FiCheck size={10} className="text-[#4ade80]" />}
                                        </div>
                                        <span className={`text-xs transition-colors duration-300 ${tip.done ? 'text-[#4ade80]' : 'text-white/35'}`}>{tip.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <PasswordField
                            label="Confirm New Password"
                            name="confirm_password"
                            control={control}
                            errors={errors}
                            placeholder="Re-enter new password"
                            rules={{
                                required: 'Please confirm your password',
                                validate: (v: any) => v === newPw || 'Passwords do not match'
                            }}
                            showPw={showConfirm}
                            togglePw={() => setShowConfirm(v => !v)}
                            disabled={isPending}
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                    {/* Submit */}
                    <div className="fu" style={{ animationDelay: '.25s' }}>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isPending}
                            className="w-full py-2.5 rounded-lg font-bold text-sm text-black bg-gradient-to-br from-[#C9A876] to-[#e0a800] shadow-[0_4px_24px_rgba(251,198,7,.35)] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <FiShield size={16} />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ChangePassword