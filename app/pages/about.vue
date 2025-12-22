<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

useSeoMeta({
  title: 'About',
  description: 'This is a communications platform that enables you to build connections through text and video features',
})

const {t} = useI18n();
const links = ref([
  {
    label: t('about.linkLabel'),
    to: '/account/login',
    icon: 'i-lucide-square-play'
  }
])
const items: NavigationMenuItem[] = [
  {
    label: 'GitHub',
    to: 'https://github.com/FuelCommunication',
    target: '_blank'
  },
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  }
]
const features = ref([
  {
    title: 'Blazing fast and memory safety',
    description: t('about.selection.features.1'),
    icon: 'i-lucide-rocket',
  },
  {
    title: 'Open source',
    description: t('about.selection.features.2'),
    icon: 'i-lucide-lock-keyhole-open',
  },
  {
    title: 'Groups',
    description: t('about.selection.features.3'),
    icon: 'i-lucide-users',
  }
])
</script>

<template>
  <UPageHero
      title="Fuel Communication"
      :description="t('about.description')"
      orientation="horizontal"
      :links="links"
  >
    <NuxtImg
        src="https://cdn.prod.website-files.com/625fe439fb70a9d901e138ab/6318a71d75360861962dff30_Policy__Safety_-_7-p-2000.png"
        alt="App screenshot"
        class="rounded-lg shadow-2xl ring ring-default"
    />
  </UPageHero>
  <UPageSection
      :title="t('about.selection.title')"
      :description="t('about.selection.description')"
      :features="features"
  />
  <USeparator :ui="{ border: 'border-primary/30' }"/>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
    </template>
    <template #right>
      <UNavigationMenu :items="items" variant="link"/>
    </template>
  </UFooter>
</template>

