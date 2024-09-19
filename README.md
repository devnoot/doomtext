# DooMTexT

Generate DooM style text in node.js

## Installation

```
npm i doomtext
```

## Usage

The `doomtext` package exposes a class, `DooMTexT`, which itself exposes the static method, `generate`.

You will need to pass a font name, and the text you want to create to `DooMTexT.generate()`

*The font you pass to the the `generate` method MUST by one of the fonts in font list below.*

### Sample Code

```ts
import { DooMTexT } from 'doomtext'
import { writeFileSync } from 'fs'

// Set the font. It must be a font from the font list.
const font = "ZD2012"
const myText = "Rip and tear. Until it is done!"

// create the image, you can also use DoomText.generate()
// this will return an image buffer
const myDoomText = DooMTexT.generate(font, myText)

// save the file
writeFileSync(myText + '.png', myDoomText)
```

### Font list

*Some of these fonts do not have a full character set.*

- 04FONTOK
- APOS_BOK
- DBIGFC
- DBIGFONT-chex
- DBIGFONT-freedoom
- DBIGSQ
- DOOM93_2
- ESFONTAA
- GRGW_LBO
- JENOBIG
- MINECSL2
- MINIPLWK
- MM2FONTO
- MM2SFNTO
- Q2SMFONK
- SLSKFONT
- SMSKFONT
- STAT_LWR
- STATBLWS
- TORMENTK
- UNRC
- ZD2012
