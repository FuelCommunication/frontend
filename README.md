# Frontend

SPA/SSR client for FuelCommunication, built on Nuxt 4. Covers authentication (email + OAuth Google/GitHub), channels (
CRUD, search, subscriptions), WebSocket chat with typing indicators and history, and WebRTC mesh-topology video calls.

## Stack

**Nuxt 4 + Vue 3 (Composition API, `<script setup>`)** with strict TypeScript.

| Layer      | Choice                                                                                 |
|------------|----------------------------------------------------------------------------------------|
| UI kit     | `@nuxt/ui` v4                                                                          |
| Icons      | `@iconify-json/lucide`, `@iconify-json/simple-icons`                                   |
| State      | `pinia` + `pinia-plugin-persistedstate`                                                |
| Validation | `zod` (reactive schemas — re-evaluated on locale change)                               |
| i18n       | `@nuxtjs/i18n` (`prefix_except_default` strategy, `detectBrowserLanguage` with cookie) |
| SEO        | `@nuxtjs/seo` (sitemap, robots, OG, schema.org)                                        |
| Fonts      | `@nuxt/fonts`                                                                          |
| Images     | `@nuxt/image`                                                                          |
| Lint       | `@nuxt/eslint` (flat config)                                                           |

## Features

- **Auth**: login, register, OAuth (Google, GitHub), JWT + refresh with automatic rotation in `useApi`. Bearer tokens
  kept in memory, refresh tracked via `expires_at`.
- **Channels**: create / update / delete with avatars (uploaded via `/images`), Meilisearch-backed search, subscription
  listing, ownership transfer, reactive sidebar.
- **Chat**: WebSocket with auto-reconnect and heartbeat (`useWs`), TTL-based typing indicator, history via WS history
  event, edit / delete messages, handling of `channel_deleted` and `kicked` events.
- **Video calls**: WebRTC mesh topology, signaling over WebSocket to `service-calls`, `getUserMedia` + dynamic video
  grid (1 / 2 / 4 / 9 tiles), mute / camera toggle, peer reconnect.
- **i18n**: 2 locales (en / ru) with reactive SEO meta and validation messages.
- **Theming**: light / dark via `useColorMode` plus a locale switcher in settings.

## Run

```bash
npm i           # or npm i / pnpm i
npm run dev     # http://localhost:3000

npm run build   # production build (Nitro)
npm run lint    # eslint --fix
```

Requires the backend to be running — see `../devops/README.md`. URLs can be overridden via `NUXT_PUBLIC_API_URL` and
`NUXT_PUBLIC_WS_URL`.