import { useState } from 'react';
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

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '.78rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,.5)',
    marginBottom: '6px',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
};

const EyeOpen = () => (
    <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeClosed = () => (
    <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: registerMutate, isPending: isRegisterPending } = useRegistration();
    const navigate = useNavigate();

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

    const eyeBtnStyle: React.CSSProperties = {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255,255,255,.3)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
        if (!hasError) (e.target as HTMLInputElement).style.borderColor = 'rgba(251,198,7,.5)';
        (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(251,198,7,.08)';
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
        (e.target as HTMLInputElement).style.borderColor = hasError ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.08)';
        (e.target as HTMLInputElement).style.boxShadow = 'none';
    };

    return (
        <>
            <Navbar />
            <ToastContainer theme="dark" />

            <div style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                paddingTop: '5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <LoadingOverlay visible={isRegisterPending} />

                {/* Background grid */}
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
                    maxWidth: '480px',
                    marginTop: '1rem',
                    marginBottom: '2rem',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '.4rem' }}>Create your account</h1>
                        <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.875rem' }}>Start earning rewards today — it's free</p>
                    </div>

                    {/* Tab switcher */}
                    <div style={{
                        display: 'flex', gap: '4px',
                        background: 'rgba(255,255,255,.04)',
                        borderRadius: '12px',
                        padding: '4px',
                        marginBottom: '2rem',
                    }}>
                        <Link
                            to="/login"
                            style={{
                                flex: 1, padding: '10px 16px', borderRadius: '9px',
                                color: 'rgba(255,255,255,.4)',
                                fontWeight: 600, fontSize: '.875rem', textAlign: 'center',
                                textDecoration: 'none', transition: 'color .2s',
                            }}
                        >
                            Login
                        </Link>
                        <div style={{
                            flex: 1, padding: '10px 16px', borderRadius: '9px',
                            background: '#FBC607', color: '#000',
                            fontWeight: 700, fontSize: '.875rem', textAlign: 'center',
                        }}>
                            Register
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                    >
                        {/* Full Name */}
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <Controller
                                name="fullname"
                                control={registerForm.control}
                                rules={{ required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' } }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="John Doe"
                                            disabled={isRegisterPending}
                                            style={error ? inputError : inputBase}
                                            onFocus={(e) => handleFocus(e, !!error)}
                                            onBlur={(e) => handleBlur(e, !!error)}
                                        />
                                        {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <Controller
                                name="email"
                                control={registerForm.control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="email"
                                            placeholder="you@example.com"
                                            autoCapitalize="none"
                                            disabled={isRegisterPending}
                                            style={error ? inputError : inputBase}
                                            onFocus={(e) => handleFocus(e, !!error)}
                                            onBlur={(e) => handleBlur(e, !!error)}
                                        />
                                        {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Phone & Invite Code */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <Controller
                                    name="phone_number"
                                    control={registerForm.control}
                                    rules={{
                                        required: 'Phone is required',
                                        pattern: { value: /^[+]?[\d\s\-()]{7,15}$/, message: 'Invalid number' },
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <input
                                                {...field}
                                                type="tel"
                                                placeholder="+234 000 0000"
                                                disabled={isRegisterPending}
                                                style={error ? inputError : inputBase}
                                                onFocus={(e) => handleFocus(e, !!error)}
                                                onBlur={(e) => handleBlur(e, !!error)}
                                            />
                                            {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    Invite Code
                                    <span style={{ color: 'rgba(255,255,255,.3)', fontWeight: 400, marginLeft: '4px', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                                </label>
                                <Controller
                                    name="code"
                                    control={registerForm.control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="e.g. ABC123"
                                            disabled={isRegisterPending}
                                            style={inputBase}
                                            onFocus={(e) => {
                                                (e.target as HTMLInputElement).style.borderColor = 'rgba(251,198,7,.5)';
                                                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(251,198,7,.08)';
                                            }}
                                            onBlur={(e) => {
                                                (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,.08)';
                                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={labelStyle}>Password</label>
                            <Controller
                                name="password"
                                control={registerForm.control}
                                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a password"
                                                disabled={isRegisterPending}
                                                style={{ ...(error ? inputError : inputBase), paddingRight: '44px' }}
                                                onFocus={(e) => handleFocus(e, !!error)}
                                                onBlur={(e) => handleBlur(e, !!error)}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isRegisterPending} style={eyeBtnStyle}>
                                                {showPassword ? <EyeClosed /> : <EyeOpen />}
                                            </button>
                                        </div>
                                        {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <Controller
                                name="password2"
                                control={registerForm.control}
                                rules={{
                                    required: 'Please confirm your password',
                                    validate: (value) => value === registerForm.getValues('password') || 'Passwords do not match',
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                {...field}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Repeat your password"
                                                disabled={isRegisterPending}
                                                style={{ ...(error ? inputError : inputBase), paddingRight: '44px' }}
                                                onFocus={(e) => handleFocus(e, !!error)}
                                                onBlur={(e) => handleBlur(e, !!error)}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isRegisterPending} style={eyeBtnStyle}>
                                                {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
                                            </button>
                                        </div>
                                        {error && <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: '4px' }}>{error.message}</p>}
                                    </>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <div style={{ marginTop: '4px' }}>
                            <SolidBtn text="Create Account" />
                        </div>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'rgba(255,255,255,.35)', marginTop: '1.5rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#FBC607', fontWeight: 600, textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;