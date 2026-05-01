import type { Channel, Subscription } from "~/interfaces/channel.interface";

export const useChannelStore = defineStore("channels", () => {
    const { apiFetch } = useApi();

    const userSubscriptions = ref<Subscription[]>([]);

    async function uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);
        const result = await apiFetch<{ filename: string }>("/images/upload", {
            method: "POST",
            body: formData,
        });
        return result.filename;
    }

    async function createChannel(title: string, description: string, avatar_url?: string) {
        const channel = await apiFetch<Channel>("/channels", {
            method: "POST",
            body: { title, description, avatar_url },
        });
        userSubscriptions.value.unshift({
            ...channel,
            avatar_url: channel.avatar_url ?? null,
            subscribers_count: 1,
        });
        refreshNuxtData("subscriptions");
        refreshNuxtData("channels");
        return channel;
    }

    async function updateChannel(channelId: string, data: { title?: string; description?: string; avatar_url?: string | null }) {
        const updated = await apiFetch<Channel>(`/channels/${channelId}`, {
            method: "PATCH",
            body: data,
        });
        const idx = userSubscriptions.value.findIndex((s) => s.id === channelId);
        const existing = userSubscriptions.value[idx];
        if (idx !== -1 && existing) {
            userSubscriptions.value[idx] = {
                ...existing,
                ...updated,
                avatar_url: updated.avatar_url ?? null,
            };
        }
        refreshNuxtData("subscriptions");
        refreshNuxtData("channels");
        return updated;
    }

    async function deleteChannel(channelId: string) {
        await apiFetch(`/channels/${channelId}`, { method: "DELETE" });
        userSubscriptions.value = userSubscriptions.value.filter((s) => s.id !== channelId);
        refreshNuxtData("subscriptions");
        refreshNuxtData("channels");
    }

    async function subscribe(channelId: string) {
        await apiFetch(`/channels/${channelId}/subscribe`, { method: "POST" });
        const channel = await apiFetch<Channel>(`/channels/${channelId}`);
        userSubscriptions.value.unshift({
            ...channel,
            avatar_url: channel.avatar_url ?? null,
            subscribers_count: 0,
        });
        refreshNuxtData("subscriptions");
    }

    async function unsubscribe(channelId: string) {
        await apiFetch(`/channels/${channelId}/subscribe`, { method: "DELETE" });
        userSubscriptions.value = userSubscriptions.value.filter((s) => s.id !== channelId);
        refreshNuxtData("subscriptions");
    }

    async function transferOwnership(channelId: string, userId: string) {
        await apiFetch(`/channels/${channelId}/transfer/${userId}`, { method: "POST" });
    }

    function $reset() {
        userSubscriptions.value = [];
    }

    return {
        userSubscriptions,
        uploadImage,
        createChannel,
        updateChannel,
        deleteChannel,
        subscribe,
        unsubscribe,
        transferOwnership,
        $reset,
    };
});
