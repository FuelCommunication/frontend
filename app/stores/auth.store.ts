import type {LoginResponse, Session, User} from "~/interfaces/auth.interfaces";

export const useAuthStore = defineStore('auth', () => {
    const API_URL = useRuntimeConfig().public.apiUrl + "/access";
    const user = ref<User | undefined>();
    const session = ref<Session | undefined>();

    async function loginUser(email: string, password: string) {
        const response = await $fetch<LoginResponse>(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: {
                email: email,
                password: password,
            },
        });

        user.value = response.user;
        session.value = response.session;
    }

    async function registerUser(email: string, username: string, password: string) {
        const response = await $fetch.raw<LoginResponse>(API_URL + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: {
                email: email,
                username: username,
                password: password,
            },
        });

        user.value = response._data?.user;
        session.value = response._data?.session;
    }

    async function logout() {
        await $fetch.raw<LoginResponse>(API_URL + "/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
            }
        });

        user.value = undefined;
        session.value = undefined;

        await navigateTo('/about')
    }

    return {session, user, loginUser, registerUser, logout}
}, {
    persist: true
})