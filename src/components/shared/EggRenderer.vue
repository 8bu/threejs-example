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
  HemisphereLight,
  TextureLoader,
  WebGLCubeRenderTarget,
  BufferAttribute,
  DirectionalLightHelper,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import SimplexNoise from "simplex-noise";
import { Pane } from "tweakpane";

export default defineComponent({
  name: "EggRenderer",
  props: {},
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    onMounted(() => {
      const blobConfig = {
        spike: 2,
        scale: 1.02,
        noiseIntensity: 0.02,
        speed: 0.001,
      };

      const pane = new Pane({
        title: "Egg Renderer",
      });
      pane.addInput(blobConfig, "spike", {
        min: 0,
        max: 10,
      });
      pane.addInput(blobConfig, "scale", {
        min: 1,
        max: 1.5,
      });
      pane.addInput(blobConfig, "noiseIntensity", {
        min: 0,
        max: 0.5,
      });
      pane.addInput(blobConfig, "speed", {
        min: 0.0001,
        max: 0.002,
      });
      const noise = new SimplexNoise();
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
      const hLight = new HemisphereLight();
      scene.add(hLight);

      let ambientLight = new AmbientLight("#ffffff", 3);
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
          model = gltf.scene.children[0];

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
          model.material.metalness = 0.5;
          // model.children[1].material.metalness = 0;

          model.geometry.setAttribute(
            "basePosition",
            new (BufferAttribute as any)().copy(
              model.geometry.attributes.position
            )
          );
          console.debug(model);
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
          const blob = model;
          if (blob) {
            const basePositionAttribute =
              blob.geometry.getAttribute("basePosition");
            const positionAttribute = blob.geometry.attributes.position;
            const v = new Vector3();
            for (
              let vertexIndex = 0;
              vertexIndex < positionAttribute.count;
              vertexIndex++
            ) {
              let time = performance.now() * blobConfig.speed;
              v.fromBufferAttribute(basePositionAttribute, vertexIndex);
              let perlin =
                noise.noise3D(
                  v.x * blobConfig.spike + time + 0.0002,
                  v.y * blobConfig.spike + time + 0.0003,
                  v.z * blobConfig.spike + time,
                ) *
                  blobConfig.noiseIntensity +
                blobConfig.scale;
              v.multiplyScalar(perlin);
              positionAttribute.setXYZ(vertexIndex, v.x, v.y, v.z);
            }
            blob.geometry.attributes.position.needsUpdate = true; // required after the first render
            blob.geometry.computeBoundingSphere();
          }
          model.rotation.y += 0.005;
        }
      };
      renderer.setAnimationLoop(render);
    });

    return { container };
  },
});
</script>

<style>
.galaxy {
  background-image: url("https://user-images.githubusercontent.com/26748614/96337246-f14d4580-1085-11eb-8793-a86d929e034d.jpg");
  background-size: cover;
  backdrop-filter: brightness(50%);
} 
</style>
