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
        label: t("auth.login.emailLabel"),
        placeholder: "user@mail.com",
        required: true,
    },
    {
        name: "password",
        label: t("auth.login.passwordLabel"),
        type: "password" as const,
        placeholder: "********",
        required: true,
    },
]);

const loginSchema = computed(() =>
    z.object({
        email: z.email(t("validate.invalidEmail")),
        password: z
            .string(t("validate.emptyString"))
            .min(8, t("validate.insufficientLength", { min: 8 })),
    }),
);
type TypeLoginSchema = z.infer<typeof loginSchema.value>;

async function login(payload: FormSubmitEvent<TypeLoginSchema>) {
    loading.value = true;
    try {
        await authStore.loginUser(payload.data.email, payload.data.password);
        toast.add({
            description: t("auth.toast.loginSuccess"),
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
        :schema="loginSchema"
        :title="t('auth.login.title')"
        :description="t('auth.login.description')"
        :fields="fields"
        :loading="loading"
        :submit-handler="login"
        :back-route="localePath('/account/register')"
        :back-label="t('auth.login.backButtonLabel')"
    />
</template>
