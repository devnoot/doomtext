import { Fon2Parser } from '../lib/Fon2Parser'
import path from 'path'
import { parse_fon2 } from '../lib/parseTest.js'

async function main() {

  // load the font into a buffer, and dataview
  const fon2 = path.resolve(process.cwd(), 'fonts', 'DBIGFC.fon2')
  const { buffer: fon2b, dataView: fon2dv } = Fon2Parser.load(fon2) 

  // This gets the font info and the palette from the font data. The info returned
  // is used to extract the font data and the palette from the font file.
  const info = Fon2Parser.extractInfo(fon2dv)
  console.info('Got font info:', info)

  const palette = Fon2Parser.extractPalette(fon2dv, info.paletteSize, 12)
  console.info('Got palette:', palette)

  const characterWidths = Fon2Parser.extractCharacterWidths(fon2dv, info)
  console.info('Got character widths:', characterWidths)
  
  const res = parse_fon2(fon2dv.buffer)

  console.info(res)
  
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

main().catch((err)=>console.error(err))
