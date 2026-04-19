<script setup lang="ts">
definePageMeta({
    layout: "channels",
    middleware: ["auth"],
});

const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();
const callsStore = useCallsStore();

useSeoMeta({
    title: () => t("calls.list.seoTitle"),
});

const { data, pending, refresh } = useAsyncData("rooms", () => callsStore.listRooms());

const isCreating = ref(false);

async function createRoom() {
    isCreating.value = true;
    try {
        const id = await callsStore.createRoom();
        await navigateTo(localePath(`/calls/${id}`));
    } catch {
        toast.add({ description: t("calls.list.createError"), color: "error" });
    } finally {
        isCreating.value = false;
    }
}
</script>

<template>
    <div class="py-6 space-y-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold">{{ t("calls.list.title") }}</h1>
            <UButton
                icon="i-lucide-video"
                :loading="isCreating"
                @click="createRoom"
            >
                {{ t("calls.list.createBtn") }}
            </UButton>
        </div>

        <template v-if="pending">
            <USkeleton v-for="i in 3" :key="i" class="h-16 w-full" />
        </template>

        <div
            v-else-if="!data?.rooms?.length"
            class="flex flex-col items-center gap-3 py-16 text-[var(--ui-text-dimmed)]"
        >
            <UIcon name="i-lucide-video-off" class="w-12 h-12 opacity-50" />
            <p>{{ t("calls.list.empty") }}</p>
        </div>

        <ul v-else class="space-y-2">
            <li
                v-for="room in data.rooms"
                :key="room.id"
                class="flex items-center justify-between p-4 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]"
            >
                <div class="flex flex-col">
                    <span class="font-mono text-sm">{{ room.id.slice(0, 8) }}</span>
                    <span class="text-xs text-[var(--ui-text-dimmed)]">
                        {{ t("calls.list.peerCount", { current: room.peer_count, max: room.max_peers }) }}
                    </span>
                </div>
                <UButton
                    icon="i-lucide-log-in"
                    variant="soft"
                    :to="localePath(`/calls/${room.id}`)"
                    :disabled="room.peer_count >= room.max_peers"
                >
                    {{
                        room.peer_count >= room.max_peers
                            ? t("calls.list.full")
                            : t("calls.list.join")
                    }}
                </UButton>
            </li>
        </ul>

        <div class="flex justify-end pt-2">
            <UButton
                icon="i-lucide-refresh-cw"
                variant="ghost"
                size="sm"
                :loading="pending"
                @click="refresh"
            >
                {{ t("calls.list.refresh") }}
            </UButton>
        </div>
    </div>
</template>
