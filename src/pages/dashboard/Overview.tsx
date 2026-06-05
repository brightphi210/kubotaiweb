import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FiAward,
  FiBarChart2,
  FiChevronRight,
  FiClock,
  FiPlay,
  FiShare2,
  FiTrendingUp,
  FiUsers,
  FiZap
} from 'react-icons/fi';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useClaimMining } from '../../hooks/mutations/allMutation';
import { useGetNews, useGetProfile, useGetRecentEarnings, useGetTotalUserToken } from '../../hooks/queries/allQueries';

/* ─── constants ─────────────────────────────────────────────── */
const TOKENS_PER_SESSION = 3;
const MINING_DURATION = 12 * 60 * 60; // 12 hours in seconds
const TOKENS_PER_SECOND = TOKENS_PER_SESSION / MINING_DURATION;
const TOKENS_PER_HOUR = TOKENS_PER_SECOND * 3600;

/* ─── storage helpers (localStorage — web equivalent of AsyncStorage) ── */
const STORAGE_KEY = 'miningState';

function saveMiningState(state: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving mining state:', e);
  }
}

function loadMiningState(): any | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error loading mining state:', e);
    return null;
  }
}

function calculateMiningProgress(startTime: number, currentTime: number) {
  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
  const clamped = Math.min(elapsedSeconds, MINING_DURATION);
  return {
    timeElapsed: clamped,
    tokensEarned: clamped * TOKENS_PER_SECOND,
    progress: (clamped / MINING_DURATION) * 100,
    isComplete: clamped >= MINING_DURATION,
  };
}

function fmt(s: number) {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

/* ─── circular progress ring ────────────────────────────────── */
const RADIUS = 110;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ progress }: { progress: number }) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  return (
    <svg width={260} height={260} className="absolute inset-0 m-auto top-0 left-0">
      <circle cx={130} cy={130} r={RADIUS} fill="none" stroke="rgba(251,198,7,0.08)" strokeWidth={STROKE} />
      <circle
        cx={130} cy={130} r={RADIUS}
        fill="none"
        stroke="#FBC607"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 130 130)"
        className="transition-[stroke-dashoffset] duration-[600ms] ease-in-out"
      />
    </svg>
  );
}

/* ─── blog/news card ─────────────────────────────────────────── */
function NewsCard({ post }: { post: any }) {
  const navigate = useNavigate();

  const handleNewsClick = () => {
    navigate(`/news/${post.id}`, { state: { newsData: post } });
  };

  return (
    <div
      className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200"
      onClick={handleNewsClick}
    >
      <div className="relative h-28 bg-black/20 overflow-hidden">
        {post.image_url ? (
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
        )}
        <button
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toast.info('Share feature coming soon!');
          }}
        >
          <FiShare2 className="w-3 h-3 text-white" />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[0.72rem] font-semibold text-white leading-snug line-clamp-2 mb-2">
          {post.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[0.65rem] text-white/40">
            {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-[0.65rem] text-white/40">❤ {post.likes_count ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── recent earnings item ─────────────────────────────────── */
function EarningItem({ amount, timestamp, type = 'mining', title = '' }: { amount: number; timestamp: Date; type?: string; title?: string }) {
  const timeAgo = Math.floor((Date.now() - timestamp.getTime()) / 1000);
  let timeString = '';
  console.log(timeString)

  if (timeAgo < 60) timeString = 'just now';
  else if (timeAgo < 3600) timeString = `${Math.floor(timeAgo / 60)}m ago`;
  else if (timeAgo < 86400) timeString = `${Math.floor(timeAgo / 3600)}h ago`;
  else timeString = `${Math.floor(timeAgo / 86400)}d ago`;

  const getIcon = () => {
    switch (type) {
      case 'task': return '✓';
      case 'referral': return '👥';
      case 'mining': return '⛏️';
      default: return '💰';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'task': return 'bg-[rgba(251,198,7,.15)] text-[#FBC607]';
      case 'referral': return 'bg-[rgba(251,198,7,.15)] text-[#FBC607]';
      case 'mining': return 'bg-black/10 text-[#4ade80]';
      default: return 'bg-[rgba(251,198,7,.15)] text-[#FBC607]';
    }
  };

  return (
    <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full border border-white/[0.15] flex items-center justify-center text-lg ${getColor()}`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-semibold text-white capitalize">{title.slice(0, 25) || type}...</p>
          {/* <p className="text-[0.7rem] text-white/40">{timeString}</p> */}
        </div>
      </div>
      <p className="text-sm font-bold text-[#4ade80]">+{amount} KU</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERVIEW
══════════════════════════════════════════════════════════════ */
const Overview = () => {
  /* ── query hooks ── */
  const navigate = useNavigate();
  const { getNews, isLoading: newsLoading, refetch: refetchNews } = useGetNews();
  const { isLoading: profileLoading, refetch: refetchProfile } = useGetProfile();
  const { getUserToken, isLoading: userTokenLoading } = useGetTotalUserToken();
  const { mutate: claimMining, isPending: claimPending } = useClaimMining();
  const { getRecentEarnings, isLoading: earningsLoading } = useGetRecentEarnings();

  const newsData: any[] = getNews?.data?.data ?? [];
  const userTokenData = getUserToken?.data?.data;
  const earningsApiData = getRecentEarnings?.data?.data ?? [];

  /* ─── limit to 6 earnings ─── */
  const recentEarningsData = earningsApiData.slice(0, 6);

  /* ── mining state ── */
  const [isMining, setIsMining] = useState(false);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [tokensMinedThisSession, setTokensMinedThisSession] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── initialize from storage ── */
  useEffect(() => {
    const saved = loadMiningState();
    if (saved?.isMining && saved?.miningStartTime) {
      const now = Date.now();
      const { timeElapsed, tokensEarned, progress, isComplete } =
        calculateMiningProgress(saved.miningStartTime, now);

      setMiningStartTime(saved.miningStartTime);
      setTimeElapsed(timeElapsed);
      setTokensMinedThisSession(tokensEarned);
      setRingProgress(progress);

      if (isComplete) {
        setIsMining(false);
        saveMiningState({ ...saved, isMining: false });
      } else {
        setIsMining(true);
      }
    }
  }, []);

  /* ── tick interval ── */
  useEffect(() => {
    if (isMining && miningStartTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const { timeElapsed, tokensEarned, progress, isComplete } =
          calculateMiningProgress(miningStartTime, now);

        setTimeElapsed(timeElapsed);
        setTokensMinedThisSession(tokensEarned);
        setRingProgress(progress);

        if (isComplete) {
          setIsMining(false);
          saveMiningState({
            isMining: false,
            miningComplete: true,
            miningStartTime: null,
            timeElapsed: MINING_DURATION,
            tokensMinedThisSession: tokensEarned,
          });
        }
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isMining, miningStartTime]);

  /* ── helpers ── */
  const miningComplete = timeElapsed >= MINING_DURATION && tokensMinedThisSession > 0;

  const handleMiningToggle = async () => {
    if (miningComplete) return; // must claim first

    const next = !isMining;
    setIsMining(next);

    if (next) {
      const startTime = Date.now();
      setMiningStartTime(startTime);
      setTimeElapsed(0);
      setTokensMinedThisSession(0);
      setRingProgress(0);
      saveMiningState({ isMining: true, miningStartTime: startTime, miningComplete: false, timeElapsed: 0, tokensMinedThisSession: 0 });
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setMiningStartTime(null);
      saveMiningState({ isMining: false, miningStartTime: null, miningComplete: false, timeElapsed: 0, tokensMinedThisSession: 0 });
    }
  };

  const handleClaimTokens = () => {
    claimMining(
      { tokens_mined: tokensMinedThisSession },
      {
        onSuccess: () => {
          toast.success('Mining rewards claimed successfully!');
          setTimeElapsed(0);
          setTokensMinedThisSession(0);
          setRingProgress(0);
          saveMiningState({ isMining: false, miningStartTime: null, miningComplete: false, timeElapsed: 0, tokensMinedThisSession: 0 });
        },
        onError: () => {
          toast.error('Failed to claim tokens. Please try again.');
        },
      }
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchNews(), refetchProfile()]);
    } catch (e) {
      console.error('Refresh error:', e);
    }
    setRefreshing(false);
  }, [refetchNews, refetchProfile]);

  const handleViewAllEarnings = () => {
    navigate('/earnings');
  };

  const getEarningTitle = (earning: any) => {
    if (earning.task_earning) return earning.task_earning.title;
    if (earning.referral_earning) return `You referred ${earning.referral_earning.referred_user.username}`;
    if (earning.mined_token) return `Mining Reward`;
    return 'Earning';
  };

  const getEarningAmount = (earning: any) => {
    if (earning.task_earning) return earning.task_earning.reward_tokens;
    if (earning.referral_earning) return earning.referral_earning.immediate_bonus;
    if (earning.mined_token) return earning.mined_token.tokens_mined;
    return 0;
  };

  const getEarningDate = (earning: any) => {
    const dateStr = earning.task_earning?.created_at ||
      earning.referral_earning?.created_at ||
      earning.mined_token?.date_earned ||
      earning.created_at;
    return new Date(dateStr);
  };

  const getEarningType = (earning: any) => {
    if (earning.task_earning) return 'task';
    if (earning.referral_earning) return 'referral';
    if (earning.mined_token) return 'mining';
    return 'other';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes pulse-ring {
          0%, 100% { opacity:.4; transform:scale(1); }
          50%       { opacity:.9; transform:scale(1.04); }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }

        .mining-pulse  { animation: pulse-ring 2s ease-in-out infinite; }
        .fu            { animation: fade-up .45s ease both; }
        .d1 { animation-delay:.08s; }
        .d2 { animation-delay:.16s; }
        .d3 { animation-delay:.24s; }
        .d4 { animation-delay:.32s; }
        .d5 { animation-delay:.40s; }
        .d6 { animation-delay:.48s; }
        .d7 { animation-delay:.56s; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="min-h-screen px-5 flex justify-center text-white dm-sans">
        <LoadingOverlay visible={newsLoading || profileLoading || userTokenLoading || claimPending || earningsLoading} />
        <div className="w-full max-w-100 flex flex-col pt-5">

          <main className="flex-1 pb-32 flex flex-col gap-8">

            {/* ── CIRCLE ── */}
            <div className="fu d2 flex justify-center pt-2">
              <div className="relative w-65 h-65 cursor-pointer" onClick={handleMiningToggle}>
                {isMining && (
                  <div className="mining-pulse absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,198,7,.15)_0%,transparent_70%)]" />
                )}
                <div
                  className={`absolute inset-0 rounded-full border border-[rgba(251,198,7,.12)] transition-shadow duration-700 ${isMining ? 'shadow-[0_0_40px_rgba(251,198,7,.15),inset_0_0_40px_rgba(251,198,7,.05)]' : ''
                    }`}
                />
                <ProgressRing progress={ringProgress} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <p className="text-[0.7rem] text-white/50">Tokens Earned</p>
                  <p className="text-[2.4rem] font-bold dm-mono">
                    {tokensMinedThisSession.toFixed(4)}
                  </p>
                  <p className="text-sm font-semibold text-[#4ade80]">
                    +{TOKENS_PER_HOUR.toFixed(4)} KU/hr
                  </p>
                  <div className="flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-white/[0.06]">
                    <FiUsers className="w-3 h-3 text-[#FBC607]" />
                    <span className="text-[0.75rem] text-white/60">1/2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── TIMER + BOOST ── */}
            <div className="fu d3 flex items-center justify-center gap-4">
              {/* timer pill */}
              <div className="flex items-center gap-2 px-5 py-[10px] rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                <FiClock className="w-4 h-4 text-[#FBC607]" />
                <span className="text-sm font-semibold dm-mono">{fmt(timeElapsed)}</span>
              </div>

              {/* boost */}
              <button
                className={`flex items-center gap-2 px-7 py-[10px] rounded-2xl font-bold text-sm cursor-pointer transition-all duration-200 ${isMining
                  ? 'bg-[rgba(251,198,7,.15)] text-[#FBC607] border border-[#FBC607]'
                  : 'bg-[#FBC607] text-black border-none shadow-[0_4px_24px_rgba(251,198,7,.4)]'
                  }`}
              >
                <FiZap className="w-4 h-4" />
                {isMining ? 'Boosting…' : 'Boost'}
              </button>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="fu d4 grid grid-cols-2 gap-3">
              {/* session time */}
              <div className="rounded-2xl p-4 bg-white/[0.04] border border-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <FiClock className="w-3.5 h-3.5 text-[#FBC607]" />
                  <span className="text-[0.7rem] text-white/50">Session Time</span>
                </div>
                <p className="text-xl font-bold dm-mono">{fmt(timeElapsed)}</p>
              </div>

              {/* total balance */}
              <div className="rounded-2xl p-4 bg-[rgba(251,198,7,.06)] border border-[rgba(251,198,7,.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <MdOutlineAccountBalanceWallet className="w-3.5 h-3.5 text-[#FBC607]" />
                  <span className="text-[0.7rem] text-white/50">Total Token Balance</span>
                </div>
                {userTokenLoading ? (
                  <div className="w-20 h-6 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-xl font-bold text-[#FBC607]">
                    {userTokenData?.quantity?.toFixed(3) ?? '0.000'}
                    <span className="text-[0.75rem] text-[rgba(251,198,7,.7)] ml-1">(KU)</span>
                  </p>
                )}
              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="fu d5 grid grid-cols-2 gap-3">
              {/* start / claim / mining in progress */}
              {miningComplete ? (
                <button
                  onClick={handleClaimTokens}
                  disabled={claimPending}
                  className="py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm cursor-pointer bg-[#10B981] text-white shadow-[0_4px_20px_rgba(16,185,129,.35)] hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {claimPending ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiAward className="w-4 h-4" />
                      Claim Tokens
                    </>
                  )}
                </button>
              ) : !isMining ? (
                <button
                  onClick={handleMiningToggle}
                  className="py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm cursor-pointer bg-gradient-to-br from-[#FBC607] to-[#e0a800] text-black shadow-[0_4px_20px_rgba(251,198,7,.35)] hover:opacity-90 transition-opacity"
                >
                  <FiPlay className="w-4 h-4" />
                  Start Mining
                </button>
              ) : (
                <div className="py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm bg-[rgba(251,198,7,.15)] text-[#FBC607] border border-[rgba(251,198,7,.4)]">
                  <span className="w-3.5 h-3.5 border-2 border-[#FBC607]/40 border-t-[#FBC607] rounded-full animate-spin" />
                  Mining in progress…
                </div>
              )}

              {/* check earnings */}
              <button
                onClick={handleViewAllEarnings}
                className="py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer bg-white/[0.05] border border-white/10 text-[#FBC607] hover:bg-[rgba(251,198,7,.08)] transition-all duration-200"
              >
                <FiBarChart2 className="w-4 h-4" />
                Check Earnings
              </button>
            </div>

            {/* ── DIVIDER ── */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── NEWS ── */}
            <div className="fu d6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold mb-1">Latest News</h2>
                  <p className="text-[0.7rem] text-white/40">Stay updated with the latest updates</p>
                </div>
                <button
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="text-[0.7rem] text-[#FBC607]/70 hover:text-[#FBC607] transition-colors disabled:opacity-50 font-medium"
                >
                  {refreshing ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>

              {newsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.06] animate-pulse">
                      <div className="h-28 bg-white/[0.06]" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-white/[0.08] rounded w-full" />
                        <div className="h-3 bg-white/[0.08] rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : newsData.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <span className="text-3xl">📭</span>
                  <p className="text-sm text-white/40">No news available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {newsData.map((post: any) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* ── DIVIDER ── */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── RECENT EARNINGS ── */}
            <div className="fu d7">
              <div>
                <h2 className="text-lg font-bold mb-1">Recent Earnings</h2>
                <p className="text-[0.7rem] text-white/40 mb-4">Track your token earnings history</p>
              </div>

              {earningsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-white/[0.04] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentEarningsData.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <span className="text-3xl">💰</span>
                  <p className="text-sm text-white/40">No earnings yet</p>
                  <p className="text-xs text-white/30">Start mining to earn tokens!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentEarningsData.map((earning: any, idx: number) => (
                    <div
                      key={earning.id || idx}
                      style={{ animationDelay: `${0.08 + idx * 0.06}s` }}
                      className="fu"
                    >
                      <EarningItem
                        amount={getEarningAmount(earning)}
                        timestamp={getEarningDate(earning)}
                        type={getEarningType(earning)}
                        title={getEarningTitle(earning)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* View All Button */}
              <button
                onClick={handleViewAllEarnings}
                className="fu w-full mt-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer bg-white/[0.05] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                <FiTrendingUp className="w-4 h-4" />
                View All Earnings
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Overview;