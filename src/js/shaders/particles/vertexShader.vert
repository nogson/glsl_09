uniform sampler2D tData;
uniform vec2 resolution;

//varying vec2 vUv;

void main() {
  //vUv = uv;

// vec2 p = gl_FragCoord.xy / resolution;  // テクスチャ座標を計算
vec4 t = texture2D(tData, uv);         // 前フレームの座標読み出し
vec2 xy = t.rg;

  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(xy, 0.0, 1.0);
}