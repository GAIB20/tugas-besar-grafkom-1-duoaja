import { Line } from "./line.js";
import { Square } from "./square.js";
import { Rectangle } from "./rectangle.js";
import { initializeWebGL } from "../utils/WebGLSetup.js";
import { addVertexDot, hexColorToFloatArray } from "../utils/utils.js";
// import { Polygon } from "./polygon.js";

export class ShapeManager {
    constructor(canvas) {
        const { gl, program, positionAttributeLocation, colorLocation } = initializeWebGL(canvas);
        this.gl = gl;
        this.program = program;
        this.positionAttributeLocation = positionAttributeLocation;
        this.colorAttributeLocation = colorLocation;
        this.canvas = canvas;
        this.shapes = [];
        this.activeShape = null;

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
        /*        
            ====BUTTON EVENT LISTENERS====
        */
        // Listener for type of shape to draw
        this.activeType = null;
        this.setupShapeCreation("draw-line", "Line");
        this.setupShapeCreation("draw-square", "Square");
        this.setupShapeCreation("draw-rectangle", "Rectangle");
        // this.setupShapeCreation("draw-polygon", "Polygon");

        // Clear canvas Button
        const clearButton = document.getElementById("clear");
        clearButton.addEventListener("click", () => this.clearCanvas());

        // Save Button
        const saveButton = document.getElementById("save");
        saveButton.addEventListener("click", () => this.save());

        // Color Picker
        this.colorPickerHandler();

        // Selector
        const select = document.getElementById("selector");
        select.addEventListener("click", (event) => {
            this.activeType = 'selector';
            this.activeShape = null;
        });
    }

    // Create a new shape based on the shape type
    setupShapeCreation(buttonId, shapeType) {
        const button = document.getElementById(buttonId);
        button.addEventListener("click", () => {
            this.activeType = shapeType;
            this.activeShape = null;
            this.toggleDrawModeForOtherShapes(null);
            button.style.backgroundColor = "blue";
            button.style.color = "white";

            const otherButtons = document.querySelectorAll(".draw-button");
            otherButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.style.backgroundColor = "white";
                }
            });
        });
    }
    // Toggle draw mode for active shape
    mouseDownHandler(e) {
        if (this.activeType === 'selector') {
            const x = e.clientX - this.canvas.offsetLeft;
            const y = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
            this.shapes.forEach(shape => {
                if (shape.isInside(x, y)) {
                    this.activeShape = shape;
                    this.activeShape.toggleDrawMode();
                    this.toggleDrawModeForOtherShapes(shape);
                }
            });
            return;
        }
        if (this.activeType) {
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
        if (this.activeShape && this.activeType !== 'selector') {
            this.activeShape.mouseUpHandler(e);
            addVertexDot(this.canvas, this.activeShape.positions, this.shapes.length - 1);
            // setup for vertex with data-shape-index = this.shapes.length - 1

            this.setupVertexDotEventListeners(this.shapes.length - 1);
        }
        this.shapes.forEach(shape => {
            shape.draw();
        });
    }

    // Setup Event Listener for each Vertex
    setupVertexDotEventListeners(shapeIndex) {
        // get all vertex dots with data-shape-index = shapeIndex
        const vertexDots = document.querySelectorAll(`.vertex-dot[data-shape-index="${shapeIndex}"]`);
        vertexDots.forEach(dot => {
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
        const existingPicker = document.getElementById('vertex-color-picker');
        if (existingPicker) {
            existingPicker.remove();
        }

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'vertex-color-picker';
        colorPicker.style.position = 'absolute';
        colorPicker.style.left = `100px`;
        colorPicker.style.top = `100px`;

        document.body.appendChild(colorPicker);

        colorPicker.focus();

        colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            const { r, g, b } = hexColorToFloatArray(color);
            const newColor = [r, g, b, 1];

            for (let i = 0; i < 4; i++) {
                currentShape.colors[vertexIndex * 4 + i] = newColor[i];
            }
            this.shapes.forEach(shape => {
                shape.draw();
            });
        });

        colorPicker.addEventListener('blur', (e) => {
            colorPicker.remove();
        });
    }

    // Slider for change vertex position
    showTranslationBars(vertexIndex, shapeIndex) {
        const currentShape = this.shapes[shapeIndex];

        const existingUI = document.getElementById('translation-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const uiContainer = document.createElement('div');
        uiContainer.id = 'translation-ui';
        uiContainer.style.position = 'absolute';
        uiContainer.style.left = `${150}px`;
        uiContainer.style.top = `${100}px`;
        document.body.appendChild(uiContainer);

        // Create X-axis slider
        const xSlider = document.createElement('input');
        xSlider.type = 'range';
        xSlider.min = '0';
        xSlider.max = this.canvas.clientWidth.toString();
        xSlider.value = currentShape.positions[vertexIndex * 2].toString();
        uiContainer.appendChild(xSlider);

        // Create Y-axis slider
        const ySlider = document.createElement('input');
        ySlider.type = 'range';
        ySlider.min = '0';
        ySlider.max = this.canvas.clientHeight.toString();
        ySlider.value = currentShape.positions[vertexIndex * 2 + 1].toString();
        uiContainer.appendChild(ySlider);

        // Create a button to remove the UI
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => uiContainer.remove());
        uiContainer.appendChild(removeButton);

        // Slider event listeners to update vertex position
        xSlider.addEventListener('input', () => {
            currentShape.positions[vertexIndex * 2] = parseFloat(xSlider.value);
            // remove the vertex dot with data-shape-index = shapeIndex
            document.querySelectorAll(`.vertex-dot[data-shape-index="${shapeIndex}"]`).forEach(dot => dot.remove());
            // add new vertex dot
            addVertexDot(this.canvas, currentShape.positions, shapeIndex);
            this.setupVertexDotEventListeners(shapeIndex);
            this.shapes.forEach(shape => {
                shape.draw();
            });
        });
        ySlider.addEventListener('input', () => {
            currentShape.positions[vertexIndex * 2 + 1] = parseFloat(ySlider.value);
            // remove the vertex dot with data-shape-index = shapeIndex
            document.querySelectorAll(`.vertex-dot[data-shape-index="${shapeIndex}"]`).forEach(dot => dot.remove());
            // add new vertex dot
            addVertexDot(this.canvas, currentShape.positions, shapeIndex);
            this.setupVertexDotEventListeners(shapeIndex);
            this.shapes.forEach(shape => {
                shape.draw();
            });
        });
    }
    // Handle mouse move event
    mouseMoveHandler(e) {
        this.shapes.forEach(shape => {
            shape.draw();
        });

        if (this.activeShape) {
            this.activeShape.mouseMoveHandler(e);
        }
    }

    // Toggle draw mode for other shapes
    toggleDrawModeForOtherShapes(activeShape) {
        this.shapes.forEach(shape => {
            if (shape !== activeShape) {
                shape.toggleDrawMode();
            }
        });
        // change button color
        const otherButtons = document.querySelectorAll(".draw-button");
        otherButtons.forEach(otherButton => {
            if (otherButton !== activeShape) {
                otherButton.style.backgroundColor = "white";
            }
        });
    }


    // Create a new shape based on the shape type
    createShape(shapeType) {
        switch (shapeType) {
            case "Line":
                return new Line(this.gl, this.program, this.positionAttributeLocation, this.colorAttributeLocation, this.canvas);
            case "Square":
                return new Square(this.gl, this.program, this.positionAttributeLocation, this.colorAttributeLocation, this.canvas);
            case "Rectangle":
                return new Rectangle(this.gl, this.program, this.positionAttributeLocation, this.colorAttributeLocation, this.canvas);
            // case "Polygon":
            //     return new Polygon(this.gl, this.program, this.positionAttributeLocation, this.colorAttributeLocation, this.canvas);
        }
    }

    // Listener for clearing the canvas from clear button
    clearCanvas() {
        this.shapes = [];
        this.activeShape = null;
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // remove all vertex dots
        const vertexDots = document.querySelectorAll('.vertex-dot');
        vertexDots.forEach(dot => {
            dot.remove();
        });
    }

    // Handle Save Button Click
    save() {
        // Save all shapes in JSON format
        const saveObj = this.shapes.map(shape => {
            return {
                type: shape.type,
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
        });
    }
}