import { compileShader } from "./WebGLUtils.js";
import { Line } from "../models/line.js";
import { Square } from "../models/square.js";
import { Rectangle } from "../models/rectangle.js";
import { Polygon } from "../models/polygon.js";

export function initializeWebGL(canvas) {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error(
      "Unable to initialize WebGL. Your browser may not support it."
    );
    return null;
  }

  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
      v_color = a_color;
    }
    `;

  const fragmentShaderSource = `
        precision mediump float;
        varying vec4 v_color;
        //uniform color
        //uniform vec4 u_color;
        
        void main() {
            gl_FragColor = v_color;
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

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
    return null;
  }
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const colorLocation = gl.getAttribLocation(program, "a_color");
  return {
    gl,
    program,
    positionAttributeLocation,
    colorLocation,
  };
}

// export function createShapes(
//   gl,
//   program,
//   positionAttributeLocation,
//   colorLocation,
//   canvas
// ) {
//   return [
//     {
//       shape: new Line(
//         gl,
//         program,
//         positionAttributeLocation,
//         colorLocation,
//         canvas
//       ),
//       buttonId: "draw-line",
//     },
//     {
//       shape: new Square(
//         gl,
//         program,
//         positionAttributeLocation,
//         colorLocation,
//         canvas
//       ),
//       buttonId: "draw-square",
//     },
//     {
//       shape: new Rectangle(
//         gl,
//         program,
//         positionAttributeLocation,
//         colorLocation,
//         canvas
//       ),
//       buttonId: "draw-rectangle",
//     },
//     // {
//     //   shape: new Polygon(
//     //     gl,
//     //     program,
//     //     positionAttributeLocation,
//     //     resolutionUniformLocation,
//     //     canvas
//     //   ),
//     //   buttonId: "draw-polygon",
//     //   draw: function () {
//     //     this.shape.updateCoordinates(
//     //       150,
//     //       75,
//     //       225,
//     //       100,
//     //       225,
//     //       150,
//     //       150,
//     //       175,
//     //       75,
//     //       150,
//     //       75,
//     //       100
//     //     );
//     //     this.shape.draw();
//     //   },
//     // },
//   ];
// }

export function createShape(gl,
  program,
  positionAttributeLocation,
  colorLocation,
  canvas,
  type
) {
  switch (type) {
    case "line":
      return new Line(
        gl,
        program,
        positionAttributeLocation,
        colorLocation,
        canvas
      );
    case "square":
      return new Square(
        gl,
        program,
        positionAttributeLocation,
        colorLocation,
        canvas
      );
    case "rectangle":
      return new Rectangle(
        gl,
        program,
        positionAttributeLocation,
        colorLocation,
        canvas
      );
    case "polygon":
      return new Polygon(
        gl,
        program,
        positionAttributeLocation,
        colorLocation,
        canvas
      );
    default:
      return null;
  }
}