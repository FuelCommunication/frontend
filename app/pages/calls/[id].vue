<script setup lang="ts">
definePageMeta({
    layout: "channels",
    middleware: ["auth"],
});

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();

const roomId = computed(() => route.params.id as string);

const {
    localStream,
    remotePeers,
    selfId,
    isMicOn,
    isCamOn,
    isConnecting,
    start,
    leave,
    toggleMic,
    toggleCam,
} = useCalls({
    roomId: roomId.value,
    onError: (message) => toast.add({ description: message, color: "error" }),
});

const peers = computed(() => Array.from(remotePeers.value.values()));

const gridClass = computed(() => {
    const total = peers.value.length + 1;
    if (total <= 1) return "grid-cols-1";
    if (total <= 2) return "grid-cols-1 md:grid-cols-2";
    if (total <= 4) return "grid-cols-2";
    if (total <= 9) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-3 md:grid-cols-4";
});

async function handleLeave() {
    leave();
    await navigateTo(localePath("/calls"));
}

async function copyInviteLink() {
    if (!import.meta.client) return;
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        toast.add({
            title: t("calls.room.linkCopied"),
            icon: "i-lucide-link",
            color: "success",
        });
    } catch {
        toast.add({
            description: t("calls.room.linkCopyError"),
            color: "error",
        });
    }
}

onMounted(start);
</script>

<template>
    <div class="flex flex-col h-[calc(100vh-2rem)] py-4">
        <div class="flex items-center justify-between pb-3">
            <div class="flex items-center gap-3">
                <UIcon name="i-lucide-video" class="w-5 h-5" />
                <span class="font-mono text-sm">{{ roomId.slice(0, 8) }}</span>
                <span class="text-xs text-[var(--ui-text-dimmed)]">
                    {{ t("calls.room.peerLabel", { count: peers.length + 1 }) }}
                </span>
            </div>
            <UButton
                icon="i-lucide-link"
                color="neutral"
                variant="soft"
                size="sm"
                class="cursor-pointer"
                @click="copyInviteLink"
            >
                {{ t("calls.room.copyLink") }}
            </UButton>
        </div>

        <div
            v-if="isConnecting"
            class="flex-1 flex items-center justify-center"
        >
            <div class="text-center text-[var(--ui-text-dimmed)]">
                <UIcon
                    name="i-lucide-loader-circle"
                    class="w-10 h-10 mx-auto mb-3 animate-spin"
                />
                <p>{{ t("calls.room.connecting") }}</p>
            </div>
        </div>

        <div v-else class="flex-1 overflow-auto">
            <div class="grid gap-3" :class="gridClass">
                <CallsVideoTile
                    :stream="localStream"
                    :label="t('calls.room.youLabel', { id: selfId?.slice(0, 6) ?? '' })"
                    muted
                    mirror
                    :placeholder="!isCamOn"
                />
                <CallsVideoTile
                    v-for="peer in peers"
                    :key="peer.user_id"
                    :stream="peer.stream"
                    :label="peer.user_id.slice(0, 6)"
                />
            </div>
        </div>

        <CallsControls
            :is-mic-on="isMicOn"
            :is-cam-on="isCamOn"
            @toggle-mic="toggleMic"
            @toggle-cam="toggleCam"
            @leave="handleLeave"
        />
    </div>
</template>
