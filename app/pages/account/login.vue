<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({
    title: () => t("auth.login.seoTitle"),
    description: () => t("auth.login.seoDescription"),
});
definePageMeta({
    layout: "auth",
    middleware: "guest",
});
</script>

<template>
    <AuthLogin />
</template>
