precision mediump float;

uniform sampler2D tData;
uniform vec2      resolution;


void main(void){
	vec2 coord = gl_FragCoord.st / resolution;
	vec4 position = texture2D(tData, coord);

	//position.xyz += 0.5;

    gl_FragColor = vec4(vec3(position).xyz, 1.0);
}
