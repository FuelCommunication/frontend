<script setup lang="ts">
defineProps<{
    isMicOn: boolean;
    isCamOn: boolean;
}>();

defineEmits<{
    "toggle-mic": [];
    "toggle-cam": [];
    leave: [];
}>();

const { t } = useI18n();
</script>

<template>
    <div class="flex items-center justify-center gap-3 py-4">
        <UButton
            :icon="isMicOn ? 'i-lucide-mic' : 'i-lucide-mic-off'"
            :color="isMicOn ? 'neutral' : 'error'"
            :variant="isMicOn ? 'subtle' : 'solid'"
            size="xl"
            class="rounded-full"
            :aria-label="t('calls.toggleMic')"
            @click="$emit('toggle-mic')"
        />
        <UButton
            :icon="isCamOn ? 'i-lucide-video' : 'i-lucide-video-off'"
            :color="isCamOn ? 'neutral' : 'error'"
            :variant="isCamOn ? 'subtle' : 'solid'"
            size="xl"
            class="rounded-full"
            :aria-label="t('calls.toggleCam')"
            @click="$emit('toggle-cam')"
        />
        <UButton
            icon="i-lucide-phone-off"
            color="error"
            variant="solid"
            size="xl"
            class="rounded-full"
            :aria-label="t('calls.leave')"
            @click="$emit('leave')"
        />
    </div>
</template>
