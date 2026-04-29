import type {
  LoginResponse,
  Session,
  User,
} from "~/interfaces/auth.interfaces";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | undefined>();
    const session = ref<Session | undefined>();

    function withExpiresAt(s: Session): Session {
      return { ...s, expires_at: Date.now() + s.expiresIn * 1000 };
    }

    function clearDependentStores() {
      const channelStore = useChannelStore();
      channelStore.$reset();
    }

    async function loginUser(email: string, password: string) {
      const { apiFetch } = useApi();
      const response = await apiFetch<LoginResponse>("/access/login", {
        method: "POST",
        body: { email, password },
      });

      clearDependentStores();
      user.value = response.user;
      session.value = withExpiresAt(response.session);
    }

    async function registerUser(
      email: string,
      username: string,
      password: string,
    ) {
      const { apiFetch } = useApi();
      const response = await apiFetch<LoginResponse>("/access/register", {
        method: "POST",
        body: { email, username, password },
      });

      clearDependentStores();
      user.value = response.user;
      session.value = withExpiresAt(response.session);
    }

    async function logout() {
      const { apiFetch } = useApi();
      const localePath = useLocalePath();
      const router = useRouter();
      try {
        await apiFetch("/access/logout", {
          method: "POST",
          body: { refresh_token: session.value?.refreshToken },
        });
      } catch {
        // Clear local state regardless of server response
      }

      clearDependentStores();
      user.value = undefined;
      session.value = undefined;

      await router.push(localePath("/about"));
    }

    function setSessionFromOAuth(oauthSession: Session, oauthUser: User) {
      clearDependentStores();
      session.value = withExpiresAt(oauthSession);
      user.value = oauthUser;
    }

    return {
      session,
      user,
      loginUser,
      registerUser,
      logout,
      setSessionFromOAuth,
    };
  },
  {
    persist: {
      serializer: {
        serialize: (state: Record<string, unknown>) => {
          const s = state.session as Session | undefined;
          const sanitized = s ? { ...s, refreshToken: undefined } : undefined;
          return JSON.stringify({ ...state, session: sanitized });
        },
        deserialize: (value: string) => JSON.parse(value),
      },
    },
  },
);
