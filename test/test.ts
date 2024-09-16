import { Fon2Parser } from '../lib/Fon2Parser'
import path from 'path'

async function main() {
  const fontPath = path.resolve(process.cwd(), 'fonts', 'DBIGFONT-freedoom.fon2')
  Fon2Parser.load(fontPath)
}

main().catch((err)=>console.error(err))
