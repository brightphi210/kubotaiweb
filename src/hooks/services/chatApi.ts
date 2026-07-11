/* ─────────────────────────────────────────────────────────────
   Chat completion API service
   Provider: Pollinations AI unified endpoint (gen.pollinations.ai)
   Requires a free API key from https://enter.pollinations.ai
───────────────────────────────────────────────────────────── */

const BASE_URL = 'https://gen.pollinations.ai/v1/chat/completions';
const MODEL = 'openai';
const API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY as string;

export interface ChatApiMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

function authHeaders() {
    if (!API_KEY) {
        console.warn('VITE_POLLINATIONS_API_KEY is missing — set it in your .env file.');
    }
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    };
}

export async function streamChatCompletion(
    messages: ChatApiMessage[],
    onToken: (token: string) => void,
    signal?: AbortSignal
): Promise<void> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: authHeaders(),
        signal,
        body: JSON.stringify({ model: MODEL, messages, stream: true }),
    });

    if (!res.ok || !res.body) {
        const bodyText = await res.text().catch(() => '');
        throw new Error(`Chat API failed (${res.status}): ${bodyText.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') continue;
            try {
                const parsed = JSON.parse(payload);
                const delta = parsed?.choices?.[0]?.delta?.content;
                if (delta) onToken(delta);
            } catch {
                // ignore malformed / keep-alive chunks
            }
        }
    }
}

export async function getChatCompletion(
    messages: ChatApiMessage[],
    signal?: AbortSignal
): Promise<string> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: authHeaders(),
        signal,
        body: JSON.stringify({ model: MODEL, messages, stream: false }),
    });

    if (!res.ok) {
        const bodyText = await res.text().catch(() => '');
        throw new Error(`Chat API failed (${res.status}): ${bodyText.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error(`Unexpected response shape: ${JSON.stringify(data).slice(0, 200)}`);
    return content;
}