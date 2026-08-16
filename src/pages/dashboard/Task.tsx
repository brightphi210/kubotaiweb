import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiAward, FiPlay, FiX } from 'react-icons/fi';
import { useClaimToken } from '../../hooks/mutations/allMutation';
import { useGetCompletedTask, useGetTask } from '../../hooks/queries/allQueries';

interface Task {
    id: string | number;
    image: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    reward_tokens: number;
    created_at: string;
    url?: string;
}

interface CompletedTask {
    id: string | number;
    image: string;
    date: string;
    time: string;
    title: string;
    reward_tokens: string;
    category: string;
    created_at: string;
    description: string;
}

type TabType = 'active' | 'completed';

const Tasks: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [claimedTokens, setClaimedTokens] = useState(0);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    const { getTask, isLoading } = useGetTask();
    const { getCompletedTask, isLoading: completedTaskLoading, refetch: refetchCompletedTasks } = useGetCompletedTask();
    const { mutate: claimToken, isPending: claimPending } = useClaimToken(selectedTask?.id as string | undefined);

    const allTasks: Task[] = getTask?.data?.data || [];
    const completedTasks: CompletedTask[] = getCompletedTask?.data?.data || [];

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (timerActive && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setTimerActive(false);
                        setTaskCompleted(true);
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerActive, timeRemaining]);

    useEffect(() => {
        if (showSuccessModal) {
            const timeout = setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [showSuccessModal]);

    useEffect(() => {
        if (!showModal) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerActive(false);
            setTimeRemaining(0);
        }
    }, [showModal]);

    const handleTaskPress = (task: Task) => {
        setSelectedTask(task);
        setTaskCompleted(false);
        setTimeRemaining(0);
        setTimerActive(false);
        setShowModal(true);
    };

    const handlePerformTask = () => {
        if (selectedTask?.url) {
            window.open(selectedTask.url, '_blank');
        }
        setTimeRemaining(80);
        setTimerActive(true);
    };

    const handleClaimTokens = () => {
        if (selectedTask) {
            claimToken(undefined, {
                onSuccess: () => {
                    setClaimedTokens(selectedTask.reward_tokens);
                    setShowModal(false);
                    setShowSuccessModal(true);
                    setSelectedTask(null);
                    setTaskCompleted(false);
                    setTimeRemaining(0);
                    setTimerActive(false);
                    refetchCompletedTasks();
                },
                onError: () => {
                    alert('Failed to claim tokens. Please try again.');
                },
            });
        }
    };

    const totalTokensAvailable = allTasks.reduce((sum, task) => sum + Number(task.reward_tokens), 0);
    const totalTokensEarned = completedTasks.reduce((sum, task) => sum + Number(task.reward_tokens || 0), 0);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fu { animation: fade-up .45s ease both; }
        .d1 { animation-delay: .08s; }
        .d2 { animation-delay: .16s; }
        .d3 { animation-delay: .24s; }
        .d4 { animation-delay: .32s; }
        .d5 { animation-delay: .40s; }
        .d6 { animation-delay: .48s; }

        * { font-family: 'DM Sans', sans-serif; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(251,198,7,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(251,198,7,0.5); }
      `}</style>

            <div className="min-h-screen px-5 flex justify-center text-white">
                <div className="w-full max-w-100 flex flex-col pt-5">

                    <main className="flex-1 pb-32 flex flex-col gap-8">

                        {/* ── STATS CARD ── */}
                        <div className="fu d2 rounded-2xl p-5 bg-white/[0.04] border border-white/[0.07] overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-white/50 mb-1">Available Tasks</p>
                                    <p className="text-2xl font-bold">{allTasks.length}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-white/50 mb-1">Total Rewards</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="text-2xl font-bold text-[#C9A876]">{totalTokensAvailable}</p>
                                        <p className="text-[#C9A876] font-bold">KU</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 pt-3 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-white/50">Tokens Earned</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-base font-bold text-[#4ade80]">{totalTokensEarned}</p>
                                        <p className="text-[#4ade80] font-bold text-xs">KU</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#C9A876] rounded-full transition-all duration-500"
                                        style={{
                                            width: allTasks.length > 0 ? `${(completedTasks.length / allTasks.length) * 100}%` : '0%',
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-white/40">{completedTasks.length} completed</p>
                            </div>
                        </div>

                        {/* ── TAB NAVIGATION ── */}
                        <div className="fu d3 flex gap-3">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-200 ${activeTab === 'active'
                                    ? 'bg-[#C9A876] text-black shadow-[0_4px_24px_rgba(251,198,7,.4)]'
                                    : 'bg-white/[0.05] border border-white/[0.08] text-white/70 hover:bg-white/[0.08]'
                                    }`}
                            >
                                Active
                            </button>

                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-200 ${activeTab === 'completed'
                                    ? 'bg-[#C9A876] text-black shadow-[0_4px_24px_rgba(251,198,7,.4)]'
                                    : 'bg-white/[0.05] border border-white/[0.08] text-white/70 hover:bg-white/[0.08]'
                                    }`}
                            >
                                Completed
                            </button>
                        </div>

                        {/* ── DIVIDER ── */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* ── TASK LIST ── */}
                        <div className="fu d4">
                            {isLoading || completedTaskLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-white/20 border-t-[#C9A876] rounded-full animate-spin mb-3" />
                                    <p className="text-white/40 text-sm">Loading tasks...</p>
                                </div>
                            ) : activeTab === 'active' ? (
                                allTasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <span className="text-3xl mb-3">📭</span>
                                        <p className="text-sm text-white/40">No active tasks available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {allTasks.map((task, idx) => (
                                            <div
                                                key={task.id}
                                                className="fu rounded-2xl p-4 bg-white/[0.04] border border-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200 cursor-pointer"
                                                style={{ animationDelay: `${0.08 + idx * 0.06}s` }}
                                                onClick={() => handleTaskPress(task)}
                                            >
                                                <div className="flex gap-4 items-start">
                                                    <img
                                                        src={task.image}
                                                        alt={task.title}
                                                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="text-[0.7rem] font-bold px-2 py-0.5 rounded bg-[rgba(251,198,7,.15)] text-[#C9A876]">
                                                                {task.category}
                                                            </span>
                                                            {task.duration && (
                                                                <span className="text-[0.7rem] text-white/50">{task.duration}</span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-sm font-bold text-white mb-0.5 truncate">{task.title}</h3>
                                                        <p className="text-[0.75rem] text-white/50 line-clamp-1">{task.description}</p>
                                                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                                                            <span className="text-xs">🪙</span>
                                                            <span className="text-xs font-bold text-[#4ade80]">+{Number(task.reward_tokens)} KU</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTaskPress(task);
                                                        }}
                                                        className="p-2 rounded-lg bg-[#016FEC] hover:opacity-90 text-white transition-opacity flex-shrink-0"
                                                    >
                                                        <FiArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : completedTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <span className="text-3xl mb-3">✅</span>
                                    <p className="text-sm text-white/40">No completed tasks yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {completedTasks.map((task, idx) => (
                                        <div
                                            key={task.id}
                                            className="fu rounded-2xl p-4 bg-white/[0.04] border border-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.12)] transition-all duration-200"
                                            style={{ animationDelay: `${0.08 + idx * 0.06}s` }}
                                        >
                                            <div className="flex gap-4 items-start">
                                                <img
                                                    src={task.image}
                                                    alt={task.title}
                                                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[0.7rem] font-bold px-2 py-0.5 rounded bg-[rgba(251,198,7,.15)] text-[#C9A876]">
                                                            {task.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white mb-0.5 truncate">{task.title}</h3>
                                                    <p className="text-[0.75rem] text-white/50 line-clamp-1">{task.description}</p>
                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                                                        <span className="text-xs">🪙</span>
                                                        <span className="text-xs font-bold text-[#4ade80]">+{Number(task.reward_tokens)} KU</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </main>
                </div>
            </div>

            {/* ── TASK DETAIL MODAL ── */}
            {showModal && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/[0.08] border border-white/[0.12] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto backdrop-blur-md">
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.04]">
                            <h2 className="text-lg font-bold text-white truncate">{selectedTask.title}</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    if (timerRef.current) clearInterval(timerRef.current);
                                    setTimerActive(false);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                            >
                                <FiX className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            {/* Image */}
                            <img
                                src={selectedTask.image}
                                alt={selectedTask.title}
                                className="w-full h-40 rounded-xl object-cover"
                            />

                            {/* Info */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[0.75rem] font-bold px-2 py-1 rounded-lg bg-[rgba(251,198,7,.15)] text-[#C9A876]">
                                    {selectedTask.category}
                                </span>
                                <span className="text-[0.75rem] text-white/50">
                                    {new Date(selectedTask.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-white/70 text-sm leading-relaxed">{selectedTask.description}</p>

                            {/* Task Status */}
                            {!taskCompleted && !timerActive ? (
                                <>
                                    <div className="rounded-xl p-3 bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)]">
                                        <p className="text-xs text-[#C9A876] text-center">
                                            💡 Complete the task to unlock your reward
                                        </p>
                                    </div>

                                    <button
                                        onClick={handlePerformTask}
                                        className="w-full py-3 px-4 rounded-2xl bg-[#C9A876] text-black font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                                    >
                                        <FiPlay className="w-4 h-4" />
                                        Perform Task
                                    </button>
                                </>
                            ) : timerActive && timeRemaining > 0 ? (
                                <>
                                    <div className="rounded-xl p-3 bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)]">
                                        <p className="text-xs text-[#C9A876] text-center mb-2">
                                            ⏱️ Please complete the task
                                        </p>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-white font-mono">{formatTime(timeRemaining)}</p>
                                        </div>
                                    </div>

                                    <button
                                        disabled
                                        className="w-full py-3 px-4 rounded-2xl bg-white/10 text-white/50 font-bold text-sm cursor-not-allowed"
                                    >
                                        Waiting for task completion...
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="rounded-xl p-3 bg-[rgba(16,185,129,.15)] border border-[rgba(16,185,129,.3)]">
                                        <p className="text-sm text-center mb-1">🎉</p>
                                        <p className="text-xs text-[#4ade80] text-center font-bold">Task Completed!</p>
                                        <p className="text-[0.7rem] text-[#4ade80]/70 text-center mt-1">
                                            Amazing work! Your tokens are ready to claim
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleClaimTokens}
                                        disabled={claimPending}
                                        className="w-full py-3 px-4 rounded-2xl bg-[#10B981] text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {claimPending ? (
                                            <>
                                                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Claiming...
                                            </>
                                        ) : (
                                            <>
                                                <FiAward className="w-4 h-4" />
                                                Claim {selectedTask.reward_tokens} KU
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── SUCCESS MODAL ── */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white/[0.08] border border-white/[0.12] rounded-2xl p-6 text-center max-w-sm w-full backdrop-blur-md">
                        <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,.15)] border border-[rgba(16,185,129,.3)] flex items-center justify-center mx-auto mb-3">
                            <span className="text-4xl">🎉</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">Success!</h3>
                        <p className="text-white/60 text-xs mb-4">You've successfully claimed your tokens</p>

                        <div className="rounded-2xl p-4 bg-[rgba(16,185,129,.06)] border border-[rgba(16,185,129,.15)] mb-4">
                            <p className="text-[0.7rem] text-[#4ade80] mb-1 uppercase">Tokens Earned</p>
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-2xl font-bold text-[#4ade80]">+{claimedTokens}</span>
                                <span className="text-lg font-bold text-[#4ade80]">KU</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 px-4 rounded-2xl bg-[#C9A876] text-black font-bold text-sm transition-all hover:opacity-90"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tasks;