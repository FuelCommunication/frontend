import type { Session } from "~/interfaces/auth.interfaces";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

let refreshPromise: Promise<Session | null> | null = null;

async function refreshToken(
  baseUrl: string,
  currentSession: Session,
): Promise<Session | null> {
  if (!currentSession.refreshToken) return null;

  try {
    return await $fetch<Session>(`${baseUrl}/access/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: {
        refresh_token: currentSession.refreshToken,
      },
    });
  } catch {
    return null;
  }
}

export function useApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl as string;

  async function apiFetch<T>(
    url: string,
    opts: NitroFetchOptions<NitroFetchRequest> = {},
  ): Promise<T> {
    const authStore = useAuthStore();
    const router = useRouter();
    const localePath = useLocalePath();
    const session = authStore.session;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...((opts.headers as Record<string, string>) || {}),
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const buildFetchOpts = (h: Record<string, string>) =>
      ({ ...opts, headers: h }) as NitroFetchOptions<NitroFetchRequest>;

    try {
      return (await $fetch(`${baseUrl}${url}`, buildFetchOpts(headers))) as T;
    } catch (error: unknown) {
      const fetchErr = error as { statusCode?: number };
      if (fetchErr?.statusCode !== 401 || !session?.refreshToken) {
        throw error;
      }

      if (!refreshPromise) {
        refreshPromise = refreshToken(baseUrl, session).finally(() => {
          refreshPromise = null;
        });
      }

      const newSession = await refreshPromise;

      if (!newSession) {
        authStore.session = undefined;
        authStore.user = undefined;
        await router.push(localePath("/account/login"));
        throw error;
      }

      authStore.session = { ...newSession, expires_at: Date.now() + newSession.expiresIn * 1000 };

      return (await $fetch(
        `${baseUrl}${url}`,
        buildFetchOpts({ ...headers, Authorization: `Bearer ${newSession.access_token}` }),
      )) as T;
    }
  }

  return { apiFetch };
}
