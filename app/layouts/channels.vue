<script setup lang="ts">
import { LazyChannelCreateForm, LazySettingsModal } from "#components";

const overlay = useOverlay();
const localePath = useLocalePath();
const modalChannelCreate = overlay.create(LazyChannelCreateForm);
const modalSettings = overlay.create(LazySettingsModal);
</script>

<template>
    <div class="flex h-screen">
        <ChannelSidebar>
            <UButton
                class="rounded-xl cursor-pointer"
                size="xl"
                icon="i-lucide-plus"
                variant="solid"
                @click="modalChannelCreate.open()"
            />
            <UButton
                class="rounded-xl cursor-pointer"
                size="xl"
                icon="i-lucide-compass"
                variant="ghost"
                :to="localePath('/channel')"
            />
            <UButton
                class="rounded-xl cursor-pointer"
                size="xl"
                icon="i-lucide-video"
                variant="ghost"
                :to="localePath('/calls')"
            />
            <UButton
                class="rounded-xl cursor-pointer"
                size="xl"
                icon="i-lucide-settings"
                variant="ghost"
                @click="modalSettings.open()"
            />
        </ChannelSidebar>
        <main class="flex-1 lg:pl-20 overflow-y-auto flex">
            <UContainer class="flex-1 flex flex-col min-h-full">
                <slot />
            </UContainer>
        </main>
    </div>
</template>
