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

    static rotate(value) {
        // TODO
    }

    static scale(factor) {
        // TODO
    }

    static avgX(positions) {
        return positions.reduce((acc, pos, index) => index % 2 === 0 ? acc + pos : acc, 0) / (positions.length / 2);
    }

    static avgY(positions) {
        return positions.reduce((acc, pos, index) => index % 2 === 1 ? acc + pos : acc, 0) / (positions.length / 2);
    }

}

export default ShearManager;