class ShearManager {

    // Translasi X
    static translateX(positions, value, maxValue) {
        return positions.map((pos, index) => index % 2 === 0 ? pos + value/100 * maxValue : pos);
    }

    // Translasi Y
    static translateY(positions, value, maxValue) {
        return positions.map((pos, index) => index % 2 === 1 ? pos + value/100 * maxValue : pos);
    }

    static transformX(factor) {
        // TODO
    }

    static transformY(factor) {
        // TODO
    }

    static rotate(value) {
        // TODO
    }

    static scale(factor) {
        // TODO
    }

}

export default ShearManager;