<script setup lang="ts">
import type {FormSubmitEvent} from "@nuxt/ui";
import * as z from "zod";
import type {FetchError} from "ofetch";

const {t} = useI18n();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>()
const channelStore = useChannelStore();

const schema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.file().optional(),
});
type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: undefined,
  description: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const title = event.data.title;
  const description = event.data.description;
  // const image = event.data.image;
  try {
    await channelStore.createChannel(title, description);
    toast.add({
      title: `Канал усешно создан`,
      icon: "i-lucide-package-plus",
      color: 'success',
    });
  } catch (err) {
    const e = err as FetchError;
    toast.add({
      title: e.status?.toString(),
      description: e.statusText,
      icon: "i-lucide-bug",
      color: 'error',
    });
  }
}
</script>

<template>
  <UModal
      :title="t('channel.create.description')"
      :close="{ onClick: () => emit('close', false) }"
      close-icon="i-lucide-arrow-right"
  >
    <template #body>
      <UForm :schema :state class="space-y-4 flex flex-col" @submit="onSubmit">
        <UInput
            v-model="state.title" required :placeholder="t('channel.create.title')"
            trailing-icon="i-lucide-captions"
            size="md"/>
        <UTextarea v-model="state.description" required :placeholder="t('channel.create.description')" type="text"/>
        <UFileUpload
            v-model="state.image"
            :label="t('channel.create.image')"
            description=""
            size="md"
        />
        <UButton
            type="submit" class="w-24 min-h-6 cursor-pointer" icon="i-lucide-badge-plus"
            @click="emit('close', false)">
          {{ t('channel.create.btn') }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>