<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type { FetchError } from "ofetch";

const authStore = useAuthStore();
const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();
const loading = ref(false);

const fields = computed(() => [
    {
        name: "email",
        type: "text" as const,
        label: t("auth.register.emailLabel"),
        placeholder: "user@mail.com",
        required: true,
    },
    {
        name: "username",
        type: "text" as const,
        label: t("auth.register.usernameLabel"),
        placeholder: "Username",
        required: true,
    },
    {
        name: "password",
        label: t("auth.register.passwordLabel"),
        type: "password" as const,
        placeholder: "********",
        required: true,
    },
]);

const registerSchema = computed(() =>
    z.object({
        username: z
            .string(t("validate.emptyString"))
            .min(2, t("validate.insufficientLength", { min: 2 }))
            .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, t("validate.invalidUsername")),
        email: z.email(t("validate.invalidEmail")),
        password: z
            .string(t("validate.emptyString"))
            .min(8, t("validate.insufficientLength", { min: 8 })),
    }),
);
type TypeRegisterSchema = z.infer<typeof registerSchema.value>;

async function register(payload: FormSubmitEvent<TypeRegisterSchema>) {
    loading.value = true;
    try {
        await authStore.registerUser(
            payload.data.email,
            payload.data.username,
            payload.data.password,
        );
        toast.add({
            description: t("auth.toast.registerSuccess"),
            icon: "i-lucide-cloud-check",
        });
        await navigateTo(localePath("/"));
    } catch (error) {
        const e = error as FetchError;
        toast.add({
            title: e.statusCode?.toString(),
            description: e.data?.error || t("auth.toast.error"),
            icon: "i-lucide-bug",
            color: "error",
        });
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <AuthFormWrapper
        :schema="registerSchema"
        :title="t('auth.register.title')"
        :description="t('auth.register.description')"
        :fields="fields"
        :loading="loading"
        :submit-handler="register"
        :back-route="localePath('/account/login')"
        :back-label="t('auth.register.backButtonLabel')"
    />
</template>
