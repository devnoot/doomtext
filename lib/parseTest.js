import { createCanvas } from "canvas";

function string_from_buffer_ascii(buf, start = 0, len) {
    if (ArrayBuffer.isView(buf)) {
        start += buf.byteOffset;
        buf = buf.buffer;
    }
    return String.fromCodePoint.apply(null, new Uint8Array(buf, start, len));
}

function get_lightness(r, g, b) {
    return r * 0.299 + g * 0.587 + b * 0.114;
}

function* decode_rle(array) {
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

export function parse_fon2(buf) {
    let data = new DataView(buf);
    let magic = string_from_buffer_ascii(buf, 0, 4);
    if (magic !== 'FON2') {
        throw new Error("Not a FON2 file");
    }

    let cell_height = data.getUint16(4, true);
    let n0 = data.getUint8(6);
    let n1 = data.getUint8(7);
    let is_constant_width = data.getUint8(8);
    // byte 9 is "shading type", unused
    let palette_size = data.getUint8(10);
    let flags = data.getUint8(11);
    let p = 12;

    let kerning_info;
    if (flags & 1) {
        kerning_info = data.getInt16(p, true);
        p += 2;
    }

    let widths = [];
    if (is_constant_width) {
        let width = data.getUint16(p, true);
        p += 2;
        for (let n = n0; n <= n1; n++) {
            widths.push(width);
        }
    }
    else {
        for (let n = n0; n <= n1; n++) {
            let width = data.getUint16(p, true);
            p += 2;
            widths.push(width);
        }
    }

    let palette = [];
    // Grab the lightness range while we're in here.
    // I *think* it's taken from the palette and not from the set of colors that are actually
    // used?  Hopefully there's no difference in most cases anyway??
    let min_lightness = 255;
    let max_lightness = 0;
    for (let i = 0; i < palette_size + 1; i++) {
        let color = [data.getUint8(p), data.getUint8(p + 1), data.getUint8(p + 2)];
        p += 3;
        palette.push(color);

        // Do NOT do this for the first or last colors, which are transparent and dummy
        if (i !== 0 && i !== palette_size) {
            let lightness = get_lightness(...color);
            min_lightness = Math.min(min_lightness, lightness);
            max_lightness = Math.max(max_lightness, lightness);
        }
    }
    if (max_lightness < min_lightness) {
        // Well this should definitely not happen
        min_lightness = 0;
        max_lightness = 255;
    }

    let glyphs = {};
    let n = n0;
    let glyph = null;
    // This is a generator, and we're gonna juggle it a bit
    let pixel_decoder = decode_rle(new Uint8Array(buf, p));
    for (let n = n0; n <= n1; n++) {
        let width = widths[n - n0];
        if (width === 0)
            continue;

        // TODO probably better to like, pack these into one canvas?
        let canvas = createCanvas('canvas');
        canvas.width = width;
        canvas.height = cell_height;
        let ctx = canvas.getContext('2d');
        let imgdata = ctx.getImageData(0, 0, width, cell_height);
        let px = imgdata.data;
        for (let i = 0; i < width * cell_height; i++) {
            let p = pixel_decoder.next().value;
            if (p === 0 || p === palette_size)
                continue;

            px[i * 4 + 0] = palette[p][0];
            px[i * 4 + 1] = palette[p][1];
            px[i * 4 + 2] = palette[p][2];
            px[i * 4 + 3] = 255;
        }
        ctx.putImageData(imgdata, 0, 0);

        glyphs[String.fromCodePoint(n)] = {
            width: width,
            height: cell_height,
            canvas: canvas,
            dy: 0,
        };
    }

    return {
        glyphs: glyphs,
        line_height: cell_height,
        kerning: kerning_info,
        lightness_range: [min_lightness, max_lightness],
    };
}