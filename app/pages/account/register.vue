<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({
    title: () => t("auth.register.seoTitle"),
    description: () => t("auth.register.seoDescription"),
});
definePageMeta({
    layout: "auth",
});
</script>

<template>
    <AuthRegister />
</template>
