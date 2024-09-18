const { Fon2Parser } = require("../dist/Fon2Parser")
const path = require('path')

test("It should load the fon2 file and return a buffer and dataview", () => {
  const f = Fon2Parser.load(path.resolve("lib/fonts/04FONTOK.fon2"));
  expect(f).toHaveProperty("buffer");
  expect(f).toHaveProperty("dataView");
});

test("It should extract info from a fon2 dataview", () => {
  const { dataView: dv } = Fon2Parser.load(path.resolve("lib/fonts/DBIGFONT-freedoom.fon2"));
  const f = Fon2Parser.extractInfo(dv);
  expect(f).toHaveProperty("identifier");
  expect(f).toHaveProperty("characterHeight");
  expect(f).toHaveProperty("firstCharIndex");
  expect(f).toHaveProperty("lastCharIndex");
  expect(f).toHaveProperty("constantWidth");
  expect(f).toHaveProperty("shadingType");
  expect(f).toHaveProperty("paletteSize");
  expect(f).toHaveProperty("hasKerningInfo");
});
