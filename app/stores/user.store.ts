import type { User } from "~/interfaces/auth.interfaces";
import type { PaginatedResponse } from "~/interfaces/channel.interface";

export const useUserStore = defineStore("user", () => {
    const { apiFetch } = useApi();

    async function getMe() {
        const authStore = useAuthStore();
        const user = await apiFetch<User>("/access/users/me");
        authStore.user = user;
        return user;
    }

    async function updateProfile(data: { username?: string; avatar_url?: string | null; bio?: string | null }) {
        const authStore = useAuthStore();
        const updated = await apiFetch<User>("/access/users/me", {
            method: "PATCH",
            body: data,
        });
        authStore.user = updated;
        return updated;
    }

    async function changePassword(oldPassword: string, newPassword: string) {
        await apiFetch("/users/me/password", {
            method: "POST",
            body: { old_password: oldPassword, new_password: newPassword },
        });
    }

    async function deleteAccount() {
        const authStore = useAuthStore();
        const userId = authStore.user?.id;
        if (!userId) return;

        await apiFetch(`/users/${userId}`, { method: "DELETE" });
        await authStore.logout();
    }

    async function searchUsers(q: string, limit = 20, offset = 0) {
        return await apiFetch<PaginatedResponse<User>>(
            `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`,
        );
    }

    return { getMe, updateProfile, changePassword, deleteAccount, searchUsers };
});
