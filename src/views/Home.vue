<template>
  <div class="w-screen h-screen flex items-stretch">
    <ThreeRenderer
      class="flex-1"
      objectPath="/models/skull/scene.gltf"
      skyBoxPath="/skybox/box3.jpeg"
    />
    <ThreeRenderer
      class="flex-1"
      objectPath="/models/hourglass/scene.gltf"
      skyBoxPath="/skybox/box2.jpg"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThreeRenderer from "../components/shared/ThreeRenderer.vue";

export default defineComponent({
  components: { ThreeRenderer },
});
</script>
