import type { Channel, PaginatedResponse, Subscription } from "~/interfaces/channel.interface";

export function useChannelsQuery(page: Ref<number>, pageSize: number) {
    const { apiFetch } = useApi();

    return useAsyncData("channels", () =>
        apiFetch<PaginatedResponse<Channel>>(
            `/channels?currentPage=${page.value}&pageSize=${pageSize}`,
        ),
        { watch: [page] },
    );
}

export function useChannelsBrowseQuery(query: Ref<string>, page: Ref<number>, pageSize: number) {
    const { apiFetch } = useApi();

    return useAsyncData(
        "channels-browse",
        () => {
            const q = query.value.trim();
            const url = q
                ? `/channels/search?q=${encodeURIComponent(q)}&currentPage=${page.value}&pageSize=${pageSize}`
                : `/channels?currentPage=${page.value}&pageSize=${pageSize}`;
            return apiFetch<PaginatedResponse<Channel>>(url);
        },
        { watch: [query, page] },
    );
}

export function useUserSubscriptionsQuery() {
    const { apiFetch } = useApi();
    const authStore = useAuthStore();

    return useAsyncData("subscriptions", async () => {
        if (!authStore.user?.id) return null;
        return apiFetch<PaginatedResponse<Subscription>>(
            `/channels/sub/user/${authStore.user.id}?currentPage=1&pageSize=50`,
        );
    }, { watch: [() => authStore.user?.id] });
}
