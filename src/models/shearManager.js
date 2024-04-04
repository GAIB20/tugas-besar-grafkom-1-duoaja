class ShearManager {

    // Translasi X
    static translateX(positions, value, maxValue) {
        return positions.map((pos, index) => index % 2 === 0 ? pos + value/100 * maxValue : pos);
    }

    // Translasi Y
    static translateY(positions, value, maxValue) {
        return positions.map((pos, index) => index % 2 === 1 ? pos + value/100 * maxValue : pos);
    }

    static transformX(positions, factor) {
        return positions.map((pos, index) => index % 2 === 0 ? pos + (pos - ShearManager.avgX(positions)) * factor/100  : pos);
    }

    static transformY(positions, factor) {
        return positions.map((pos, index) => index % 2 === 1 ? pos + (pos - ShearManager.avgY(positions)) * factor/100 : pos);
    }

    static rotate(positions, value) {
        const angle = value * Math.PI / 180;
        const avgX = ShearManager.avgX(positions);
        const avgY = ShearManager.avgY(positions);
        return positions.map((pos, index) => {
            if (index % 2 === 0) {
                return avgX + (pos - avgX) * Math.cos(angle) - (positions[index + 1] - avgY) * Math.sin(angle);
            } else {
                return avgY + (pos - avgY) * Math.cos(angle) + (positions[index - 1] - avgX) * Math.sin(angle);
            }
        });
    }

    static scale(positions, factor) {
        return positions.map((pos, index) => index % 2 === 0 ? pos + (pos - ShearManager.avgX(positions)) * factor/100 : pos + (pos - ShearManager.avgY(positions)) * factor/100);
    }

    static avgX(positions) {
        return positions.reduce((acc, pos, index) => index % 2 === 0 ? acc + pos : acc, 0) / (positions.length / 2);
    }

    static avgY(positions) {
        return positions.reduce((acc, pos, index) => index % 2 === 1 ? acc + pos : acc, 0) / (positions.length / 2);
    }

}

export default ShearManager;