<template>
  <div class="w-screen h-screen flex items-stretch">
    <EggRenderer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EggRenderer from "../components/shared/EggRenderer.vue";

export default defineComponent({
  components: { EggRenderer },
});
</script>
