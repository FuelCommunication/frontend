import type {Channel ,Channels} from "~/interfaces/channel.interface";
import type {Session, User} from "~/interfaces/auth.interfaces";

export const useChannelStore = defineStore("channels", () => {
        const API_URL = useRuntimeConfig().public.apiUrl + "/channels";
        const user_channels = ref<Channel[]>([]);

        async function createChannel(
            title: string,
            description: string,
            avatar_url?: string,
        ) {
            const cookie = useCookie<{ session: Session, user: User }>('auth')
            const accessToken = cookie.value.session.access_token;
            const user_id = cookie.value.user.id;

            const channel = await $fetch<Channel>(API_URL + `/${user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    title: title,
                    description: description,
                    avatar_url: avatar_url
                },
            });
            user_channels.value.push(channel);
            return channel;
        }

        async function getUserChannels(): Promise<void> {
            const cookie = useCookie<{ session: Session; user: User }>('auth');
            const accessToken = cookie.value.session.access_token;
            const user_id = cookie.value.user.id;

            const { data, error } = await useFetch<Channel[]>(`${API_URL}/sub/user/${user_id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (error.value) {
                console.error("Ошибка при загрузке каналов пользователя:", error.value);
                return;
            }

            if (data.value) {
                user_channels.value = data.value;
            }
        }

        async function getChannelInfo(channelId: string) {
        }

        async function getChannels(limit: number, offset: number): Promise<Channels> {
            const cookie = useCookie<{ session: Session, user: User }>('auth')
            const accessToken = cookie.value.session.access_token;

            return await $fetch<Channels>(API_URL + `?limit=${limit}&offset=${offset}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                }
            });
        }

        return {user_channels, createChannel, getUserChannels, getChannelInfo, getChannels};
    },
    {
        persist: true,
    },
);
