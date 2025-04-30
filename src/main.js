import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import gsap from 'gsap'
import './style.css'

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

let model;

// hdri
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  scene.environment = texture;
});

// gltf loader
const loader = new GLTFLoader();
loader.load(
  './DamagedHelmet.gltf',
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error occurred:', error);
  }
);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //to get great performance without sacrificing resources
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

window.addEventListener("mousemove", (e) => {
  if (model) {
    const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * .20);
    const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * .20);
    gsap.to(model.rotation, {
      y: rotationX,
      x: rotationY,
      duration: 0.9,
      ease: "power2.out"
    });
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//render
function animate() {
  window.requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}

animate();