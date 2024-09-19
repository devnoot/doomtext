export type Color = [number, number, number];

export interface Fon2Info {
  identifier: string;
  characterHeight: number;
  firstCharIndex: number;
  lastCharIndex: number;
  constantWidth: boolean;
  shadingType: number;
  paletteSize: number;
  hasKerningInfo: boolean;
}

export interface Fon2Palette {
    palette: Color[]
    minLightness: number
    maxLightness: number
    offset: number
}

export interface Fon2Glyph {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  dy: number;
}

export interface Fon2Img {
}