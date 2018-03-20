const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')
const EffectComposer = require('three-effectcomposer')(THREE);

const vertexShader = glslify('./shaders/mapping/vertexShader.vert');
const fragmentShader = glslify('./shaders/mapping/fragmentShader.frag');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let composer;
let dpr = window.devicePixelRatio;

module.exports = class Mapping {
    constructor(app) {
        this.renderTarget = new THREE.WebGLRenderTarget(256, 256, {
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping
        });
    }

    getTarget() {
        return this.renderTarget;
    }


};

if (module.hot) {
    module.hot.accept(err => {
        if (err) throw errr
    })
    hmr.update(cache, {
        vertexShader,
        fragmentShader
    })
}