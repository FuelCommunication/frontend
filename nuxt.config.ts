export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: {enabled: true},
    modules: [
      "@nuxt/ui",
      "@nuxt/image",
      '@nuxt/eslint',
      "@nuxtjs/i18n",
      "@pinia/nuxt",
      "pinia-plugin-persistedstate/nuxt",
      "@vueuse/nuxt",
      "@nuxtjs/seo",
    ],
    routeRules: {
        '/about': {prerender: true},
    },
    css: ["~/assets/css/main.css"],
    app: {
        head: {
            title: "FuelCommunication",
            titleTemplate: "%s | FuelCommunication",
            htmlAttrs: { lang: "en" },
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            ],
        },
        pageTransition: { name: "page", mode: "out-in" },
    },
    i18n: {
        langDir: "locales",
        strategy: "prefix_except_default",
        locales: [
            { code: "en", name: "English", file: "en.json" },
            { code: "ru", name: "Russian", file: "ru.json" },
        ],
        defaultLocale: "en",
    },
    runtimeConfig: {
        token: "",
        public: {
            apiUrl: "",
        },
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
    sitemap: {
        defaults: {
            lastmod: new Date().toISOString(),
            priority: 0.5,
            changefreq: 'weekly'
        }
    },
});
