import { createCanvas } from 'canvas';
import fs from 'fs';
import { resolve as resolvePath } from 'path';
import { Fon2Parser } from "./Fon2Parser";
import { type DoomFont } from "./index.d";

export class DooMTexT {

  public static generate(font: DoomFont, textToCreate: string) {

    const fontPath = resolvePath('fonts', `${font}.fon2`)

    if (!fs.existsSync(fontPath)) {
      console.error(`Tried font path:${fontPath}`)
      throw new Error('Font file does not exist');
    }

    const { dataView } = Fon2Parser.load(fontPath);
    const info = Fon2Parser.extractInfo(dataView);
    const { widths, offset } = Fon2Parser.extractCharacterWidths(dataView, info);
    const palette = Fon2Parser.extractPalette(
      dataView,
      info.paletteSize,
      offset,
    );

    const glyphs = Fon2Parser.extractGlyphs(
      dataView,
      info,
      palette,
      widths,
      palette.offset
    )

    const glyphsMap = glyphs.glyphs.reduce((acc, glyph) => {
      acc[glyph.id] = glyph;
      return acc;
    }, {});

    const textToGenerateArray = textToCreate.split('');

    const generatedGlyphs = textToGenerateArray.map(char => {
      if (glyphsMap[char]) {
        return glyphsMap[char];
      } else {
        console.error(`Character ${char} not found in glyphs`);
        return
      }
    }).filter(c => c);

    const canvasWidth = generatedGlyphs.reduce((acc, glyph) => acc + glyph.canvas.width, 0);
    const canvasHeight = Math.max(...generatedGlyphs.map(glyph => glyph.canvas.height));

    const finalCanvas = createCanvas(canvasWidth, canvasHeight)
    finalCanvas.width = canvasWidth;
    finalCanvas.height = canvasHeight;
    const ctx = finalCanvas.getContext('2d');

    if (ctx === null) {
      throw new Error('Could not create context')
    }

    let currentX = 0;
    generatedGlyphs.forEach(glyph => {
      ctx.drawImage(glyph.canvas, currentX, 0);
      currentX += glyph.canvas.width;
    });

    const finalImageBuffer = Buffer.from(finalCanvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""), 'base64');

    return finalImageBuffer
  }
}

export const DoomText = DooMTexT
