import fs from 'fs'
import path from 'path'

export class Fon2Parser {

  public static load(fontPath: string) {
    const fontToLoad = path.resolve(process.cwd(), 'fonts', 'DBIGFONT-freedoom.fon2')
    console.info(`Font path: ${fontToLoad}`)

    const buffer = fs.readFileSync(fontToLoad)
    console.info(`Loaded font: ${fontToLoad}`)

    console.info(buffer)
  }

}