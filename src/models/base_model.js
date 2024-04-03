export class base_model {
  constructor(
    gl,
    program,
    positionAttributeLocation,
    colorAttributeLocation,
    canvas,
    type
  ) {
    this.gl = gl;
    this.program = program;
    this.positionAttributeLocation = positionAttributeLocation;
    this.colorAttributeLocation = colorAttributeLocation;
    this.canvas = canvas;
    this.positions = new Float32Array(0);
    this.isPressed = false;
    this.drawMode = false;
    this.type = type;
    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
    this.colors = new Float32Array(0);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }
  normalizeCoordinates(x, y) {
    const normalizeX = x / this.canvas.clientWidth * 2 - 1;
    const normalizeY = y / this.canvas.clientHeight * 2 - 1;
    return {
      normalizeX,
      normalizeY
    };
  }
  mouseDownHandler(e) {
    console.log("MOUSE DOWN")
    document.querySelectorAll('.vertex-dot').forEach(dot => dot.remove());
    this.isPressed = true;
    this.x1 = e.clientX - this.canvas.offsetLeft;
    this.y1 = this.canvas.clientHeight - e.clientY + this.canvas.offsetTop;
  }

  mouseUpHandler() {
    this.isPressed = false;
    this.addVertexDot();
  }

  toggleDrawMode() {
    this.drawMode = !this.drawMode;
  }

  activate() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
  save() {
    const saveObj = {
      type: this.type,
      positions: Array.from(this.positions),
    };
    const jsonStr = JSON.stringify(saveObj);

    const blob = new Blob([jsonStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const dateAndTime = new Date().toISOString().replace(/:/g, "-");
    a.download = this.type + "_" + dateAndTime + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
  addVertexDot() {
    console.log("CALLED");
    const canvasRect = this.canvas.getBoundingClientRect();
    this.positions.forEach((pos, i) => {
      if (i % 2 === 0) { // Coordinate X
        const dot = document.createElement('div');
        dot.className = 'vertex-dot';
        dot.setAttribute('data-vertex-index', i / 2);
        dot.addEventListener('click', (e) => {
          const vertexIndex = parseInt(dot.getAttribute('data-vertex-index'));
          const pickerPosX = e.pageX + 5;
          const pickerPosY = e.pageY + 5;
          this.showColorPicker(vertexIndex, pickerPosX, pickerPosY);

          // call translation bar
          this.showTranslationBars(vertexIndex, pickerPosX, pickerPosY);
        });
        dot.style.position = 'absolute';
        dot.style.width = '7px';
        dot.style.height = '7px';
        dot.style.backgroundColor = 'black';
        dot.style.borderRadius = '50%';

        const dotX = canvasRect.left + window.scrollX + pos;
        const dotY = canvasRect.top + this.canvas.clientHeight - this.positions[i + 1];

        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        document.body.appendChild(dot);
      }
    });
  }
  changeVertexColor(vertexIndex, hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;
    const newColor = [r, g, b, 1];

    for (let i = 0; i < 4; i++) {
      this.colors[vertexIndex * 4 + i] = newColor[i];
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    this.draw();
  }

  showColorPicker(vertexIndex, posX, posY) {
    const existingPicker = document.getElementById('vertex-color-picker');
    if (existingPicker) {
      existingPicker.remove();
    }

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'vertex-color-picker';
    colorPicker.style.position = 'absolute';
    colorPicker.style.left = `${posX}px`;
    colorPicker.style.top = `${posY}px`;

    document.body.appendChild(colorPicker);

    colorPicker.focus();

    colorPicker.addEventListener('input', (e) => {
      const color = e.target.value;
      this.changeVertexColor(vertexIndex, color);
      colorPicker.remove();
    });

    colorPicker.addEventListener('blur', (e) => {
      colorPicker.remove();
    });
  }

  showTranslationBars(vertexIndex, posX, posY) {
    const existingUI = document.getElementById('translation-ui');
    if (existingUI) {
      existingUI.remove();
    }

    const uiContainer = document.createElement('div');
    uiContainer.id = 'translation-ui';
    uiContainer.style.position = 'absolute';
    uiContainer.style.left = `${posX + 20}px`;
    uiContainer.style.top = `${posY}px`;
    document.body.appendChild(uiContainer);

    // Create X-axis slider
    const xSlider = document.createElement('input');
    xSlider.type = 'range';
    xSlider.min = '0';
    xSlider.max = this.canvas.clientWidth.toString();
    xSlider.value = this.positions[vertexIndex * 2].toString();
    uiContainer.appendChild(xSlider);

    // Create Y-axis slider
    const ySlider = document.createElement('input');
    ySlider.type = 'range';
    ySlider.min = '0';
    ySlider.max = this.canvas.clientHeight.toString();
    ySlider.value = this.positions[vertexIndex * 2 + 1].toString();
    uiContainer.appendChild(ySlider);

    // Create a button to remove the UI
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => uiContainer.remove());
    uiContainer.appendChild(removeButton);

    // Slider event listeners to update vertex position
    xSlider.addEventListener('input', () => {
      console.log(parseFloat(xSlider.value));
      console.log("before", this.positions[vertexIndex * 2]);
      this.positions[vertexIndex * 2] = parseFloat(xSlider.value);
      console.log("after", this.positions[vertexIndex * 2]);
      // remove the vertex dot
      document.querySelectorAll('.vertex-dot').forEach(dot => dot.remove());
      this.updateBuffersAndDraw();
    });
    ySlider.addEventListener('input', () => {
      console.log(parseFloat(ySlider.value));
      console.log("before", this.positions[vertexIndex * 2 + 1]);
      this.positions[vertexIndex * 2 + 1] = parseFloat(ySlider.value);
      console.log("after", this.positions[vertexIndex * 2 + 1]);
      // remove the vertex dot
      document.querySelectorAll('.vertex-dot').forEach(dot => dot.remove());
      this.updateBuffersAndDraw();
    });
  }
  updateBuffersAndDraw() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    console.log("redraw");

    // re-create the vertex dots
    this.addVertexDot();
    this.draw();
  }
  mouseMoveHandler(e) { }
  updateCoordinates() { }
  draw() { }
}
