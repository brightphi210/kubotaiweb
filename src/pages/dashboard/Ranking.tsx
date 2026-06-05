import React, { useState } from 'react';
import { useGetGlobalTokens, useGetRegionalTokens } from '../../hooks/queries/allQueries';

type RankingTab = 'regional' | 'global';

const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map((word: string) => word[0]).join('').toUpperCase();
};

interface RankingItemProps {
    leader: any;
    index: number;
}

const RankingItem: React.FC<RankingItemProps> = ({ leader, index }) => {
    const rank = index + 1;
    const isTopThree = rank <= 3;

    const getRankBg = (rank: number) => {
        if (rank === 1) return 'bg-[rgba(251,198,7,.08)]';
        if (rank === 2) return 'bg-white/[0.04]';
        if (rank === 3) return 'bg-[rgba(251,198,7,.06)]';
        return 'bg-white/[0.02]';
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-[#FBC607]';
        if (rank === 2) return 'text-white/70';
        if (rank === 3) return 'text-[rgba(251,198,7,.8)]';
        return 'text-white/60';
    };

    const username = leader?.owner?.username || 'Unknown User';
    const avatarUrl = leader?.owner?.profile?.image;
    const quantity = leader?.quantity || 0;

    return (
        <div className={`flex items-center py-3 sm:py-4 px-3 sm:px-5 gap-3 sm:gap-4 rounded-xl border border-white/[0.07] ${getRankBg(rank)} hover:bg-white/[0.06] hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200 fu`}>
            {/* Rank Number */}
            <div className="w-6 sm:w-8 text-center flex-shrink-0">
                <span className={`text-base sm:text-lg font-bold ${getRankColor(rank)}`}>{rank}</span>
            </div>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border border-white/[0.15]"
                    />
                ) : (
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[rgba(251,198,7,.15)] flex items-center justify-center border border-[rgba(251,198,7,.3)]">
                        <span className="text-xs sm:text-sm font-bold text-[#FBC607]">{getInitials(username)}</span>
                    </div>
                )}

                {/* Badge for top 3 */}
                {isTopThree && (
                    <div className="absolute -top-2 -right-2 w-5 sm:w-6 h-5 sm:h-6 bg-[#FBC607] rounded-full flex items-center justify-center text-[0.6rem] sm:text-xs font-bold text-black border-2 border-white/[0.15] shadow-md">
                        {rank === 1 ? '👑' : '⭐'}
                    </div>
                )}
            </div>

            {/* Username */}
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white truncate">{username}</p>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0 whitespace-nowrap">
                <p className="text-sm sm:text-base font-bold text-[#4ade80]">{quantity.toLocaleString()} KU</p>
            </div>
        </div>
    );
};

const Ranking: React.FC = () => {
    const [activeTab, setActiveTab] = useState<RankingTab>('regional');

    const { getRegionalLeader, isLoading: regionalLoading } = useGetRegionalTokens();
    const { getGlobalLeader, isLoading: globalLoading } = useGetGlobalTokens();

    const regionalData = getRegionalLeader?.data?.results || [];
    const globalData = getGlobalLeader?.data?.results || [];

    // Sort by quantity descending
    const sortedRegionalData = [...regionalData].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    const sortedGlobalData = [...globalData].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));

    const displayedRankings = activeTab === 'regional' ? sortedRegionalData : sortedGlobalData;
    const isLoading = activeTab === 'regional' ? regionalLoading : globalLoading;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

                @keyframes fade-up {
                  from { opacity:0; transform:translateY(14px); }
                  to   { opacity:1; transform:translateY(0); }
                }

                .fu            { animation: fade-up .45s ease both; }
                .d1 { animation-delay:.08s; }
                .d2 { animation-delay:.16s; }
                .d3 { animation-delay:.24s; }
                .dm-sans  { font-family: 'DM Sans',  sans-serif; }
            `}</style>

            <div className="min-h-screen px-4 sm:px-5 flex justify-center text-white dm-sans">
                <div className="w-full max-w-2xl sm:max-w-100 flex flex-col pb-10">

                    {/* Tab Navigation */}
                    <div className="fu d2 flex gap-4 sm:gap-8 mb-6 sm:mb-8 border-b border-white/[0.07] pb-3 sm:pb-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('regional')}
                            className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'regional'
                                ? 'text-[#FBC607] border-b-2 border-[#FBC607]'
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            Regional
                        </button>
                        <button
                            onClick={() => setActiveTab('global')}
                            className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === 'global'
                                ? 'text-[#FBC607] border-b-2 border-[#FBC607]'
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            Global
                        </button>
                    </div>

                    {/* Rankings List */}
                    {isLoading ? (
                        <div className="fu d3 flex flex-col items-center justify-center py-12 sm:py-20">
                            <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-white/[0.15] border-t-[#FBC607] rounded-full animate-spin mb-2 sm:mb-3" />
                            <p className="text-white/50 text-xs sm:text-sm">Loading rankings...</p>
                        </div>
                    ) : displayedRankings.length === 0 ? (
                        <div className="fu d3 flex flex-col items-center justify-center py-12 sm:py-20 bg-white/[0.04] rounded-2xl border border-white/[0.07]">
                            <span className="text-3xl sm:text-4xl mb-2 sm:mb-3">📊</span>
                            <p className="text-xs sm:text-sm text-white/60">No ranking data available</p>
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {displayedRankings.map((leader: any, idx: number) => (
                                <div key={leader.id || idx} style={{ animationDelay: `${0.16 + idx * 0.06}s` }}>
                                    <RankingItem leader={leader} index={idx} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Ranking;