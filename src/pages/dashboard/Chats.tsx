import { useEffect, useRef, useState } from 'react';
import { FiSend, FiTrash2, FiUser, FiZap } from 'react-icons/fi';
import { useChatCompletion, type ChatMessage } from '../../hooks/services/useChatCompletion';

function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user';
    return (
        <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-sm ${isUser
                    ? 'bg-[rgba(251,198,7,.15)] border-[rgba(251,198,7,.4)] text-[#C9A876]'
                    : 'bg-white/5 border-white/10 text-white/70'
                    }`}
            >
                {isUser ? <FiUser className="w-3.5 h-3.5" /> : <FiZap className="w-3.5 h-3.5" />}
            </div>
            <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap dm-sans ${isUser
                    ? 'bg-[#C9A876] text-black font-medium rounded-tr-sm'
                    : 'bg-white/5 border border-white/8 text-white rounded-tl-sm'
                    }`}
            >
                {message.content}
                {message.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-white/60 align-middle animate-pulse" />
                )}
            </div>
        </div>
    );
}

const Chats = () => {
    const { messages, isSending, error, sendMessage, clearChat } = useChatCompletion();
    const [input, setInput] = useState('');

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isSending) return;
        sendMessage(input);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fu { animation: fade-up .35s ease both; }
        .dm-mono { font-family: 'DM Mono', monospace; }
        .dm-sans  { font-family: 'DM Sans',  sans-serif; }
        .chat-scroll::-webkit-scrollbar { width: 6px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(251,198,7,.2); border-radius: 999px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>

            <div className="min-h-screen flex justify-center text-white dm-sans">
                <div className="w-full max-w-100 flex flex-col h-screen">

                    <div className="fu flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 shrink-0">
                        <div>
                            <h1 className="text-lg font-bold flex items-center gap-2">
                                <FiZap className="w-4 h-4 text-[#C9A876]" />
                                Assistant
                            </h1>
                            <p className="text-[0.7rem] text-white/40">Ask anything, get an instant answer</p>
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C9A876] hover:bg-[rgba(251,198,7,.08)] transition-all duration-200"
                                title="Clear chat"
                            >
                                <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div
                        ref={scrollRef}
                        className="chat-scroll flex-1 overflow-y-auto px-5 pt-5 pb-[172px] md:pb-[104px] flex flex-col gap-4"
                    >
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                                <div className="w-14 h-14 rounded-2xl bg-[rgba(251,198,7,.1)] border border-[rgba(251,198,7,.2)] flex items-center justify-center">
                                    <FiZap className="w-6 h-6 text-[#C9A876]" />
                                </div>
                                <p className="text-sm font-semibold text-white">Start a conversation</p>
                                <p className="text-xs text-white/40 max-w-[220px]">
                                    Type a prompt below and I'll get right back to you.
                                </p>
                            </div>
                        ) : (
                            messages.map((m: any) => (
                                <div key={m.id} className="fu">
                                    <MessageBubble message={m} />
                                </div>
                            ))
                        )}
                        {error && <p className="text-center text-xs text-red-400/80">{error}</p>}
                    </div>

                    <div className="fixed left-0 right-0 bottom-[68px] md:bottom-0 z-40 flex justify-center px-5 pb-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                        <div className="w-full max-w-100">
                            <div className="flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus-within:border-[rgba(251,198,7,.4)] transition-colors duration-200">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message Assistant…"
                                    rows={1}
                                    className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder:text-white/30 px-2 py-2 max-h-[120px] dm-sans"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isSending}
                                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 ${input.trim() && !isSending
                                        ? 'bg-[#C9A876] text-black shadow-[0_4px_20px_rgba(251,198,7,.35)] hover:opacity-90'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    {isSending ? (
                                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <FiSend className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Chats;