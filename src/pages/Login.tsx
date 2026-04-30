import { useState } from 'react';
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

const EyeOpen = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeClosed = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,.08)',
    background: 'rgba(255,255,255,.03)',
    color: '#fff',
    fontSize: '.9rem',
    outline: 'none',
    transition: 'border-color .25s, box-shadow .25s',
    boxSizing: 'border-box',
};
const inputError: React.CSSProperties = {
    ...inputBase,
    borderColor: 'rgba(239,68,68,.5)',
    background: 'rgba(239,68,68,.05)',
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { mutate: loginMutate, isPending: isLoginPending } = useLogin();
    const navigate = useNavigate();

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
                loginForm.reset();
                setTimeout(() => navigate('/dashboard/overview'), 2000);
            },
            onError: (error: any) => {
                if (error.response?.data?.email_verified === false) {
                    toast.info('Please verify your email first');
                    setTimeout(() => navigate('/verify-otp', { state: { email: error.response?.data?.email } }), 1500);
                    return;
                }
                toast.error(error.response?.data?.error || error.message);
            },
        });
    };

    return (
        <>
            <Navbar />

            <div style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <LoadingOverlay visible={isLoginPending} />
                <ToastContainer theme="dark" />

                {/* Faint grid background */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'linear-gradient(to right,rgba(251,198,7,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(251,198,7,.04) 1px,transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'radial-gradient(circle,rgba(251,198,7,.07) 1px,transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />
                    <div style={{ position: 'absolute', top: '-8rem', right: '-8rem', width: '28rem', height: '28rem', borderRadius: '50%', background: 'rgba(251,198,7,.05)', filter: 'blur(100px)' }} />
                    <div style={{ position: 'absolute', bottom: '-8rem', left: '-8rem', width: '28rem', height: '28rem', borderRadius: '50%', background: 'rgba(251,198,7,.03)', filter: 'blur(100px)' }} />
                </div>

                {/* Card */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    background: '#111111',
                    border: '1px solid rgba(255,255,255,.07)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '440px',
                    marginTop: '3rem',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '.4rem' }}>Welcome back</h1>
                        <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.875rem' }}>Sign in to continue earning rewards</p>
                    </div>

                    {/* Tab switcher */}
                    <div style={{
                        display: 'flex', gap: '4px',
                        background: 'rgba(255,255,255,.04)',
                        borderRadius: '12px',
                        padding: '4px',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            flex: 1, padding: '10px 16px', borderRadius: '9px',
                            background: '#FBC607', color: '#000',
                            fontWeight: 700, fontSize: '.875rem', textAlign: 'center',
                        }}>
                            Login
                        </div>
                        <Link
                            to="/register"
                            style={{
                                flex: 1, padding: '10px 16px', borderRadius: '9px',
                                color: 'rgba(255,255,255,.4)',
                                fontWeight: 600, fontSize: '.875rem', textAlign: 'center',
                                textDecoration: 'none', transition: 'color .2s',
                            }}
                        >
                            Register
                        </Link>
                    </div>

                    {/* Form */}
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.5)', marginBottom: '6px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                                Email Address
                            </label>
                            <Controller
                                name="email"
                                control={loginForm.control}
                                rules={{ required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="email"
                                            placeholder="you@example.com"
                                            autoCapitalize="none"
                                            disabled={isLoginPending}
                                            style={error ? inputError : inputBase}
                                            onFocus={(e) => {
                                                if (!error) (e.target as HTMLInputElement).style.borderColor = 'rgba(251,198,7,.5)';
                                                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(251,198,7,.08)';
                                            }}
                                            onBlur={(e) => {
                                                (e.target as HTMLInputElement).style.borderColor = error ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.08)';
                                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                                            }}
                                        />
                                        {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <label style={{ fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.5)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '.78rem', color: '#FBC607', textDecoration: 'none', fontWeight: 500 }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <Controller
                                name="password"
                                control={loginForm.control}
                                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                disabled={isLoginPending}
                                                style={{ ...(error ? inputError : inputBase), paddingRight: '44px' }}
                                                onFocus={(e) => {
                                                    if (!error) (e.target as HTMLInputElement).style.borderColor = 'rgba(251,198,7,.5)';
                                                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(251,198,7,.08)';
                                                }}
                                                onBlur={(e) => {
                                                    (e.target as HTMLInputElement).style.borderColor = error ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.08)';
                                                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoginPending}
                                                style={{
                                                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: 'rgba(255,255,255,.3)', padding: 0,
                                                }}
                                            >
                                                {showPassword ? <EyeClosed /> : <EyeOpen />}
                                            </button>
                                        </div>
                                        {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Remember me */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                            <div
                                onClick={() => setRememberMe(!rememberMe)}
                                style={{
                                    width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                    border: rememberMe ? '2px solid #FBC607' : '2px solid rgba(255,255,255,.15)',
                                    background: rememberMe ? '#FBC607' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all .2s', cursor: 'pointer',
                                }}
                            >
                                {rememberMe && (
                                    <svg style={{ width: 11, height: 11, color: '#000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span style={{ fontSize: '.875rem', color: 'rgba(255,255,255,.45)' }}>Remember me</span>
                        </label>

                        {/* Submit */}
                        <div style={{ marginTop: '4px' }}>
                            <SolidBtn text="Sign In" />
                        </div>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'rgba(255,255,255,.35)', marginTop: '1.5rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#FBC607', fontWeight: 600, textDecoration: 'none' }}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;