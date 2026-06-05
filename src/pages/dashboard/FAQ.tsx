import { useState } from 'react';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQ = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const faqData = [
        {
            id: 9,
            question: 'How does mining work on the KU Network?',
            answer: 'KU Network offers a Web2–Web3 hybrid mining system that allows users to mine KU tokens effortlessly using mobile or Web2 applications. Mining rewards are distributed every 12 hours, with users earning up to 10 KU per day. The process is AI-assisted, energy-efficient, and does not require hardware, electricity, or technical setup.',
        },
        {
            id: 10,
            question: 'What is the mining reward structure?',
            answer: 'Mining starts at a rate of 3 KU every 12 hours. Rewards are capped at 10 KU per day per user and follow a halving cycle to ensure long-term sustainability. Halving occurs after every 10 million KU mined or when the network reaches 2 million users.',
        },
        {
            id: 11,
            question: 'What is the total supply of KU Token?',
            answer: 'The maximum supply of KU Token is capped at 10 billion KU. Token allocation is structured to support sustainability and growth: 50% for the community, 15% for team and advisors, 20% for ecosystem and partnerships, 10% as reserve, and 5% for marketing.',
        },
        {
            id: 12,
            question: 'How does Kubot AI ensure fair mining and rewards?',
            answer: 'Kubot AI uses artificial intelligence to validate mining activity, detect fraud, prevent bot abuse, and optimize reward distribution. This ensures fair participation, accurate rewards, and long-term network integrity.',
        },
        {
            id: 13,
            question: 'What real-world use cases does KU Token support?',
            answer: 'KU Token supports real-world use cases including merchant payments, AI-powered services, NFTs, peer-to-peer transfers, staking, governance voting, and marketplace participation. The ecosystem is designed to connect mining rewards directly to practical digital and real-world utility.',
        },
        {
            id: 14,
            question: 'Is KU Network environmentally friendly?',
            answer: 'Yes. KU Network focuses on sustainable and energy-efficient mining practices. Mining does not rely on power-intensive hardware or traditional proof-of-work systems, making it accessible and environmentally conscious.',
        },
        {
            id: 15,
            question: 'How does governance work on the KU Network?',
            answer: 'KU Network operates a decentralized governance model. KU token holders can submit proposals and vote on ecosystem upgrades, policies, and decisions through a DAO-based governance system. Voting power is determined by token participation.',
        },
        {
            id: 16,
            question: 'What is the roadmap for KU Network?',
            answer: 'The roadmap includes five phases: community building, growth and validation, ecosystem development, exchange readiness targeting 5–10 million miners, and global expansion. Each phase is measured by adoption, partnerships, AI usage, and real-world utility.',
        },
        {
            id: 17,
            question: 'How does KU Network handle security and compliance?',
            answer: 'KU Network prioritizes security through AI-based monitoring, anti-bot protection, AML/KYC compliance, data privacy standards aligned with GDPR and ISO guidelines, and planned third-party audits to ensure transparency and trust.',
        },
        {
            id: 18,
            question: 'Is KU Token a financial investment?',
            answer: 'KU Token is a utility token designed for participation within the Kubot AI ecosystem. The project does not offer financial guarantees or investment promises. Users are encouraged to conduct their own research before participating.',
        },
    ];

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
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
        .dm-sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

            <div className="min-h-screen text-white dm-sans" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)' }}>
                <div className="max-w-md mx-auto px-5 pt-10 pb-10">
                    {/* HEADER */}
                    <div className="fu flex flex-col items-start gap-2 mb-6" style={{ animationDelay: '.05s' }}>
                        <div className="flex items-center gap-2">
                            <FiHelpCircle className="w-5 h-5 text-[#FBC607]" />
                            <h1 className="text-2xl font-bold">FAQs</h1>
                        </div>
                        <p className="text-xs text-white/40">Frequently Asked Questions about KU Network</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    {/* FAQ ITEMS */}
                    <div className="space-y-3 pb-32">
                        {faqData.map((faq, index) => (
                            <div
                                key={faq.id}
                                className="fu"
                                style={{ animationDelay: `${0.08 + (index % 5) * 0.06}s` }}
                            >
                                <button
                                    onClick={() => toggleExpand(faq.id)}
                                    className="w-full rounded-2xl p-4 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(251,198,7,.06)] transition-all duration-200 text-left"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm font-semibold text-white leading-snug flex-1">
                                            {faq.question}
                                        </h3>
                                        <div
                                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-[rgba(251,198,7,.1)] border border-[rgba(251,198,7,.2)] transition-transform duration-200"
                                            style={{
                                                transform: expandedId === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                            }}
                                        >
                                            <FiChevronDown className="w-4 h-4 text-[#FBC607]" />
                                        </div>
                                    </div>

                                    {/* ANSWER */}
                                    {expandedId === faq.id && (
                                        <div className="mt-3 pt-3 border-t border-white/[0.08]">
                                            <p className="text-xs text-white/60 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FAQ;