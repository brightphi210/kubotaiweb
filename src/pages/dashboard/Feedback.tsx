import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAlertCircle, FiMail, FiPlus, FiSend, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useFeedBack } from '../../hooks/mutations/allMutation'

const QUESTION_TYPES = [
    'Crash',
    'Page misalignment',
    'Page stuck',
    'Complain about product features',
    'Feedback on other issues',
]

const SuccessDialog = ({ visible, onClose }: any) => {
    if (!visible) return null
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-6" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div
                className="w-full max-w-sm rounded-3xl p-8 text-center bg-neutral-950"
            >
                <div className="w-20 h-20 rounded-full bg-[rgba(251,198,7,.1)] border border-[rgba(251,198,7,.3)] flex items-center justify-center mx-auto mb-5">
                    <span style={{ fontSize: 36 }}>🎁</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Feedback Received!</h3>
                <p className="text-sm text-white/50 mb-8 leading-relaxed">
                    Thank you for helping us improve. We appreciate your time and valuable feedback.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-lg font-bold text-sm text-[#FBC607] bg-[rgba(251,198,7,.1)] border border-[rgba(251,198,7,.3)] hover:bg-[rgba(251,198,7,.15)] transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

const Feedback = () => {
    const [selectedType, setSelectedType] = useState('')
    const [screenshots, setScreenshots] = useState<string[]>([])
    const [showSuccess, setShowSuccess] = useState(false)
    const { mutate, isPending } = useFeedBack()

    const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
        defaultValues: { question_type: '', description: '', email: '' }
    })

    const descValue = watch('description') || ''

    const handleSelectType = (type: any) => {
        setSelectedType(type)
        setValue('question_type', type)
    }

    const handleAddScreenshot = async () => {
        if (screenshots.length >= 10) {
            toast.warning('Maximum 10 screenshots allowed')
            return
        }
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.multiple = true
        input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || [])
            const urls = files.map(f => URL.createObjectURL(f))
            setScreenshots(prev => [...prev, ...urls].slice(0, 10))
        }
        input.click()
    }

    const onSubmit = (data: any) => {
        if (!selectedType) {
            toast.warning('Please select a question type')
            return
        }
        mutate(data, {
            onSuccess: () => {
                setShowSuccess(true)
                reset()
                setSelectedType('')
                setScreenshots([])
            },
            onError: (error: any) => {
                const msg = error?.response?.data?.detail || 'Submission failed. Please try again.'
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
        .type-pill { transition: all .2s ease; }
        .type-pill:hover { transform: translateY(-1px); }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-6 pb-32">

                    {/* Header */}
                    <div className="fu flex items-center gap-4 mb-10" style={{ animationDelay: '.05s' }}>
                        <h1 className="text-xl font-bold">Feedback</h1>
                    </div>

                    <div className="space-y-7">

                        {/* Question type */}
                        <div className="fu" style={{ animationDelay: '.1s' }}>
                            <label className="block text-sm font-semibold text-white/70 mb-3">Question Type</label>
                            <div className="flex flex-wrap gap-2">
                                {QUESTION_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleSelectType(type)}
                                        disabled={isPending}
                                        className={`type-pill px-4 py-2 rounded-full text-xs font-medium border transition-colors ${selectedType === type
                                            ? 'bg-[#FBC607] text-black border-[#FBC607] shadow-[0_4px_16px_rgba(251,198,7,.3)]'
                                            : 'bg-white/[0.05] text-white/50 border-white/[0.1] hover:border-white/[0.2] hover:text-white/70'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Problem description */}
                        <div className="fu" style={{ animationDelay: '.15s' }}>
                            <label className="block text-sm font-semibold text-white/70 mb-3">Problem Description</label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required', maxLength: { value: 300, message: 'Max 300 characters' } }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <textarea
                                            {...field}
                                            placeholder="Please describe the issue in detail…"
                                            disabled={isPending}
                                            maxLength={300}
                                            rows={5}
                                            className={`w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/[0.06] border resize-none outline-none transition-all duration-200 focus:bg-white/[0.08] disabled:opacity-50
                        ${errors.description ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/[0.1] focus:border-[rgba(251,198,7,.5)] focus:shadow-[0_0_0_3px_rgba(251,198,7,0.08)]'}`}
                                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                                        />
                                        <span className="absolute bottom-3 right-3 text-[0.65rem] text-white/30 dm-mono">{descValue.length}/300</span>
                                    </div>
                                )}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <FiAlertCircle size={13} className="text-red-400" />
                                    <p className="text-xs text-red-400">{errors.description.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Screenshots */}
                        <div className="fu" style={{ animationDelay: '.2s' }}>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-white/70">
                                    Screenshots <span className="text-white/30 font-normal">(optional)</span>
                                </label>
                                <span className="text-[0.65rem] text-white/30 dm-mono">{screenshots.length}/10</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {screenshots.map((uri, i) => (
                                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/[0.1]">
                                        <img src={uri} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setScreenshots(s => s.filter((_, idx) => idx !== i))}
                                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                                        >
                                            <FiX size={11} />
                                        </button>
                                    </div>
                                ))}
                                {screenshots.length < 10 && (
                                    <button
                                        onClick={handleAddScreenshot}
                                        disabled={isPending}
                                        className="w-20 h-20 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.03] flex flex-col items-center justify-center gap-1 hover:border-[rgba(251,198,7,.4)] hover:bg-[rgba(251,198,7,.04)] transition-all duration-200 disabled:opacity-50"
                                    >
                                        <FiPlus size={22} className="text-white/30" />
                                        <span className="text-[0.6rem] text-white/25">Add</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Contact email */}
                        <div className="fu" style={{ animationDelay: '.25s' }}>
                            <label className="block text-sm font-semibold text-white/70 mb-3">Contact Email</label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                                            <FiMail size={15} />
                                        </div>
                                        <input
                                            {...field}
                                            type="email"
                                            placeholder="We'll contact you if we need more info"
                                            disabled={isPending}
                                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/[0.06] border outline-none transition-all duration-200 focus:bg-white/[0.08] disabled:opacity-50
                        ${errors.email ? 'border-red-500/60' : 'border-white/[0.1] focus:border-[rgba(251,198,7,.5)] focus:shadow-[0_0_0_3px_rgba(251,198,7,0.08)]'}`}
                                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                                        />
                                    </div>
                                )}
                            />
                            {errors.email && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <FiAlertCircle size={13} className="text-red-400" />
                                    <p className="text-xs text-red-400">{errors.email.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Submit */}
                        <div className="fu" style={{ animationDelay: '.3s' }}>
                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isPending}
                                className="w-full py-3 rounded-lg font-bold text-sm text-black bg-gradient-to-br from-[#FBC607] to-[#e0a800] shadow-[0_4px_24px_rgba(251,198,7,.35)] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        <FiSend size={15} />
                                        Confirm Feedback
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <SuccessDialog visible={showSuccess} onClose={() => setShowSuccess(false)} />
        </>
    )
}

export default Feedback