import { compileShader } from "./utils/WebGLUtils.js";

// Get the canvas element
const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl");
if (!gl) {
  alert("Unable to initialize WebGL. Your browser may not support it.");
}

const vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    
    void main() {
        // Convert position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;
        
        // Convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
        
        // Convert from 0->2 to -1->+1 (clip space)
        vec2 clipSpace = zeroToTwo - 1.0;
        
        gl_Position = vec4(clipSpace, 0, 1);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1, 0, 0, 1); // Red
    }
`;

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(
  gl,
  fragmentShaderSource,
  gl.FRAGMENT_SHADER
);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [0, 0, canvas.width, canvas.height];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.LINES, 0, 2);
