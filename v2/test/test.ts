import path from 'path'
import { parse_fon2 } from '../../lib/parseFon2.js'
import fs from 'fs'
import { createCanvas } from 'canvas';

function createCombinedCanvas(canvases: any[]): string[][] {
    // Determine the total width and height of the combined canvas
    const totalWidth = canvases.reduce((sum, canvas) => sum + canvas.width, 0);
    const maxHeight = Math.max(...canvases.map(canvas => canvas.height));

    // Create the empty combined canvas
    const combinedCanvas: string[][] = Array.from({length: maxHeight}, () => Array(totalWidth).fill(' '));

    // Place each canvas side by side in the combined canvas
    let currentX = 0;
    for (const {width, height, canvas, dy} of canvases) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const targetY = y + dy;
                if (targetY >= 0 && targetY < maxHeight) {
                    combinedCanvas[targetY][currentX + x] = canvas[y][x];
                }
            }
        }
        currentX += width;
    }

    return combinedCanvas;
}

interface DoomtextArgs {
  fontPath: string
  textToGenerate: string
  outputPath: string
}

async function Doomtext(args: DoomtextArgs) {

  const { fontPath, textToGenerate, outputPath } = args

  const fon2fp = path.resolve(fontPath)
  const fon2b = fs.readFileSync(fon2fp)
  const fon2dv = new DataView(new Uint8Array(fon2b).buffer)
  const fon2 = parse_fon2(fon2dv.buffer)

  // iterate through textToGenerate and find the glyphs
  let result: any[] = [];
  for (let i = 0; i < textToGenerate.length; i++) {
    const charCode = textToGenerate[i].toUpperCase();
    // @ts-ignore
    const glyph = fon2.glyphs[charCode];
    if (glyph) {
      result.push(glyph)
    } else {
      console.warn(`Unknown character ${charCode}`)
    }
  }

  console.info(`Generated glyphs for "${textToGenerate}":`);

  // result now contains an array of glyphs, and each glyph
  // has a canvas, we can now use this to construct the final
  // image
  const totalWidth = result.reduce((acc, curr) => acc + curr.width, 0)

  const resultCanvas = createCanvas(totalWidth, fon2.line_height)
  const resultCtx = resultCanvas.getContext('2d')

  let offsetX = 0

  for (let i = 0; i < result.length; i++) {
    const glyphWidth = result[i].width
    const glyphCanvas = result[i].canvas

    // if (i !== 0 || i === result.length - 1) {
    // }

    offsetX += glyphWidth

    resultCtx.drawImage(
      glyphCanvas, 
      glyphWidth + offsetX, 
      0)
  } 

  fs.writeFileSync(outputPath, 
    resultCanvas.toBuffer()
  )

  // const { glyphs } = Fon2Parser.extractGlyphs(
  //   fon2dv, 
  //   info, 
  //   palette, 
  //   characterWidths.widths, 
  //   palette.offset 
  // )

  // console.info(`Extracted ${glyphs.length} glyphs`)
  // console.info(glyphs[0])

  // fs.writeFileSync('1.png', glyphs[0].img)
  // fs.writeFileSync('2.png', glyphs[1].img)
  // fs.writeFileSync('3.png', glyphs[2].img)
  // fs.writeFileSync('4.png', glyphs[3].img)
  // fs.writeFileSync('5.png', glyphs[4].img)

  // const paletteOffset = 12 // assume palette starts right after initial header

  // extract the palette from the font data
  // const palette = Fon2Parser.extractPalette(fon2dv, info.paletteSize, paletteOffset)

  // const glyphOffset = paletteOffset + (info.paletteSize + 1) * 3;

  // const n0 = fon2dv.getUint8(6);
  // const n1 = fon2dv.getUint8(7);

  // const offsets = { p: glyphOffset, n0, n1 };
  // console.info(offsets)

  // const widths: number[] = []
  // if (info.constantWidth) {
    // const width = fon2dv.getUint16(glyphOffset, true)
  // } else {
    // const width = fon2dv.getUint16(glyphOffset, true)
  // }

  // const glyphs = Fon2Parser.renderGlyphs(
  //   data,
  //   buffer,
  //   offsets,
  //   [],
  //   palette.palette,
  //   paletteSize
  // )

  // console.info(glyphs)
}

Doomtext({
  fontPath: '/home/anthony/src/devnoot/doomtext/fonts/DBIGFC.fon2',
  outputPath: 'ripandtear.png',
  textToGenerate: 'RipAndTear'
}).catch((err)=>console.error(err))
