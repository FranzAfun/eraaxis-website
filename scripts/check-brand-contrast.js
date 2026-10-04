import fs from "node:fs";

// WCAG 2.x: alpha-composite encoded sRGB before converting to relative luminance.
export const rgb = (hex) => hex.replace("#", "").match(/../g).map((v) => parseInt(v, 16));
export const mix = (a, b, alpha) => a.map((v, i) => alpha * v + (1 - alpha) * b[i]);
const linear = (v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
export const luminance = (c) => c.reduce((sum, v, i) => sum + linear(v / 255) * [0.2126, 0.7152, 0.0722][i], 0);
export const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
const css = fs.readFileSync(new URL("../src/styles/theme.css", import.meta.url), "utf8");
const token = (name) => rgb(css.match(new RegExp(`--color-${name}:\\s*(#[a-f0-9]{6})`, "i"))[1]);
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const pairs = [];
const add = (role, foreground, background, threshold = 4.5) => {
  const value = contrast(foreground, background);
  pairs.push({ role, foreground: hex(foreground), background: hex(background), ratio: value, threshold, pass: value >= threshold });
};
const white = rgb("FFFFFF");
const black = token("background-dark");
const primary = token("primary");
const deep = token("primary-deep");
const accent = token("accent");
const glassBase = token("surface-dark");
const foundation = process.argv.includes("--foundation");
const paletteOnly = process.argv.includes("--palette");
const light = [white, token("surface-tint-top"), token("surface-tint-strong"), token("surface-soft"), mix(primary, white, 0.1)];
if (foundation) {
  for (const background of light) add("new essential UI edge", token("ui-border"), background, 3);
  for (const background of [black, deep, primary]) add("new pale dark words", token("text-on-dark-muted"), background);
  add("new light success words", token("success-text"), mix(rgb("00BC7D"), white, 0.1));
  add("new dark success words", token("success-text-dark"), mix(rgb("00BC7D"), black, 0.1));
  add("new dark error words", token("error-text-dark"), black);
  add("new required/error words", token("field-danger"), white);
  add("new rating marks", token("rating"), white, 3);
} else {
  for (const background of [...light, ...[0.05, 0.06, 0.08].map((alpha) => mix(primary, white, alpha))]) {
    for (const name of ["text-primary", "text-secondary", "text-muted", "primary", "primary-deep", "primary-light"]) add(name + " on light", token(name), background);
    for (const name of ["text-primary", "text-secondary", "text-muted", "primary", "primary-deep", "primary-light"]) add(name + " below header shadow bound", token(name), mix(rgb("000000"), background, 0.01));
    add("focus / essential edge", primary, background, 3);
    add("essential UI outline", token("ui-border"), background, 3);
  }
  for (const name of ["primary", "primary-dark", "primary-deep", "primary-soft", "primary-light"]) add("white button / hover / disabled on " + name, white, token(name));
  for (const background of [black, deep, primary, ...[0.05, 0.08].map((alpha) => mix(white, black, alpha)), mix(accent, primary, 0.14)]) {
    add("pale secondary dark words", token("text-on-dark-muted"), background);
    add("accent on dark", accent, background);
    add("white dark words", white, background);
    add("dark focus / offset edge", token("text-on-dark-muted"), background, 3);
  }
  if (!paletteOnly) {
  const alpha = Number(css.match(/--header-opacity:\s*([.\d]+)/)[1]);
  const glass = mix(glassBase, white, alpha);
  const dropdown = mix(white, glass, 0.1);
  const drawerRow = mix(white, glass, 0.08);
  for (const [name, background] of [["glass", glass], ["dropdown", dropdown], ["drawer active row", drawerRow]]) {
    add("active lilac " + name, accent, background);
    add("white82% inactive " + name, mix(white, background, 0.82), background);
    add("white70% focus " + name, mix(white, background, 0.7), background, 3);
  }
  add("drawer muted60%", mix(white, glass, 0.6), glass);
  add("drawer active icon", accent, mix(accent, drawerRow, 0.15), 3);
  add("drawer inactive85% hover", mix(white, dropdown, 0.85), dropdown);
  add("dark focus ring against offset", mix(white, glass, 0.7), glassBase, 3);
  const lower = mix(white, mix(glassBase, white, alpha - 0.000001), 0.1);
  if (contrast(accent, lower) >= 4.5) throw new Error("Header opacity is no longer the lowest passing six-decimal value.");
  }
  for (const background of light) {
    add("required / error words", token("field-danger"), background);
    add("invalid focus ring", token("field-danger"), background, 3);
  }
  add("newsletter light success words and icon", token("success-text"), mix(rgb("00BC7D"), white, 0.1));
  add("newsletter dark success words and icon", token("success-text-dark"), mix(rgb("00BC7D"), black, 0.1));
  add("newsletter dark error", token("error-text-dark"), black);
  add("newsletter dark already-subscribed / helper", token("text-on-dark-muted"), black);
  add("light server error summary", rgb("C10007"), rgb("FEF2F2"));
  add("light required / invalid summary", token("field-danger"), rgb("FEF2F2"));
  for (const alpha of [0.08, 0.12]) {
    add("hero secondary button white " + alpha, white, mix(white, mix(black, white, 0.65), alpha));
  }
  add("rating selected", token("rating"), white, 3);
  add("rating unselected", token("ui-border"), white, 3);
  add("radio unselected", token("ui-border"), white, 3);
  add("invalid dark focus edge", token("field-danger"), black, 3);
  add("primary ring against white offset", primary, white, 3);
  add("pale dark ring against dark offset", token("text-on-dark-muted"), glassBase, 3);
  add("gallery selection ring against dark offset", accent, black, 3);
  add("caption white words on white-photo bound", white, mix(glassBase, white, 0.85));
  add("caption pale words on white-photo bound", token("text-on-dark-muted"), mix(glassBase, white, 0.85));
  add("hero white on white-photo bound", white, mix(black, white, 0.65));
  add("hero pale on white-photo bound", token("text-on-dark-muted"), mix(black, white, 0.65));
  add("hero pale badge on white-photo bound", token("accent-text-on-hero"), mix(accent, mix(black, white, 0.65), 0.1));
  add("choice white85% description", mix(white, primary, 0.85), primary);
  add("choice white selection mark", white, mix(white, primary, 0.15), 3);
  add("dark selected accent edge vs primary", accent, primary, 3);
  add("dark selected accent edge vs surround", accent, black, 3);
}
const result = { phase: foundation ? "foundation" : "implemented", pairs, failures: pairs.filter((p) => !p.pass) };
const output = process.argv.indexOf("--out");
if (output >= 0) fs.writeFileSync(process.argv[output + 1], JSON.stringify(result, null, 2));
console.log(JSON.stringify({ phase: result.phase, pairs: pairs.length, minimum: Math.min(...pairs.map((p) => p.ratio)), failures: result.failures }));
if (result.failures.length) process.exitCode = 1;
