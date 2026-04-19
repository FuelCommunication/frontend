<script setup lang="ts">
import type { ServerEvent } from "~/interfaces/message";

definePageMeta({
    layout: "channels",
    middleware: ["auth"],
});

const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const localePath = useLocalePath();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const channelId = computed(() => route.params.id as string);
const messages = computed(() => messageStore.getChannelMessages(channelId.value));

const IMAGE_URL_RE = /^https?:\/\/[^\s]+\/images\/[A-Za-z0-9_-]+$/;
function isImageMessage(text: string | undefined): boolean {
    return !!text && IMAGE_URL_RE.test(text.trim());
}

const historyLoaded = ref(false);
const typingTick = ref(0);
let typingInterval: ReturnType<typeof setInterval> | null = null;

const typingUsers = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    typingTick.value;
    return messageStore.getChannelTyping(channelId.value);
});

const typingLabel = computed(() => {
    const users = typingUsers.value;
    if (users.length === 0) return "";
    if (users.length === 1) return t("channel.chat.typingOne", { name: users[0]!.username });
    if (users.length === 2) return t("channel.chat.typingTwo", { a: users[0]!.username, b: users[1]!.username });
    return t("channel.chat.typingMany", { count: users.length });
});

const config = useRuntimeConfig();
const wsUrl = computed(() => {
    const token = authStore.session?.access_token ?? "";
    return `${config.public.wsUrl}/ws/${channelId.value}?token=${token}`;
});

const { send, open, close } = useWs(wsUrl, {
    immediate: false,
    autoReconnect: {
        retries: 10,
        delay: 1500,
        onFailed: () => {
            toast.add({ description: t("channel.chat.error"), color: "error" });
        },
    },
    heartbeat: {
        message: "ping",
        interval: 30000,
        pongTimeout: 10000,
    },
    async onMessage(event) {
        let payload: ServerEvent;
        try {
            payload = JSON.parse(event.data);
        } catch {
            return;
        }

        switch (payload.type) {
            case "message":
                messageStore.pushMessage(channelId.value, payload);
                break;
            case "history":
                messageStore.loadHistory(channelId.value, payload.messages);
                historyLoaded.value = true;
                break;
            case "edited":
                messageStore.editMessage(channelId.value, payload.message_id, payload.text);
                break;
            case "deleted":
                messageStore.deleteMessage(channelId.value, payload.message_id);
                break;
            case "typing":
                messageStore.setTyping(channelId.value, payload.user_id, payload.username);
                break;
            case "channel_deleted":
                toast.add({ description: t("channel.chat.channelDeleted"), color: "error" });
                messageStore.clearChannel(channelId.value);
                await navigateTo(localePath("/channel"));
                break;
            case "kicked":
                toast.add({ description: t("channel.chat.kicked"), color: "error" });
                messageStore.clearChannel(channelId.value);
                await navigateTo(localePath("/channel"));
                break;
            case "error":
                toast.add({ description: payload.text, color: "error" });
                break;
        }
    },
});

onMounted(() => {
    historyLoaded.value = false;
    open();
    typingInterval = setInterval(() => {
        typingTick.value++;
    }, 1000);
});

onBeforeUnmount(() => {
    if (typingInterval) clearInterval(typingInterval);
    close();
});
</script>

<template>
    <div class="flex flex-col h-full w-full">
        <div v-if="!historyLoaded" class="flex-1 flex items-center justify-center">
            <div class="text-center text-[var(--ui-text-dimmed)]">
                <Icon
                    name="i-lucide-loader-circle"
                    class="w-10 h-10 mx-auto mb-3 animate-spin"
                />
            </div>
        </div>
        <div
            v-else-if="messages.length === 0"
            class="flex-1 flex items-center justify-center"
        >
            <div class="text-center text-[var(--ui-text-dimmed)]">
                <Icon
                    name="i-lucide-message-square"
                    class="w-12 h-12 mx-auto mb-3 opacity-50"
                />
                <p>{{ t("channel.chat.empty") }}</p>
            </div>
        </div>
        <UChatMessages
            v-else
            auto-scroll-icon="i-lucide-chevron-down"
            :messages="messages"
            :user="{
                variant: 'solid',
                side: 'right',
            }"
            :assistant="{
                variant: 'outline',
                side: 'left',
            }"
        >
            <template #content="{ parts }">
                <template v-for="(part, i) in parts" :key="i">
                    <a
                        v-if="part.type === 'text' && isImageMessage(part.text)"
                        :href="part.text"
                        target="_blank"
                        rel="noopener"
                        class="block"
                    >
                        <NuxtImg
                            :src="part.text"
                            :alt="t('channel.chat.image.alt')"
                            class="max-w-xs sm:max-w-sm md:max-w-md max-h-96 rounded-lg object-contain"
                            loading="lazy"
                        />
                    </a>
                    <template v-else-if="part.type === 'text'">
                        <span class="whitespace-pre-wrap break-words">{{ part.text }}</span>
                    </template>
                </template>
            </template>
        </UChatMessages>
        <Transition name="fade">
            <div
                v-if="typingLabel"
                class="px-4 py-1 text-xs text-[var(--ui-text-muted)] italic"
            >
                {{ typingLabel }}
            </div>
        </Transition>
        <ChatInput :send-message-ws="send" />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
