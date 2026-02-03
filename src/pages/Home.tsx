import { useState, useEffect } from 'react';
import {
    HiCheckCircle,
    HiUserGroup,
    HiLightningBolt,
    HiCash,
    HiChartBar,
    HiShieldCheck
} from 'react-icons/hi';
import {
    IoRocketSharp,
    IoGiftSharp,
    IoTrophySharp,
    IoCheckmarkCircle
} from 'react-icons/io5';
import { FaTasks, FaUsers, FaCoins } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GrayBtn, SolidBtn } from '../btns/AllBtns';
import { generalImages } from '../utils/images';

const Home = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    tasks: 0,
    rewards: 0
  });

  // Animated counter
  useEffect(() => {
    const targetUsers = 50000;
    const targetTasks = 1000000;
    const targetRewards = 500000;
    
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        users: Math.floor(targetUsers * progress),
        tasks: Math.floor(targetTasks * progress),
        rewards: Math.floor(targetRewards * progress)
      });

      if (currentStep >= steps) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate how it works steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: FaTasks,
      title: 'Complete Tasks',
      description: 'Browse through various tasks and complete them to earn tokens instantly.',
      color: 'bg-blue-500'
    },
    {
      icon: FaUsers,
      title: 'Refer Friends',
      description: 'Invite your friends and earn bonus tokens for every successful referral.',
      color: 'bg-yellow-500'
    },
    {
      icon: FaCoins,
      title: 'Earn Tokens',
      description: 'Accumulate tokens that can be redeemed for rewards or withdrawn as cash.',
      color: 'bg-blue-600'
    },
    {
      icon: HiChartBar,
      title: 'Track Progress',
      description: 'Monitor your earnings and progress with detailed analytics and reports.',
      color: 'bg-yellow-600'
    },
    {
      icon: HiLightningBolt,
      title: 'Instant Rewards',
      description: 'Get rewarded immediately upon task completion with no delays.',
      color: 'bg-blue-500'
    },
    {
      icon: HiShieldCheck,
      title: 'Secure Platform',
      description: 'Your data and earnings are protected with enterprise-grade security.',
      color: 'bg-yellow-500'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Sign Up',
      description: 'Create your free account in less than a minute and get started immediately.',
      icon: IoRocketSharp
    },
    {
      step: '02',
      title: 'Complete Tasks',
      description: 'Choose from available tasks, complete them, and earn tokens for each completed task.',
      icon: IoCheckmarkCircle
    },
    {
      step: '03',
      title: 'Get Rewarded',
      description: 'Accumulate tokens and redeem them for cash, gift cards, or other exciting rewards.',
      icon: IoGiftSharp
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Active User',
      content: 'Kubotai has been amazing! I\'ve earned over 10,000 tokens in just two months by completing simple tasks.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Top Referrer',
      content: 'The referral program is fantastic. I\'ve referred 50+ friends and the bonus tokens keep rolling in!',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Daily User',
      content: 'Love the variety of tasks available. There\'s always something new to do and the rewards are instant!',
      avatar: '👩‍🎓'
    }
  ];

    useEffect(() => {
        localStorage.getItem('theme') === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 dark:bg-blue-950/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-100 dark:bg-yellow-950/30 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-50 dark:bg-yellow-950/50 rounded-full mb-4 sm:mb-6 animate-fadeIn">
                <IoTrophySharp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs sm:text-sm font-semibold text-yellow-600 dark:text-yellow-400">Earn While You Complete Tasks</span>
              </div>
              
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight animate-slideUp">
                Turn your Time into{' '}
                <br />
                <span className="text-yellow-600 dark:text-yellow-500">
                 Real Rewards
                </span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 lg:w-full w-[90%] justify-center max-w-2xl mx-auto lg:mx-0 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Complete simple tasks, refer friends, and earn tokens that can be redeemed for real rewards. Join thousands of users already earning on Kubotai.
              </p>

              <div className="flex sm:flex-row gap-2 sm:gap-2 justify-center lg:justify-start animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div>
                    <SolidBtn text="Start Earning" onClick={() => window.location.href = '#signup'} />
                </div>
                <div
                >
                  <GrayBtn text="Learn More" onClick={() => window.location.href = '#how-it-works'} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-8 sm:mt-6 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.users.toLocaleString()}+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(stats.tasks / 1000).toFixed(0)}M+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Tasks Completed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${(stats.rewards / 1000).toFixed(0)}K+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Rewards Paid</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10 bg-blue-50/50 dark:bg-neutral-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-blue-200 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                      <FaTasks className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Daily Tasks</div>
                  </div>
                  
                  <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                      <HiCash className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">$50K+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Paid Out</div>
                  </div>
                  
                  <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                      <HiUserGroup className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">10K+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Referrals</div>
                  </div>
                  
                  <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                      <HiLightningBolt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Instant</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rewards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="tasks" className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Why Choose{' '}
              <span className="text-yellow-600 dark:text-yellow-400">
                Kubotai
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Everything you need to start earning tokens and rewards in one powerful platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-neutral-700"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              How It{' '}
              <span className="text-yellow-600 dark:text-yellow-400">
                Works
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Get started in three simple steps and begin earning tokens today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connection Lines - Hidden on mobile */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-1 bg-blue-200 dark:bg-blue-900 opacity-20"></div>
            
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 transition-all duration-500 ${
                  activeStep === index
                    ? 'border-blue-600 scale-99 shadow-2xl'
                    : 'border-gray-100 dark:border-neutral-800'
                }`}
              >
                {/* Step Number */}
                <div className={`absolute -top-2 -right-2 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-2xl transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-blue-600 text-white shadow-xl'
                    : 'bg-gray-200 dark:bg-neutral-800 text-gray-500 dark:text-gray-300'
                }`}>
                  {step.step}
                </div>

                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-blue-600'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}>
                  <step.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    activeStep === index ? 'text-white' : 'text-gray-500 dark:text-gray-300'
                  }`} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">
                  {step.description}
                </p>

                {activeStep === index && (
                  <div className="mt-4 sm:mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">
                    <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Active Step</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
            {howItWorks.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-blue-600 w-6 sm:w-8'
                    : 'bg-gray-300 dark:bg-neutral-700 w-2 sm:w-3'
                }`}
                aria-label={`Step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              What Our Users{' '}
              <span className="text-yellow-600 dark:text-yellow-400">
                Say
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Join thousands of satisfied users earning tokens every day
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-neutral-700"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-3 sm:mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg sm:text-xl">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                About{' '}
                <span className="text-yellow-600 dark:text-yellow-400">
                  Kubotai
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Kubotai is a revolutionary platform that connects users with opportunities to earn real rewards. We believe everyone should have access to simple ways to earn money online, and we've built a platform that makes that possible.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Since our launch, we've helped thousands of users earn tokens by completing tasks and referring friends. Our platform is trusted, secure, and designed to provide the best earning experience possible.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Trusted Platform</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Secure and reliable with thousands of satisfied users</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-yellow-500 flex items-center justify-center shrink-0">
                    <HiLightningBolt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Instant Rewards</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Get rewarded immediately for completing tasks</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                    <HiUserGroup className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Growing Community</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Join a thriving community of earners worldwide</p>  
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10 bg-blue-50/50 dark:bg-neutral-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200 dark:border-neutral-800">
                <img
                    src={generalImages.logo}
                    alt="About Kubotai"
                    className="rounded-5xl sm:rounded-5xl shadow-sm w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-200 dark:bg-yellow-950/30 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 dark:bg-blue-950/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join Kubotai today and turn your time into rewards. It's free, easy, and takes less than a minute to get started.
          </p>
          <a
            href="#signup"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold text-base hover:bg-gray-100 transition-all duration-300 shadow-sm"
          >
            Create Free Account
          </a>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;