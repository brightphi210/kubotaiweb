import { FiShare2 } from 'react-icons/fi';

const WhitePaper = () => {
    const sections = [
        {
            id: 1,
            title: 'Abstract',
            content:
                'Kubot AI, operating through the KU Network, is a next-generation Web3 ecosystem built to democratize crypto mining, digital utility, and AI automation across the globe. Our mission is to create an intelligent, accessible, and community-driven cryptocurrency project that allows users to mine tokens effortlessly using mobile and Web2 applications—while integrating Web3 wallets for seamless blockchain interaction. Rewards scale with user participation and contribution. KU Network bridges artificial intelligence and blockchain, promoting inclusive adoption, transparent governance, and value-backed digital currency.',
        },
        {
            id: 2,
            title: 'Introduction & Vision',
            content:
                'The world is rapidly transitioning toward decentralized economies powered by AI and blockchain. Yet, accessibility remains the biggest challenge. KU Network (symbol: KU) simplifies entry into the crypto economy for everyone—especially emerging markets—through AI-assisted mining, user education, and community engagement.\n\nOur unique value proposition: combining AI-driven mining optimization, fair reward distribution, and real-world utility adoption. We also focus on sustainable, energy-efficient mining practices.',
        },
        {
            id: 3,
            title: 'Problem Statement',
            content:
                'Despite blockchain growth, key challenges persist:\n• Complex mining setups exclude everyday users.\n• Lack of transparency erodes public trust.\n• Many projects focus on hype rather than utility.\n• Few projects connect real-world adoption to mining rewards.\n• Regulatory uncertainty and jurisdictional legal risks remain unaddressed in most projects.',
        },
        {
            id: 4,
            title: 'Solution: The KU Network Ecosystem',
            content:
                'KU Token: The KU Token is the native currency of the Kubot AI ecosystem. It powers transactions, rewards, AI services, governance, staking, and NFT-related activities.\n\nKubot AI Technology: Kubot AI automates mining validation, fraud detection, and smart token distribution. It optimizes mining efficiency, ensures fair rewards, and maintains network integrity.\n\nMining Structure: Mining offers 3 KU every 12 hours (10 per day), halving cycles to ensure long-term sustainability, referral bonuses (capped to prevent abuse), and accessible Web2–Web3 hybrid mining.',
        },
        {
            id: 5,
            title: 'Mining Mechanism and Tokenomics',
            content:
                '• Mining Start Rate: 3 KU / 12 hours\n• Daily Max Reward: 6 KU\n• Halving Interval: Every 10M KU mined or 2M users\n• Max Supply: 10B KU\n• Token Allocation: Community 50%, Team & Advisors 15%, Ecosystem & Partnerships 20%, Reserve 10%, Marketing 5%\n• Referral and staking incentives to drive adoption and retention',
        },
        {
            id: 6,
            title: 'Ecosystem Use Cases and Benefits',
            content:
                'Utility includes payments, AI services, NFTs, P2P transfers, staking, governance voting, and marketplace participation. Benefits include early mining advantage, community rewards, marketplace usage, and AI insights. Real-world utility examples: merchant payments, AI-powered analytics, NFT marketplaces.',
        },
        {
            id: 7,
            title: 'Transparency and Governance',
            content:
                '• Public ledger\n• Transparent team\n• Decentralized governance through DAO proposal submission and voting\n• Token Allocation: Community 50%, Team & Advisors 15%, Ecosystem & Partnerships 20%, Reserve 10%, Marketing 5%\n• Referral and staking incentives to drive adoption and retention',
        },
        {
            id: 8,
            title: 'Adoption & Global Acceptance Strategy',
            content:
                '• Community education\n• Ecosystem partnerships\n• CEX listing strategy (Binance, OKX, etc.)\n• Real-world utility integrations\n• Regulatory compliance and risk management for global adoption',
        },
        {
            id: 9,
            title: 'Roadmap / Timeline',
            content:
                '• Phase 1: Community build (0–3 months)\n• Phase 2: Growth & validation (3–6 months)\n• Phase 3: Ecosystem development (6–12 months)\n• Phase 4: Exchange readiness (5–10M miners, 12–18 months)\n• Phase 5: Global expansion (18 months) Key KPIs: number of active miners, partnerships, AI adoption, token utility.',
        },
        {
            id: 10,
            title: 'Security and Compliance',
            content:
                '• Third-party audits (firm TBD)\n• AML/KYC compliance covering token holders and transfers\n• Anti-bot protections\n• Data privacy standards aligned with GDPR/ISO guidelines',
        },
        {
            id: 11,
            title: 'Conclusion',
            content:
                'KU Network is building a transparent, AI-powered, community-driven mining ecosystem, targeting global adoption, real-world utility, and sustainable token value.',
        },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .fu { animation: fade-up .45s ease both; }
        .dm-sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-10 pb-10">
                    {/* HEADER */}
                    <div className="fu flex flex-col items-start gap-3 mb-6" style={{ animationDelay: '.05s' }}>
                        <h1 className="text-2xl font-bold">WHITE PAPER</h1>
                        <h2 className="text-sm font-semibold text-[#C9A876]">KUBOT AI / KU NETWORK</h2>
                        <p className="text-xs text-white/40">Version 1.0 | October 2025</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    {/* CONTENT SECTIONS */}
                    <div className="space-y-3 pb-32">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                className="fu rounded-2xl p-4 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.06)] transition-all duration-200"
                                style={{ animationDelay: `${0.08 + (index % 6) * 0.06}s` }}
                            >
                                {/* SECTION TITLE */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <h3 className="text-sm font-semibold text-[#C9A876] leading-snug">{section.title}</h3>
                                    <button className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all">
                                        <FiShare2 className="w-3.5 h-3.5 text-white/40 hover:text-white/60" />
                                    </button>
                                </div>

                                {/* SECTION CONTENT */}
                                <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        {/* LEGAL DISCLAIMER */}
                        <div className="fu rounded-2xl p-4 bg-[rgba(251,198,7,.05)] border border-[rgba(251,198,7,.12)] mt-6" style={{ animationDelay: '.5s' }}>
                            <h3 className="text-sm font-semibold text-[#C9A876] mb-2">Legal Disclaimer</h3>
                            <p className="text-xs text-white/50 leading-relaxed">
                                This document is for informational purposes only and does not constitute financial advice, nor is it a guarantee of future performance or profits. Users should perform their own due diligence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhitePaper;