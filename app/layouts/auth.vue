<template>
  <div class="flex flex-col min-h-screen items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <slot :key="$route.fullPath"/>
    </UPageCard>
  </div>
</template>
