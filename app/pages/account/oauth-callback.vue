<script setup lang="ts">
definePageMeta({
	layout: "auth",
});

const authStore = useAuthStore();
const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();

onMounted(async () => {
	const query = new URLSearchParams(window.location.search);
	const oauthError = query.get("error");

	if (oauthError) {
		toast.add({
			title: t("auth.toast.error"),
			description: oauthError,
			icon: "i-lucide-bug",
			color: "error",
		});
		return navigateTo(localePath("/account/login"));
	}

	const hash = window.location.hash.substring(1);
	const params = new URLSearchParams(hash);

	const accessToken = params.get("access_token");
	const refreshToken = params.get("refresh_token");
	const expiresIn = params.get("expires_in");
	const userId = params.get("user_id");
	const email = params.get("email");
	const username = params.get("username");

	if (!accessToken || !refreshToken || !userId) {
		toast.add({
			description: t("auth.toast.error"),
			icon: "i-lucide-bug",
			color: "error",
		});
		return navigateTo(localePath("/account/login"));
	}

	history.replaceState(null, "", window.location.pathname);

	authStore.setSessionFromOAuth(
		{
			access_token: accessToken,
			tokenType: "Bearer",
			refreshToken,
			expiresIn: Number(expiresIn) || 3600,
			expires_at: 0,
		},
		{
			id: userId,
			email: email || "",
			username: username || "",
		},
	);

	toast.add({
		description: t("auth.toast.loginSuccess"),
		icon: "i-lucide-cloud-check",
	});

	await navigateTo(localePath("/"));
});
</script>

<template>
	<div class="flex items-center justify-center min-h-screen">
		<UIcon name="i-lucide-loader-circle" class="animate-spin size-8" />
	</div>
</template>
