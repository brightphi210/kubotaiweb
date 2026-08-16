import { useState } from "react";
import {
    FiCheck,
    FiChevronRight,
    FiCopy,
    FiEdit2,
    FiLogOut,
    FiMessageSquare,
    FiShield,
    FiUsers,
    FiX
} from "react-icons/fi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { IoScanOutline } from "react-icons/io5";
import {
    MdOutlineAccountBalanceWallet,
    MdPersonOutline,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetInvitation, useGetProfile } from "../../hooks/queries/allQueries";

/* ─── reusable modal ──────────────────────────────────────── */
function Modal({ visible, onClose, children }: any) {
    if (!visible) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}

/* ─── spinner ─────────────────────────────────────────────── */
function Spinner({ color = "#016FEC" }: any) {
    return (
        <span
            className="inline-block w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${color}40`, borderTopColor: color }}
        />
    );
}

/* ─── menu row ────────────────────────────────────────────── */
function MenuRow({ icon: Icon, label, onClick, danger = false }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-200 group
        ${danger
                    ? "bg-red-500/[0.06] border border-red-500/[0.12] hover:bg-red-500/[0.12]"
                    : "bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1]"
                }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center
            ${danger ? "bg-red-500/[0.15]" : "bg-white/[0.07]"}`}
                >
                    <Icon
                        className={`w-4 h-4 ${danger
                            ? "text-red-400"
                            : "text-white/60 group-hover:text-[#C9A876] transition-colors"
                            }`}
                    />
                </div>
                <span
                    className={`text-sm font-medium ${danger ? "text-red-400" : "text-white/80"
                        }`}
                >
                    {label}
                </span>
            </div>
            <FiChevronRight
                className={`w-4 h-4 ${danger
                    ? "text-red-400/60"
                    : "text-white/25 group-hover:text-white/50 transition-colors"
                    }`}
            />
        </button>
    );
}

/* ─── avatar skeleton ─────────────────────────────────────── */
function ProfileSkeleton() {
    return (
        <div className="flex flex-col items-center gap-3 mb-6 px-5 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-white/[0.08]" />
            <div className="h-4 w-24 rounded-full bg-white/[0.08]" />
            <div className="h-8 w-32 rounded-full bg-white/[0.08]" />
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════ */
export default function Profile() {
    const navigate = useNavigate();

    /* ── modal state ── */
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [copied, setCopied] = useState(false);

    /* ── data hooks (same as mobile) ── */
    const { isLoading: profileLoading, getProfile } = useGetProfile();
    const profile = getProfile?.data?.data;

    const { getInvitationToken, isLoading: invitationLoading } = useGetInvitation();
    const inviteCode = getInvitationToken?.data?.data?.referral_code;

    /* ── logout: mirrors mobile AsyncStorage.removeItem → router.replace("/login") ── */
    const handleLogout = () => {
        localStorage.removeItem("ku_token");
        localStorage.removeItem("ku_onboarding");
        setShowLogoutModal(false);
        navigate("/login");
    };

    /* ── copy referral code: mirrors Clipboard.setStringAsync + Toast ── */
    const handleCopyCode = async () => {
        if (!inviteCode) return;
        await navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        toast.success("Referral code copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scale-in {
          from { opacity:0; transform:scale(.93); }
          to   { opacity:1; transform:scale(1); }
        }

        .fu { animation: fade-up .45s ease both; }
        .si { animation: scale-in .35s ease both; }
        .d1 { animation-delay:.06s; }
        .d2 { animation-delay:.12s; }
        .d3 { animation-delay:.18s; }
        .d4 { animation-delay:.24s; }
        .d5 { animation-delay:.30s; }
        .d6 { animation-delay:.36s; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
        .avatar-glow {
          box-shadow: 0 0 0 3px rgba(251,198,7,.25), 0 0 24px rgba(251,198,7,.12);
        }
      `}</style>

            {/* full-screen overlay while profile is loading (mirrors ActivityIndicator block) */}
            <LoadingOverlay visible={profileLoading} />
            <ToastContainer theme="dark" />

            <div className="min-h-screen text-white dm-sans flex justify-center pt-6">
                <div className="w-full max-w-[420px] flex flex-col">


                    {/* ── AVATAR + USERNAME ── */}
                    {profileLoading ? (
                        <ProfileSkeleton />
                    ) : (
                        <div className="fu d2 flex flex-col items-center gap-3 mb-6 px-5">
                            <div className="relative">
                                {profile?.image ? (
                                    <img
                                        src={profile.image}
                                        alt="avatar"
                                        className="w-24 h-24 rounded-full object-cover avatar-glow"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-white/[0.08] border border-white/[0.12] avatar-glow flex items-center justify-center">
                                        <MdPersonOutline className="w-10 h-10 text-white/40" />
                                    </div>
                                )}
                                {/* edit badge */}
                                <button
                                    onClick={() => navigate("/dashboard/profile/edit")}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#C9A876] flex items-center justify-center shadow-[0_2px_12px_rgba(251,198,7,.5)] hover:scale-110 transition-transform"
                                >
                                    <FiEdit2 className="w-3 h-3 text-black" />
                                </button>
                            </div>

                            <p className="text-sm text-white/50 dm-mono">
                                @{profile?.username}
                            </p>

                            <button
                                onClick={() => navigate("/dashboard/profile/edit")}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#016FEC] text-white text-sm font-semibold hover:bg-[#0061d4] shadow-[0_4px_20px_rgba(1,111,236,.35)] transition-all hover:-translate-y-0.5"
                            >
                                <FiEdit2 className="w-3.5 h-3.5" />
                                Edit Profile
                            </button>
                        </div>
                    )}

                    {/* ── REFERRAL BANNER ── */}
                    <div className="fu d3 mx-5 mb-5">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[rgba(251,198,7,.08)] border border-[rgba(251,198,7,.2)]">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl leading-none">🎁</span>
                                <div>
                                    <p className="text-sm font-bold text-[#C9A876]">
                                        Referral Challenge
                                    </p>
                                    <p className="text-xs text-[rgba(251,198,7,.6)]">
                                        24/7 Rewards from Every Deal
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowReferralModal(true)}
                                className="px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-white/80 text-xs font-semibold hover:bg-white/[0.14] hover:text-white transition-all"
                            >
                                invite
                            </button>
                        </div>
                    </div>

                    {/* ── MENU ── */}
                    <div className="fu d4 flex flex-col gap-2 px-5 lg:pb-10 pb-20">

                        {/* Invitation Code → opens referral modal (same as mobile) */}
                        <MenuRow
                            icon={MdPersonOutline}
                            label="Invitation Code"
                            onClick={() => navigate("/dashboard/profile/invitation-code")}
                        />

                        {/* Connect Wallet */}
                        <MenuRow
                            icon={MdOutlineAccountBalanceWallet}
                            label="Connect Wallet"
                            onClick={() => navigate("/dashboard/wallet")}
                        />

                        {/* Earning Team */}
                        <MenuRow
                            icon={FiUsers}
                            label="Earning Team"
                            onClick={() => navigate("/dashboard/friends")}
                        />

                        {/* Account & Security → change-password */}
                        <MenuRow
                            icon={FiShield}
                            label="Account & Security"
                            onClick={() => navigate("/dashboard/profile/change-password")}
                        />

                        {/* KYC Verification → "coming soon" toast (same as mobile) */}
                        <MenuRow
                            icon={IoScanOutline}
                            label="KYC Verification"
                            onClick={() =>
                                toast.success("KYC verification coming Soon")
                            }
                        />

                        {/* About */}
                        <MenuRow
                            icon={HiOutlineInformationCircle}
                            label="About"
                            onClick={() => navigate("/dashboard/profile/about")}
                        />

                        {/* Feedback */}
                        <MenuRow
                            icon={FiMessageSquare}
                            label="Feedback"
                            onClick={() => navigate("/dashboard/profile/feedback")}
                        />

                        {/* <MenuRow
                            icon={FiGlobe}
                            label="Language"
                            onClick={() => { }}
                        /> */}

                        <div className="h-2" />

                        {/* Logout → opens confirmation modal */}
                        <MenuRow
                            icon={FiLogOut}
                            label="Logout"
                            onClick={() => setShowLogoutModal(true)}
                            danger
                        />
                    </div>
                </div>
            </div>

            <Modal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            >
                <div className="si bg-[#111] border border-white/[0.1] rounded-3xl p-8 mx-4 w-[340px] shadow-2xl dm-sans">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/[0.12] border border-red-500/[0.25] flex items-center justify-center mb-5">
                            <FiLogOut className="w-7 h-7 text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold mb-2">Logout from account</h2>
                        <p className="text-sm text-white/50 leading-relaxed mb-7">
                            Are you sure you want to logout from your account?{" "}
                            <br className="hidden sm:block" />
                            You can always login again later.
                        </p>

                        <div className="flex gap-3 w-full">
                            {/* Cancel */}
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white/70 text-sm font-semibold hover:bg-white/[0.1] transition-all"
                            >
                                Cancel
                            </button>
                            {/* Confirm Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 shadow-[0_4px_20px_rgba(239,68,68,.35)] transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>


            <Modal
                visible={showReferralModal}
                onClose={() => setShowReferralModal(false)}
            >
                <div className="si relative bg-[#111] border border-white/[0.1] rounded-3xl p-8  lg:w-[400px] w-[90%] m-auto shadow-2xl dm-sans">
                    <button
                        onClick={() => setShowReferralModal(false)}
                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
                    >
                        <FiX className="w-3.5 h-3.5 text-white/60" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[rgba(251,198,7,.12)] border border-[rgba(251,198,7,.25)] flex items-center justify-center mb-5">
                            <span className="text-3xl leading-none">🎁</span>
                        </div>
                        <h2 className="text-lg font-bold mb-2">Your Referral Code</h2>
                        <p className="text-sm text-white/50 leading-relaxed mb-6">
                            Share this code with friends and earn rewards from every deal!
                        </p>

                        {/* code box — spinner while loading, mirrors mobile ActivityIndicator */}
                        {invitationLoading ? (
                            <div className="w-full flex justify-center py-5 mb-6">
                                <Spinner color="#016FEC" />
                            </div>
                        ) : (
                            <div className="w-full bg-white/[0.05] border border-[rgba(251,198,7,.25)] rounded-lg p-4 mb-6">
                                <p className="text-xl font-bold tracking-[0.18em] dm-mono text-[#C9A876]">
                                    {inviteCode ?? "N/A"}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setShowReferralModal(false)}
                                className="flex-1 py-3 rounded-lg bg-white/[0.06] border border-white/[0.1] text-white/70 text-sm font-semibold hover:bg-white/[0.1] transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCopyCode}
                                disabled={!inviteCode || invitationLoading}
                                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${copied
                                        ? "bg-green-500 text-white shadow-[0_4px_20px_rgba(16,185,129,.35)]"
                                        : "bg-[#C9A876] text-black"
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <FiCheck className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="w-4 h-4" />
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}