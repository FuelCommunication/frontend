export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore();
    const localePath = useLocalePath();

    if (!authStore.session) {
        return navigateTo(localePath("/account/login"));
    }

    const isExpired = authStore.session.expires_at <= Date.now();
    if (isExpired && !authStore.session.refreshToken) {
        authStore.session = undefined;
        authStore.user = undefined;
        return navigateTo(localePath("/account/login"));
    }
});
