<script setup lang="ts">
definePageMeta({
    layout: "channels",
    middleware: ["auth"],
});

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
    title: () => t("channel.list.seoTitle"),
});

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 300;

const rawQuery = ref("");
const query = ref("");
const page = ref(1);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(rawQuery, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        query.value = val;
        page.value = 1;
    }, DEBOUNCE_MS);
});

onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
});

const { data: channels, pending } = useChannelsBrowseQuery(query, page, PAGE_SIZE);

const totalPages = computed(() =>
    channels.value ? Math.ceil(channels.value.total / PAGE_SIZE) : 0,
);

const hasResults = computed(() => (channels.value?.items?.length ?? 0) > 0);
</script>

<template>
    <div class="w-full max-w-6xl mx-auto py-6 flex flex-col gap-6">
        <header class="flex flex-col gap-2">
            <h1 class="text-2xl font-semibold text-[var(--ui-text-highlighted)]">
                {{ t("channel.list.seoTitle") }}
            </h1>
            <p class="text-sm text-[var(--ui-text-muted)]">
                {{ t("channel.list.subtitle") }}
            </p>
        </header>

        <UInput
            v-model="rawQuery"
            :placeholder="t('channel.list.searchPlaceholder')"
            icon="i-lucide-search"
            size="lg"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
        >
            <template v-if="rawQuery" #trailing>
                <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-x"
                    class="cursor-pointer"
                    :aria-label="t('channel.list.clear')"
                    @click="rawQuery = ''"
                />
            </template>
        </UInput>

        <!-- Loading -->
        <div
            v-if="pending && !channels"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
            <USkeleton
                v-for="i in 6"
                :key="i"
                class="h-32 rounded-xl"
            />
        </div>

        <!-- Empty -->
        <div
            v-else-if="!hasResults"
            class="flex flex-col items-center justify-center py-20 text-[var(--ui-text-dimmed)] gap-3"
        >
            <UIcon
                :name="query ? 'i-lucide-search-x' : 'i-lucide-hash'"
                class="w-14 h-14 opacity-60"
            />
            <p class="text-base">
                {{ query ? t("channel.list.noMatch", { q: query }) : t("channel.list.empty") }}
            </p>
        </div>

        <!-- Grid -->
        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            :class="pending ? 'opacity-60 pointer-events-none transition-opacity' : 'transition-opacity'"
        >
            <NuxtLink
                v-for="channel in channels!.items"
                :key="channel.id"
                :to="localePath(`/channel/${channel.id}`)"
                class="group flex flex-col gap-3 p-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] hover:bg-[var(--ui-bg-accented)] hover:border-[var(--ui-border-accented)] hover:-translate-y-0.5 transition-all duration-200"
            >
                <div class="flex items-center gap-3">
                    <ChannelAvatar
                        :title="channel.title"
                        :icon="useImageUrl(channel.avatar_url)"
                    />
                    <h3
                        class="font-semibold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)] transition-colors line-clamp-1 flex-1 min-w-0"
                    >
                        {{ channel.title }}
                    </h3>
                </div>
                <p
                    class="text-sm text-[var(--ui-text-muted)] line-clamp-2 leading-relaxed flex-1"
                >
                    {{ channel.description || t("channel.list.noDescription") }}
                </p>
            </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center pt-2">
            <UPagination
                v-model="page"
                :total="channels?.total ?? 0"
                :items-per-page="PAGE_SIZE"
            />
        </div>
    </div>
</template>
