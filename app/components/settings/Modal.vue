<script setup lang="ts">
const authStore = useAuthStore();
const { t } = useI18n();
const emit = defineEmits<{ close: [boolean] }>();

const isEditing = ref(false);

async function handleLogout() {
    emit("close", false);
    await authStore.logout();
}
</script>

<template>
    <UModal
        :title="t('settings.modal')"
        close-icon="i-lucide-arrow-right"
        :close="{ onClick: () => emit('close', false) }"
    >
        <template #body>
            <div class="flex flex-col gap-8">
                <div v-if="authStore.user" class="pb-4 border-b border-[var(--ui-border)]">
                    <div class="flex items-center gap-3">
                        <UAvatar
                            :src="useImageUrl(authStore.user.avatar_url)"
                            :alt="authStore.user.username"
                            :text="authStore.user.username.charAt(0).toUpperCase()"
                            size="lg"
                        />
                        <div class="min-w-0 flex-1">
                            <p class="font-medium text-[var(--ui-text-highlighted)] truncate">
                                {{ authStore.user.username }}
                            </p>
                            <p class="text-sm text-[var(--ui-text-muted)] truncate">
                                {{ authStore.user.email }}
                            </p>
                        </div>
                        <UButton
                            v-if="!isEditing"
                            icon="i-lucide-pencil"
                            color="neutral"
                            variant="ghost"
                            size="sm"
                            class="cursor-pointer shrink-0"
                            :aria-label="t('settings.profile.edit')"
                            @click="isEditing = true"
                        />
                    </div>

                    <div v-if="isEditing" class="mt-4">
                        <SettingsProfileEditForm @done="isEditing = false" />
                    </div>
                </div>

                <template v-if="!isEditing">
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium opacity-80">{{
                            t("settings.colorMode")
                        }}</label>
                        <UColorModeSwitch />
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium opacity-80">{{
                            t("settings.lang")
                        }}</label>
                        <SettingsLocale />
                    </div>

                    <div class="pt-2">
                        <UButton
                            icon="i-lucide-log-out"
                            color="error"
                            variant="outline"
                            class="w-full justify-center py-2.5 cursor-pointer"
                            @click="handleLogout"
                        >
                            {{ t("settings.logout") }}
                        </UButton>
                    </div>
                </template>
            </div>
        </template>
    </UModal>
</template>
