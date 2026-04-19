<script setup lang="ts">
const props = defineProps<{
    stream: MediaStream | null;
    label: string;
    muted?: boolean;
    mirror?: boolean;
    placeholder?: boolean;
}>();

const videoEl = ref<HTMLVideoElement | null>(null);

watch(
    () => props.stream,
    (stream) => {
        if (videoEl.value) videoEl.value.srcObject = stream;
    },
    { flush: "post" },
);

onMounted(() => {
    if (videoEl.value && props.stream) videoEl.value.srcObject = props.stream;
});
</script>

<template>
    <div
        class="relative aspect-video rounded-lg overflow-hidden bg-[var(--ui-bg-elevated)] border border-[var(--ui-border)]"
    >
        <video
            v-if="stream && !placeholder"
            ref="videoEl"
            autoplay
            playsinline
            :muted="muted"
            :class="['w-full h-full object-cover', mirror ? 'scale-x-[-1]' : '']"
        />
        <div
            v-else
            class="w-full h-full flex items-center justify-center text-[var(--ui-text-dimmed)]"
        >
            <UIcon name="i-lucide-user" class="w-16 h-16" />
        </div>

        <div
            class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs font-medium"
        >
            {{ label }}
        </div>
    </div>
</template>
