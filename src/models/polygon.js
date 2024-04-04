import { base_model } from "./base_model.js";

export class Polygon extends base_model {
  constructor(gl, program, positionAttributeLocation, colorAttributeLocation, canvas) {
    super(gl, program, positionAttributeLocation, colorAttributeLocation, canvas, "polygon");
    this.vertices = [];
    this.colors = new Float32Array(0);
    this.position = new Float32Array(0);
  }

  convertVerticesToPosition() {
    let position = [];
    for (let i = 0; i < this.vertices.length; i++) {
      position.push(this.vertices[i].x);
      position.push(this.vertices[i].y);
    }
    this.position = new Float32Array(position);
  }

  handleMouseClick(vertices){
    this.vertices = vertices;
    console.log(this.vertices);
    if (this.vertices.length > 2) {
      this.convertVerticesToPosition();
      this.customDraw();
    }
  }

  draw() {
    if (this.vertices.length > 2) {
      this.customDraw();
      console.log("Drawing polygon");
    }
    
  }

  normalizePositions() {
    const positions = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const x = this.vertices[i].x;
      const y = this.vertices[i].y;
      const normalizedX = (x / this.canvas.clientWidth) * 2 - 1;
      const normalizedY = (y / this.canvas.clientHeight) * 2 - 1;
      positions.push(normalizedX, normalizedY);
    }
    return new Float32Array(positions);
  }
  

  customDraw() {
    const normalizedPositions = this.normalizePositions();
    const positionBuffer = this.gl.createBuffer();
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalizedPositions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
    this.bindColorBuffer(this.colors);
    this.gl.vertexAttribPointer(this.colorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.colorAttributeLocation);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertices.length);
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
