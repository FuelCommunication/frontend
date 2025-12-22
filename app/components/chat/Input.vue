<script setup lang="ts">
import {ref} from "vue";
import {useAuthStore} from "~/stores/auth.store";

const props = defineProps<{ sendMessageWs: (data: string) => boolean }>();
const {t} = useI18n();
const {user} = useAuthStore();
const newMessage = ref("");

function sendMessage() {
  if (!newMessage.value.trim()) return;

  const data = JSON.stringify({
    chat: {
      user_id: user?.id,
      username: user?.username,
      text: newMessage.value,
      ts: Date.now()
    }
  });

  props.sendMessageWs(data);
  newMessage.value = "";
}
</script>

<template>

  <div class="sticky bottom-0 flex justify-center items-center gap-2 p-3 backdrop-blur z-1">
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
    />

    <UButton
        color="primary"
        icon="i-lucide-send"
        :disabled="!newMessage.trim()"
        @click="sendMessage"
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.enter.shift="newMessage += '\n'"
    />
  </div>
</template>
