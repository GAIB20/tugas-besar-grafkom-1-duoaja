import { base_model } from "./base_model.js";

export class Square extends base_model {
  constructor(
    gl,
    program,
    positionAttributeLocation,
    resolutionUniformLocation,
    canvas
  ) {
    super(
      gl,
      program,
      positionAttributeLocation,
      resolutionUniformLocation,
      canvas
    );
  }

  mouseDownHandler(e) {
    this.isPressed = true;
    this.x1 = e.clientX - this.canvas.offsetLeft;
    this.y1 = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
  }

  mouseMoveHandler(e) {
    if (this.isPressed && this.drawMode) {
      this.x2 = e.clientX - this.canvas.offsetLeft;
      this.y2 = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
      const dx = this.x2 - this.x1;
      const dy = this.y2 - this.y1;
      this.updateCoordinates(this.x1, this.y1, dx, dy);
      this.draw();
    }
  }

  updateCoordinates(x1, y1, dx, dy) {
    // get length
    const sideLength = Math.max(Math.abs(dx), Math.abs(dy));
    const xDirection = dx >= 0 ? 1 : -1;
    const yDirection = dy >= 0 ? 1 : -1;
    this.positions = new Float32Array([
      x1,
      y1,
      x1,
      y1 + sideLength * yDirection,
      x1 + sideLength * xDirection,
      y1,
      x1 + sideLength * xDirection,
      y1 + sideLength * yDirection,
    ]);
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
