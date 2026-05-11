import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import { FaCoins, FaTasks, FaUsers } from 'react-icons/fa';
import {
  HiChartBar,
  HiCheckCircle,
  HiLightningBolt,
  HiShieldCheck,
  HiUserGroup,
} from 'react-icons/hi';
import {
  IoCheckmarkCircle,
  IoGiftSharp,
  IoRocketSharp
} from 'react-icons/io5';
import kubotImage from '../assets/images/Right.png';
import bottomImage from '../assets/images/bottom.png';
import { GrayBtn, SolidBtn } from '../btns/AllBtns';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { generalImages } from '../utils/images';

const Home = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stats, setStats] = useState({ users: 0, tasks: 0, rewards: 0 });

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }, []);

  useEffect(() => {
    const targetUsers = 50000;
    const targetTasks = 1000000;
    const targetRewards = 500000;
    const steps = 60;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const p = current / steps;
      setStats({
        users: Math.floor(targetUsers * p),
        tasks: Math.floor(targetTasks * p),
        rewards: Math.floor(targetRewards * p),
      });
      if (current >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveStep((p) => (p + 1) % 3), 20000);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: FaTasks, title: 'Complete Tasks', description: 'Browse through various tasks and complete them to earn tokens instantly.', color: '#FBC607' },
    { icon: FaUsers, title: 'Refer Friends', description: 'Invite your friends and earn bonus tokens for every successful referral.', color: '#FBC607' },
    { icon: FaCoins, title: 'Earn Tokens', description: 'Accumulate tokens that can be redeemed for rewards or withdrawn as cash.', color: '#FBC607' },
    { icon: HiChartBar, title: 'Track Progress', description: 'Monitor your earnings and progress with detailed analytics and reports.', color: '#FBC607' },
    { icon: HiLightningBolt, title: 'Instant Rewards', description: 'Get rewarded immediately upon task completion with no delays.', color: '#FBC607' },
    { icon: HiShieldCheck, title: 'Secure Platform', description: 'Your data and earnings are protected with enterprise-grade security.', color: '#FBC607' },
  ];

  const howItWorks = [
    { step: '01', title: 'Sign Up', description: 'Create your free account in less than a minute and get started immediately.', icon: IoRocketSharp },
    { step: '02', title: 'Complete Tasks', description: 'Choose from available tasks, complete them, and earn tokens for each completed task.', icon: IoCheckmarkCircle },
    { step: '03', title: 'Get Rewarded', description: 'Accumulate tokens and redeem them for cash, gift cards, or other exciting rewards.', icon: IoGiftSharp },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Active User', content: "Kubotai has been amazing! I've earned over 10,000 tokens in just two months by completing simple tasks." },
    { name: 'Michael Chen', role: 'Top Referrer', content: "The referral program is fantastic. I've referred 50+ friends and the bonus tokens keep rolling in!" },
    { name: 'Emily Rodriguez', role: 'Daily User', content: 'Love the variety of tasks available. There\'s always something new to do and the rewards are instant!' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section id="home" style={{ position: 'relative', paddingTop: '8rem', paddingBottom: '0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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
          <div style={{ position: 'absolute', top: '-10rem', right: '-10rem', width: '35rem', height: '35rem', borderRadius: '50%', background: 'rgba(251,198,7,.06)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-10rem', left: '-10rem', width: '30rem', height: '30rem', borderRadius: '50%', background: 'rgba(251,198,7,.04)', filter: 'blur(100px)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 10 }}>
          <div className="grid lg:grid-cols-2 lg:gap-24 gap-4 items-center justify-between">
            {/* Left copy */}
            <div>
              <div
                data-aos="fade-down"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', borderRadius: '9999px',
                  border: '1px solid rgba(251,198,7,.5)',
                  background: 'rgba(251,198,7,.08)',
                  marginBottom: '1.5rem',
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FBC607', display: 'inline-block' }} />
                <span className='text-xs' style={{ fontWeight: 300, color: '#FBC607', letterSpacing: '.05em' }}>
                  Earn While You Complete Tasks
                </span>
              </div>

              <h1
                data-aos="fade-up"
                data-aos-delay="80"
                style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-.02em' }}
              >
                Turn your Time {' '}
                <br />
                into {' '}
                <span style={{ color: '#FBC607' }}>Real Rewards</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="160"
                style={{ fontSize: '1rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.75, maxWidth: '480px', marginBottom: '2rem' }}
              >
                Complete simple tasks, refer friends, and earn tokens that can be redeemed for real rewards. Join thousands of users already earning on Kubotai.
              </p>

              <div data-aos="fade-up" data-aos-delay="240" className='flex gap-2 w-full pb-4'>
                <div className='lg:w-[40%] w-full'>
                  <SolidBtn text="Get Started" onClick={() => (window.location.href = '#signup')} />
                </div>
                <div className='lg:w-[40%] w-full'>
                  <GrayBtn text="Watch Video" onClick={() => (window.location.href = '#how-it-works')} />
                </div>
              </div>

              {/* Stats */}
              <div data-aos="fade-up" data-aos-delay="320" className='flex flex-wrap lg:gap-10 gap-5 pt-4 lg:pb-0 pb-10'>
                {[
                  { value: `${stats.users.toLocaleString()}+`, label: 'Active Users' },
                  { value: `${(stats.tasks / 1000000).toFixed(0)}M+`, label: 'Tasks Completed' },
                  { value: `$${(stats.rewards / 1000).toFixed(0)}K+`, label: 'Rewards Paid' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 800, color: '#FBC607' }} className='lg:text-2xl text-2xl '>{s.value}</div>
                    <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', marginTop: '4px' }} className='lg:text-lg text-sm'>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right hero image */}
            <div data-aos="fade-left" data-aos-delay="200"
              className='w-full mb-10'
            >
              <img src={kubotImage} alt="Kubotai Hero" className='w-full' />
            </div>
          </div>
        </div>

        {/* Partners bar */}
        {/* <div
          style={{ marginTop: '5rem', background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)', padding: '1.5rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.25)', letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Satisfied Partners</span>
            {['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum'].map((p, i) => (
              <span key={i} style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.18)', fontWeight: 600, letterSpacing: '.05em' }}>{p}</span>
            ))}
          </div>
        </div> */}
      </section>

      {/* ── FEATURES ── */}
      <section id="tasks" style={{ padding: '6rem 0', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%,rgba(251,198,7,.04) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '9999px',
              border: '1px solid rgba(251,198,7,.4)', color: '#FBC607',
              fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', marginBottom: '1rem',
            }}>Features</span>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: '.75rem' }}>
              Future Breakdown
            </h2>
            <p style={{ color: 'rgba(255,255,255,.4)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Secure, scalable, and decentralized solutions for your digital assets—experience the future of financial freedom.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div
                className='text-center'
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,.06)',
                  borderRadius: '16px',
                  padding: '2rem',
                  transition: 'border-color .3s,transform .3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(251,198,7,.3)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.06)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: 'rgba(251,198,7,.1)',
                  border: '1px solid rgba(251,198,7,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} className='m-auto mb-5'>
                  <f.icon style={{ width: 24, height: 24, color: '#FBC607' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }} className='text-base'>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section style={{ padding: '5rem 0', background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '9999px',
              border: '1px solid rgba(251,198,7,.4)', color: '#FBC607',
              fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', marginBottom: '1rem',
            }}>Statistics</span>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: '.75rem' }}>
              Completely Leverage <span style={{ color: '#FBC607' }}>Kubotai</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.4)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Leading the way in reward innovation, we are redefining how users earn and redeem tokens bringing a new era of financial opportunity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '1M+', label: 'Tasks Completed' },
              { value: '$500K+', label: 'Rewards Paid' },
            ].map((s, i) => (
              <div key={i} data-aos="zoom-in" data-aos-delay={i * 120}>
                <div style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, color: '#FBC607', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,.4)', marginTop: '.5rem', fontSize: '.95rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '6rem 0', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%,rgba(251,198,7,.03) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className='flex flex-col lg:gap-20 gap-3 lg:flex-row '>
            {/* Left placeholder */}
            <div data-aos="fade-right" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
              }}>
                <img src={bottomImage} alt="" />
              </div>
            </div>

            {/* Right steps */}
            <div>
              <div data-aos="fade-left">
                <span style={{
                  display: 'inline-block', padding: '5px 16px', borderRadius: '9999px',
                  border: '1px solid rgba(251,198,7,.4)', color: '#FBC607',
                  fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', marginBottom: '1rem',
                }}>Feature</span>
                <h2 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, marginBottom: '.75rem' }}>
                  How It <span style={{ color: '#FBC607' }}>Works</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,.4)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '420px' }}>
                  Get started in three simple steps and begin earning tokens today
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {howItWorks.map((step, index) => (
                  <div
                    key={index}
                    data-aos="fade-left"
                    data-aos-delay={index * 100}
                    onClick={() => setActiveStep(index)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      border: activeStep === index ? '1px solid rgba(251,198,7,.45)' : '1px solid rgba(255,255,255,.06)',
                      background: activeStep === index ? 'rgba(251,198,7,.05)' : '#141414',
                      cursor: 'pointer',
                      transition: 'all .3s',
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: activeStep === index ? '#FBC607' : 'rgba(255,255,255,.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background .3s',
                    }}>
                      <step.icon style={{ width: 22, height: 22, color: activeStep === index ? '#000' : 'rgba(255,255,255,.35)' }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: '.3rem' }} className='text-base pt-5'>{step.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }} className='text-base'>
                        {step.description}
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '1.4rem', fontWeight: 900, color: activeStep === index ? '#FBC607' : 'rgba(255,255,255,.08)' }}>
                      {step.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '6rem 0', background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '9999px',
              border: '1px solid rgba(251,198,7,.4)', color: '#FBC607',
              fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', marginBottom: '1rem',
            }}>Testimonial</span>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: '.75rem' }}>
              What Our Users <span style={{ color: '#FBC607' }}>Say</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.4)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Join thousands of satisfied users earning tokens every day
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,.06)',
                  borderRadius: '16px',
                  padding: '2rem',
                  transition: 'border-color .3s,transform .3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(251,198,7,.25)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.06)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: '#FBC607', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{t.content}"
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{t.name}</div>
                  <div style={{ color: '#FBC607', fontSize: '.8rem', marginTop: '2px' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '6rem 0', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%,rgba(251,198,7,.03) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-10 items-center'>
            <div data-aos="fade-right">
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: '1.25rem' }}>
                About <span style={{ color: '#FBC607' }}>Kubotai</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,.45)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Kubotai is a revolutionary platform that connects users with opportunities to earn real rewards. We believe everyone should have access to simple ways to earn money online.
              </p>
              <p style={{ color: 'rgba(255,255,255,.45)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Since our launch, we've helped thousands of users earn tokens by completing tasks and referring friends. Our platform is trusted, secure, and designed to provide the best earning experience possible.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: HiCheckCircle, title: 'Trusted Platform', desc: 'Secure and reliable with thousands of satisfied users' },
                  { icon: HiLightningBolt, title: 'Instant Rewards', desc: 'Get rewarded immediately for completing tasks' },
                  { icon: HiUserGroup, title: 'Growing Community', desc: 'Join a thriving community of earners worldwide' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: 'rgba(251,198,7,.1)', border: '1px solid rgba(251,198,7,.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <item.icon style={{ width: 20, height: 20, color: '#FBC607' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>{item.title}</div>
                      <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.875rem' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: '420px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,.07)',
                background: 'rgba(255,255,255,.02)',
                padding: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '340px',
              }}>
                <img src={generalImages.logo} alt="Kubotai Logo" style={{ width: '100%', borderRadius: '12px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 0', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%,rgba(251,198,7,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div data-aos="zoom-in">
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '9999px',
              border: '1px solid rgba(251,198,7,.4)', color: '#FBC607',
              fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', marginBottom: '1.5rem',
            }}>Revolutionary</span>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
              Enhance Your Earning With<br />Seamless Task Rewards
            </h2>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
              Join a thriving community committed to maximising your rewards, empowering your earning journey with trust, innovation, and security.
            </p>
            <a
              href="#signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px', borderRadius: '10px',
                background: '#FBC607', color: '#000',
                fontWeight: 700, fontSize: '.95rem',
                textDecoration: 'none',
                transition: 'opacity .2s,transform .2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '.88'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ─── FAQ ─────────────────────────────────── */
const faqs = [
  { q: 'What is Kubotai, and how does it work?', a: 'Kubotai is a platform where you earn tokens by completing simple online tasks. You can then redeem those tokens for real cash or gift card rewards.' },
  { q: 'How do I start earning tokens?', a: 'Simply create a free account, browse the available tasks, complete them, and tokens are credited to your account instantly.' },
  { q: 'Is the platform secure?', a: 'Yes. Kubotai uses enterprise-grade security to protect your personal data and earnings at all times.' },
  { q: 'How do referrals work?', a: 'Share your unique referral code with friends. When they sign up and start completing tasks, you earn bonus tokens automatically.' },
  { q: 'How can I withdraw my earnings?', a: 'You can redeem your tokens for cash, gift cards, or other exciting rewards directly from your dashboard.' },
  { q: 'Is there a minimum withdrawal amount?', a: 'Minimum thresholds vary by reward type. Check the rewards section in your dashboard for full details.' },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: '6rem 0', background: '#0a0a0a' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: '9999px',
            border: '1px solid rgba(251,198,7,.4)', color: '#FBC607',
            fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', marginBottom: '1rem',
          }}>FAQ</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: '.75rem' }}>
            Get Answers To Common Questions
          </h2>
          <p style={{ color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
            From basics to advanced topics, find everything you need to know right here. Let us help you simplify the process and find the clarity you're looking for.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              style={{
                border: open === i ? '1px solid rgba(251,198,7,.35)' : '1px solid rgba(255,255,255,.07)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color .3s',
                background: '#111',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.1rem 1.5rem',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#fff', fontWeight: 500, textAlign: 'left',
                  gap: '1rem',
                }} className='text-base'
              >
                {faq.q}
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${open === i ? '#FBC607' : 'rgba(255,255,255,.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: open === i ? '#FBC607' : 'rgba(255,255,255,.3)',
                  transition: 'all .3s',
                }} className='text-base'>
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }} className='text-base'>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;