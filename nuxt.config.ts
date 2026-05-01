export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    modules: [
      "@nuxt/ui",
      "@nuxt/image",
      "@nuxt/fonts",
      '@nuxt/eslint',
      "@nuxtjs/i18n",
      "@pinia/nuxt",
      "pinia-plugin-persistedstate/nuxt",
      "@nuxtjs/seo",
    ],
    routeRules: {
        '/about': { prerender: true },
        '/ru/about': { prerender: true },
    },
    css: ["~/assets/css/main.css"],
    sourcemap: {
        client: false,
    },
    app: {
        head: {
            title: "FuelCommunication",
            titleTemplate: "%s | FuelCommunication",
            link: [
                { rel: "icon", type: "image/x-icon", href: "/avatar.svg" },
            ],
        },
        pageTransition: { name: "page", mode: "out-in" },
    },
    i18n: {
        langDir: "locales",
        strategy: "prefix_except_default",
        locales: [
            { code: "en", language: "en-US", name: "English", file: "en.json" },
            { code: "ru", language: "ru-RU", name: "Русский", file: "ru.json" },
        ],
        defaultLocale: "en",
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_redirected",
            redirectOn: "root",
            alwaysRedirect: false,
        },
    },
    imports: {
        dirs: ["composables/**"],
    },
    runtimeConfig: {
        public: {
            apiUrl: "",
            wsUrl: "",
            googleClientId: "",
            githubClientId: "",
        },
    },
    nitro: {
        compressPublicAssets: true,
    },
    image: {
        format: ["webp", "avif"],
        densities: [1, 2],
        quality: 80,
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
    },
    robots: {
        disallow: ['/account/', '/channel/'],
        blockNonSeoBots: true,
    },
    sitemap: {
        defaults: {
            priority: 0.5,
            changefreq: 'weekly',
        },
    },
});
