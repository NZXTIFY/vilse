// Lägger till nya platser i platser.js. Varje punkt flyttas först till närmaste bilväg (OSRM).
// Kör: node verktyg/lagg-till.mjs nya.json
// nya.json: [[lat, lng, "Ort", "Land", "region", "Träningsland (valfritt)"], ...]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FIL = fileURLToPath(new URL('../platser.js', import.meta.url));
const ORDNING = ['se', 'eu', 'am', 'as', 'af', 'oc'];
const RUBRIK = { se: 'Sverige', eu: 'Europa', am: 'Amerika', as: 'Asien', af: 'Afrika', oc: 'Oceanien' };

const window = {};
const text = readFileSync(FIL, 'utf8');
new Function('window', text)(window);
const platser = window.PLATSER;
const nya = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const finns = new Set(platser.map(p => `${p[2]}|${p[3]}`));

const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const p of nya) {
  if (finns.has(`${p[2]}|${p[3]}`)) { console.log(`${p[2]}: finns redan, hoppar över`); continue; }
  const res = await fetch(`https://router.project-osrm.org/nearest/v1/driving/${p[1]},${p[0]}?number=1`, {
    headers: { 'User-Agent': 'Vilse-geogame/1.0 (hobbyprojekt)' },
  }).then(r => r.json()).catch(() => null);
  const wp = res?.waypoints?.[0];
  if (wp) {
    p[0] = wp.location[1];
    p[1] = wp.location[0];
    if (wp.distance > 300) console.log(`${p[2]}: flyttad ${Math.round(wp.distance)} m`);
  } else {
    console.log(`${p[2]}: ingen väg hittad, behåller punkten`);
  }
  platser.push(p);
  await sleep(1100);
}

// Skriv om filen grupperad per region, i den ordning platserna redan har
const rad = p => `  [${p[0].toFixed(5)}, ${p[1].toFixed(5)}, ${JSON.stringify(p[2])}, ${JSON.stringify(p[3])}, "${p[4]}"${p[5] ? `, ${JSON.stringify(p[5])}` : ''}],`;
const ut = [text.split('window.PLATSER')[0] + 'window.PLATSER = ['];
ORDNING.forEach((region, i) => {
  if (i) ut.push('');
  ut.push(`  // ${RUBRIK[region]}`);
  platser.filter(p => p[4] === region).forEach(p => ut.push(rad(p)));
});
ut.push('];', '');
writeFileSync(FIL, ut.join('\n'));
console.log(`Klart: ${platser.length} platser`);
