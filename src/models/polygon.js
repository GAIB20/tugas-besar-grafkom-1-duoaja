export class Polygon {
    constructor(gl, program, positionAttributeLocation, resolutionUniformLocation, canvas) {
      this.gl = gl;
      this.program = program;
      this.positionAttributeLocation = positionAttributeLocation;
      this.resolutionUniformLocation = resolutionUniformLocation;
      this.canvas = canvas;
      
      this.positions = [];
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
  
    updateCoordinates(...coordinates) {
      this.positions = coordinates;
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
    }
  
    draw() {
      const { gl, program, positionAttributeLocation, resolutionUniformLocation, canvas } = this;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
  
      // Draw the polygon
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.positions.length / 2);
    }
  }
  