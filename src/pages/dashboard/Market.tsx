import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BiHappy } from 'react-icons/bi';
import {
    FiArrowDown,
    FiArrowUp,
    FiBookmark,
    FiGlobe,
    FiLink,
    FiMenu,
    FiSearch,
    FiTrendingUp,
    FiX
} from 'react-icons/fi';
import LoadingOverlay from '../../components/LoadingOverlay';

const api = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    timeout: 10000,
});

interface Coin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
    circulating_supply: number;
    ath: number;
    atl: number;
    max_supply?: number;
}

interface CoinDetails {
    id: string;
    symbol: string;
    name: string;
    image: {
        large: string;
    };
    market_cap_rank: number;
    description: {
        en: string;
    };
    links: {
        homepage: string[];
        blockchain_site: string[];
    };
    market_data: {
        current_price: {
            usd: number;
        };
        market_cap: {
            usd: number;
        };
        total_volume: {
            usd: number;
        };
        price_change_percentage_24h: number;
        circulating_supply: number;
        ath: {
            usd: number;
        };
        atl: {
            usd: number;
        };
    };
}

type TabType = 'tokens' | 'trending' | 'memes' | 'watchlist';

const fetchCoins = async (): Promise<Coin[]> => {
    const { data } = await api.get('/coins/markets', {
        params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false,
        },
    });
    return data;
};

const fetchTrendingCoins = async (): Promise<Coin[]> => {
    const { data } = await api.get('/search/trending');
    return data.coins.map((coin: any) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        image: coin.item.large || coin.item.thumb,
        market_cap_rank: coin.item.market_cap_rank,
    }));
};

const fetchMemeCoins = async (): Promise<Coin[]> => {
    const memeTokenIds = 'dogecoin,shiba-inu,pepe,floki,bonk,dogwifcoin,memecoin,baby-doge-coin,samoyedcoin,monacoin';
    const { data } = await api.get('/coins/markets', {
        params: {
            vs_currency: 'usd',
            ids: memeTokenIds,
            order: 'market_cap_desc',
            per_page: 100,
            sparkline: false,
        },
    });
    return data;
};

const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
    const { data } = await api.get(`/coins/${coinId}`, {
        params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
        },
    });
    return data;
};

const formatPrice = (price: number): string => {
    if (price < 0.01) {
        return `$${price.toFixed(6)}`;
    } else if (price < 1) {
        return `$${price.toFixed(4)}`;
    } else {
        return `$${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
};

const formatMarketCap = (cap: number): string => {
    if (cap >= 1e12) {
        return `$${(cap / 1e12).toFixed(2)}T`;
    } else if (cap >= 1e9) {
        return `$${(cap / 1e9).toFixed(2)}B`;
    } else if (cap >= 1e6) {
        return `$${(cap / 1e6).toFixed(2)}M`;
    } else {
        return `$${cap.toLocaleString()}`;
    }
};

// Skeleton Loader Component
const CoinCardSkeleton = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 animate-pulse">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="h-3 sm:h-4 bg-white/10 rounded w-20 sm:w-24 mb-1.5 sm:mb-2" />
                    <div className="h-2 sm:h-3 bg-white/10 rounded w-14 sm:w-16" />
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <div className="h-3 sm:h-4 bg-white/10 rounded w-16 sm:w-20 mb-1.5 sm:mb-2" />
                <div className="h-2 sm:h-3 bg-white/10 rounded w-12 sm:w-16" />
            </div>
        </div>
    </div>
);

// Enhanced Modal Component - Mobile First
const CoinDetailsModal = ({
    coin,
    isOpen,
    onClose,
    isLoading,
}: {
    coin: CoinDetails | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal - Mobile First */}
            <div className="relative w-full md:max-w-2xl bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-t-3xl md:rounded-3xl border border-white/10 h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto shadow-2xl">
                {/* Handle - Mobile only */}
                <div className="flex justify-center pt-3 pb-2 md:hidden sticky top-0 bg-[#0a0a0a]">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="sticky top-0 md:top-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between backdrop-blur-md z-10">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {coin?.image?.large && (
                            <img
                                src={coin.image.large}
                                alt={coin.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex-shrink-0"
                            />
                        )}
                        <div className="min-w-0">
                            <h2 className="text-white font-bold text-lg sm:text-xl truncate">{coin?.name}</h2>
                            <p className="text-white/40 text-xs sm:text-sm uppercase tracking-wider">{coin?.symbol}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 flex-shrink-0 active:scale-90"
                    >
                        <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 sm:py-20">
                        <div className="text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/20 border-t-[#C9A876] rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
                            <p className="text-white/40 font-medium text-sm sm:text-base">Loading details...</p>
                        </div>
                    </div>
                ) : coin ? (
                    <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-8">
                        {/* Price Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
                            <div className="flex-1">
                                <p className="text-white/40 text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-wide">Current Price</p>
                                <p className="text-white font-bold text-3xl sm:text-4xl">
                                    {formatPrice(coin.market_data?.current_price?.usd || 0)}
                                </p>
                            </div>
                            <div
                                className={`px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-all flex-shrink-0 ${(coin.market_data?.price_change_percentage_24h || 0) >= 0
                                    ? 'bg-[#4ade80]/20 border border-[#4ade80]/30'
                                    : 'bg-[#ef4444]/20 border border-[#ef4444]/30'
                                    }`}
                            >
                                {(coin.market_data?.price_change_percentage_24h || 0) >= 0 ? (
                                    <FiArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ade80]" />
                                ) : (
                                    <FiArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#ef4444]" />
                                )}
                                <span
                                    className={`font-bold text-sm sm:text-base ${(coin.market_data?.price_change_percentage_24h || 0) >= 0
                                        ? 'text-[#4ade80]'
                                        : 'text-[#ef4444]'
                                        }`}
                                >
                                    {Math.abs(coin.market_data?.price_change_percentage_24h || 0).toFixed(2)}%
                                </span>
                            </div>
                        </div>

                        {/* Stats Grid - Responsive */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/5 transition-colors">
                                <p className="text-white/40 text-xs mb-2 sm:mb-3 uppercase tracking-wide">Market Cap Rank</p>
                                <p className="text-white font-bold text-xl sm:text-2xl">
                                    #{coin.market_cap_rank || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/5 transition-colors">
                                <p className="text-white/40 text-xs mb-2 sm:mb-3 uppercase tracking-wide">24h Volume</p>
                                <p className="text-white font-bold text-xl sm:text-2xl">
                                    {formatMarketCap(coin.market_data?.total_volume?.usd || 0)}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#C9A876]/10 to-[#C9A876]/5 border border-[#C9A876]/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:from-[#C9A876]/15 transition-colors">
                                <p className="text-white/40 text-xs mb-2 sm:mb-3 uppercase tracking-wide">Market Cap</p>
                                <p className="text-[#C9A876] font-bold text-xl sm:text-2xl">
                                    {formatMarketCap(coin.market_data?.market_cap?.usd || 0)}
                                </p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/5 transition-colors">
                                <p className="text-white/40 text-xs mb-2 sm:mb-3 uppercase tracking-wide">Circulating Supply</p>
                                <p className="text-white font-bold text-xl sm:text-2xl">
                                    {(coin.market_data?.circulating_supply || 0).toLocaleString('en-US', {
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* ATH/ATL */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/5 transition-colors">
                                <p className="text-white/40 text-xs mb-2 sm:mb-3 uppercase tracking-wide">All Time High</p>
                                <p className="text-[#4ade80] font-bold text-xl sm:text-2xl">
                                    {formatPrice(coin.market_data?.ath?.usd || 0)}
                                </p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/5 transition-colors">
                                <p className="text-white/40 text-xs mb-2 sm:mb-3 uppercase tracking-wide">All Time Low</p>
                                <p className="text-[#ef4444] font-bold text-xl sm:text-2xl">
                                    {formatPrice(coin.market_data?.atl?.usd || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {coin.description?.en && (
                            <div>
                                <h3 className="text-white font-bold mb-3 sm:mb-4 text-base sm:text-lg">About</h3>
                                <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                                    {coin.description.en.replace(/<[^>]*>/g, '').substring(0, 300)}...
                                </p>
                            </div>
                        )}

                        {/* Links */}
                        <div>
                            <h3 className="text-white font-bold mb-3 sm:mb-4 text-base sm:text-lg">Links</h3>
                            <div className="space-y-2 sm:space-y-3">
                                {coin.links?.homepage?.[0] && (
                                    <a
                                        href={coin.links.homepage[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 group active:scale-95"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A876] group-hover:scale-110 transition-transform flex-shrink-0" />
                                            <span className="text-white font-medium text-sm sm:text-base">Website</span>
                                        </div>
                                        <FiArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-white/60 rotate-45 transition-colors flex-shrink-0" />
                                    </a>
                                )}
                                {coin.links?.blockchain_site?.[0] && (
                                    <a
                                        href={coin.links.blockchain_site[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 group active:scale-95"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <FiLink className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5cf6] group-hover:scale-110 transition-transform flex-shrink-0" />
                                            <span className="text-white font-medium text-sm sm:text-base">Blockchain</span>
                                        </div>
                                        <FiArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-white/60 rotate-45 transition-colors flex-shrink-0" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const Market = () => {
    const [activeTab, setActiveTab] = useState<TabType>('tokens');
    const [searchQuery, setSearchQuery] = useState('');
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: coins = [], isLoading: coinsLoading } = useQuery({
        queryKey: ['market-coins'],
        queryFn: fetchCoins,
        staleTime: 60000,
    });

    const { data: trendingCoins = [], isLoading: trendingLoading } = useQuery({
        queryKey: ['market-trending'],
        queryFn: fetchTrendingCoins,
        staleTime: 60000,
    });

    const { data: memeCoins = [], isLoading: memesLoading } = useQuery({
        queryKey: ['market-memes'],
        queryFn: fetchMemeCoins,
        staleTime: 60000,
    });

    const { data: selectedCoin, isLoading: detailsLoading } = useQuery({
        queryKey: ['market-coin-details', selectedCoinId],
        queryFn: () => fetchCoinDetails(selectedCoinId!),
        enabled: !!selectedCoinId,
        staleTime: 120000,
    });

    const handleCoinPress = useCallback(
        (coinId: string) => {
            setSelectedCoinId(coinId);
            setModalOpen(true);

            queryClient.prefetchQuery({
                queryKey: ['market-coin-details', coinId],
                queryFn: () => fetchCoinDetails(coinId),
                staleTime: 120000,
            });
        },
        [queryClient]
    );

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        setTimeout(() => setSelectedCoinId(null), 300);
    }, []);

    const toggleWatchlist = (coinId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setWatchlist((prev) =>
            prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
        );
    };

    const filteredCoins = useMemo(() => {
        let dataToFilter =
            activeTab === 'memes'
                ? memeCoins
                : activeTab === 'trending'
                    ? trendingCoins
                    : activeTab === 'watchlist'
                        ? coins.filter((coin) => watchlist.includes(coin.id))
                        : coins;

        if (!searchQuery.trim()) return dataToFilter;

        return dataToFilter.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [coins, trendingCoins, memeCoins, activeTab, searchQuery, watchlist]);

    const isLoading = coinsLoading || trendingLoading || memesLoading;

    const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: 'tokens', label: 'All Tokens', icon: <FiMenu className="w-5 h-5 sm:w-5 sm:h-5" /> },
        { key: 'trending', label: 'Trending', icon: <FiTrendingUp className="w-5 h-5 sm:w-5 sm:h-5" /> },
        { key: 'memes', label: 'Memes', icon: <BiHappy className="w-5 h-5 sm:w-5 sm:h-5" /> },
        { key: 'watchlist', label: 'Watchlist', icon: <FiBookmark className="w-5 h-5 sm:w-5 sm:h-5" /> },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * { font-family: 'DM Sans', sans-serif; }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fu { animation: fade-up 0.45s ease both; }
        .d1 { animation-delay: 0.08s; }
        .d2 { animation-delay: 0.16s; }
        .d3 { animation-delay: 0.24s; }
        .d4 { animation-delay: 0.32s; }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: rgba(255, 255, 255, 0.2); 
        }
        
        /* Better mobile touch targets */
        button { min-height: 44px; }
        input { min-height: 44px; }
        
        /* Prevent zoom on input focus on mobile */
        input { font-size: 16px; }
        
        /* Smooth transitions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

            <div className="min-h-screen text-white">
                <LoadingOverlay visible={isLoading} />

                <div className="w-full lg:flex lg:justify-center">
                    <div className="w-full lg:max-w-2xl px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6 pb-20 sm:pb-24 md:pb-32">
                        {/* Header */}
                        <div className="fu d1 mb-4 sm:mb-6 md:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Market</h1>
                            <p className="text-xs sm:text-sm md:text-base text-white/50">Explore and track cryptocurrencies</p>
                        </div>

                        {/* Search Bar */}
                        {(activeTab === 'tokens' || activeTab === 'memes' || activeTab === 'watchlist') && (
                            <div className="fu d2 mb-4 sm:mb-5 md:mb-7">
                                <div className="relative flex items-center">
                                    <FiSearch className="absolute left-3 sm:left-4 w-4 h-4 text-white/40 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab === 'memes' ? 'meme coins' : 'coins'}...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:border-[#C9A876] focus:bg-white/[0.08] transition-all duration-200"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-2 sm:right-3 p-2 hover:bg-white/5 rounded-lg transition-colors active:scale-90"
                                        >
                                            <FiX className="w-4 h-4 text-white/40 hover:text-white/60" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tabs - Horizontal Scroll on Mobile */}
                        <div className="fu d3 mb-4 sm:mb-6 md:mb-8">
                            <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 active:scale-95 ${activeTab === tab.key
                                            ? 'bg-[#C9A876] text-black shadow-lg shadow-[#C9A876]/30'
                                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span className="hidden xs:inline">{tab.label}</span>
                                        {tab.key === 'watchlist' && watchlist.length > 0 && (
                                            <span
                                                className={`ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${activeTab === tab.key
                                                    ? 'bg-black/20 text-black'
                                                    : 'bg-[#C9A876]/20 text-[#C9A876]'
                                                    }`}
                                            >
                                                {watchlist.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="fu d4 space-y-2 sm:space-y-3">
                            {isLoading ? (
                                <div className="space-y-2 sm:space-y-3">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <CoinCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : filteredCoins.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
                                    <div className="mb-3 sm:mb-4 text-4xl sm:text-5xl">🔍</div>
                                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">No coins found</h3>
                                    <p className="text-xs sm:text-sm text-white/40 text-center px-4">
                                        Try adjusting your search terms
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {filteredCoins.map((coin, idx) => {
                                            const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
                                            const isInWatchlist = watchlist.includes(coin.id);

                                            return (
                                                <div
                                                    key={coin.id}
                                                    onClick={() => handleCoinPress(coin.id)}
                                                    className="fu bg-white/3 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/[0.08] hover:border-white/20 cursor-pointer transition-all duration-200 active:scale-95 sm:active:scale-98"
                                                    style={{ animationDelay: `${0.08 + idx * 0.03}s` }}
                                                >
                                                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                            <div className="relative flex-shrink-0">
                                                                <img
                                                                    src={coin.image}
                                                                    alt={coin.name}
                                                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';
                                                                    }}
                                                                />
                                                                {coin.market_cap_rank && (
                                                                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#3b82f6] text-white text-[8px] sm:text-[9px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-sm:border-2 border-black">
                                                                        {coin.market_cap_rank}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                                                    <h3 className="font-bold text-xs sm:text-sm text-white">{coin.name}</h3>
                                                                </div>
                                                                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                                                    <span className="text-white/40 text-[10px] sm:text-xs uppercase font-medium">{coin.symbol}</span>
                                                                    {coin.market_cap && (
                                                                        <span className="text-white/30 text-[9px] sm:text-xs bg-white/5 px-1.5 sm:px-2 py-0.5 rounded font-medium">
                                                                            {formatMarketCap(coin.market_cap)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                                            <div className="text-right">
                                                                <p className="font-bold text-white text-xs sm:text-sm">
                                                                    {formatPrice(coin.current_price || 0)}
                                                                </p>
                                                                <div
                                                                    className={`flex items-center justify-end gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-xs font-bold ${isPositive
                                                                        ? 'text-[#4ade80] bg-[#4ade80]/20'
                                                                        : 'text-[#ef4444] bg-[#ef4444]/20'
                                                                        }`}
                                                                >
                                                                    {isPositive ? (
                                                                        <FiArrowUp className="w-2.5 h-2.5" />
                                                                    ) : (
                                                                        <FiArrowDown className="w-2.5 h-2.5" />
                                                                    )}
                                                                    {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={(e) => toggleWatchlist(coin.id, e)}
                                                                className="p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-200 active:scale-90 flex-shrink-0"
                                                            >
                                                                <FiBookmark
                                                                    className="w-4 h-4"
                                                                    fill={isInWatchlist ? '#C9A876' : 'none'}
                                                                    color={isInWatchlist ? '#C9A876' : 'currentColor'}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Coin Details Modal */}
            <CoinDetailsModal
                coin={selectedCoin || null}
                isOpen={modalOpen}
                onClose={handleCloseModal}
                isLoading={detailsLoading}
            />
        </>
    );
};

export default Market;