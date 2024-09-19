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

#### 04FONTOK

<img src="images/04FONTOK.png" width="600" alt="04FONTOK" />

#### APOS_BOK

<img src="images/APOS_BOK.png" width="600" alt="APOS_BOK" />

#### DOOM93_2

<img src="images/DOOM93_2.png" width="600" alt="DOOM93_2" />

#### GRGW_LBO

<img src="images/GRGW_LBO.png" width="600" alt="GRGW_LBO" />

#### JENOBIG

<img src="images/JENOBIG.png" width="600" alt="JENOBIG" />

#### MINECSL2

<img src="images/MINECSL2.png" width="600" alt="MINECSL2" />

#### Q2SMFONK

<img src="images/Q2SMFONK.png" width="600" alt="Q2SMFONK" />

#### STAT_LWR

<img src="images/STAT_LWR.png" width="600" alt="STAT_LWR" />

#### STATBLWS

<img src="images/STATBLWS.png" width="600" alt="STATBLWS" />

#### TORMENTK

<img src="images/TORMENTK.png" width="600" alt="TORMENTK" />

#### ZD2012

<img src="images/ZD2012.png" width="600" alt="ZD2012" />

