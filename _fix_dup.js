const fs = require("fs");
let c = fs.readFileSync("src/sections/hero-3d-gallery.tsx", "utf8");

// Remove duplicate lines: find "}[];" and everything after until the next "}"
const dupeIdx = c.indexOf("}[];");
if (dupeIdx !== -1) {
  const afterDupe = c.indexOf("};", dupeIdx + 4);
  if (afterDupe !== -1) {
    c = c.substring(0, dupeIdx + 1) + c.substring(afterDupe + 2);
  }
}

fs.writeFileSync("src/sections/hero-3d-gallery.tsx", c);
console.log("DONE");
