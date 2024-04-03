import { base_model } from "./base_model.js";

export class Line extends base_model {
  constructor(gl, program, positionAttributeLocation, colorAttributeLocation, canvas) {
    super(gl, program, positionAttributeLocation, colorAttributeLocation, canvas, "line");
    this.colors = new Float32Array(0);
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
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.positionAttributeLocation);

    // Bind the color buffer
    this.bindColorBuffer(this.colors);
    gl.vertexAttribPointer(this.colorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.colorAttributeLocation);

    gl.drawArrays(gl.LINES, 0, 2);
  }
  isInside(x, y) {
    const [x1, y1, x2, y2] = this.positions;

    const m1 = (y - y1) / (x - x1);
    const m2 = (y - y2) / (x - x2);

    const collinear = Math.abs(m1 - m2) < 0.1;
    const [x1_, x2_] = x1 > x2 ? [x2, x1] : [x1, x2];
    const [y1_, y2_] = y1 > y2 ? [y2, y1] : [y1, y2];

    const isInside = x > x1_ && x < x2_ && y > y1_ && y < y2_ && collinear;
    return isInside;
  }

  bindColorBuffer(colors) {
    if (colors.length === 4) {
      colors = new Float32Array([
        ...colors, ...colors
      ]);
    }
    this.colors = colors;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);
  }
}
