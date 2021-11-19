<template>
  <div class="h-full w-full" ref="container"></div>
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
  TextureLoader,
  WebGLCubeRenderTarget,
  DirectionalLightHelper,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default defineComponent({
  name: "Home",
  props: {
    objectPath: {
      type: String,
      required: true,
    },
    skyBoxPath: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    onMounted(() => {
      const scene = new Scene();
      scene.background = new Color(0xffc0cb);
      const camera = new PerspectiveCamera(
        75,
        container.value!.clientWidth / container.value!.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0.2, 1.4);

      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(
        container.value!.clientWidth,
        container.value!.clientHeight
      );
      camera.position.z = 1; // load model

      // setup lightings
      const dLight1 = new DirectionalLight(0xffffff, 10);
      dLight1.position.set(5, 3, 0);
      scene.add(dLight1);
      const dLight2 = new DirectionalLight(0xffffff, 10);
      dLight2.position.set(-5, 10, 0);
      scene.add(dLight2);

      // const dlHelper1 = new DirectionalLightHelper(dLight1, 5);
      // scene.add(dlHelper1);
      // const dlHelper2 = new DirectionalLightHelper(dLight2, 5);
      // scene.add(dlHelper2);
      const loader = new GLTFLoader();
      let model: any;
      loader.load(
        props.objectPath,
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

          // add model to scene
          scene.add(model);
        },
        (xhr) => {
          // handle load progress here
        },
        (error) => console.log("glTF.load() error", error)
      );
      const boxLoader = new TextureLoader();
      const texture = boxLoader.load(props.skyBoxPath, () => {
        const renderTarget = new WebGLCubeRenderTarget(texture.image.height);
        renderTarget.fromEquirectangularTexture(renderer, texture);
        scene.background = renderTarget.texture;
        scene.environment = renderTarget.texture;
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      // controls.enableZoom = false;
      controls.enableKeys = false;
      controls.update();
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
