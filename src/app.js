import { initializeWebGL } from "./utils/WebGLSetup.js";
import { createShapes } from "./utils/WebGLSetup.js";

// Get the canvas element
const canvas = document.getElementById("canvas");

// Initialize WebGL
const { gl, program, positionAttributeLocation, resolutionUniformLocation } =
  initializeWebGL(canvas);
const shapes = createShapes(
  gl,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  canvas
);
let currentActiveShape = null;

function toggleDrawModeForOtherShapes(activeShape) {
  shapes.forEach(({ shape }) => {
    if (shape !== activeShape && shape.drawMode) {
      shape.toggleDrawMode();
    }
  });
}

function resetButtonStyles() {
  shapes.forEach(({ buttonId }) => {
    const button = document.getElementById(buttonId);
    button.style.backgroundColor = "";
    button.style.color = "";
  });
}

shapes.forEach(({ shape, buttonId, draw }) => {
  shape.activate();
  const button = document.getElementById(buttonId);
  button.addEventListener("click", function () {
    resetButtonStyles();
    this.style.backgroundColor = "blue";
    this.style.color = "white";
    toggleDrawModeForOtherShapes(shape);
    if (draw) {
      draw.call({ shape });
    } else {
      currentActiveShape = shape;
      shape.toggleDrawMode();
    }
  });
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  if (currentActiveShape) {
    currentActiveShape.save();
  } else {
    console.log("No active shape to save.");
  }
});
// clear
const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function () {
  gl.clear(gl.COLOR_BUFFER_BIT);
});
