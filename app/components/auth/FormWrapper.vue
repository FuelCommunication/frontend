<script setup lang="ts">
import type {AuthFormProps} from "~/interfaces/auth.interfaces";

defineProps<AuthFormProps<any, any>>();

const toast = useToast();
const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: () => {
      toast.add({title: "Google", description: "Login with Google"});
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: () => {
      toast.add({title: "GitHub", description: "Login with GitHub"});
    },
  },
];
</script>

<template>
  <UAuthForm
      :schema
      :title
      :description
      icon="i-lucide-user"
      :fields
      :providers
      @submit="submitHandler"
  />

  <ULink :to="backRoute" class="text-center">{{ backLabel }}</ULink>
</template>