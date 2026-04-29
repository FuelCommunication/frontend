<script setup lang="ts">
import type {NuxtError} from "#app";

const props = defineProps<{ error: NuxtError }>();
const {t, te} = useI18n();

const statusCode = computed(() => props.error.status ?? 500);

const message = computed(() => {
  const key = `error.${statusCode.value}`;
  return te(key) ? t(key) : t("error.default");
});
</script>

<template>
  <UError
      :clear="{
            color: 'neutral',
            size: 'xl',
            icon: 'i-lucide-arrow-left',
            label: t('error.back'),
            class: 'rounded-full',
        }"
      :error="{
            statusCode: statusCode,
            statusMessage: props.error.statusText ?? t('error.default'),
            message: message,
        }"
  />
</template>
