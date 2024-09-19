const { DooMTexT } = require("../dist/DoomText");
const { writeFileSync }= require('fs')

test("generate an image from text using fonts in dist/fonts", () => {
  const font = "ZD2012"
  const myText = "Rip and tear. Until it is done!"
  const myDoomText = DooMTexT.generate(font, myText)
  expect(myDoomText).toBeDefined()
});
