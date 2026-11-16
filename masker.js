// Masker som döljer klubbens namn i märket i Hemmaplan på svårighetsgraden Svårt.
// Bilden ändras inte: spelet lägger färgade ytor ovanpå märket när det visas.
//
// Varje klubb har en lista med ytor. x och bredd räknas i procent av bildens bredd, y och höjd i procent
// av bildens höjd, och radier i procent av bredden (så att en cirkel blir rund även i en avlång bild).
//   ['r', x, y, bredd, höjd, färg]                          rektangel
//   ['r', x, y, bredd, höjd, färg, vinkel]                  rektangel vriden runt sin mitt (grader medurs)
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
  'Paris Saint-Germain': [['b', 50, 50, 41, 20.5, -52, 52, '#004170'],['b', 50, 50, 45, 32, 118, 242, '#004170']],
  'Olympique Lyonnais': [['r', 8, 6, 84, 25, '#f40043']],
  'Lille OSC': [['r', 20, 72, 60, 19, '#e01e13']],
  'OGC Nice': [['r', 15, 3, 70, 38, '#1a171c']],
  'RC Lens': [['r', 3, 6, 94, 13, '#000000']],
  'RC Strasbourg': [['o', 50, 50, 46.5, 33, '#009fe3']],
  'SS Lazio': [['r', 10, 7, 82, 20, '#ffffff']],
  'Parma Calcio 1913': [['r', 6, 2.5, 88, 13, '#ffcf01']],
  'AS Roma': [['r', 14, 55, 72, 17, '#970a2c']],
  'Udinese Calcio': [['b', 49, 49, 33, 20, -102, 102, '#b2b3b5']],
  'Cagliari Calcio': [['r', 12, 6, 71.5, 18, '#b01028'], ['r', 83.5, 6, 6, 18, '#082242']],
  'AS Monaco FC': [['r', 12, 36, 76, 12, '#ffffff']],
  'Valencia CF': [['r', 7, 31, 86, 12, '#0097d7']],
  'Athletic Bilbao': [['r', 5, 2, 90, 13, '#ffffff'], ['r', 29.5, 78, 27, 11, '#ffffff', 31], ['r', 53.5, 75.5, 22, 11, '#ffffff', -43]],
  'RCD Espanyol': [['o', 50, 64.7, 50, 34, '#e01217']],
  'RC Deportivo de La Coruña': [['b', 45.5, 61.5, 39.5, 29, -78, 78, '#ffffff'], ['b', 45.5, 61.5, 39.5, 29, 145, 218, '#ffffff']],
  'Levante UD': [['r', 11, 45.5, 78, 11, '#ffffff', -14]],
  'Manchester City FC': [['o', 50, 50, 46.5, 33, '#ffffff']],
  'Aston Villa FC': [['r', 13, 69, 74, 19, '#94bee5']],
  'Tottenham Hotspur FC': [['r', 0, 75, 100, 25, 'bg']],
  'Everton FC': [['r', 22, 53, 56, 16, '#00009e']],
  'Newcastle United FC': [['r', 14, 85, 72, 11, '#41b6e6']],
  'Crystal Palace FC': [['b', 50, 30.4, 82.5, 70.5, 146, 214, '#1b458f']],
  'Bayer 04 Leverkusen': [['o', 50.8, 51.5, 21, 0, '#ffffff'], ['o', 50.8, 51.5, 23.6, 21, '#1b181c'], ['r', 17, 74.5, 66, 16.5, '#ffe500']],
  '1. FC Köln': [['r', 18, 76, 28, 12, '#1d1d1b']],
  'TSG 1899 Hoffenheim': [['r', 13, 41, 60, 12, '#105ba6', -52], ['r', 27, 52, 56, 10.5, '#ffffff', -52]],
  'RB Leipzig': [['r', 29, 57, 42, 32, '#ffffff']],
  'Deportivo Alavés': [['o', 50, 50, 47.5, 33.5, '#0232a0']],
  'Brentford FC': [['o', 50, 50, 47.5, 33.5, '#c10000']],
  'Brighton & Hove Albion FC': [['b', 50, 50, 47, 33, -80, 80, '#ffffff'], ['b', 50, 50, 47, 33, 135, 225, '#ffffff']],
  'Coventry City FC': [['r', 20, 1.5, 64, 9, '#ffffff']],
  'Hull City AFC': [['r', 12, 3, 76, 15, '#101920']],
  'Ipswich Town FC': [['r', 12, 7, 76, 11, '#1b3c8c']],
  'Como 1907': [['r', 20, 32, 60, 23, '#1b3b63']],
  'Frosinone Calcio': [['r', 2, 2.5, 96, 11, '#ffdd00']],
  'Elche CF': [['r', 27, 30.5, 46, 8.5, '#f3d36b']],
  'Getafe CF': [['b', 50.8, 49, 46.5, 33, 95, 265, '#1d5aa8']],
  'Málaga CF': [['r', 6, 26, 98, 15, '#ffffff', -29]],
  'Racing de Santander': [['o', 50.5, 64.5, 46, 32.5, '#ffffff']],
  'US Lecce': [['r', 14, 2, 72, 24, '#002856']],
  'AC Monza': [['r', 14, 22, 72, 22, '#ed1639']],
  'US Sassuolo Calcio': [['r', 16, 41, 76, 12, '#000000']],
  '1. FC Union Berlin': [['r', 57.5, 0, 42.5, 100, 'bg']],
  'Angers SCO': [['r', 24, 3, 52, 9.5, '#ffffff']],
  'SC Paderborn 07': [['r', 0, 31, 88, 24, '#ffffff']],
  'AJ Auxerre': [['r', 6, 5, 88, 13, '#004ea2']],
  'Le Mans FC': [['r', 10, 3.5, 80, 16, '#130a15']],
  'FC Lorient': [['r', 5, 30, 90, 13, '#231f20']],
  'Paris FC': [['r', 9, 7, 80, 17, '#0a0f2d']],
  'Toulouse FC': [['o', 50, 50, 47.5, 33.5, '#38284f']],
  'ES Troyes AC': [['r', 13, 22, 74, 29, '#006eb2']],
  // Lag utanför Europa
  'Racing Club': [['r', 10, 7, 80, 15, '#029cdc']],
  'Corinthians': [['o', 50, 50, 26.5, 19, '#000000']],
  'Palmeiras': [['b', 50, 50, 45, 0, 83, 277, '#006437']],
  'Internacional': [['b', 51.5, 50, 45.5, 32, -150, 150, '#ffffff']],
  'Chivas Guadalajara': [['b', 50, 62, 42.5, 33, 48, 312, '#002856']],
  'Cruz Azul': [['o', 50, 50, 47, 33, '#212452']],
  'Tigres de la UANL': [['r', 3, 4, 94, 25, '#0b358f'], ['r', 18, 76, 64, 18, '#ffbd00']],
  'Al Nassr FC': [['o', 50, 50, 47, 34, '#081c4e']],
  'Al-Ittihad': [['r', 19, 15, 30, 15, '#fef201'], ['r', 8, 73, 88, 11, '#fef201']],
  'Los Angeles Galaxy': [['r', 20, 64, 60, 10, '#ffce02']],
  'Los Angeles FC': [['r', 15, 9.5, 70, 9, '#17191d']],
  'Grêmio': [['r', 13, 47, 74, 20, '#000000']],
  'Colo-Colo': [['r', 2, 61, 92.5, 18, '#d01f39']],
  'Sunderland AFC': [['r', 24, 84, 53, 13, '#eb172b']],
  'AFC Bournemouth': [['r', 4, 3, 92, 12.5, '#000000']],
  'Nottingham Forest FC': [['r', 0, 79, 100, 21, 'bg']],
  'Torino FC': [['r', 10, 9, 80, 17, '#ffffff']],
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
      // En sjunde siffra vrider rektangeln (grader medurs) runt sin mitt, för snedställda band
      if (typeof m[6] === 'number') el.setAttribute('transform', `rotate(${m[6]} ${m[1] + m[3] / 2} ${Y(m[2] + m[4] / 2)})`);
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
    const farg = m.find((v, i) => i > 0 && typeof v === 'string');
    if (farg === 'bg') el.style.fill = 'var(--maskbakgrund, #fff)';
    else el.setAttribute('fill', farg);
    svg.appendChild(el);
  }
  ram.append(bild, svg);
  return ram;
};
