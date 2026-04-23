import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { SolidBtn } from '../btns/AllBtns';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import { useRegistration } from '../hooks/mutations/auth';

interface RegisterFormData {
    fullname: string;
    email: string;
    phone_number: string;
    code: string;
    password: string;
    password2: string;
}

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: registerMutate, isPending: isRegisterPending } = useRegistration();
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('kubotAccessToken');
        if (isLoggedIn) {
            navigate('/dashboard/overview');
        }
    }, []);

    useEffect(() => {
        localStorage.getItem('theme') === 'dark'
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
    }, []);

    const registerForm = useForm<RegisterFormData>({
        defaultValues: {
            fullname: '',
            email: '',
            phone_number: '',
            code: '',
            password: '',
            password2: '',
        },
    });

    const onRegisterSubmit = (data: RegisterFormData) => {
        registerMutate(data, {
            onSuccess: (response: any) => {
                toast.success('Account created! Check your email for a verification code.');
                setTimeout(() => {
                    navigate('/account/verify', { state: { email: response.data.email } });
                }, 2000);
                registerForm.reset();
            },
            onError: (error: any) => {
                const errData = error.response?.data;
                if (errData?.email) { toast.error(errData.email[0]); return; }
                if (errData?.fullname) { toast.error(errData.fullname[0]); return; }
                if (errData?.phone_number) { toast.error(errData.phone_number[0]); return; }
                if (errData?.code) { toast.error(errData.code[0]); return; }
                if (errData?.password) { toast.error(errData.password[0]); return; }
                if (errData?.password2) { toast.error(errData.password2[0]); return; }
                if (errData?.error) { toast.error(errData.error); return; }
                toast.error(error.message || 'Something went wrong');
            },
        });
    };

    const EyeIcon = ({ visible }: { visible: boolean }) =>
        visible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
        ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden">

                <LoadingOverlay visible={isRegisterPending} />

                {/* Grid background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-neutral-50/40 dark:bg-neutral-950/10" />
                    <div
                        className="absolute inset-0 opacity-25 dark:opacity-5"
                        style={{
                            backgroundImage: `
                            linear-gradient(to right, #d97706 1px, transparent 1px),
                            linear-gradient(to bottom, #d97706 1px, transparent 1px)
                        `,
                            backgroundSize: '48px 48px',
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-15 dark:opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle, #b45309 1.5px, transparent 1.5px)`,
                            backgroundSize: '48px 48px',
                        }}
                    />
                </div>

                {/* Glow blobs */}
                <div className="absolute -top-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 dark:bg-blue-950/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-100 dark:bg-yellow-950/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

                {/* Card */}
                <div className="bg-white dark:bg-neutral-950 shadow-xl rounded-2xl lg:p-8 p-3 w-full max-w-lg relative z-10 my-8 mt-12">

                    <ToastContainer />

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start earning rewards today — it's free</p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-neutral-800 rounded-xl p-1">
                        <Link
                            to="/login"
                            className="flex-1 py-2.5 px-4 rounded-lg text-gray-500 dark:text-gray-400 text-sm font-semibold text-center hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            Login
                        </Link>
                        <div className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold text-center shadow-sm">
                            Register
                        </div>
                    </div>

                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                            <Controller
                                name="fullname"
                                control={registerForm.control}
                                rules={{
                                    required: 'Full name is required',
                                    minLength: { value: 2, message: 'At least 2 characters required' },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="John Doe"
                                            disabled={isRegisterPending}
                                            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                : 'border-gray-200 dark:border-neutral-700'
                                                } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                        />
                                        {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                            <Controller
                                name="email"
                                control={registerForm.control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="email"
                                            placeholder="you@example.com"
                                            autoCapitalize="none"
                                            disabled={isRegisterPending}
                                            className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                : 'border-gray-200 dark:border-neutral-700'
                                                } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                        />
                                        {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Phone & Invite Code — side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                                <Controller
                                    name="phone_number"
                                    control={registerForm.control}
                                    rules={{
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[+]?[\d\s\-()]{7,15}$/,
                                            message: 'Invalid phone number',
                                        },
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <input
                                                {...field}
                                                type="tel"
                                                placeholder="+234 000 0000"
                                                disabled={isRegisterPending}
                                                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                    : 'border-gray-200 dark:border-neutral-700'
                                                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                            />
                                            {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Invite Code
                                    <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(optional)</span>
                                </label>
                                <Controller
                                    name="code"
                                    control={registerForm.control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="e.g. ABC123"
                                                disabled={isRegisterPending}
                                                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                    : 'border-gray-200 dark:border-neutral-700'
                                                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                            />
                                            {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <Controller
                                name="password"
                                control={registerForm.control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters' },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <div className="relative">
                                            <input
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a password"
                                                disabled={isRegisterPending}
                                                className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                    : 'border-gray-200 dark:border-neutral-700'
                                                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isRegisterPending}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            >
                                                <EyeIcon visible={showPassword} />
                                            </button>
                                        </div>
                                        {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                            <Controller
                                name="password2"
                                control={registerForm.control}
                                rules={{
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === registerForm.getValues('password') || 'Passwords do not match',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <div className="relative">
                                            <input
                                                {...field}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Repeat your password"
                                                disabled={isRegisterPending}
                                                className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                    : 'border-gray-200 dark:border-neutral-700'
                                                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={isRegisterPending}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            >
                                                <EyeIcon visible={showConfirmPassword} />
                                            </button>
                                        </div>
                                        {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-1 w-full">
                            <SolidBtn text="Create Account" />
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;