import { Line } from "./line.js";
import { Square } from "./square.js";
import { Rectangle } from "./rectangle.js";
import { initializeWebGL } from "../utils/WebGLSetup.js";
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
    }

    // Create a new shape based on the shape type
    setupShapeCreation(buttonId, shapeType) {
        console.log("setupShapeCreation");
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
        if (this.activeType) {
            const newShape = this.createShape(this.activeType);
            newShape.activate();
            this.activeShape = newShape;
            this.activeShape.handleMouseDown(e);
            this.activeShape.toggleDrawMode();
            this.toggleDrawModeForOtherShapes(newShape);
            this.shapes.push(newShape);
        }
    }
    // After create a new shape instance, then wait until mouse up event to redraw all shapes
    mouseUpHandler(e) {
        if (this.activeShape) {
            this.activeShape.mouseUpHandler(e);
        }
        this.shapes.forEach(shape => {
            shape.draw();
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
        this.drawScene();
    }

    // Handle Save Button Click
    save() {
        // TODO : SAVE ALL SHAPES
        if (this.activeShape) {
            this.activeShape.save();
        } else {
            console.log("No active shape to save.");
        }
    }

    // color picker event listener
    colorPickerHandler() {
        const colorPicker = document.getElementById("colorPicker");
        colorPicker.addEventListener("input", (event) => {
            const colorHex = colorPicker.value;
            const r = parseInt(colorHex.substr(1, 2), 16) / 255.0;
            const g = parseInt(colorHex.substr(3, 2), 16) / 255.0;
            const b = parseInt(colorHex.substr(5, 2), 16) / 255.0;

            // update shape color
            if (this.activeShape) {
                this.activeShape.colors = new Float32Array([r, g, b, 1.0, r, g, b, 1.0]);
                this.activeShape.draw();
            }
        });
    }
}