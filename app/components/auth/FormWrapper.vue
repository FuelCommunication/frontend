<script setup lang="ts">
import type { AuthFormProps } from "~/interfaces/auth.interfaces";

defineProps<AuthFormProps>();

const config = useRuntimeConfig();

const providers = [
    {
        label: "Google",
        icon: "i-simple-icons-google",
        onClick: () => {
            navigateTo(`${config.public.apiUrl}/access/oauth/google`, {
                external: true,
            });
        },
    },
    {
        label: "GitHub",
        icon: "i-simple-icons-github",
        onClick: () => {
            navigateTo(`${config.public.apiUrl}/access/oauth/github`, {
                external: true,
            });
        },
    },
];
</script>

<template>
    <UAuthForm
        :schema
        :title
        :description
        icon="i-lucide-user"
        :fields
        :providers
        :loading
        @submit="submitHandler"
    />

    <ULink :to="backRoute" class="text-center">{{ backLabel }}</ULink>
</template>
