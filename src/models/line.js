import { base_model } from "./base_model.js";

export class Line extends base_model {
  constructor(
    gl,
    program,
    positionAttributeLocation,
    colorAttributeLocation,
    canvas
  ) {
    super(
      gl,
      program,
      positionAttributeLocation,
      colorAttributeLocation,
      canvas,
      "line"
    );
    this.colors = new Float32Array(0);
    for (let i = 0; i < 2; i++) {
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
      this.updateCoordinates(this.x1, this.y1, this.x2, this.y2);
      this.draw();
    }
  }
  updateCoordinates(x1, y1, x2, y2) {
    this.positions = new Float32Array([x1, y1, x2, y2]);
  }

  draw() {
    const gl = this.gl;
    const normalizedPositions = this.positions.map((position, i) => {
      if (i % 2 === 0) {
        return position / this.canvas.clientWidth * 2 - 1;
      } else {
        return position / this.canvas.clientHeight * 2 - 1;
      }
    });

    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, normalizedPositions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
      );
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    
    // Bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.colorAttributeLocation,
      4,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(this.colorAttributeLocation);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, 2);
  }
}
