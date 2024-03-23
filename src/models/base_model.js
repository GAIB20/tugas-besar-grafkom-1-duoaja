export class base_model {
  constructor(
    gl,
    program,
    positionAttributeLocation,
    resolutionUniformLocation,
    canvas
  ) {
    this.gl = gl;
    this.program = program;
    this.positionAttributeLocation = positionAttributeLocation;
    this.resolutionUniformLocation = resolutionUniformLocation;
    this.canvas = canvas;
    this.positions = new Float32Array(0);
    this.isPressed = false;
    this.drawMode = false;

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }

  mouseDownHandler(e) {
    this.isPressed = true;
    this.x1 = e.clientX - this.canvas.offsetLeft;
    this.y1 = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
  }

  mouseUpHandler() {
    this.isPressed = false;
  }

  toggleDrawMode() {
    this.drawMode = !this.drawMode;
  }
  activate() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
  
  // Override in inherited classes
  mouseMoveHandler(e) {}
  updateCoordinates() {}
  draw() {}
}
