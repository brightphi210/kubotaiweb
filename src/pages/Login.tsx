import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { SolidBtn } from '../btns/AllBtns';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import { useLogin } from '../hooks/mutations/auth';

interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { mutate: loginMutate, isPending: isLoginPending } = useLogin();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const isLoggedIn = localStorage.getItem('kubotAccessToken');
    //     if (isLoggedIn) {
    //         navigate('/dashboard/overview');
    //     }
    // }, []);

    useEffect(() => {
        localStorage.getItem('theme') === 'dark'
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
    }, []);

    const loginForm = useForm<LoginFormData>({
        defaultValues: { email: '', password: '' },
    });

    const onLoginSubmit = (data: LoginFormData) => {
        loginMutate(data, {
            onSuccess: (response: any) => {
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('email', data.email);
                }
                toast.success('Login successful!');
                localStorage.setItem('kubotAccessToken', response.data.token.access);
                console.log('Access Token:', response.data.token.access);
                loginForm.reset();
                setTimeout(() => navigate('/dashboard/overview'), 2000)
            },
            onError: (error: any) => {
                if (error.response?.data?.email_verified === false) {
                    toast.info('Please verify your email first');
                    setTimeout(() => {
                        navigate('/verify-otp', { state: { email: error.response?.data?.email } });
                    }, 1500);
                    return;
                }
                toast.error(error.response?.data?.error || error.message);
            },
        });
    };

    return (

        <>
            <Navbar />
            <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden">

                <LoadingOverlay visible={isLoginPending} />
                <ToastContainer theme='dark' />

                {/* Grid background — matches Home */}
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

                {/* Glow blobs — matches Home */}
                <div className="absolute -top-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 dark:bg-blue-950/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-100 dark:bg-yellow-950/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

                {/* Card */}
                <div className="bg-white dark:bg-neutral-950 shadow-xl rounded-2xl lg:p-8 p-3 w-full max-w-lg  relative z-10">


                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue earning rewards</p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-neutral-800 rounded-xl p-1">
                        <div className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold text-center shadow-sm">
                            Login
                        </div>
                        <Link
                            to="/register"
                            className="flex-1 py-2.5 px-4 rounded-lg text-gray-500 dark:text-gray-400 text-sm font-semibold text-center hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            Register
                        </Link>
                    </div>

                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email Address
                            </label>
                            <Controller
                                name="email"
                                control={loginForm.control}
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
                                            disabled={isLoginPending}
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

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Controller
                                name="password"
                                control={loginForm.control}
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
                                                placeholder="Enter your password"
                                                disabled={isLoginPending}
                                                className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${error
                                                    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                                                    : 'border-gray-200 dark:border-neutral-700'
                                                    } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoginPending}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {error && <p className="text-red-500 text-xs mt-1 pl-1">{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoginPending}
                                    className="sr-only"
                                />
                                <div
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${rememberMe
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                                        }`}
                                >
                                    {rememberMe && (
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>

                        {/* Submit */}
                        <div className="pt-1 w-full">
                            <SolidBtn text="Sign In" />
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;