// Flyttar varje plats i platser.js till närmaste bilväg (OSRM:s nearest-tjänst på OpenStreetMap-data),
// så att Street View väljer Googles egna gatubilder i stället för inomhusfoton.
// Kör: node verktyg/snappa.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FIL = fileURLToPath(new URL('../platser.js', import.meta.url));
const SERVRAR = [
  'https://router.project-osrm.org/nearest/v1/driving/',
  'https://routing.openstreetmap.de/routed-car/nearest/v1/driving/',
];

const window = {};
new Function('window', readFileSync(FIL, 'utf8'))(window);
const platser = window.PLATSER;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function narmasteVag(lat, lng, n) {
  for (let forsok = 0; forsok < 6; forsok++) {
    const url = `${SERVRAR[(n + forsok) % SERVRAR.length]}${lng},${lat}?number=1`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Vilse-geogame/1.0 (hobbyprojekt)' } });
      if (res.ok) {
        const data = await res.json();
        if (data.code === 'Ok' && data.waypoints.length) return data.waypoints[0];
      }
      console.warn(`  ${url} svarade ${res.status}`);
    } catch (e) {
      console.warn(`  fel: ${e.message}`);
    }
    await sleep(1500 * 2 ** forsok);
  }
  return null;
}

const nya = platser.map(p => [...p]);
for (let i = 0; i < platser.length; i++) {
  const [lat, lng, ort] = platser[i];
  const wp = await narmasteVag(lat, lng, i);
  if (wp) {
    nya[i][0] = wp.location[1];
    nya[i][1] = wp.location[0];
    if (wp.distance > 300) console.log(`  ${ort}: flyttad ${Math.round(wp.distance)} m till ${wp.name || 'namnlös väg'}`);
  } else {
    console.log(`  ${ort}: ingen väg hittad, behåller punkten`);
  }
  if (i % 50 === 49) console.log(`${i + 1}/${platser.length}`);
  await sleep(600);
}

// Skriv tillbaka filen med samma rubriker
const RUBRIK = { se: 'Sverige', eu: 'Europa', am: 'Amerika', as: 'Asien', af: 'Afrika', oc: 'Oceanien' };
const ut = [readFileSync(FIL, 'utf8').split('window.PLATSER')[0] + 'window.PLATSER = ['];
let region = null;
for (const p of nya) {
  if (p[4] !== region) { if (region) ut.push(''); ut.push(`  // ${RUBRIK[p[4]]}`); region = p[4]; }
  ut.push(`  [${p[0].toFixed(5)}, ${p[1].toFixed(5)}, ${JSON.stringify(p[2])}, ${JSON.stringify(p[3])}, "${p[4]}"],`);
}
ut.push('];', '');
writeFileSync(FIL, ut.join('\n'));
console.log('Klart, platser.js uppdaterad');
