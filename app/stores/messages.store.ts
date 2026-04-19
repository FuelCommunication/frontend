import type { ChatMessage, ServerMessagePayload } from "~/interfaces/message";

const MAX_MESSAGES_PER_CHANNEL = 500;
const TYPING_CLEAR_MS = 4000;

interface TypingUser {
    user_id: string;
    username: string;
    expires_at: number;
}

export const useMessageStore = defineStore("messages", () => {
    const messages = ref<Map<string, ChatMessage[]>>(new Map());
    const typing = ref<Map<string, TypingUser[]>>(new Map());

    function getChannelMessages(channelId: string): ChatMessage[] {
        return messages.value.get(channelId) ?? [];
    }

    function getChannelTyping(channelId: string): TypingUser[] {
        const now = Date.now();
        const list = typing.value.get(channelId) ?? [];
        return list.filter((u) => u.expires_at > now);
    }

    function toDisplayMessage(payload: ServerMessagePayload): ChatMessage {
        const authStore = useAuthStore();
        const isOwn = authStore.user?.id === payload.user_id;
        const initial = (payload.username?.charAt(0) ?? "?").toUpperCase();
        const avatar = isOwn
            ? {
                  src: useImageUrl(authStore.user?.avatar_url),
                  alt: payload.username,
                  text: initial,
              }
            : {
                  alt: payload.username,
                  text: initial,
              };

        return {
            id: payload.message_id,
            user_id: payload.user_id,
            role: isOwn ? "user" : "assistant",
            parts: [{ type: "text", text: payload.text }],
            createdAt: new Date(payload.ts),
            avatar,
        };
    }

    function pushMessage(channelId: string, payload: ServerMessagePayload) {
        if (!messages.value.has(channelId)) {
            messages.value.set(channelId, []);
        }
        const list = messages.value.get(channelId)!;
        list.push(toDisplayMessage(payload));
        if (list.length > MAX_MESSAGES_PER_CHANNEL) {
            list.splice(0, list.length - MAX_MESSAGES_PER_CHANNEL);
        }
    }

    function loadHistory(channelId: string, payloads: ServerMessagePayload[]) {
        const trimmed = payloads.slice(-MAX_MESSAGES_PER_CHANNEL);
        messages.value.set(channelId, trimmed.map(toDisplayMessage));
    }

    function editMessage(channelId: string, messageId: string, text: string) {
        const list = messages.value.get(channelId);
        if (!list) return;
        const msg = list.find((m) => m.id === messageId);
        if (msg) {
            msg.parts = [{ type: "text", text }];
        }
    }

    function deleteMessage(channelId: string, messageId: string) {
        const list = messages.value.get(channelId);
        if (!list) return;
        const idx = list.findIndex((m) => m.id === messageId);
        if (idx !== -1) list.splice(idx, 1);
    }

    function setTyping(channelId: string, user_id: string, username: string) {
        const authStore = useAuthStore();
        if (authStore.user?.id === user_id) return;

        const list = typing.value.get(channelId) ?? [];
        const filtered = list.filter((u) => u.user_id !== user_id && u.expires_at > Date.now());
        filtered.push({ user_id, username, expires_at: Date.now() + TYPING_CLEAR_MS });
        typing.value.set(channelId, filtered);
    }

    function clearChannel(channelId: string) {
        messages.value.delete(channelId);
        typing.value.delete(channelId);
    }

    function $reset() {
        messages.value.clear();
        typing.value.clear();
    }

    return {
        messages,
        typing,
        getChannelMessages,
        getChannelTyping,
        pushMessage,
        loadHistory,
        editMessage,
        deleteMessage,
        setTyping,
        clearChannel,
        $reset,
    };
});
