<script setup lang="ts">
import {LazyChannelCreateForm, LazySettingsModal} from "#components";

const overlay = useOverlay()
const modalChannelCreate = overlay.create(LazyChannelCreateForm)
const modalSettings = overlay.create(LazySettingsModal)
</script>

<template>
  <div class="flex h-screen text-white">
    <ChannelSidebar>
      <UButton class="mt-auto rounded-xl cursor-pointer" size="xl" icon="i-lucide-plus" variant="solid" @click="modalChannelCreate.open()"/>
      <UButton class="rounded-xl cursor-pointer" size="xl" icon="i-lucide-settings" variant="ghost" @click="modalSettings.open()"/>
    </ChannelSidebar>
    <UContainer>
      <slot/>
    </UContainer>
    </div>
</template>

