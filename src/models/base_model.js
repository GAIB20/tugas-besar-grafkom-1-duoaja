export class base_model {
  constructor(
    gl,
    program,
    positionAttributeLocation,
    resolutionUniformLocation,
    canvas,
    type
  ) {
    this.gl = gl;
    this.program = program;
    this.positionAttributeLocation = positionAttributeLocation;
    this.resolutionUniformLocation = resolutionUniformLocation;
    this.canvas = canvas;
    this.positions = new Float32Array(0);
    this.isPressed = false;
    this.drawMode = false;
    this.type = type;

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
  save() {
    const saveObj = {
      type: this.type,
      positions: Array.from(this.positions),
    };
    const jsonStr = JSON.stringify(saveObj);

    const blob = new Blob([jsonStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const dateAndTime = new Date().toISOString().replace(/:/g, "-");
    a.download = this.type + "_" + dateAndTime + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
  // Override in inherited classes
  mouseMoveHandler(e) {}
  updateCoordinates() {}
  draw() {}
}
