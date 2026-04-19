<script setup lang="ts">
import { en, ru } from "@nuxt/ui/locale";

const { locale, setLocale } = useI18n()

const changeLocale = async (value: "en" | "ru") => {
  await setLocale(value);
  window.location.reload();
};
</script>

<template>
  <ULocaleSelect
      :model-value="locale"
      :locales="[en, ru]"
      class="w-48 cursor-pointer"
      @update:model-value="changeLocale"
  />
</template>
