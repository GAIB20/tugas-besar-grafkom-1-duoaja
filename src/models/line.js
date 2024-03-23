import { base_model } from "./base_model.js";

export class Line extends base_model {
  constructor(
    gl,
    program,
    positionAttributeLocation,
    resolutionUniformLocation,
    canvas
  ) {
    super(gl, program, positionAttributeLocation, resolutionUniformLocation, canvas, "line");
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
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

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
    gl.drawArrays(gl.LINES, 0, 2);
  }
}
