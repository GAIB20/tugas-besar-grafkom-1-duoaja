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
    }
  
    updateCoordinates(x1, y1, x2, y2, x3, y3, x4, y4) {
      this.positions = x1, y1, x2, y2, x3, y3, x4, y4;
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
  