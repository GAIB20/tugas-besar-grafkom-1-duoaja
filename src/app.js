import { compileShader } from "./utils/WebGLUtils.js";
import { Line } from "./models/line.js";

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
          gl_FragColor = vec4(1, 0, 0, 1);
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

var isPressed = false;
var x1, y1, x2, y2;

const drawLineButton = document.getElementById("draw-line");
let drawLineMode = false;

drawLineButton.addEventListener("click", function () {
  // change color of button
  if (drawLineMode) {
    drawLineButton.style.backgroundColor = "white";
    drawLineButton.style.color = "black";
  } else {
    drawLineButton.style.backgroundColor = "black";
    drawLineButton.style.color = "white";
  }
  drawLineMode = !drawLineMode;
});

canvas.addEventListener("mousedown", function (e) {
  isPressed = true;
  x1 = e.clientX - canvas.offsetLeft;
  y1 = canvas.clientHeight - e.clientY + canvas.offsetTop;
  console.log(
    "Client X ",
    e.clientX,
    "canvas.width: ",
    canvas.clientWidth,
    "canvas.offsetLeft: ",
    canvas.offsetLeft
  );
  console.log("x1: ", x1, "y1: ", y1);
});

canvas.addEventListener("mouseup", function (e) {
  isPressed = false;
});

canvas.addEventListener("mousemove", function (e) {
  if (isPressed && drawLineMode) {
    x2 = e.clientX - canvas.offsetLeft;
    y2 = canvas.clientHeight - e.clientY + canvas.offsetTop;
    const line = new Line(
      gl,
      program,
      positionAttributeLocation,
      resolutionUniformLocation,
      canvas
    );
    line.updateCoordinates(x1, y1, x2, y2);
    line.draw();
  }
});
