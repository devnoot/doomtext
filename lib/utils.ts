/**
 * Calculates the lightness of a color using the Rec. 601 luma formula.
 *
 * @param {number} r - The red component of the color, in the range 0-255.
 * @param {number} g - The green component of the color, in the range 0-255.
 * @param {number} b - The blue component of the color, in the range 0-255.
 * @returns {number} - The calculated lightness value.
 */

export function getLightness(r: number, g: number, b: number): number {
    return r * 0.299 + g * 0.587 + b * 0.114;
}


/**
 * Decodes a run-length encoded (RLE) array.
 *
 * @param {Uint8Array | number[]} array - The RLE encoded array to decode.
 * @returns {Generator<number>} - A generator that yields the decoded values.
 */

export function* decodeRle(array: Uint8Array | number[]): Generator<number> {
    let i = 0;
    while (i < array.length) {
        let code = array[i];
        i += 1;

        if (code < 128) {
            let count = code + 1;
            for (let _ = 0; _ < count; _++) {
                yield array[i];
                i += 1;
            }
        }
        else if (code > 128) {
            let count = 257 - code;
            let datum = array[i];
            i += 1;
            for (let _ = 0; _ < count; _++) {
                yield datum;
            }
        }
    }
}