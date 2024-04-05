export class base_model {
  constructor(gl, program, positionAttributeLocation, colorAttributeLocation, canvas, type) {
    this.gl = gl;
    this.program = program;
    this.positionAttributeLocation = positionAttributeLocation;
    this.colorAttributeLocation = colorAttributeLocation;
    this.canvas = canvas;
    this.positions = new Float32Array(0);
    this.isPressed = false;
    this.drawMode = false;
    this.type = type;
    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
    this.colors = new Float32Array(0);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }

  handleMouseDown(e) {
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

  updateBuffersAndDraw() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

    // re-create the vertex dots
    this.addVertexDot();
    this.draw();
  }
  mouseMoveHandler(e) { }
  updateCoordinates() { }
  draw() { }
}
