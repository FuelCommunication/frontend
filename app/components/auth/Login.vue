<script setup lang="ts">
import type {FormSubmitEvent} from "@nuxt/ui";
import * as z from "zod";
import type {FetchError} from 'ofetch'

const authStore = useAuthStore();
const {t} = useI18n();
const toast = useToast();

const fields = [
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
];

const loginSchema = z.object({
  email: z
      .email(t("validate.invalidEmail"))
      .min(15, t("validate.insufficientLength", {min: 15})),
  password: z
      .string(t("validate.emptyString"))
      .min(5, t("validate.insufficientLength", {min: 5})),
});
type TypeLoginSchema = z.infer<typeof loginSchema>;

async function login(payload: FormSubmitEvent<TypeLoginSchema>) {
  try {
    await authStore.loginUser(payload.data.email, payload.data.password);
    toast.add({
      title: '200',
      description: 'Успешный вход в аккаунт',
      icon: "i-lucide-cloud-check",
    });
    navigateTo("/");
  } catch (error) {
    const e = error as FetchError;
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
  <AuthFormWrapper
      :schema="loginSchema"
      :title="t('auth.login.title')"
      :description="t('auth.login.description')"
      :fields
      :submit-handler="login"
      back-route="/account/register"
      :back-label="t('auth.login.backButtonLabel')"
  />
</template>