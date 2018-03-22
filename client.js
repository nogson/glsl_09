const createBackground = require('three-vignette-background');
const Stats = require('stats.js');
const glslify = require('glslify')

const vertexMappingShader = glslify('./src/js/shaders/mapping/vertexShader.vert');
const fragmentMappingShader = glslify('./src/js/shaders/mapping/fragmentShader.frag');
const vertexPointShader = glslify('./src/js/shaders/point/vertexShader.vert');
const fragmentPointShader = glslify('./src/js/shaders/point/fragmentShader.frag');

const CLOCK = new THREE.Clock();
let ww = window.innerWidth;
let wh = window.innerHeight;
let time = 0.0;

let aspect = ww / wh;

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, ww / wh, 0.1, 1000);

const body = document.getElementsByTagName('body')[0];

renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
renderer.setPixelRatio(window.devicePixelRatio || 1);

// canvasをbodyに追加
body.appendChild(renderer.domElement);

// canvasをリサイズ
renderer.setSize(ww, wh);

let background = createBackground({
  noiseAlpha: 0.1,
  colors: ['#000000', '#000000']
});
//scene.add(background)

//LIGHTS
let light = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(light);

let dlight = new THREE.DirectionalLight(0xffffff, 1.0);
scene.add(dlight);

camera.position.z = 1.5;

let stats = new Stats();
//body.appendChild(stats.dom);


//リセット処理　----------

const DATA_SIZE = Math.pow(2, 10); //1024 * 1024 = Math.pow(2, 20) 
const DATA_TEXTURE_SIZE = Math.sqrt(DATA_SIZE);
const data = new Float32Array(DATA_SIZE * 4);

for (let i = 0; i < data.length; i += 4) {
  const position = new THREE.Vector2(
    Math.random() *2 -1.0,
    Math.random() *2 -1.0
  );

  data[i + 0] = position.x;
  data[i + 1] = position.y;
}

const texture = new THREE.DataTexture(
  data, DATA_TEXTURE_SIZE, DATA_TEXTURE_SIZE,
  THREE.RGBAFormat,
  THREE.FloatType,
  THREE.Texture.DEFAULT_MAPPING,
  THREE.RepeatWrapping,
  THREE.RepeatWrapping,
  THREE.NearestFilter,
  THREE.NearestFilter
);

texture.needsUpdate = true;


//Geometryを作成
var rtGeometry = new THREE.BufferGeometry();

// Material作成
let rtMaterial = new THREE.RawShaderMaterial({
  uniforms: {
    tData: {
      type: 't',
      value: texture
    },
    resolution: {
      type: 'v2',
      value: new THREE.Vector2()
    },
    time: {
      type: 'f',
      value: 0,
    }
  },
  vertexShader: vertexMappingShader,
  fragmentShader: fragmentMappingShader
});


// Mesh作成
let rtMesh = new THREE.Mesh(rtGeometry, rtMaterial);


let rt1 = new THREE.WebGLRenderTarget(ww, wh, {
  magFilter: THREE.NearestFilter,
  minFilter: THREE.NearestFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping
});

let rt2 = new THREE.WebGLRenderTarget(ww, wh, {
  magFilter: THREE.NearestFilter,
  minFilter: THREE.NearestFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping
});

const rtScene = new THREE.Scene();

rtScene.add(rtMesh);

renderer.render(rtScene, camera, rt1);

//リセット処理終わりーーーーーー


//Geometryを作成
var pointGeometry = new THREE.BufferGeometry();

// Material作成
let pointMaterial = new THREE.RawShaderMaterial({
  uniforms: {
    tData: {
      type: 't',
      value: rt1
    },
    resolution: {
      type: 'v2',
      value: new THREE.Vector2()
    },
    time: {
      type: 'f',
      value: 0,
    }
  },
  vertexShader: vertexPointShader,
  fragmentShader: fragmentPointShader
});

pointGeometry.addAttribute(
  'position',
  new THREE.BufferAttribute(data, 4)
);


const points = new THREE.Points(
  pointGeometry,
  pointMaterial
);

scene.add(points);

render();

//リサイズイベント
window.addEventListener('resize', function () {
  ww = window.innerWidth;
  wh = window.innerHeight;
  renderer.setSize(ww, wh);
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
}, false);


function render() {
  time = CLOCK.getElapsedTime();
  ww = window.innerWidth;
  wh = window.innerHeight;

  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}