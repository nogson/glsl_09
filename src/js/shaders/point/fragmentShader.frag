precision mediump float;

uniform sampler2D texture;

void main(void){
	gl_FragColor = texture2D(texture, gl_PointCoord);
}