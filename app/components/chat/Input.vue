<script setup lang="ts">
const props = defineProps<{ sendMessageWs: (data: string | ArrayBufferLike | Blob) => boolean }>();
const { t } = useI18n();
const toast = useToast();
const channelStore = useChannelStore();

const newMessage = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const MAX_LENGTH = 5000;
const TYPING_THROTTLE_MS = 2000;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
let lastTypingSent = 0;

function sendMessage() {
    const text = newMessage.value.trim();
    if (!text || text.length > MAX_LENGTH) return;

    props.sendMessageWs(JSON.stringify({ type: "chat", text }));
    newMessage.value = "";
    lastTypingSent = 0;
}

function onInput() {
    const now = Date.now();
    if (now - lastTypingSent < TYPING_THROTTLE_MS) return;
    if (!newMessage.value.trim()) return;
    lastTypingSent = now;
    props.sendMessageWs(JSON.stringify({ type: "typing" }));
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function openPicker() {
    fileInput.value?.click();
}

async function onFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        toast.add({ description: t("channel.chat.image.invalidType"), color: "error" });
        return;
    }
    if (file.size > MAX_FILE_BYTES) {
        toast.add({ description: t("channel.chat.image.tooBig"), color: "error" });
        return;
    }

    uploading.value = true;
    try {
        const key = await channelStore.uploadImage(file);
        const url = useImageUrl(key);
        if (!url) throw new Error("no url");
        props.sendMessageWs(JSON.stringify({ type: "chat", text: url }));
    } catch {
        toast.add({ description: t("channel.chat.image.uploadError"), color: "error" });
    } finally {
        uploading.value = false;
    }
}

const isOverLimit = computed(() => newMessage.value.length > MAX_LENGTH);
const canSend = computed(() => newMessage.value.trim().length > 0 && !isOverLimit.value);
</script>

<template>
    <div class="sticky bottom-0 flex flex-col gap-1 p-3 backdrop-blur z-1">
        <div class="flex justify-center items-center gap-2">
            <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onFile"
            >
            <UButton
                color="neutral"
                variant="ghost"
                :icon="uploading ? 'i-lucide-loader-circle' : 'i-lucide-paperclip'"
                :disabled="uploading"
                :ui="{ leadingIcon: uploading ? 'animate-spin' : '' }"
                class="cursor-pointer"
                :aria-label="t('channel.chat.image.attach')"
                @click="openPicker"
            />

            <UTextarea
                v-model="newMessage"
                :placeholder="t('channel.chat.input')"
                class="flex-1 max-w-xl"
                variant="ghost"
                size="md"
                icon="i-lucide-message-circle"
                :rows="1"
                :maxrows="5"
                :autoresize="true"
                :maxlength="MAX_LENGTH"
                @input="onInput"
                @keydown="onKeydown"
            />

            <UButton
                color="primary"
                icon="i-lucide-send"
                :disabled="!canSend"
                class="cursor-pointer"
                @click="sendMessage"
            />
        </div>
        <p
            v-if="isOverLimit"
            class="text-xs text-[var(--ui-error)] text-center"
        >
            {{ t("channel.chat.tooLong", { max: MAX_LENGTH }) }}
        </p>
    </div>
</template>
