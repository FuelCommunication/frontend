<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type {FetchError} from "ofetch";

const authStore = useAuthStore();
const { t } = useI18n();
const toast = useToast();

const fields = [
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
];

const registerSchema = z.object({
	username: z
		.string(t("validate.emptyString"))
		.min(2, t("validate.insufficientLength", { min: 2 }))
		.regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, t("validate.invalidString")),
	email: z
		.email(t("validate.invalidEmail"))
		.min(15, t("validate.insufficientLength", { min: 15 })),
	password: z
		.string(t("validate.emptyString"))
		.min(5, t("validate.insufficientLength", { min: 5 })),
});
type TypeRegisterSchema = z.infer<typeof registerSchema>;

async function register(payload: FormSubmitEvent<TypeRegisterSchema>) {
	try {
		await authStore.registerUser(
			payload.data.email,
			payload.data.username,
			payload.data.password,
		);
    toast.add({
      title: '200',
      description: 'Аккаунт создан',
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
      :schema="registerSchema"
      :title="t('auth.register.title')"
      :description="t('auth.register.description')"
      :fields
      :submit-handler="register"
      :back-route="'/account/login'"
      :back-label="t('auth.register.backButtonLabel')"
  />
</template>