<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";
import { en } from "@nuxt/ui/locale";

const { locale } = useI18n();

useHead({
    htmlAttrs: { lang: locale },
});

const uiLocale = computed<typeof en>(() => {
    const list = locales as unknown as Record<string, typeof en>;
    return list[locale.value] ?? en;
});
</script>

<template>
    <UApp :locale="uiLocale">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
