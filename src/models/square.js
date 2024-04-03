import { base_model } from "./base_model.js";

export class Square extends base_model {
  constructor(gl, program, positionAttributeLocation, colorAttributeLocation, canvas) {
    super(gl, program, positionAttributeLocation, colorAttributeLocation, canvas, "square");
    this.colors = new Float32Array(0);
    for (let i = 0; i < 4; i++) {
      this.colors = new Float32Array([
        ...this.colors,
        Math.random(),
        Math.random(),
        Math.random(),
        1.0,
      ]);
    }
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
    const sideLength = Math.max(Math.abs(dx), Math.abs(dy));
    const xDirection = dx >= 0 ? 1 : -1;
    const yDirection = dy >= 0 ? 1 : -1;
    this.positions = new Float32Array([
      x1, y1,
      x1, y1 + sideLength * yDirection,
      x1 + sideLength * xDirection, y1,
      x1 + sideLength * xDirection, y1 + sideLength * yDirection,
    ]);
  }
  draw() {
    const gl = this.gl;
    // normalize the positions
    const normalizedPositions = this.positions.map((pos, i) => {
      if (i % 2 === 0) {
        return pos / this.canvas.clientWidth * 2 - 1;
      } else {
        return pos / this.canvas.clientHeight * 2 - 1;
      }
    }
    );
    // BIND POSITION BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalizedPositions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.positionAttributeLocation);

    // BIND COLOR BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.colorAttributeLocation);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}