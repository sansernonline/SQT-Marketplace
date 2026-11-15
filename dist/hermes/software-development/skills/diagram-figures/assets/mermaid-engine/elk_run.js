// from diagram-figures/assets/mermaid-engine
// Lay out an ELK graph read from stdin and print the result. Needs elkjs (NODE_PATH).
const ELK = require("elkjs/lib/elk.bundled.js");
let s = "";
process.stdin.on("data", d => (s += d));
process.stdin.on("end", () =>
  new ELK().layout(JSON.parse(s)).then(g => process.stdout.write(JSON.stringify(g)))
    .catch(e => { console.error(e); process.exit(1); }));
