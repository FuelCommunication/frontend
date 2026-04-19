<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { FetchError } from "ofetch";
import * as z from "zod";

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const userStore = useUserStore();
const channelStore = useChannelStore();

const emit = defineEmits<{ done: [] }>();

const schema = z.object({
    username: z.string().min(1).max(64),
    bio: z.string().max(500).optional().or(z.literal("")),
    image: z.file().optional(),
});
type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
    username: authStore.user?.username,
    bio: authStore.user?.bio ?? "",
});

const submitting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitting.value = true;
    try {
        let avatar_url: string | undefined;
        if (event.data.image) {
            avatar_url = await channelStore.uploadImage(event.data.image);
        }
        await userStore.updateProfile({
            username: event.data.username,
            bio: event.data.bio ?? "",
            ...(avatar_url ? { avatar_url } : {}),
        });
        toast.add({
            title: t("settings.profile.success"),
            icon: "i-lucide-check",
            color: "success",
        });
        emit("done");
    } catch (err) {
        const e = err as FetchError;
        toast.add({
            title: e.status?.toString() ?? "error",
            description: e.statusText ?? t("settings.profile.error"),
            icon: "i-lucide-bug",
            color: "error",
        });
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <UForm
        :schema
        :state
        class="flex flex-col gap-4"
        @submit="onSubmit"
    >
        <UFormField :label="t('settings.profile.username')" name="username">
            <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField :label="t('settings.profile.bio')" name="bio">
            <UTextarea v-model="state.bio" :rows="3" class="w-full" />
        </UFormField>

        <UFormField :label="t('settings.profile.avatar')" name="image">
            <UFileUpload v-model="state.image" :label="t('settings.profile.avatarHint')" description="" size="md" />
        </UFormField>

        <div class="flex gap-2 pt-2">
            <UButton
                type="submit"
                :loading="submitting"
                icon="i-lucide-save"
                class="cursor-pointer"
            >
                {{ t("settings.profile.save") }}
            </UButton>
            <UButton
                color="neutral"
                variant="ghost"
                class="cursor-pointer"
                :disabled="submitting"
                @click="emit('done')"
            >
                {{ t("settings.profile.cancel") }}
            </UButton>
        </div>
    </UForm>
</template>
