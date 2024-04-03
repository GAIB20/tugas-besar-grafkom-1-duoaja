export function hexColorToFloatArray(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;
    return { r, g, b };
}

export function addVertexDot(canvas, positions, shapeIndex) {
    const canvasRect = canvas.getBoundingClientRect();
    positions.forEach((pos, i) => {
        if (i % 2 === 0) {
            const dot = document.createElement('div');
            dot.className = 'vertex-dot';
            dot.setAttribute('data-vertex-index', i / 2);
            dot.setAttribute('data-shape-index', shapeIndex);
            dot.style.position = 'absolute';
            dot.style.width = '7px';
            dot.style.height = '7px';
            dot.style.backgroundColor = 'black';
            dot.style.borderRadius = '50%';

            const dotX = canvasRect.left + window.scrollX + pos;
            const dotY = canvasRect.top + canvas.clientHeight - positions[i + 1];

            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;

            document.body.appendChild(dot);
        }
    });
}
