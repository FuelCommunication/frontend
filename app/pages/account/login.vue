<script setup lang="ts">
useSeoMeta({
  title: 'Login',
  description: 'Login in account',
});
definePageMeta({
	layout: "auth",
});
</script>

<template>
  <AuthLogin/>
</template>