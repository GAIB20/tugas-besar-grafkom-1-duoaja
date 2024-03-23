import { Line } from "./models/line.js";
import { Square } from "./models/square.js";
import { Rectangle } from "./models/rectangle.js";
import { initializeWebGL } from "./utils/WebGLSetup.js";
import { Polygon } from "./models/polygon.js";

// Get the canvas element
const canvas = document.getElementById("canvas");

// Initialize WebGL
const {
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  positionBuffer,
} = initializeWebGL(canvas);

// TODO : Refactor Model
const drawLineButton = document.getElementById("draw-line");
const line = new Line(
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  canvas
);
line.activate();

drawLineButton.addEventListener("click", function () {
  if (square.drawMode) {
    square.toggleDrawMode();
  }
  if (rectangle.drawMode) {
    rectangle.toggleDrawMode();
  }
  line.toggleDrawMode();
});

// square
const drawSquareButton = document.getElementById("draw-square");
const square = new Square(
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  canvas
);
square.activate();

drawSquareButton.addEventListener("click", function () {
  if (line.drawMode) {
    line.toggleDrawMode();
  }
  if (rectangle.drawMode) {
    rectangle.toggleDrawMode();
  }
  square.toggleDrawMode();
});

// rectangle
const drawRectangleButton = document.getElementById("draw-rectangle");
const rectangle = new Rectangle(
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  canvas
);
rectangle.activate();

drawRectangleButton.addEventListener("click", function () {
  if (rectangle.drawMode) {
    rectangle.toggleDrawMode();
  }
  if (square.drawMode) {
    square.toggleDrawMode();
  }
  rectangle.toggleDrawMode();
});

// Draw Polygon
const drawPolygonButton = document.getElementById("draw-polygon");
const polygon = new Polygon(
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  canvas
);

drawPolygonButton.addEventListener("click", function () {
  if (line.drawMode) {
    line.toggleDrawMode();
  }
  if (square.drawMode) {
    square.toggleDrawMode();
  }
  if (rectangle.drawMode) {
    rectangle.toggleDrawMode();
  }
  polygon.updateCoordinates(
    150, 75,
    225, 100,
    225, 150,
    150, 175,
    75, 150,
    75, 100
  );
  polygon.draw();
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  // line.save();
});
// clear
const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function () {
  gl.clear(gl.COLOR_BUFFER_BIT);
});
