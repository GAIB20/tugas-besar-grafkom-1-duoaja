import { base_model } from "./base_model.js";

export class Rectangle extends base_model {
  constructor(gl, program, positionAttributeLocation, colorAttributeLocation, canvas) {
    super(gl, program, positionAttributeLocation, colorAttributeLocation, canvas, "rectangle");
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
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    this.positions = new Float32Array([x1, y1, x1, y2, x2, y1, x2, y2]);
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
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalizedPositions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.positionAttributeLocation);

    // BIND COLOR BUFFER
    this.bindColorBuffer(this.colors);
    gl.vertexAttribPointer(this.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.colorAttributeLocation);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  isInside(x, y) {
    let [x1, y1, x2, y2, x3, y3, x4, y4] = this.positions;
    if (x2 > x3) {
      [x2, x3] = [x3, x2];
    }
    if (y2 > y3) {
      [y2, y3] = [y3, y2];
    }
    const isInside = (x > x2 && x < x3) && (y > y2 && y < y3);
    return isInside;
  }
  bindColorBuffer(colors) {
    if (colors.length === 4) {
      colors = new Float32Array([
        ...colors, ...colors, ...colors, ...colors
      ]);
    }
    this.colors = colors;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);
  }
}
