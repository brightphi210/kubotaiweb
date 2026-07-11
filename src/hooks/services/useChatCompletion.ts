import { useEffect, useRef, useState } from 'react';
import { getChatCompletion, streamChatCompletion, type ChatApiMessage } from '../services/chatApi';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

function friendlyError(err: unknown): string {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('(401)')) return 'Invalid or missing API key. Check your .env file.';
    if (message.includes('(402)')) return 'API key budget exhausted. Check your Pollinations account.';
    if (message.includes('(429)')) return 'Rate limited — please wait a moment and try again.';
    return 'Something went wrong reaching the assistant. Please try again.';
}

export function useChatCompletion() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => () => abortRef.current?.abort(), []);

    const sendMessage = async (prompt: string) => {
        const trimmed = prompt.trim();
        if (!trimmed || isSending) return;

        setError(null);

        const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
        const assistantId = crypto.randomUUID();
        const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '', isStreaming: true };

        const historyForApi: ChatApiMessage[] = [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
        }));

        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setIsSending(true);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            await streamChatCompletion(
                historyForApi,
                (token) => {
                    setMessages((prev) =>
                        prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m))
                    );
                },
                controller.signal
            );
        } catch (streamErr) {
            if ((streamErr as Error).name === 'AbortError') {
                setIsSending(false);
                return;
            }
            console.error('Streaming failed, falling back:', streamErr);

            try {
                const full = await getChatCompletion(historyForApi, controller.signal);
                setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m))
                );
            } catch (fallbackErr) {
                if ((fallbackErr as Error).name !== 'AbortError') {
                    console.error('Chat API error:', fallbackErr);
                    setError(friendlyError(fallbackErr));
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? { ...m, content: m.content || 'Sorry, I ran into an error responding.' }
                                : m
                        )
                    );
                }
            }
        } finally {
            setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
            );
            setIsSending(false);
        }
    };

    const clearChat = () => {
        abortRef.current?.abort();
        setMessages([]);
        setError(null);
    };

    return { messages, isSending, error, sendMessage, clearChat };
}