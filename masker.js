// Masker som döljer klubbens namn i märket i Hemmaplan på svårighetsgraden Svårt.
// Bilden ändras inte: spelet lägger färgade ytor ovanpå märket när det visas.
//
// Varje klubb har en lista med ytor. x och bredd räknas i procent av bildens bredd, y och höjd i procent
// av bildens höjd, och radier i procent av bredden (så att en cirkel blir rund även i en avlång bild).
//   ['r', x, y, bredd, höjd, färg]                          rektangel
//   ['o', cx, cy, yttre radie, inre radie, färg]            ring (inre radie 0 ger en hel cirkel)
//   ['b', cx, cy, yttre radie, inre radie, från, till, färg]  del av en ring, vinklar i grader medurs från klockan 12
// Färgen 'bg' är bakgrunden bakom märket, för text som står utanför själva märket.
// Koordinaterna går att ta fram och kontrollera i verktyg/masker.html.
window.MASKER = {
  'Malmö FF': [['r', 0, 65.5, 100, 22.5, 'bg']],
  'Manchester United FC': [['b', 50, 52, 45, 33, -70, 70, '#da020e'], ['b', 50, 35, 58, 42, 150, 210, '#da020e']],
  'Chelsea FC': [['b', 50, 50, 46, 30, -62, 62, '#051495']],
  'Arsenal FC': [['r', 14, 12, 72, 20, '#ef0107']],
  'FC Bayern München': [['o', 50, 50, 47, 31.8, '#ed0038']],
};

// Lägger märket (en laddad <img>) i en ram med bildens egna proportioner och ritar maskerna ovanpå
window.maskeraMarke = function (bild, masker) {
  const ns = 'http://www.w3.org/2000/svg';
  const k = bild.naturalWidth / bild.naturalHeight || 1;
  const hojd = 100 / k;   // ritytan är 100 enheter bred och lika hög som bilden i samma enheter
  const Y = y => y / 100 * hojd;
  const ram = document.createElement('div');
  ram.className = 'maskram';
  // Märket visas i en kvadrat: en bred bild fyller bredden, en hög bild får bredden som gör den lika hög som kvadraten
  ram.style.aspectRatio = `${bild.naturalWidth} / ${bild.naturalHeight}`;
  ram.style.width = `${Math.min(1, k) * 100}%`;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 100 ${hojd}`);
  svg.setAttribute('aria-hidden', 'true');
  const punkt = (cx, cy, r, v) => [cx + r * Math.sin(v * Math.PI / 180), cy - r * Math.cos(v * Math.PI / 180)].map(t => +t.toFixed(2)).join(' ');
  for (const m of masker) {
    const el = document.createElementNS(ns, 'path');
    let d = '';
    if (m[0] === 'r') {
      d = `M${m[1]} ${Y(m[2])}h${m[3]}v${Y(m[4])}h${-m[3]}z`;
    } else if (m[0] === 'o') {
      const [, cx, cyp, r1, r2] = m, cy = Y(cyp);
      const cirkel = r => r > 0 ? `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z` : '';
      d = cirkel(r1) + cirkel(r2);
      el.setAttribute('fill-rule', 'evenodd');
    } else if (m[0] === 'b') {
      const [, cx, cyp, r1, r2, fran, till] = m, cy = Y(cyp);
      const stor = till - fran > 180 ? 1 : 0;
      d = `M${punkt(cx, cy, r1, fran)}A${r1} ${r1} 0 ${stor} 1 ${punkt(cx, cy, r1, till)}`
        + `L${punkt(cx, cy, r2, till)}A${r2} ${r2} 0 ${stor} 0 ${punkt(cx, cy, r2, fran)}z`;
    }
    el.setAttribute('d', d);
    const farg = m[m.length - 1];
    if (farg === 'bg') el.style.fill = 'var(--maskbakgrund, #fff)';
    else el.setAttribute('fill', farg);
    svg.appendChild(el);
  }
  ram.append(bild, svg);
  return ram;
};
