<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const {t} = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("about.seo.title"),
  description: () => t("about.description"),
});

useSchemaOrg([defineWebSite({name: "FuelCommunication"}), defineWebPage()]);

const links = computed(() => [
  {
    label: t("about.linkLabel"),
    to: localePath("/account/login"),
    icon: "i-lucide-square-play",
  },
]);

const items: NavigationMenuItem[] = [
  {
    label: "GitHub",
    to: "https://github.com/FuelCommunication",
    target: "_blank",
  },
];

const features = computed(() => [
  {
    title: t("about.selection.features.1.title"),
    description: t("about.selection.features.1.description"),
    icon: "i-lucide-rocket",
  },
  {
    title: t("about.selection.features.2.title"),
    description: t("about.selection.features.2.description"),
    icon: "i-lucide-lock-keyhole-open",
  },
  {
    title: t("about.selection.features.3.title"),
    description: t("about.selection.features.3.description"),
    icon: "i-lucide-users",
  },
]);

const ctaLinks = computed(() => [
  {
    label: t("about.cta.button"),
    to: localePath("/account/register"),
    icon: "i-lucide-user-plus",
    size: "lg" as const,
  },
]);
</script>

<template>
  <div>
    <UPageHero
        title="Fuel Communication"
        :description="t('about.description')"
        orientation="horizontal"
        :links="links"
    >
      <NuxtImg
          src="./fuelcommunication_shield.svg"
          alt="App screenshot"
          class="rounded-lg shadow-2xl ring ring-default"
      />
    </UPageHero>
    <UPageSection
        :title="t('about.selection.title')"
        :description="t('about.selection.description')"
        :features="features"
    />
    <UPageCTA
        :title="t('about.cta.title')"
        :description="t('about.cta.description')"
        :links="ctaLinks"
    />
    <USeparator :ui="{ border: 'border-primary/30' }"/>
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright &copy;
          {{ new Date().getFullYear() }} FuelCommunication
        </p>
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <SettingsLocale/>
          <UColorModeSwitch/>
          <UNavigationMenu :items="items" variant="link"/>
        </div>
      </template>
    </UFooter>
  </div>
</template>
