// Traces the wordmark crop into SVG path data: node scripts/trace-logo.mjs <input.png>
import potrace from "potrace";

const input = process.argv[2];
potrace.trace(input, { threshold: 128, turdSize: 20, optTolerance: 0.4, alphaMax: 1, color: "#000" }, (err, svg) => {
  if (err) throw err;
  process.stdout.write(svg);
});
