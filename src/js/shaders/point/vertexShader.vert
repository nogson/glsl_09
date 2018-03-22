attribute vec3 position;
attribute vec2 texCoord;
uniform mat4 projectionMatrix; 
uniform mat4 modelViewMatrix;
varying vec3 vPositon; 
uniform sampler2D tData;
uniform vec2 resolution;

void main(void){
	vec4 p = texture2D(tData, texCoord);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(p.xyz*0.1), 1.0 );
	vPositon = gl_Position.xyz;
	gl_PointSize = 10.0;
}