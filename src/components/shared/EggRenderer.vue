<template>
  <div class="h-full min-h-screen w-full galaxy" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Box3,
  Vector3,
  DirectionalLight,
  AmbientLight,
  PointLight,
  PointLightHelper,
  TextureLoader,
  WebGLCubeRenderTarget,
  DirectionalLightHelper,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default defineComponent({
  name: "EggRenderer",
  props: {},
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    onMounted(() => {
      const scene = new Scene();
      const camera = new PerspectiveCamera(
        75,
        container.value!.clientWidth / container.value!.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0.2, 1.4);

      // const directionalLight = new PointLight("#fff", 150, 500, 2);
      // directionalLight.position.set(0.5, -1, 0);
      // const dHelper = new PointLightHelper(directionalLight);
      const directionalLight2 = new DirectionalLight("#fff", 2);
      directionalLight2.position.set(-1.5, 1, 0);
      const dHelper2 = new DirectionalLightHelper(directionalLight2, 1);
      // scene.add(directionalLight);
      // scene.add(dHelper);
      scene.add(directionalLight2);
      // scene.add(dHelper2);

      let ambientLight = new AmbientLight("#ffffff", 1);
      ambientLight.position.set(0, 55, 55);
      scene.add(ambientLight);

      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(
        container.value!.clientWidth,
        container.value!.clientHeight
      );

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      // controls.enableZoom = false;
      controls.enableKeys = false;
      controls.update();

      const loader = new GLTFLoader();
      let model: any;
      loader.load(
        "/models/egg/seed.glb",
        (gltf) => {
          model = gltf.scene;

          // setup center values
          let bbox = new Box3().setFromObject(model);
          let cent = bbox.getCenter(new Vector3());
          let size = bbox.getSize(new Vector3());
          let maxAxis = Math.max(size.x, size.y, size.z);

          // scale model
          model.scale.multiplyScalar(1.0 / maxAxis);
          bbox.setFromObject(model);
          bbox.getCenter(cent);
          bbox.getSize(size);

          // center model
          model.position.x -= cent.x;
          model.position.y -= cent.y;
          model.position.z -= cent.z;
          model.children[0].material.metalness = 0;
          // model.children[1].material.metalness = 0;

          // add model to scene
          scene.add(model);
        },
        (xhr) => {
          // handle load progress here
        },
        (error) => console.log("glTF.load() error", error)
      );

      container.value!.appendChild(renderer.domElement);
      const render = () => {
        renderer.render(scene, camera);
        controls.update();
        if (model) {
          model.rotation.y += 0.005;
        }
      };
      renderer.setAnimationLoop(render);
    });

    return { container };
  },
});
</script>

<style scoped>
.galaxy {
  background-image: url("https://user-images.githubusercontent.com/26748614/96337246-f14d4580-1085-11eb-8793-a86d929e034d.jpg");
  background-size: cover;
  backdrop-filter: brightness(50%);
}
</style>
