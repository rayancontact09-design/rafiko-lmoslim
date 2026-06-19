import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

const GOLD = "#D9B65C";
const GOLD_LIGHT = "#EAD49A";
const EMERALD_LIGHT = "#16805F";
const EMERALD_DEEP = "#0A4A38";

function minaret(cx, top, bottom, width, capR) {
  const half = width / 2;
  return `
    <rect x="${cx - half}" y="${top}" width="${width}" height="${bottom - top}" />
    <circle cx="${cx}" cy="${top}" r="${capR}" />
    <rect x="${cx - 2}" y="${top - capR - 22}" width="4" height="22" />
  `;
}

function crescent(cx, cy, r) {
  const innerR = r * 0.72;
  const offset = r * 0.42;
  return `
    <mask id="crescentMask-${cx}-${cy}">
      <rect x="${cx - r - 4}" y="${cy - r - 4}" width="${(r + 4) * 2}" height="${(r + 4) * 2}" fill="white" />
      <circle cx="${cx + offset}" cy="${cy - offset * 0.5}" r="${innerR}" fill="black" />
    </mask>
    <circle cx="${cx}" cy="${cy}" r="${r}" mask="url(#crescentMask-${cx}-${cy})" />
  `;
}

function domeWithDoorway(cx, drumTop, drumBottom, drumHalfWidth, domeR) {
  const drumLeft = cx - drumHalfWidth;
  const drumRight = cx + drumHalfWidth;
  const doorHalf = 25;
  const doorTopY = drumBottom - 80 + 25;
  const drumPath = `M${drumLeft},${drumTop} L${drumRight},${drumTop} L${drumRight},${drumBottom} L${drumLeft},${drumBottom} Z`;
  const doorPath = `M${cx - doorHalf},${drumBottom} L${cx - doorHalf},${doorTopY} A${doorHalf},${doorHalf} 0 0 1 ${cx + doorHalf},${doorTopY} L${cx + doorHalf},${drumBottom} Z`;
  const domePath = `M${drumLeft},${drumTop} A${domeR},${domeR} 0 0 1 ${drumRight},${drumTop} Z`;
  return `
    <path d="${drumPath} ${doorPath}" fill-rule="evenodd" />
    <path d="${domePath}" />
  `;
}

function mosqueMark(cx, cy, color) {
  const baseBottom = cy + 150;
  const baseTop = baseBottom - 50;
  const drumHalfWidth = 85;
  const drumTop = baseTop - 110;
  const domeR = 85;
  const domeApex = drumTop - domeR;
  const finialTop = domeApex - 40;
  const crescentCy = finialTop - 22;

  const leftMinaretX = cx - 145;
  const rightMinaretX = cx + 145;
  const minaretTop = baseTop - 100;

  return `
    <g fill="${color}">
      ${minaret(leftMinaretX, minaretTop, baseBottom, 30, 19)}
      ${minaret(rightMinaretX, minaretTop, baseBottom, 30, 19)}
      <rect x="${cx - 200}" y="${baseTop}" width="400" height="50" rx="12" />
      ${domeWithDoorway(cx, drumTop, baseTop, drumHalfWidth, domeR)}
      <rect x="${cx - 6}" y="${finialTop}" width="12" height="${domeApex - finialTop}" />
      ${crescent(cx, crescentCy, 22)}
    </g>
  `;
}

function ring(cx, cy, color, ringR = 330, ringWidth = 14) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="${color}" stroke-width="${ringWidth}" />
    <circle cx="${cx}" cy="${cy}" r="${ringR - ringWidth * 2.6}" fill="none" stroke="${color}" stroke-width="2" opacity="0.6" />
  `;
}

function svgDoc(size, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${inner}</svg>`;
}

const backgroundDefs = `
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="${EMERALD_LIGHT}" />
      <stop offset="100%" stop-color="${EMERALD_DEEP}" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${GOLD_LIGHT}" />
      <stop offset="100%" stop-color="${GOLD}" />
    </linearGradient>
  </defs>
`;

const goldMark = `${ring(512, 512, "url(#goldGrad)")}${mosqueMark(512, 512, "url(#goldGrad)")}`;
const blackMark = mosqueMark(512, 512, "#000000");
const blackRing = ring(512, 512, "#000000");

const icon = svgDoc(1024, `${backgroundDefs}<rect width="1024" height="1024" fill="url(#bgGrad)" />${goldMark}`);
const adaptiveForeground = svgDoc(1024, `${backgroundDefs}${goldMark}`);
const adaptiveBackground = svgDoc(1024, `${backgroundDefs}<rect width="1024" height="1024" fill="url(#bgGrad)" />`);
const monochrome = svgDoc(1024, `${blackRing}${blackMark}`);
const splash = svgDoc(1024, `${backgroundDefs}${goldMark}`);
const favicon = svgDoc(256, `${backgroundDefs}<rect width="1024" height="1024" fill="url(#bgGrad)" />${goldMark}`);

const outDir = fileURLToPath(new URL("../assets/", import.meta.url));
mkdirSync(outDir, { recursive: true });

const jobs = [
  ["icon.png", icon, 1024, true],
  ["android-icon-foreground.png", adaptiveForeground, 1024, false],
  ["android-icon-background.png", adaptiveBackground, 1024, true],
  ["android-icon-monochrome.png", monochrome, 1024, false],
  ["splash-icon.png", splash, 1024, false],
  ["favicon.png", favicon, 256, true],
];

for (const [name, svg, size, flatten] of jobs) {
  let pipeline = sharp(Buffer.from(svg), { density: 384 }).resize(size, size);
  if (flatten) pipeline = pipeline.flatten({ background: EMERALD_DEEP });
  await pipeline.png().toFile(outDir + name);
  console.log("generated", name);
}
