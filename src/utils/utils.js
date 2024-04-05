export function hexColorToFloatArray(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;
    return { r, g, b };
}

export function addVertexDot(canvas, positions, shapeIndex, currentActiveShapeIndex) {
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
            if (shapeIndex === currentActiveShapeIndex) {
                dot.style.backgroundColor = 'red';;
            }
            dot.style.borderRadius = '50%';

            const dotX = canvasRect.left + window.scrollX + pos;
            const dotY = canvasRect.top + canvas.clientHeight - positions[i + 1];

            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;

            document.body.appendChild(dot);
        }
    });
}

export function isCounterClockwise(p1, p2, p) {
    const res = (p2.x - p1.x) * (p.y - p1.y) - (p2.y - p1.y) * (p.x - p1.x);
    return res > 0;
}

export function convexHull(points) {
    if (points.length < 3) return points;

    // find most bottom point
    let mostBottom = points.reduce((lowest, point) => {
        return (point.y < lowest.y || (point.y === lowest.y && point.x < lowest.x)) ? point : lowest;
    }, points[0]);

    // sort points by angle
    const sorted = points.filter(p => p !== mostBottom).sort((a, b) => {
        const angleA = Math.atan2(a.y - mostBottom.y, a.x - mostBottom.x);
        const angleB = Math.atan2(b.y - mostBottom.y, b.x - mostBottom.x);
        return angleA - angleB;
    });

    const stack = [mostBottom, sorted[0], sorted[1]];

    for (let i = 2; i < sorted.length; i++) {
        let top = stack[stack.length - 1];
        let nextToTop = stack[stack.length - 2];
        while (stack.length >= 2 && !isCounterClockwise(nextToTop, top, sorted[i])) {
            stack.pop();
            top = stack[stack.length - 1];
            nextToTop = stack[stack.length - 2];
        }
        stack.push(sorted[i]);
    }

    return stack;
}
