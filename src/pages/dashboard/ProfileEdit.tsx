import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAlertCircle, FiEdit3, FiUpload, FiUser } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'
import { useUpdateProfile } from '../../hooks/mutations/auth'
import { useGetProfile } from '../../hooks/queries/allQueries'

const ProfileEdit = () => {
    const [image, setImage] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
    const { getProfile, isLoading, refetch } = useGetProfile()
    const profile = getProfile?.data

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: { username: '', bio: '' }
    })

    const bioValue = watch('bio') || ''

    useEffect(() => {
        if (profile && !isLoading) {
            reset({
                username: profile?.data?.username || '',
                bio: profile?.data?.bio || '',
            })
            const pic = profile?.data?.profile_picture || profile?.data?.image
            if (pic) setImage(pic)
        }
    }, [profile, isLoading, reset])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImage(URL.createObjectURL(file))
    }

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData()
            formData.append('username', data.username)
            formData.append('bio', data.bio)
            if (imageFile) formData.append('image', imageFile)

            updateProfile(formData, {
                onSuccess: () => {
                    toast.success('Profile updated successfully')
                    refetch()
                },
                onError: (error: any) => {
                    const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Error updating profile'
                    toast.error(msg)
                }
            })
        } catch (error) {
            toast.error('An unexpected error occurred')
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
        @keyframes avatar-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,198,7,0); }
          50%       { box-shadow: 0 0 24px 6px rgba(251,198,7,.15); }
        }
        .fu { animation: fade-up .45s ease both; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
        .avatar-ring { animation: avatar-pulse 3s ease-in-out infinite; }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-6 pb-32">
                    <ToastContainer theme='dark' />

                    {/* Avatar */}
                    <div className="fu flex flex-col items-center mb-10 pt-10" style={{ animationDelay: '.1s' }}>
                        <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                            <div
                                className="avatar-ring w-32 h-32 rounded-full border-2 overflow-hidden flex items-center justify-center"
                                style={{ borderColor: 'rgba(251,198,7,0.4)', background: 'rgba(251,198,7,0.08)' }}
                            >
                                {image ? (
                                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    isLoading ? (
                                        <div className="w-full h-full bg-white/[0.06] animate-pulse rounded-full" />
                                    ) : (
                                        <FiUser size={36} className="text-white/30" />
                                    )
                                )}
                            </div>

                            {/* Edit badge */}
                            <div
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 group-hover:scale-110 transition-transform"
                                style={{ background: '#FBC607', borderColor: '#0a0a0a' }}
                            >
                                <FiUpload size={13} color="#000" />
                            </div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FiEdit3 size={20} className="text-white" />
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <p className="text-xs text-white/40 mt-3">
                            {image ? 'Click to change profile picture' : 'Click to add profile picture'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="fu space-y-6" style={{ animationDelay: '.15s' }}>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-white/70">Username</label>
                            <Controller
                                name="username"
                                control={control}
                                rules={{
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Min 3 characters' },
                                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, and underscores only' }
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your username"
                                        disabled={isUpdating}
                                        className={`w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/[0.06] border outline-none transition-all duration-200 focus:bg-white/[0.08] disabled:opacity-50
                      ${errors.username ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/[0.1] focus:border-[rgba(251,198,7,.5)] focus:shadow-[0_0_0_3px_rgba(251,198,7,0.08)]'}`}
                                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                                    />
                                )}
                            />
                            {errors.username && (
                                <div className="flex items-center gap-1.5">
                                    <FiAlertCircle size={13} className="text-red-400" />
                                    <p className="text-xs text-red-400">{errors.username.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-white/70">Bio</label>
                                {bioValue.length > 0 && (
                                    <span className="text-[0.65rem] text-white/30 dm-mono">{bioValue.length}/150</span>
                                )}
                            </div>
                            <Controller
                                name="bio"
                                control={control}
                                rules={{ maxLength: { value: 150, message: 'Max 150 characters' } }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Tell us about yourself…"
                                        disabled={isUpdating}
                                        maxLength={150}
                                        rows={4}
                                        className={`w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 bg-white/[0.06] border resize-none outline-none transition-all duration-200 focus:bg-white/[0.08] disabled:opacity-50
                      ${errors.bio ? 'border-red-500/60' : 'border-white/[0.1] focus:border-[rgba(251,198,7,.5)] focus:shadow-[0_0_0_3px_rgba(251,198,7,0.08)]'}`}
                                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                                    />
                                )}
                            />
                            {errors.bio && (
                                <div className="flex items-center gap-1.5">
                                    <FiAlertCircle size={13} className="text-red-400" />
                                    <p className="text-xs text-red-400">{errors.bio.message}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-5 mb-5" />

                    {/* Submit */}
                    <div className="fu" style={{ animationDelay: '.25s' }}>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isUpdating || isLoading}
                            className="w-full py-3 rounded-lg font-bold text-sm text-black bg-gradient-to-br from-[#FBC607] to-[#e0a800] shadow-[0_4px_24px_rgba(251,198,7,.35)] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Updating…
                                </>
                            ) : 'Update Profile'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProfileEdit