<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n";

const { locale, setLocale, locales } = useI18n();

const items = computed(() =>
    (locales.value as LocaleObject[]).map((l) => ({
        label: l.name ?? l.code,
        value: l.code,
    })),
);
</script>

<template>
    <USelect
        :model-value="locale"
        :items="items"
        class="w-48 cursor-pointer"
        @update:model-value="(value: string) => setLocale(value as 'en' | 'ru')"
    />
</template>
