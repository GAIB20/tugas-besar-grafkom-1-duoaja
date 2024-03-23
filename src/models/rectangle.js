export class Rectangle {
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
    this.positions = new Float32Array(4);
    this.isPressed = false;
    this.drawRectangleMode = false;

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

  mouseMoveHandler(e) {
    if (this.isPressed && this.drawRectangleMode) {
      this.x2 = e.clientX - this.canvas.offsetLeft;
      this.y2 = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
      const dx = this.x2 - this.x1;
      const dy = this.y2 - this.y1;
      this.updateCoordinates(this.x1, this.y1, dx, dy);
      this.draw();
    }
  }

  toggleDrawRectangleMode() {
    this.drawRectangleMode = !this.drawRectangleMode;
  }

  activate() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  updateCoordinates(x1, y1, dx, dy) {
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    this.positions = new Float32Array([x1, y1, x1, y2, x2, y1, x2, y2]);
  }
  draw() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.positions),
      gl.STATIC_DRAW
    );

    gl.uniform2f(
      this.resolutionUniformLocation,
      this.canvas.width,
      this.canvas.height
    );
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
