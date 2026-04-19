<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const {data: subscriptions, pending: isLoading} = useUserSubscriptionsQuery();

const activeChannelId = computed(() => route.params.id as string | undefined);
</script>

<template>
  <aside class="hidden lg:flex fixed left-0 top-0 h-screen w-20 flex-col items-center border-r z-10">
    <nav class="flex-1 flex flex-col items-center gap-2 py-4 overflow-y-auto scrollbar-none">
      <template v-if="isLoading">
        <USkeleton v-for="i in 4" :key="i" class="w-12 h-12 rounded-2xl shrink-0"/>
      </template>

      <div v-else-if="!subscriptions?.items?.length" class="flex flex-col items-center gap-2 mt-4">
        <UIcon name="i-lucide-hash" class="w-6 h-6"/>
      </div>

      <template v-else>
        <div
            v-for="channel in subscriptions.items"
            :key="channel.id"
            class="relative shrink-0"
        >
          <Transition name="indicator">
            <span
                v-if="activeChannelId === channel.id"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
            />
          </Transition>

          <ULink
              :to="localePath(`/channel/${channel.id}`)"
              class="block w-12 h-12 rounded-2xl transition-all duration-200"
              :class="[
                activeChannelId === channel.id
                  ? 'ring-2 scale-105'
                  : 'hover:scale-110 opacity-70 hover:opacity-100'
              ]"
          >
            <ChannelAvatar :title="channel.title" :icon="channel.avatar_url ?? undefined"/>
          </ULink>
        </div>
      </template>
    </nav>

    <div class="flex flex-col items-center gap-2 py-4">
      <slot/>
    </div>
  </aside>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.indicator-enter-active,
.indicator-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.indicator-enter-from,
.indicator-leave-to {
  opacity: 0;
  transform: translateY(-50%) scaleY(0);
}
</style>
