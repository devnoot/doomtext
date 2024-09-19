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

export interface Fon2Img {}

export type DoomFont =
  | "04FONTOK"
  | "APOS_BOK"
  | "DBIGFC"
  | "DBIGFONT-chex"
  | "DBIGFONT-freedoom"
  | "DBIGSQ"
  | "DOOM93_2"
  | "ESFONTAA"
  | "GRGW_LBO"
  | "JENOBIG"
  | "MINECSL2"
  | "MINIPLWK"
  | "MM2FONTO"
  | "MM2SFNTO"
  | "Q2SMFONK"
  | "SLSKFONT"
  | "SMSKFONT"
  | "STAT_LWR"
  | "STATBLWS"
  | "TORMENTK"
  | "UNRC"
  | "ZD2012"
