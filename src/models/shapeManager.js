import { Line } from "./line.js";
import { Square } from "./square.js";
import { Rectangle } from "./rectangle.js";
import { initializeWebGL } from "../utils/WebGLSetup.js";
import { addVertexDot, hexColorToFloatArray } from "../utils/utils.js";
import { Polygon } from "./polygon.js";
import ShearManager from "./shearManager.js";

export class ShapeManager {
  constructor(canvas) {
    const { gl, program, positionAttributeLocation, colorLocation } =
      initializeWebGL(canvas);
    this.gl = gl;
    this.program = program;
    this.positionAttributeLocation = positionAttributeLocation;
    this.colorAttributeLocation = colorLocation;
    this.canvas = canvas;
    this.shapes = [];
    this.vertices = [];
    this.activeShape = null;
    this.lastTranslateX = 0;
    this.lastTranslateY = 0;
    this.lastShearX = 100;
    this.lastShearY = 100;
    this.lastRotate = 180;
    this.lastScale = 100;
    this.lastDrag = 100;
    this.lastSingleTranslateX = 0;
    this.lastSingleTranslateY = 0;

    // Setup mouse event listeners
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.canvas.addEventListener("mouseup", (e) => {
      this.mouseUpHandler(e);
    });
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.canvas.addEventListener("mousedown", (e) => {
      this.mouseDownHandler(e);
    });
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouseMoveHandler(e);
    });
    this.mouseClickHandler = this.mouseClickHandler.bind(this);
    this.canvas.addEventListener("click", (e) => {
      this.mouseClickHandler(e);
    });

    /*        
                ====BUTTON EVENT LISTENERS====
            */
    // Listener for type of shape to draw
    this.activeType = null;
    this.setupShapeCreation("draw-line", "Line");
    this.setupShapeCreation("draw-square", "Square");
    this.setupShapeCreation("draw-rectangle", "Rectangle");
    this.setupShapeCreation("draw-polygon", "Polygon");

    // Clear canvas Button
    const clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", () => this.clearCanvas());

    // Save Button
    const saveButton = document.getElementById("save");
    saveButton.addEventListener("click", () => this.save());

    const loadButton = document.getElementById("load-model");
    loadButton.addEventListener("click", () => this.load());

    // Color Picker
    this.colorPickerHandler();

    // Selector
    const select = document.getElementById("selector");
    select.addEventListener("click", (event) => {
      this.activeType = "selector";
      this.activeShape = null;

      // get all buttons
      const selectButton = document.getElementById("selector");
      selectButton.classList.add("bg-blue-800");
      const buttons = document.querySelectorAll(".draw-button");
      buttons.forEach((b) => {
        if (b.id !== "selector") {
          b.classList.remove("bg-blue-800");
          b.classList.add("bg-blue-500");
          b.classList.add("text-white");
        }
      });
    });

    // Translation
    const translateX = document.getElementById("slider-translate-x");
    translateX.addEventListener("input", () =>
      this.translateActiveShapeX(translateX.value)
    );

    const translateY = document.getElementById("slider-translate-y");
    translateY.addEventListener("input", () =>
      this.translateActiveShapeY(translateY.value)
    );

    // Shear
    const shearX = document.getElementById("slider-transform-x");
    shearX.addEventListener("input", () =>
      this.shearActiveShapeX(shearX.value)
    );

    const shearY = document.getElementById("slider-transform-y");
    shearY.addEventListener("input", () =>
      this.shearActiveShapeY(shearY.value)
    );

    // Rotate
    const rotate = document.getElementById("slider-rotate");
    rotate.addEventListener("input", () => {
      this.rotateActiveShape(rotate.value);
    });

    // Scale
    const scale = document.getElementById("slider-scale");
    scale.addEventListener("input", () => {
      this.scaleActiveShape(scale.value);
    });

    // Reflection
    const reflectionX = document.getElementById("reflect-x");
    reflectionX.addEventListener("click", () => {
      this.reflectionActiveShape(0);
    });

    const reflectionY = document.getElementById("reflect-y");
    reflectionY.addEventListener("click", () => {
      this.reflectionActiveShape(1);
    });
  }

  // Create a new shape based on the shape type
  setupShapeCreation(buttonId, shapeType) {
    if (buttonId === "draw-polygon") {
      const button = document.getElementById(buttonId);
      button.addEventListener("click", () => {
        const newShape = this.createShape(shapeType);
        newShape.activate();
        this.activeShape = newShape;
        this.activeType = shapeType;
        this.vertices = [];
        this.toggleDrawModeForOtherShapes(newShape);
        this.shapes.push(newShape);

        button.classList.add("bg-blue-800");

        // get all buttons
        const buttons = document.querySelectorAll(".draw-button");
        buttons.forEach((b) => {
          if (b.id !== buttonId) {
            // add class bg-blue-500 and text-white
            b.classList.remove("bg-blue-800");
            b.classList.add("bg-blue-500");
            b.classList.add("text-white");
          }
        });
      });
    } else {
      const button = document.getElementById(buttonId);
      button.addEventListener("click", () => {
        this.activeType = shapeType;
        this.activeShape = null;
        this.vertices = [];
        this.toggleDrawModeForOtherShapes(null);
        button.classList.add("bg-blue-800");

        // get all buttons
        const buttons = document.querySelectorAll(".draw-button");
        buttons.forEach((b) => {
          if (b.id !== buttonId) {
            // add class bg-blue-500 and text-white
            b.classList.remove("bg-blue-800");
            b.classList.add("bg-blue-500");
            b.classList.add("text-white");
          }
        });
      });
    }
  }

  mouseClickHandler(e) {
    if (this.activeType === "Polygon") {
      
      const colorPicker = document.getElementById("colorPicker");
      const colorHex = colorPicker.value;
      const { r, g, b } = hexColorToFloatArray(colorHex);
      
      const temp = this.activeShape.colors;
      this.activeShape.colors = new Float32Array(this.activeShape.colors.length + 4);
      
      this.activeShape.colors.set(temp);
      this.activeShape.colors.set([r, g, b, 1], temp.length);
      
      console.log(this.activeShape.colors);

      const vertexX = e.clientX - this.canvas.offsetLeft;
      const vertexY =
      this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
      
      this.vertices.push({ x: vertexX, y: vertexY });
      
      this.activeShape.handleMouseClick(this.vertices);
      
      this.updateDotPosition();

      this.updateBuffersAndDraw();
    }
  }

  updateDotPosition() {
    const shapeIndex = this.shapes.indexOf(this.activeShape);
    const vertexShape = document.querySelectorAll(`.vertex-dot[data-shape-index="${shapeIndex}"]`);
        vertexShape.forEach(dot => {
            dot.remove();
        });

      addVertexDot(
        this.canvas,
        this.activeShape.positions,
        this.shapes.length - 1
      );

      this.setupVertexDotEventListeners(this.shapes.length - 1);
    }

  // Toggle draw mode for active shape
  mouseDownHandler(e) {
    if (this.activeType !== "Polygon") {
      console.log(this.activeType);
      if (this.activeType === "selector") {
        const x = e.clientX - this.canvas.offsetLeft;
        const y = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
        this.shapes.forEach((shape) => {
          if (shape.isInside(x, y)) {
            // Reset color of other shapes vertex
            let vertexDots = document.querySelectorAll(".vertex-dot");
            vertexDots.forEach((dot) => {
              dot.style.backgroundColor = "black";
            });
            this.activeShape = shape;
            this.activeShape.toggleDrawMode();
            this.toggleDrawModeForOtherShapes(shape);

            // Change color of vertex dot with data-shape-index = this.shapes.indexOf(this.activeShape)
            const shapeIndex = this.shapes.indexOf(this.activeShape);
            vertexDots = document.querySelectorAll(
              `.vertex-dot[data-shape-index="${shapeIndex}"]`
            );
            vertexDots.forEach((dot) => {
              dot.style.backgroundColor = "red";
            });
          }
        });
        return;
      }

    }
    if (this.activeType && this.activeType !== "Polygon") {
      const newShape = this.createShape(this.activeType);
      newShape.activate();
      this.activeShape = newShape;

      // get color from color picker
      const colorPicker = document.getElementById("colorPicker");
      const colorHex = colorPicker.value;
      const { r, g, b } = hexColorToFloatArray(colorHex);

      // update shape color
      this.activeShape.bindColorBuffer(new Float32Array([r, g, b, 1.0]));
      this.activeShape.handleMouseDown(e);
      this.activeShape.toggleDrawMode();
      this.toggleDrawModeForOtherShapes(newShape);
      this.shapes.push(newShape);
    }
  }
  // After create a new shape instance, then wait until mouse up event to redraw all shapes
  mouseUpHandler(e) {
    if (this.activeType !== "Polygon") {
      if (this.activeShape && this.activeType !== "selector") {
        this.activeShape.mouseUpHandler(e);
        addVertexDot(
          this.canvas,
          this.activeShape.positions,
          this.shapes.length - 1
        );
        // setup for vertex with data-shape-index = this.shapes.length - 1

        this.setupVertexDotEventListeners(this.shapes.length - 1);
      }
      this.updateBuffersAndDraw();
    }
  }

  // Setup Event Listener for each Vertex
  setupVertexDotEventListeners(shapeIndex) {
    // get all vertex dots with data-shape-index = shapeIndex
    const vertexDots = document.querySelectorAll(
      `.vertex-dot[data-shape-index="${shapeIndex}"]`
    );
    vertexDots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const vertexIndex = parseInt(dot.getAttribute("data-vertex-index"));
        const shapeIndex = parseInt(dot.getAttribute("data-shape-index"));
        this.showColorPicker(vertexIndex, shapeIndex);
        this.showTranslationBars(vertexIndex, shapeIndex);
      });
    });
  }
  // Color Picker
  showColorPicker(vertexIndex, shapeIndex) {
    const currentShape = this.shapes[shapeIndex];
    const existingPicker = document.getElementById("vertex-color-picker");
    if (existingPicker) {
      existingPicker.remove();
    }

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.id = "vertex-color-picker";
    colorPicker.style.position = "absolute";
    colorPicker.style.left = `100px`;
    colorPicker.style.top = `100px`;

    document.body.appendChild(colorPicker);

    colorPicker.focus();

    colorPicker.addEventListener("input", (e) => {
      const color = e.target.value;
      const { r, g, b } = hexColorToFloatArray(color);
      const newColor = [r, g, b, 1];

      for (let i = 0; i < 4; i++) {
        currentShape.colors[vertexIndex * 4 + i] = newColor[i];
      }
      this.updateBuffersAndDraw();
    });

    colorPicker.addEventListener("blur", (e) => {
      colorPicker.remove();
    });
  }

  // Slider for change vertex position
  showTranslationBars(vertexIndex, shapeIndex) {
    const currentShape = this.shapes[shapeIndex];

    // translate and transform congurence
    const translateX = document.getElementById("slider-translate-x-single");
    translateX.addEventListener("input", () => {
      this.translateSingleVertexX(translateX.value, vertexIndex, shapeIndex);
    });

    const translateY = document.getElementById("slider-translate-y-single");
    translateY.addEventListener("input", () => {
      this.translateSingleVertexY(translateY.value, vertexIndex, shapeIndex);
    });

    document
      .querySelectorAll(`.vertex-dot[data-shape-index="${shapeIndex}"]`)
      .forEach((dot) => dot.remove());
    // add new vertex dot
    addVertexDot(this.canvas, currentShape.positions, shapeIndex);
    this.setupVertexDotEventListeners(shapeIndex);
    this.updateBuffersAndDraw();
  }
  // Handle mouse move event
  mouseMoveHandler(e) {
    this.updateBuffersAndDraw();

    if (this.activeShape) {
      this.activeShape.mouseMoveHandler(e);
    }
  }

  // Toggle draw mode for other shapes
  toggleDrawModeForOtherShapes(activeShape) {
    this.shapes.forEach((shape) => {
      if (shape !== activeShape) {
        shape.toggleDrawMode();
      }
    });
  }

  // Create a new shape based on the shape type
  createShape(shapeType) {
    switch (shapeType) {
      case "Line":
        return new Line(
          this.gl,
          this.program,
          this.positionAttributeLocation,
          this.colorAttributeLocation,
          this.canvas
        );
      case "Square":
        return new Square(
          this.gl,
          this.program,
          this.positionAttributeLocation,
          this.colorAttributeLocation,
          this.canvas
        );
      case "Rectangle":
        return new Rectangle(
          this.gl,
          this.program,
          this.positionAttributeLocation,
          this.colorAttributeLocation,
          this.canvas
        );
      case "Polygon":
        return new Polygon(
          this.gl,
          this.program,
          this.positionAttributeLocation,
          this.colorAttributeLocation,
          this.canvas
        );
    }
  }

  // Listener for clearing the canvas from clear button
  clearCanvas() {
    this.shapes = [];
    this.vertices = [];
    this.activeShape = null;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // remove all vertex dots
    const vertexDots = document.querySelectorAll(".vertex-dot");
    vertexDots.forEach((dot) => {
      dot.remove();
    });
  }

  // Handle Save Button Click
  save() {
    // Save all shapes in JSON format
    const saveObj = this.shapes.map((shape) => {
      return {
        type: shape.type.charAt(0).toUpperCase() + shape.type.slice(1),
        positions: Array.from(shape.positions),
        colors: Array.from(shape.colors),
      };
    });
    const jsonStr = JSON.stringify(saveObj);
    console.log(jsonStr);

    // Create a blob and download the JSON file
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateAndTime = new Date().toISOString().replace(/:/g, "-");
    a.download = "shapes_" + dateAndTime + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // color picker event listener
  colorPickerHandler() {
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.addEventListener("input", (event) => {
      const colorHex = colorPicker.value;
      const { r, g, b } = hexColorToFloatArray(colorHex);

      // update shape color
      if (this.activeShape) {
        this.activeShape.bindColorBuffer(new Float32Array([r, g, b, 1.0]));
        this.activeShape.draw();
      }
      this.updateBuffersAndDraw();
    });
  }

  load() {
    const loadButton = document.getElementById("load-model");
    loadButton.addEventListener("click", (e) => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.click();
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.loadModel(e.target.result);
        };
        reader.readAsText(file);
      });
    });
  }

  loadModel(jsonStr) {
    this.clearCanvas();
    const shapes = JSON.parse(jsonStr);
    console.log("Load shapes", shapes);
    shapes.forEach((shape) => {
      const newShape = this.createShape(shape.type);
      newShape.positions = new Float32Array(shape.positions);
      newShape.colors = new Float32Array(shape.colors);
      newShape.activate();
      // add vertex dots
      addVertexDot(this.canvas, newShape.positions, this.shapes.length);
      this.setupVertexDotEventListeners(this.shapes.length);
      this.shapes.push(newShape);
      this.updateBuffersAndDraw();
    });
  }

  updateBuffersAndDraw() {
    this.shapes.forEach((shape) => {
      shape.draw();
    });
  }

  translateActiveShapeX(dx) {
    const newDx = dx - this.lastTranslateX;
    this.lastTranslateX = dx;
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.translateX(
        this.activeShape.positions,
        newDx,
        this.canvas.clientWidth / 2
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }

  translateActiveShapeY(dy) {
    const newDy = dy - this.lastTranslateY;
    this.lastTranslateY = dy;
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.translateY(
        this.activeShape.positions,
        newDy,
        this.canvas.clientHeight / 2
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }

  translateSingleVertexX(dx, vertexIndex, shapeIndex) {
    const newDx = dx - this.lastSingleTranslateX;
    this.lastSingleTranslateX = dx;
    const currentShape = this.shapes[shapeIndex];
    currentShape.positions = ShearManager.translateSingleX(
      currentShape.positions,
      newDx,
      this.canvas.clientWidth / 2,
      vertexIndex
    );
    this.shapes[shapeIndex] = currentShape;
    this.updateBuffersAndDraw();
  }

  translateSingleVertexY(dy, vertexIndex, shapeIndex) {
    const newDy = dy - this.lastSingleTranslateY;
    this.lastSingleTranslateY = dy;
    const currentShape = this.shapes[shapeIndex];
    currentShape.positions = ShearManager.translateSingleY(
      currentShape.positions,
      newDy,
      this.canvas.clientHeight / 2,
      vertexIndex
    );
    this.shapes[shapeIndex] = currentShape;
    this.updateBuffersAndDraw();
  }

  shearActiveShapeX(factor) {
    const newFactor = factor - this.lastShearX;
    this.lastShearX = factor;
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.transformX(
        this.activeShape.positions,
        newFactor
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }

  shearActiveShapeY(factor) {
    const newFactor = factor - this.lastShearY;
    this.lastShearY = factor;
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.transformY(
        this.activeShape.positions,
        newFactor
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }

  rotateActiveShape(value) {
    const newValue = value - this.lastRotate;
    this.lastRotate = value;
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.rotate(
        this.activeShape.positions,
        newValue
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }

  scaleActiveShape(value) {
    const newValue = value - this.lastScale;
    this.lastScale = value;
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.scale(
        this.activeShape.positions,
        newValue
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }

  reflectionActiveShape(axis) {
    if (this.activeShape) {
      this.activeShape.positions = ShearManager.reflection(
        this.activeShape.positions,
        axis
      );
      this.updateBuffersAndDraw();
    }
    this.updateDotPosition();
  }
}
