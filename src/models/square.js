export class Square {
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
  }

  updateCoordinates(x1, y1, length) {
    const x2 = x1 + length;
    const y2 = y1;
    const x3 = x1;
    const y3 = y1 + length;
    const x4 = x1 + length;
    const y4 = y1 + length;
    this.positions = [x1, y1, x2, y2, x3, y3, x4, y4];
    console.log(this.positions);
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
