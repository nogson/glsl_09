const createBackground = require('three-vignette-background');
const Stats = require('stats.js');
const glslify = require('glslify')

const resetVertex = glslify('./src/js/shaders/reset/vertexShader.vert');
const resetFragment = glslify('./src/js/shaders/reset/fragmentShader.frag');
const particlesVertex = glslify('./src/js/shaders/particles/vertexShader.vert');
const particlesFragment = glslify('./src/js/shaders/particles/fragmentShader.frag');
const simulationVertex = glslify('./src/js/shaders/simulation/vertexShader.vert');
const simulationFragment = glslify('./src/js/shaders/simulation/fragmentShader.frag');

const CLOCK = new THREE.Clock();
let ww = window.innerWidth;
let wh = window.innerHeight;
let time = 0.0;
let aspect = ww / wh;


const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, ww / wh, 0.1, 1000);
const body = document.getElementsByTagName('body')[0];

let   resetRt = new THREE.WebGLRenderTarget(ww, wh, {
  magFilter: THREE.NearestFilter,
  minFilter: THREE.NearestFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping
});

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



//初期値をフレームバッファに書き込む
createInitTxtuer();

function createInitTxtuer() {
  //Geometryを作成
  let geometry = new THREE.Geometry();

  //頂点座標
  geometry.vertices = [
    new THREE.Vector3(-1.0 * aspect, 1.0, 0.0),
    new THREE.Vector3(1.0 * aspect, 1.0, 0.0),
    new THREE.Vector3(-1.0 * aspect, -1.0, 0.0),
    new THREE.Vector3(1.0 * aspect, -1.0, 0.0)
  ];

  //頂点インデックス
  geometry.faces = [
    new THREE.Face3(0, 2, 1),
    new THREE.Face3(1, 2, 3)
  ];

  // Material作成
  let material = new THREE.ShaderMaterial({
    uniforms: {
      resolution:{
        type:'v2',
        value:new THREE.Vector2(ww,wh)
      }
    },
    vertexShader: resetVertex,
    fragmentShader: resetFragment
  });
  // Mesh作成
  var mesh = new THREE.Mesh(geometry, material);

  const scene = new THREE.Scene();

  scene.add(mesh);

  renderer.render(scene, camera,resetRt,true);

}

//Geometryを作成
var pointGeometry = new THREE.BufferGeometry();

// Material作成
let pointMaterial = new THREE.ShaderMaterial({
  uniforms: {
    tData: {
      type: 't',
      value: resetRt
    },
    resolution: {
      type: 'v2',
      value: new THREE.Vector2(ww,wh)
    },
    time: {
      type: 'f',
      value: 0,
    }
  },
  vertexShader: particlesVertex,
  fragmentShader: particlesFragment
});

const vertices = new Float32Array(ww*wh * 3);

for (let i = 0; i < vertices.length; i++) {
  vertices[i] = 0;
}


let uvs = new Float32Array(ww*wh * 2);
let uvarr = [];
for(let i = 0; i < wh; ++i){
  let t = i / wh;
  for(let j = 0; j < ww; ++j){
      let s = j / ww;
      uvarr.push(s, t);
  }
}


for (let i = 0; i < uvarr.length; i += 2) {
  uvs[i + 0] = uvarr[i + 0];
  uvs[i + 1] = uvarr[i + 1];
}


pointGeometry.addAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3)
);

pointGeometry.addAttribute(
  'uv', 
  new THREE.BufferAttribute(uvs, 2)
);


const points = new THREE.Points(
  pointGeometry,
  pointMaterial
);

scene.add(points);



//body.appendChild(stats.dom);


//初期値をセット　----------
// const DATA_SIZE = Math.pow(2, 10); //1024 * 1024 = Math.pow(2, 20) 
// const DATA_TEXTURE_SIZE = Math.sqrt(DATA_SIZE);
// const data = new Float32Array(DATA_SIZE * 4);

// for (let i = 0; i < data.length; i += 4) {
//   data[i + 0] = Math.random();
//   data[i + 1] = Math.random();
// }

// const texture = new THREE.DataTexture(
//   data, DATA_TEXTURE_SIZE, DATA_TEXTURE_SIZE,
//   THREE.RGBAFormat,
//   THREE.FloatType,
//   THREE.Texture.DEFAULT_MAPPING,
//   THREE.RepeatWrapping,
//   THREE.RepeatWrapping,
//   THREE.NearestFilter,
//   THREE.NearestFilter
// );

// texture.needsUpdate = true;

// //オフセットレンダリング用のwebglRenderを作成
// let rt = new THREE.WebGLRenderTarget(ww, wh, {
//   magFilter: THREE.NearestFilter,
//   minFilter: THREE.NearestFilter,
//   wrapS: THREE.ClampToEdgeWrapping,
//   wrapT: THREE.ClampToEdgeWrapping
// });

// //テクスチャデータ
// const textureBuffers = new(function () {
//   this.in = rt;
//   this.out = rt.clone();
//   //pinpong用
//   this.swap = () => {
//     [this.in, this.out] = [this.out, this.in];
//   };
// });


// //Geometryを作成
// const rtGeometry = new THREE.PlaneGeometry(0.1, 0.1, 1, 1);

// // Material作成
// let rtMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     tData: {
//       type: 't',
//       value: texture
//     },
//     resolution: {
//       type: 'v2',
//       value: new THREE.Vector2()
//     },
//     time: {
//       type: 'f',
//       value: 0,
//     }
//   },
//   vertexShader: simulationVertex,
//   fragmentShader: simulationFragment
// });

// // Mesh作成
// let rtMesh = new THREE.Mesh(rtGeometry, rtMaterial);

// const rtScene = new THREE.Scene();

// rtScene.add(rtMesh);

// renderer.render(rtScene, camera, textureBuffers.in, true);


// //---------------------------------------------

// const vertices = new Float32Array(DATA_SIZE * 3);

// //頂点座表示は使かわないので0
// for (let i = 0; i < vertices.length; i++) {
//   vertices[i] = 0;
// }

// const uvs = new Float32Array(DATA_SIZE * 2);

// for (let i = 0; i < uvs.length; i += 2) {
//   uvs[i + 0] = Math.random();
//   uvs[i + 1] = Math.random();
// }

// const particleGeometry = new THREE.BufferGeometry();
// particleGeometry.addAttribute(
//   'position',
//   new THREE.BufferAttribute(vertices, 3)
// );
// particleGeometry.addAttribute(
//   'uv', 
//   new THREE.BufferAttribute(uvs, 2)
// );

// const particleMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     resolution: {
//       type: 'v2',
//       value: new THREE.Vector2()
//     },
//     time: {
//       type: 'f',
//       value: 0,
//     },
//     tData: {
//       type: 't',
//       value: null
//     },
//   },
//   vertexShader: particlesVertex,
//   fragmentShader: particlesFragment
// })


// const particles = new THREE.Points(
//   particleGeometry,
//   particleMaterial
// );

// scene.add(particles);




// let rt1 = new THREE.WebGLRenderTarget(ww, wh, {
//   magFilter: THREE.NearestFilter,
//   minFilter: THREE.NearestFilter,
//   wrapS: THREE.ClampToEdgeWrapping,
//   wrapT: THREE.ClampToEdgeWrapping
// });

// let rt2 = new THREE.WebGLRenderTarget(ww, wh, {
//   magFilter: THREE.NearestFilter,
//   minFilter: THREE.NearestFilter,
//   wrapS: THREE.ClampToEdgeWrapping,
//   wrapT: THREE.ClampToEdgeWrapping
// });



// renderer.render(rtScene, camera, rt1);

// //リセット処理終わりーーーーーー


// //Geometryを作成
// var pointGeometry = new THREE.BufferGeometry();

// // Material作成
// let pointMaterial = new THREE.RawShaderMaterial({
//   uniforms: {
//     tData: {
//       type: 't',
//       value: rt1
//     },
//     resolution: {
//       type: 'v2',
//       value: new THREE.Vector2()
//     },
//     time: {
//       type: 'f',
//       value: 0,
//     }
//   },
//   vertexShader: vertexPointShader,
//   fragmentShader: fragmentPointShader
// });

// pointGeometry.addAttribute(
//   'position',
//   new THREE.BufferAttribute(data, 4)
// );


// const points = new THREE.Points(
//   pointGeometry,
//   pointMaterial
// );

// scene.add(points);

// render();

// //リサイズイベント
// window.addEventListener('resize', function () {
//   ww = window.innerWidth;
//   wh = window.innerHeight;
//   renderer.setSize(ww, wh);
//   camera.aspect = ww / wh;
//   camera.updateProjectionMatrix();
// }, false);


render();

function render() {
  time = CLOCK.getElapsedTime();
  ww = window.innerWidth;
  wh = window.innerHeight;

  // stats.update();
  //renderer.render(rtScene, camera, textureBuffers.in);
  //particles.material.uniforms.tData.value = textureBuffers.in.texture;

  //renderer.render(rtScene, camera);
  //renderer.render(rtScene, camera, textureBuffers.in);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}