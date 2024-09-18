const { decodeRle, getLightness } = require("../dist/utils");
const { isGeneratorObject } = require("util/types");

test("ensures getLightness returns a number", () => {
  expect(getLightness(123, 200, 23)).toEqual(expect.any(Number));
});
