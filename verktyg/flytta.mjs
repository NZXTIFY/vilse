// Ger enskilda platser en ny startpunkt och flyttar den till närmaste bilväg.
// Kör: node verktyg/flytta.mjs "Umeå=63.83,20.24" "Falun=60.60,15.645"
// Ta bort en plats: node verktyg/flytta.mjs "Tamale=bort"
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FIL = fileURLToPath(new URL('../platser.js', import.meta.url));
let text = readFileSync(FIL, 'utf8');

for (const arg of process.argv.slice(2)) {
  const [ort, varde] = arg.split('=');
  const rad = new RegExp(`^  \\[[-\\d.]+, [-\\d.]+, ${JSON.stringify(ort).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},.*\\n`, 'm');
  if (!rad.test(text)) { console.log(`${ort}: hittades inte`); continue; }
  if (varde === 'bort') {
    text = text.replace(rad, '');
    console.log(`${ort}: borttagen`);
    continue;
  }
  const [lat, lng] = varde.split(',').map(Number);
  const res = await fetch(`https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}?number=1`, {
    headers: { 'User-Agent': 'Vilse-geogame/1.0 (hobbyprojekt)' },
  });
  const data = await res.json();
  const wp = data.waypoints?.[0];
  if (!wp) { console.log(`${ort}: ingen väg hittad`); continue; }
  const [nyLng, nyLat] = wp.location;
  text = text.replace(rad, m => m.replace(/^  \[[-\d.]+, [-\d.]+,/, `  [${nyLat.toFixed(5)}, ${nyLng.toFixed(5)},`));
  console.log(`${ort}: ${nyLat.toFixed(5)}, ${nyLng.toFixed(5)} (${wp.name || 'namnlös väg'}, ${Math.round(wp.distance)} m från startpunkten)`);
  await new Promise(r => setTimeout(r, 1100));
}
writeFileSync(FIL, text);
