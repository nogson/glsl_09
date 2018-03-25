#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D tData;

// varying vec2 vUv;

void main() {
  // vec4 particle = texture2D(tData, vUv);
  // vec2 pVelocity = particle.zw;
  // float intensity = pow(length(pVelocity) / velocityMax, 5.0);

  // vec3 color = mix(colorBase, colorIntense, intensity);

  // gl_FragColor = vec4(color, 1.0);

    gl_FragColor = vec4(vec3(0.5), 1.0);

}


