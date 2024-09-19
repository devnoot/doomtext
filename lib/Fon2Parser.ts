import { createCanvas } from "canvas";
import fs from "fs";
import { Color, Fon2Info, Fon2Palette } from "./index.d";
import { decodeRle, getLightness } from "./utils";

export class Fon2Parser {
  /**
   * Loads a FON2 font file from the specified path.
   *
   * @param fontPath {string} - The path to the FON2 font file.
   * @returns {buffer: Buffer, dataView: DataView} An object containing the font file buffer and its DataView.
   * @throws Throws an error if the file is not a valid FON2 file.
   */
  public static load(fontPath: string): { buffer: Buffer; dataView: DataView } {
    const buffer = fs.readFileSync(fontPath);
    console.info(`Loaded font: ${fontPath}`);

    // fon2 files are at least 12 bytes in length. If it's shorter than that
    // then it's not a valid FON2 file, and we can stop here.
    if (buffer.length < 12) {
      throw new Error("Buffer is too short to be a valid FON2 file.");
    }

    const identifier = new TextDecoder().decode(buffer.subarray(0, 4));

    if (identifier !== "FON2") {
      throw new Error("Invalid identifier in FON2 file.");
    }

    const dataView = new DataView(new Uint8Array(buffer).buffer);
    return { buffer, dataView };
  }

  /**
   * Extracts font2 font information from the provided DataView.
   *
   * @param dv {DataView} - The DataView containing the font data.
   * @returns The extracted font information.
   */
  public static extractInfo(dv: DataView): Fon2Info {
    // more about the fon2 spec at https://zdoom.org/wiki/FON2

    // the characters 'F', 'O', 'N', '2'
    const identifier = new TextDecoder().decode(dv.buffer.slice(0, 4));

    // if the identifier is not 'FON2', then the file is invalid
    if (identifier !== "FON2") {
      throw new Error("Invalid identifier in FON2 file.");
    }

    // unsigned value for character height
    const characterHeight = dv.getUint16(4, true);

    // ASCII number for the first character described in the font.
    const firstCharIndex = dv.getUint8(6);

    // ASCII number for the last character described in the font.
    const lastCharIndex = dv.getUint8(7);

    // 1 if the characters are of constant width, 0 otherwise
    const constantWidth = Boolean(dv.getUint8(8));

    // seems unused
    const shadingType = dv.getUint8(9);

    // Amount of active colors in the palette. The true palette size is one greater, as the last
    // palette entry is for teh inactive color.
    const paletteSize = dv.getUint8(10);

    // Technically used as a boolean, since there is only one flag.
    // 1 if the font contains kerning information, otherwise 0
    const hasKerningInfo = Boolean(dv.getUint8(11));

    return {
      identifier,
      characterHeight,
      firstCharIndex,
      lastCharIndex,
      constantWidth,
      shadingType,
      paletteSize,
      hasKerningInfo,
    };
  }

  public static extractPalette(
    data: DataView,
    paletteSize: number,
    offset: number,
  ): Fon2Palette {
    const palette: Color[] = [];
    let minLightness = 255;
    let maxLightness = 0;

    for (let i = 0; i < paletteSize + 1; i++) {
      const color: Color = [
        data.getUint8(offset),
        data.getUint8(offset + 1),
        data.getUint8(offset + 2),
      ];
      offset += 3;
      palette.push(color);

      if (i !== 0 && i !== paletteSize) {
        const lightness = getLightness(...color);
        minLightness = Math.min(minLightness, lightness);
        maxLightness = Math.max(maxLightness, lightness);
      }
    }

    if (maxLightness < minLightness) {
      minLightness = 0;
      maxLightness = 255;
    }

    return { palette, minLightness, maxLightness, offset };
  }

  public static extractCharacterWidths(
    dv: DataView,
    { constantWidth, firstCharIndex, lastCharIndex, hasKerningInfo }: Fon2Info,
  ): { widths: number[]; offset: number } {
    let offset = 12; // byte padding before the first character width

    const kerningInfo = hasKerningInfo
      ? Boolean(dv.getInt16(offset, true))
      : false;
    kerningInfo && (offset += 2);

    const widths: number[] = [];

    if (constantWidth) {
      let width = dv.getUint16(offset, true);
      offset += 2;
      for (let n = firstCharIndex; n <= lastCharIndex; n++) {
        widths.push(width);
      }
    } else {
      for (let n = firstCharIndex; n <= lastCharIndex; n++) {
        let width = dv.getUint16(offset, true);
        offset += 2;
        widths.push(width);
      }
    }

    return { widths, offset };
  }
  public static extractGlyphs(
    dv: DataView,
    { characterHeight, firstCharIndex, lastCharIndex, paletteSize }: Fon2Info,
    { palette }: Fon2Palette,
    charcterWidths: number[],
    offset: number,
  ) {
    const glyphs: any[] = [];

    const pixelDecoder = decodeRle(new Uint8Array(dv.buffer, offset));
    for (let c = firstCharIndex; c <= lastCharIndex; c++) {
      const width = charcterWidths[c - firstCharIndex];
      if (width === 0) {
        continue;
      }

      const canvas = createCanvas(width, characterHeight);
      const ctx = canvas.getContext("2d");
      const numPixels = width * characterHeight;
      const imgData = ctx.getImageData(0, 0, width, characterHeight);
      const px = imgData.data;

      for (let i = 0; i < numPixels; i++) {
        if (offset === 0 || offset === paletteSize) {
          continue;
        }

        const pixel = pixelDecoder.next().value;
        if (pixel === 0 || pixel === paletteSize) {
          continue;
        }
        px[i * 4 + 0] = palette[pixel][0];
        px[i * 4 + 1] = palette[pixel][1];
        px[i * 4 + 2] = palette[pixel][2];
        px[i * 4 + 3] = 255;
      }

      ctx.putImageData(imgData, 0, 0);

      const glyph = {
        id: String.fromCodePoint(c),
        width,
        height: characterHeight,
        img: canvas.toBuffer(),
        canvas
      };

      glyphs.push(glyph);
    }

    return { glyphs };
  }
}
