import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface WalletData {
    address: string;
    balance: number;
    network: string;
    isConnected: boolean;
}

const Wallet: React.FC = () => {
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);

    const handleConnectWallet = () => {
        setShowComingSoonModal(true);
    };

    const closeModal = () => {
        setShowComingSoonModal(false);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

                @keyframes fade-up {
                  from { opacity: 0; transform: translateY(14px); }
                  to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scale-in {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }

                .fu { animation: fade-up .45s ease both; }
                .scale-in { animation: scale-in .45s ease both; }
                .d1 { animation-delay: .08s; }
                .d2 { animation-delay: .16s; }
                .d3 { animation-delay: .24s; }
                .d4 { animation-delay: .32s; }
                .d5 { animation-delay: .40s; }

                * { font-family: 'DM Sans', sans-serif; }

                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
                ::-webkit-scrollbar-thumb { background: rgba(251,198,7,0.3); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(251,198,7,0.5); }
            `}</style>

            <div className="min-h-screen px-5 flex justify-center text-white">
                <div className="w-full max-w-100 flex flex-col pb-20">
                    <div className="fu d2 flex flex-col items-center justify-center py-24">
                        <div className="relative w-40 h-40 mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FBC607] to-[#e0a800] rounded-full opacity-10" />
                            <div className="absolute inset-4 bg-gradient-to-br from-[#FBC607] to-[#e0a800] rounded-full opacity-20" />
                            <div className="absolute inset-8 bg-gradient-to-br from-[#FBC607] to-[#e0a800] rounded-full opacity-30 flex items-center justify-center text-5xl">
                                💼
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3 text-center">Connect Your Wallet</h2>
                        <p className="text-white/60 text-sm text-center mb-8 max-w-xs">
                            Connect your wallet to view balance and claim your earned tokens
                        </p>

                        <button
                            onClick={handleConnectWallet}
                            className="fu d3 w-full py-2.5 px-6 rounded-md bg-gradient-to-br from-[#FBC607] to-[#e0a800] text-black font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(251,198,7,.4)]"
                        >
                            Connect Wallet
                        </button>

                        <p className="text-[0.75rem] text-white/40 text-center mt-6 max-w-xs">
                            Your wallet will be used to receive your earned tokens. Your keys stay secure with you.
                        </p>
                    </div>

                </div>
            </div>

            {/* Coming Soon Modal */}
            {showComingSoonModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                        <div className="scale-in bg-white/[0.04] border border-white/[0.07] rounded-2xl max-w-sm w-full p-6 sm:p-8 relative overflow-hidden">
                            {/* Gradient background effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(251,198,7,.1)] rounded-full blur-3xl -z-10" />

                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-white/60 hover:text-white"
                            >
                                <FiX className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FBC607] to-[#e0a800] rounded-full opacity-20 animate-pulse" />
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                        🚀
                                    </div>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Coming Soon</h3>
                                <p className="text-sm text-white/60 mb-6">
                                    Wallet connection feature will be available soon. We're working hard to bring this functionality to you.
                                </p>

                                {/* Feature Details */}
                                <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6 text-left">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <span className="text-[#FBC607] text-lg flex-shrink-0">✓</span>
                                            <p className="text-xs text-white/70">Secure wallet integration</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-[#FBC607] text-lg flex-shrink-0">✓</span>
                                            <p className="text-xs text-white/70">View your token balance</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-[#FBC607] text-lg flex-shrink-0">✓</span>
                                            <p className="text-xs text-white/70">Easy token claims</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={closeModal}
                                    className="w-full py-3 rounded-xl bg-[rgba(251,198,7,.15)] border border-[rgba(251,198,7,.3)] text-[#FBC607] font-semibold text-sm hover:bg-[rgba(251,198,7,.2)] transition-all duration-200"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Wallet;