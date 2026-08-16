import React, { useState } from 'react';
import { BsLink } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { FiShare2, FiUsers } from 'react-icons/fi';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useGetFriends, useGetInvitation } from '../../hooks/queries/allQueries';

interface TeamMember {
    id: string;
    created_at: string;
    referred_user: {
        username: string;
    };
}

interface FriendsData {
    data: {
        data: TeamMember[];
    };
}

interface InvitationData {
    data: {
        data: {
            referral_code: string;
        };
    };
}

const Friends: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Team' | 'Security Circle'>('Team');
    const [copied, setCopied] = useState(false);

    // Hooks
    const { getFriendsData = { data: { data: [] } }, isLoading } = useGetFriends() as { getFriendsData?: FriendsData; isLoading: boolean };
    const { getInvitationToken = { data: { data: { referral_code: '' } } }, isLoading: getInvitationLoading } = useGetInvitation() as { getInvitationToken?: InvitationData; isLoading: boolean };

    const myFriendsData = getFriendsData?.data?.data || [];
    const inviteCode = getInvitationToken?.data?.data?.referral_code || '';
    const totalInvited = myFriendsData.length;

    const handleCopyCode = async () => {
        if (inviteCode) {
            try {
                await navigator.clipboard.writeText(inviteCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const TeamMemberItem = ({ member, delay = 0 }: { member: TeamMember; delay?: number }) => {
        const initials = member?.referred_user?.username?.[0]?.toUpperCase() || 'U';
        const formattedDate = new Date(member?.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        return (
            <div
                className="fu flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200"
                style={{ animationDelay: `${delay}s` }}
            >
                <div className="flex items-center flex-1 gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A876] to-[#e0a800] flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-lg">{initials}</span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base truncate">
                            {member?.referred_user?.username || 'User'}
                        </h3>
                        <p className="text-white/40 text-sm truncate">
                            @{member?.referred_user?.username?.slice(0, 20) || 'user'}
                        </p>
                    </div>
                </div>

                {/* Date */}
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-white/50 text-sm whitespace-nowrap">{formattedDate}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .fu { animation: fade-up .45s ease both; }
        .d1 { animation-delay:.08s; }
        .d2 { animation-delay:.16s; }
        .d3 { animation-delay:.24s; }
        .d4 { animation-delay:.32s; }
        .d5 { animation-delay:.40s; }
        .d6 { animation-delay:.48s; }
        .dm-sans { font-family: 'DM Sans', sans-serif; }

        * { font-family: 'DM Sans', sans-serif; }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(251,198,7,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(251,198,7,0.5); }
      `}</style>

            <div className="min-h-screen px-5 flex justify-center text-white dm-sans">
                <LoadingOverlay visible={isLoading} />
                <div className="w-full max-w-100 flex flex-col pt-5 pb-24">

                    {/* ── HEADER ── */}
                    <div className="fu d1 mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-1">Friends</h1>
                        <p className="text-white/40 text-sm">Grow your network and build your team</p>
                    </div>

                    {/* ── TAB NAVIGATION ── */}
                    <div className="fu d2 flex gap-3 mb-8">
                        <button
                            onClick={() => setActiveTab('Team')}
                            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 ${activeTab === 'Team'
                                ? 'bg-[#C9A876] text-black shadow-[0_4px_20px_rgba(251,198,7,.35)]'
                                : 'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                                }`}
                        >
                            Team
                        </button>

                        <button
                            onClick={() => setActiveTab('Security Circle')}
                            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'Security Circle'
                                ? 'bg-[#C9A876] text-black shadow-[0_4px_20px_rgba(251,198,7,.35)]'
                                : 'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                                }`}
                        >
                            Security Circle
                        </button>
                    </div>

                    {/* ── CONTENT AREA ── */}
                    {activeTab === 'Team' && (
                        <div className="fu d3">
                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-8">
                                {/* Invited Stats */}
                                <div className="fu d3 rounded-2xl p-5 bg-white/[0.04] border border-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)] flex items-center justify-center">
                                            <FiUsers className="w-4 h-4 text-[#C9A876]" />
                                        </div>
                                        <p className="text-white/50 text-xs font-medium">You have invited</p>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{totalInvited}</p>
                                    <p className="text-white/40 text-xs">
                                        {totalInvited === 1 ? 'pioneer' : 'pioneers'}
                                    </p>
                                </div>

                                {/* Team Stats */}
                                <div className="fu d4 rounded-2xl p-5 bg-[rgba(251,198,7,.06)] border border-[rgba(251,198,7,.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)] flex items-center justify-center">
                                            <FiUsers className="w-4 h-4 text-[#C9A876]" />
                                        </div>
                                        <p className="text-white/50 text-xs font-medium">Your team has</p>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-[#C9A876] mb-1">{myFriendsData.length}</p>
                                    <p className="text-white/40 text-xs">
                                        {myFriendsData.length === 1 ? 'member' : 'members'}
                                    </p>
                                </div>
                            </div>

                            {/* ── DIVIDER ── */}
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                            {/* ── TEAM MEMBERS LIST OR EMPTY STATE ── */}
                            {!isLoading && (
                                <div className="fu d5">
                                    {myFriendsData.length > 0 ? (
                                        <div>
                                            <h2 className="text-lg font-bold text-white mb-4">Team Members</h2>
                                            <div className="space-y-3">
                                                {myFriendsData.map((member, idx) => (
                                                    <TeamMemberItem
                                                        key={member.id}
                                                        member={member}
                                                        delay={0.08 + idx * 0.06}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                                            <div className="w-16 h-16 rounded-2xl bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)] flex items-center justify-center mb-4">
                                                <FiUsers className="w-8 h-8 text-[#C9A876]" />
                                            </div>
                                            <p className="text-white text-center font-semibold text-base">No team members yet</p>
                                            <p className="text-white/40 text-sm mt-2 text-center max-w-xs">
                                                Invite friends using your referral code to build your team
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'Security Circle' && (
                        <div className="fu d3 flex items-center justify-center py-32 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                            <p className="text-white/50 text-center font-medium text-lg">
                                Content coming soon
                            </p>
                        </div>
                    )}

                    {/* ── DIVIDER ── */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                    {/* ── COPY CODE SECTION ── */}
                    <div className="fu d6">
                        <h3 className="text-sm font-semibold text-white/60 mb-3">Your Referral Code</h3>
                        <button
                            onClick={handleCopyCode}
                            disabled={getInvitationLoading || !inviteCode}
                            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-3 ${copied
                                ? 'bg-[#10B981] text-white shadow-[0_4px_20px_rgba(16,185,129,.35)] hover:opacity-90'
                                : 'bg-gradient-to-br from-[#C9A876] to-[#e0a800] text-black shadow-[0_4px_20px_rgba(251,198,7,.35)] hover:opacity-90'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {copied ? (
                                <>
                                    <FaCheckCircle className="w-5 h-5" />
                                    <span>Copied to clipboard!</span>
                                </>
                            ) : (
                                <>
                                    <BsLink className="w-5 h-5" />
                                    <span>Copy Referral Code</span>
                                </>
                            )}
                        </button>

                        {/* Display Code */}
                        {inviteCode && (
                            <div className="mt-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                                <p className="text-white/40 text-xs mb-2">Your Code:</p>
                                <div className="flex items-center justify-between gap-3">
                                    <code className="text-[#C9A876] font-mono font-semibold text-sm">{inviteCode}</code>
                                    <button
                                        onClick={handleCopyCode}
                                        className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-white/50 hover:text-[#C9A876]"
                                    >
                                        <FiShare2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Friends;