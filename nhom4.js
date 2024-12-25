import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ** 1. Chung

//    - Scene
const scene = new THREE.Scene();

//    - Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: false,
  canvas: document.querySelector("#bg"),});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild( renderer.domElement );
document.body.appendChild(renderer.domElement);

//    - Camera orbit
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 2, 0);

//    - OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);
controls.update();

// ** 2. Khung hình

//   - Light
// test thì để light nhẹ toàn bộ trước đã
const ambientLight = new THREE.AmbientLight( 0x404040 , 0.1 );
scene.add( ambientLight );

const DirectionalLight = new THREE.DirectionalLight( 0xffcc33, 1.3 );
DirectionalLight.position.set( 64.06, 36.08, 130.179 );
DirectionalLight.castShadow = true;
DirectionalLight.shadow.camera.top = 1000;
DirectionalLight.shadow.camera.bottom = - 1000;
DirectionalLight.shadow.camera.left = - 1000;
DirectionalLight.shadow.camera.right = 1000;
scene.add( DirectionalLight );

const hemispherelight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.2 );
scene.add( hemispherelight );

//   - Mặt đất

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 150),
  new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide }) // màu xám
);
ground.rotation.x = Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

// ** 3. Đối tượng trong không gian

//    - Map GLTF
const manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
  console.log( item, loaded, total );
};

const loader = new GLTFLoader(manager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

loader.load(
  './3D/city.glb',

  function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.traverse(function(child){
      if(child.isMesh){
          child.castShadow = true;
          child.receiveShadow = true;
      }
    });
    scene.add(model);
  },

  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },

  function ( error ) {
    console.error( 'maps: An error happened, check the code or the fuckin 3D again' );
  }
);

// Mặt trời

const sungeometry = new THREE.SphereGeometry( 15, 32, 16 ); 
const suntexture = new THREE.TextureLoader().load('./tex/sun.jpg');
const sunmaterial = new THREE.MeshBasicMaterial( { map: suntexture } ); 
const sun = new THREE.Mesh( sungeometry, sunmaterial ); 
sun.position.set(220, 220, 220);
sun.scale.set(3, 3, 3);
scene.add( sun );



// load xe vào, cho chạy animation loop khi hết, call 2 camera từ model này

const car = new GLTFLoader( manager );
const carDracoLoader = new DRACOLoader();
carDracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
car.setDRACOLoader( carDracoLoader );

let mixer;


car.load(
  './3D/xe.glb',

  function ( gltf ) {
    const model = gltf.scene;

    const animation = gltf.animations;
    if (animation && animation.length){
      mixer = new THREE.AnimationMixer(model);
      animation.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
    gltf.cameras.forEach((cam, index) => {
      cameras[`xe_${index+1}`] = cam;
    });
    scene.traverse(function(child){
      if(child.isMesh){
          child.castShadow = true;
          child.receiveShadow = true;
      }
    });
    scene.add(model);
  },

  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },

  function ( error ) {
    console.error( 'borgor: An error happened, check the code or the fuckin 3D again' );
  }
);

// neon light

const bullsign = new GLTFLoader(manager);
const bullsignDracoLoader = new DRACOLoader();
bullsignDracoLoader.setDecoderPath('/examples/js/libs/draco/');
bullsign.setDRACOLoader(bullsignDracoLoader);

bullsign.load(
  './3D/bullsign.glb',

  function (gltf) {
    const model = gltf.scene;
    model.scale.set(5, 5, 5);
    model.position.set(-45.39, 26.95, 17.65);
    model.rotation.set(0.04, -1.5, -1.64);
    scene.add(model);
    scene.traverse(function(child){
      if(child.isMesh){
          child.castShadow = true;
          child.receiveShadow = true;
      }
    });
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },

  function (error) {
    console.error('bullsign: An error happened, check the code or the 3D model again');
  }
);

const realPcLogo = new GLTFLoader(manager);
const realPcLogoDracoLoader = new DRACOLoader();
realPcLogoDracoLoader.setDecoderPath('/examples/js/libs/draco/');
realPcLogo.setDRACOLoader(realPcLogoDracoLoader);

realPcLogo.load(
  './3D/real_pc_logo.glb',

  function (gltf) {
    const model = gltf.scene;
    model.scale.set(7, 7, 7);
    model.position.set(16.70, 26.63, 76.13);
    scene.add(model);
    scene.traverse(function(child){
      if(child.isMesh){
          child.castShadow = true;
          child.receiveShadow = true;
      }
    });
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },

  function (error) {
    console.error('realPcLogo: An error happened, check the code or the 3D model again');
  }
);

// Tổng hợp camera
const cameras = {
  default: camera,
  // các cam model sẽ add vào đây
};

let currentCamera = camera;

const dground = new THREE.CubeTextureLoader()
  .setPath('./tex/')
  .load([
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
  ]);
scene.background = dground; // temp 

function switchCamera(newCamera) {
  if (currentCamera !== newCamera) {
      // Move listener to new camera
      newCamera.add(listener);
      currentCamera = newCamera;
  }
}

let isMuted = false;
let audioInitialized = false;
const sounds = [];


function initAudio() {
    if (audioInitialized) return;
    
    const listener = new THREE.AudioListener();
    currentCamera.add(listener);
    
    const sound = new THREE.Audio(listener);
    const sound2 = new THREE.Audio(listener);
    const sound3 = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    
    audioLoader.load('./audio/wind.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.3);
        sound.play();
        sounds.push(sound);
    });

    audioLoader.load('./audio/Drunken_Sailor.mp3', function(buffer) {
        sound2.setBuffer(buffer);
        sound2.setLoop(true);
        sound2.setVolume(0.5);
        sound2.play();
        sounds.push(sound2);
    });

    audioLoader.load('./audio/V6 Hybrid Engines.mp3', function(buffer) {
        sound3.setBuffer(buffer);
        sound3.setLoop(true);
        sound3.setVolume(0.2);
        sound3.play();
        sounds.push(sound3);
    });

    audioInitialized = true;
}

function toggleAudio() {
    isMuted = !isMuted;
    sounds.forEach(sound => {
        if (sound && sound.isPlaying) {
            sound.setVolume(isMuted ? 0 : 0.5);
        }
    });
    document.querySelector('.audioButton').textContent = isMuted ? 'Audio Off' : 'Audio On';
}

window.addEventListener('click', function() {
    initAudio();
}, { once: true });

// switch camera
document.getElementById('cameraSelect').addEventListener('change', (event) => {
  const selectedCamera = cameras[event.target.value];
  if (selectedCamera) {
    currentCamera = selectedCamera;
  }
});

function animate() {
  requestAnimationFrame(animate);
  if (mixer) {
    mixer.update(clock.getDelta())
  };
//  controls.update();
  render();
};

const clock = new THREE.Clock();
function render() {
  renderer.render( scene, currentCamera );
};

animate();