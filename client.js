const createBackground = require('three-vignette-background');
const Stats = require('stats.js');
const glslify = require('glslify')

const vertexShader = glslify('./src/js/shaders/particles/vertexShader.vert');
const fragmentShader = glslify('./src/js/shaders/particles/fragmentShader.frag');

const CLOCK = new THREE.Clock();
let ww = window.innerWidth;
let wh = window.innerHeight;
let time = 0.0;

let aspect = ww / wh;

const app = {
  renderer: new THREE.WebGLRenderer(),
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(60, ww / wh, 0.1, 1000)
};
const body = document.getElementsByTagName('body')[0];

app.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
app.renderer.setPixelRatio(window.devicePixelRatio || 1);

// canvasをbodyに追加
body.appendChild(app.renderer.domElement);

// canvasをリサイズ
app.renderer.setSize(ww, wh);

let background = createBackground({
  noiseAlpha:0.1,
  colors:[ '#000000', '#000000' ]
});
app.scene.add(background)

//LIGHTS
let light = new THREE.AmbientLight(0xffffff, 1.0);
app.scene.add(light);

let dlight = new THREE.DirectionalLight(0xffffff,1.0);
app.scene.add(dlight);

app.camera.position.z = 1.5;

let stats = new Stats();
//body.appendChild(stats.dom);

var sphere = new THREE.SphereBufferGeometry( 1, 15, 15 );

//Geometryを作成
var geometry = new THREE.BufferGeometry();

//頂点座標
var vertices = sphere.attributes.position.array;

//頂点インデックス
var index = new Uint32Array(vertices.length/3);

for(let i = 0,j = index.length; i < j; i++){
  index[i] = i;
}

//頂点座標
geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

//頂点　index
geometry.setIndex(new THREE.BufferAttribute(index, 1));

// Material作成
let material = new THREE.ShaderMaterial({
  uniforms: {
   resolution:{
     type:'v2',
     value:new THREE.Vector2()
   }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});
// Mesh作成
let mesh = new THREE.Mesh(geometry, material);

app.scene.add(mesh);

render();

//リサイズイベント
window.addEventListener('resize', function() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  app.renderer.setSize(ww, wh);
  app.camera.aspect = ww / wh;
  app.camera.updateProjectionMatrix();
}, false );


function render() {
  time = CLOCK.getElapsedTime();
  ww = window.innerWidth;
  wh = window.innerHeight;

  stats.update();
  app.renderer.render(app.scene,app.camera);
  requestAnimationFrame(render);
}