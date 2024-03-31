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
    uniform vec2 u_resolution;

    void main() {
        vec2 zeroToOne = a_position / u_resolution;
        
        vec2 zeroToTwo = zeroToOne * 2.0;
        
        vec2 clipSpace = zeroToTwo - 1.0;
        
        gl_Position = vec4(clipSpace, 0, 1);
    }
    `;

  const fragmentShaderSource = `
        precision mediump float;

        //uniform color
        uniform vec4 u_color;
        
        void main() {
            gl_FragColor = u_color;
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
  const colorUniformLocation = gl.getUniformLocation(program, "u_color");
  return {
    gl,
    program,
    positionAttributeLocation,
    resolutionUniformLocation,
    colorUniformLocation,
    positionBuffer,
  };
}

export function createShapes(
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  canvas
) {
  return [
    {
      shape: new Line(
        gl,
        program,
        positionAttributeLocation,
        resolutionUniformLocation,
        canvas
      ),
      buttonId: "draw-line",
    },
    {
      shape: new Square(
        gl,
        program,
        positionAttributeLocation,
        resolutionUniformLocation,
        canvas
      ),
      buttonId: "draw-square",
    },
    {
      shape: new Rectangle(
        gl,
        program,
        positionAttributeLocation,
        resolutionUniformLocation,
        canvas
      ),
      buttonId: "draw-rectangle",
    },
    // {
    //   shape: new Polygon(
    //     gl,
    //     program,
    //     positionAttributeLocation,
    //     resolutionUniformLocation,
    //     canvas
    //   ),
    //   buttonId: "draw-polygon",
    //   draw: function () {
    //     this.shape.updateCoordinates(
    //       150,
    //       75,
    //       225,
    //       100,
    //       225,
    //       150,
    //       150,
    //       175,
    //       75,
    //       150,
    //       75,
    //       100
    //     );
    //     this.shape.draw();
    //   },
    // },
  ];
}
