<script setup lang="ts">
import {storeToRefs} from 'pinia';

const channelStore = useChannelStore();
const {user_channels} = storeToRefs(channelStore);
const {getUserChannels} = channelStore;

onMounted(() => {
  getUserChannels();
});
</script>

<template>
  <aside class="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-4 space-y-3  border-r z-10">
    <div
        v-for="channel in user_channels"
        :key="channel.id"
        class="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer group transition-transform
      hover:scale-110 relative">
      <ULink :to="`/channel/${channel.id}`">
        <ChannelAvatar :title="channel.title" :icon="channel.avatar_url"/>
      </ULink>
    </div>
    <slot/>
  </aside>
</template>