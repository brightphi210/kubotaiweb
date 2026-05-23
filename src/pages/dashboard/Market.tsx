import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full bg-[#0a0a0a] rounded-t-3xl border border-white/10 max-h-[85vh] overflow-y-auto">
                {/* Handle */}
                <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {coin?.image?.large && (
                            <img
                                src={coin.image.large}
                                alt={coin.name}
                                className="w-12 h-12 rounded-full"
                            />
                        )}
                        <div>
                            <h2 className="text-white font-bold text-xl">{coin?.name}</h2>
                            <p className="text-white/40 text-sm uppercase">{coin?.symbol}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FiX className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-white/20 border-t-[#FBC607] rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/40 font-medium">Loading details...</p>
                        </div>
                    </div>
                ) : coin ? (
                    <div className="px-6 py-6 space-y-6">
                        {/* Price Section */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-sm mb-2">Current Price</p>
                                <p className="text-white font-bold text-3xl">
                                    {formatPrice(coin.market_data?.current_price?.usd || 0)}
                                </p>
                            </div>
                            <div
                                className={`px-4 py-2 rounded-full flex items-center gap-2 ${(coin.market_data?.price_change_percentage_24h || 0) >= 0
                                    ? 'bg-[#4ade80]/20'
                                    : 'bg-[#ef4444]/20'
                                    }`}
                            >
                                {(coin.market_data?.price_change_percentage_24h || 0) >= 0 ? (
                                    <FiArrowUp className="w-4 h-4 text-[#4ade80]" />
                                ) : (
                                    <FiArrowDown className="w-4 h-4 text-[#ef4444]" />
                                )}
                                <span
                                    className={`font-bold text-sm ${(coin.market_data?.price_change_percentage_24h || 0) >= 0
                                        ? 'text-[#4ade80]'
                                        : 'text-[#ef4444]'
                                        }`}
                                >
                                    {Math.abs(coin.market_data?.price_change_percentage_24h || 0).toFixed(2)}%
                                </span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white/40 text-xs mb-2">Market Cap Rank</p>
                                <p className="text-white font-bold text-lg">
                                    #{coin.market_cap_rank || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white/40 text-xs mb-2">24h Volume</p>
                                <p className="text-white font-bold text-lg">
                                    {formatMarketCap(coin.market_data?.total_volume?.usd || 0)}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white/40 text-xs mb-2">Market Cap</p>
                                <p className="text-[#FBC607] font-bold text-lg">
                                    {formatMarketCap(coin.market_data?.market_cap?.usd || 0)}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white/40 text-xs mb-2">Circulating Supply</p>
                                <p className="text-white font-bold text-lg">
                                    {(coin.market_data?.circulating_supply || 0).toLocaleString('en-US', {
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* ATH/ATL */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white/40 text-xs mb-2">All Time High</p>
                                <p className="text-[#4ade80] font-bold text-lg">
                                    {formatPrice(coin.market_data?.ath?.usd || 0)}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white/40 text-xs mb-2">All Time Low</p>
                                <p className="text-[#ef4444] font-bold text-lg">
                                    {formatPrice(coin.market_data?.atl?.usd || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {coin.description?.en && (
                            <div>
                                <h3 className="text-white font-bold mb-3">About</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {coin.description.en.replace(/<[^>]*>/g, '').substring(0, 300)}...
                                </p>
                            </div>
                        )}

                        {/* Links */}
                        <div>
                            <h3 className="text-white font-bold mb-3">Links</h3>
                            <div className="space-y-2">
                                {coin.links?.homepage?.[0] && (
                                    <a
                                        href={coin.links.homepage[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiGlobe className="w-4 h-4 text-[#FBC607]" />
                                            <span className="text-white font-medium text-sm">Website</span>
                                        </div>
                                        <FiArrowUp className="w-4 h-4 text-white/40 rotate-45" />
                                    </a>
                                )}
                                {coin.links?.blockchain_site?.[0] && (
                                    <a
                                        href={coin.links.blockchain_site[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiLink className="w-4 h-4 text-[#8b5cf6]" />
                                            <span className="text-white font-medium text-sm">Blockchain</span>
                                        </div>
                                        <FiArrowUp className="w-4 h-4 text-white/40 rotate-45" />
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
    });

    const { data: trendingCoins = [], isLoading: trendingLoading } = useQuery({
        queryKey: ['market-trending'],
        queryFn: fetchTrendingCoins,
    });

    const { data: memeCoins = [], isLoading: memesLoading } = useQuery({
        queryKey: ['market-memes'],
        queryFn: fetchMemeCoins,
    });

    const { data: selectedCoin, isLoading: detailsLoading } = useQuery({
        queryKey: ['market-coin-details', selectedCoinId],
        queryFn: () => fetchCoinDetails(selectedCoinId!),
        enabled: !!selectedCoinId,
        staleTime: 60000,
    });

    const handleCoinPress = useCallback(
        async (coinId: string) => {
            setSelectedCoinId(coinId);
            await queryClient.prefetchQuery({
                queryKey: ['market-coin-details', coinId],
                queryFn: () => fetchCoinDetails(coinId),
                staleTime: 60000,
            });
            setModalOpen(true);
        },
        [queryClient]
    );

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        setSelectedCoinId(null);
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
        { key: 'tokens', label: 'All Tokens', icon: <FiMenu className="w-3 h-3" /> },
        { key: 'trending', label: 'Trending', icon: <FiTrendingUp className="w-3 h-3" /> },
        { key: 'memes', label: 'Memes', icon: <BiHappy className="w-3 h-3" /> },
        { key: 'watchlist', label: 'Watchlist', icon: <FiBookmark className="w-3 h-3" /> },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        
        @keyframes fade-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        
        .fu { animation: fade-up .45s ease both; }
        .d1 { animation-delay:.08s; }
        .d2 { animation-delay:.16s; }
        .d3 { animation-delay:.24s; }
        .d4 { animation-delay:.32s; }
      `}</style>

            <div className="min-h-screen  text-white dm-sans flex justify-center">
                <LoadingOverlay visible={isLoading} />

                <div className="w-full max-w-100 flex flex-col pt-5 pb-28">
                    {/* Header */}
                    <div className="fu d1 mb-6">
                        <h1 className="text-2xl font-bold mb-1">Market</h1>
                        <p className="text-[0.85rem] text-white/40">Explore and track cryptocurrencies</p>
                    </div>

                    {/* Search Bar */}
                    {(activeTab === 'tokens' || activeTab === 'memes' || activeTab === 'watchlist') && (
                        <div className="fu d2 mb-5">
                            <div className="relative flex items-center">
                                <FiSearch className="absolute left-4 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'memes' ? 'meme coins' : 'coins'}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FBC607] transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 p-1"
                                    >
                                        <FiX className="w-4 h-4 text-white/40" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="fu d3 mb-6 flex gap-2 overflow-x-auto pb-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key
                                    ? 'bg-[#FBC607] text-black'
                                    : 'bg-white/5 border border-white/10 text-white'
                                    }`}
                            >
                                {tab.icon}
                                <span className="text-xs">{tab.label}</span>
                                {tab.key === 'watchlist' && watchlist.length > 0 && (
                                    <span
                                        className={`ml-1 px-1 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.key
                                            ? 'bg-black/20'
                                            : 'bg-[#FBC607]/20 text-[#FBC607]'
                                            }`}
                                    >
                                        {watchlist.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="fu d4 flex-1">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-10 h-10 border-4 border-white/20 border-t-[#FBC607] rounded-full animate-spin mb-3" />
                                <p className="text-xs text-white/40">Loading...</p>
                            </div>
                        ) : filteredCoins.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="mb-3 text-3xl">🔍</div>
                                <h3 className="text-sm font-bold text-white mb-1">No coins found</h3>
                                <p className="text-xs text-white/40 text-center px-4">
                                    Try adjusting your search terms
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {filteredCoins.map((coin, idx) => {
                                    const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
                                    const isInWatchlist = watchlist.includes(coin.id);

                                    return (
                                        <div
                                            key={coin.id}
                                            onClick={() => handleCoinPress(coin.id)}
                                            className="fu bg-white/5 border border-white/10 rounded-2xl p-3.5 hover:bg-white/10 cursor-pointer transition-all active:scale-95"
                                            style={{ animationDelay: `${0.08 + idx * 0.04}s` }}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                {/* Left: Coin Info */}
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="relative">
                                                        <img
                                                            src={coin.image}
                                                            alt={coin.name}
                                                            className="w-10 h-10 rounded-full"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                        {coin.market_cap_rank && (
                                                            <div className="absolute -bottom-1 -right-1 bg-[#3b82f6] text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0a0a0a]">
                                                                {coin.market_cap_rank}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <h3 className="font-bold text-sm text-white truncate">{coin.name}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-white/40 text-[0.7rem] uppercase">{coin.symbol}</span>
                                                            {coin.market_cap && (
                                                                <span className="text-white/30 text-[0.65rem] bg-white/5 px-1.5 py-0.5 rounded">
                                                                    {formatMarketCap(coin.market_cap)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Price & Change */}
                                                <div className="flex items-center gap-2.5">
                                                    <div className="text-right">
                                                        <p className="font-bold text-white text-sm">
                                                            {formatPrice(coin.current_price || 0)}
                                                        </p>
                                                        <div
                                                            className={`flex items-center justify-end gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${isPositive
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

                                                    {/* Watchlist Button */}
                                                    <button
                                                        onClick={(e) => toggleWatchlist(coin.id, e)}
                                                        className="p-2 active:scale-90 transition-transform"
                                                    >
                                                        <FiBookmark
                                                            className="w-4 h-4"
                                                            fill={isInWatchlist ? '#FBC607' : 'none'}
                                                            color={isInWatchlist ? '#FBC607' : 'currentColor'}
                                                        />
                                                    </button>
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