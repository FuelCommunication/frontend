<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useWebSocket} from "@vueuse/core";
import type {ChatMessage} from "~/interfaces/message";
import {useAuthStore} from "~/stores/auth.store";

definePageMeta({
  layout: "channels",
  middleware: ["auth"]
});

const route = useRoute();
const {user} = useAuthStore();
const messages = ref<ChatMessage[]>([]);

const wsUrl = computed(() => `ws://localhost:3000/ws/${route.params.id}`);
const {send, open, close} = useWebSocket(wsUrl, {
  autoReconnect: {
    retries: 10,
    delay: 1500,
    onFailed: () => {
      alert('Failed to connect WebSocket after 3 retries')
    }
  },
  heartbeat: {
    message: 'ping',
    interval: 30000,
    pongTimeout: 10000,
  },
  immediate: false,
  onMessage(ws, event) {
    const payload = JSON.parse(event.data)
    console.log(user?.id, payload.user_id, user?.id === payload.user_id )

    messages.value.push({
      id: payload.user_id,
      role: user?.id === payload.user_id ? "user" : "assistant",
      parts: [{type: "text", text: payload.text}],
      timestamp: payload.ts,
    })
  }
});

onMounted(() => {
  open();
});
onBeforeUnmount(() => {
  close();
});
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <UChatMessages
        auto-scroll-icon="i-lucide-chevron-down"
        :messages="messages"
        :user="{
        avatar: { icon: 'i-lucide-user' },
        variant: 'solid',
        side: 'right'
      }"
        :assistant="{
        avatar: { icon: 'i-lucide-user' },
        variant: 'outline',
        side: 'left'
      }"
    />
    <ChatInput :send-message-ws="send"/>
  </div>
</template>

