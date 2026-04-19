<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>();
const {logout} = useAuthStore();
const {t} = useI18n();
</script>

<template>
  <UModal
      :title="t('settings.modal')"
      :close="{ onClick: () => emit('close', false) }"
      close-icon="i-lucide-arrow-right"
  >
    <template #body>
      <div class="flex flex-col gap-8">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium opacity-80">{{ t('settings.modal') }}</label>
          <UColorModeSwitch />
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm font-medium opacity-80">{{ t('settings.lang') }}</label>
          <SettingsLocale />
        </div>

        <div class="pt-2">
          <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              color="error"
              variant="outline"
              class="w-full justify-center py-2.5 cursor-pointer"
              @click="logout"
          >
            {{ t('settings.logout') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
