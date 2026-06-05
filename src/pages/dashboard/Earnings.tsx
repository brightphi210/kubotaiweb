import React from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { MdOutlineMonetizationOn, MdOutlinePeopleAlt } from 'react-icons/md';
import { useGetRecentEarnings } from '../../hooks/queries/allQueries';

const Earnings: React.FC = () => {
    const { getRecentEarnings, isLoading } = useGetRecentEarnings();
    const earningsApiData = getRecentEarnings?.data?.data || [];

    const getEarningIcon = (earning: any) => {
        if (earning.task_earning) return <IoCheckmarkCircleOutline />;
        if (earning.referral_earning) return <MdOutlinePeopleAlt />;
        if (earning.mined_token) return <MdOutlineMonetizationOn />;
        return <MdOutlineMonetizationOn />;
    };

    const getEarningTitle = (earning: any) => {
        if (earning.task_earning) return earning.task_earning.title;
        if (earning.referral_earning) return `You referred ${earning.referral_earning.referred_user.username}`;
        if (earning.mined_token) return `You earned ${earning.mined_token.tokens_mined} KU after mining`;
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
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEarningCategory = (earning: any) => {
        if (earning.task_earning) return 'Task';
        if (earning.referral_earning) return 'Referral';
        if (earning.mined_token) return 'Mining';
        return 'Other';
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Task': return {
                bg: 'bg-[#FBC607]/40',
                text: 'text-[#FBC607]',
                border: 'border-[#FBC607]/50'
            };
            case 'Referral': return {
                bg: 'bg-[rgba(251,198,7,.15)]',
                text: 'text-[#FBC607]',
                border: 'border-[rgba(251,198,7,.3)]'
            };
            case 'Mining': return {
                bg: 'bg-black/10',
                text: 'text-[#4ade80]',
                border: 'border-black/20'
            };
            default: return {
                bg: 'bg-white/[0.04]',
                text: 'text-white/60',
                border: 'border-white/[0.07]'
            };
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

                @keyframes fade-up {
                  from { opacity:0; transform:translateY(14px); }
                  to   { opacity:1; transform:translateY(0); }
                }

                .fu            { animation: fade-up .45s ease both; }
                .d1 { animation-delay:.08s; }
                .d2 { animation-delay:.16s; }
                .d3 { animation-delay:.24s; }
                .d4 { animation-delay:.32s; }
                .dm-sans  { font-family: 'DM Sans',  sans-serif; }
            `}</style>

            <div className="min-h-screen px-4 sm:px-5 py-6 flex justify-center text-white dm-sans">
                <div className="w-full max-w-100 flex flex-col pb-10">

                    {/* Earnings List */}
                    <div className="fu d3">
                        <h2 className="text-lg text-white/40 font-bold mb-4">Recent Earnings</h2>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-white/[0.15] border-t-[#FBC607] rounded-full animate-spin mb-3" />
                                <p className="text-white/50 text-sm">Loading earnings...</p>
                            </div>
                        ) : earningsApiData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.04] rounded-2xl border border-white/[0.07]">
                                <span className="text-4xl mb-3">💰</span>
                                <p className="text-sm text-white/60">No earnings yet</p>
                                <p className="text-xs text-white/40 mt-1">Try to be active to earn tokens</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {earningsApiData.map((earning: any, idx: number) => {
                                    const category = getEarningCategory(earning);
                                    const colors = getCategoryColor(category);
                                    const amount = getEarningAmount(earning);

                                    return (
                                        <div
                                            key={earning.id || idx}
                                            className="bg-neutral-900 rounded-2xl border border-white/[0.07] p-4 hover:bg-neutral-900 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200 fu"
                                            style={{ animationDelay: `${0.16 + idx * 0.06}s` }}
                                        >
                                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 sm:items-start">
                                                <div className={`w-10 h-10 rounded-md flex items-center justify-center text-lg flex-shrink-0 bg-neutral-800`}>
                                                    <p className="text-2xl">{getEarningIcon(earning)}</p>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                                        <h3 className="text-sm font-semibold text-white break-words">
                                                            {getEarningTitle(earning).length > 50
                                                                ? getEarningTitle(earning).slice(0, 50) + '...'
                                                                : getEarningTitle(earning)
                                                            }
                                                        </h3>
                                                        <p className="text-sm font-bold text-[#FBC607] flex-shrink-0">+{amount} KU</p>
                                                    </div>
                                                    <p className="text-xs text-white/40 mb-2">
                                                        {getEarningDate(earning)}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.07]">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors.bg} ${colors.text}`}>
                                                            {category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Earnings;