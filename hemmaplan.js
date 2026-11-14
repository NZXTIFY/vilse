// Hemmaplan: ett klubbmärke visas, och spelaren sätter nålen på klubbens hemmaarena.
// Rundor, karta, timer och resultat sköts av spel.js. Här finns klubbarna, urvalen och klubbpanelen.
(() => {
  'use strict';
  const V = window.Vilse;
  const { S, $, nf, las, spara, blanda, RUNDOR, TIDER, esc } = V;

  const K = window.KLUBBAR.map(k => ({
    namn: k[0], arena: k[1], lat: k[2], lng: k[3], land: k[4], region: k[5], logga: k[6], stor: !!k[7],
  }));

  // vy: kartans startutsnitt. 'varlden' visar hela den bebodda världen.
  const URVAL = [
    { id: 'stor', namn: 'Storklubbar', text: 'Från Anfield till La Bombonera.', filter: k => k.stor, vy: 'varlden' },
    { id: 'alla', namn: 'Hela världen', text: 'Alla klubbar, stora som små.', filter: () => true, vy: 'varlden' },
    { id: 'norden', namn: 'Norden', text: 'Sex länder, från Malmö till Tromsø.', filter: k => k.region === 'se' || k.region === 'nd', vy: [[54.5, -24], [70, 31]] },
    { id: 'sverige', namn: 'Sverige', text: 'Från Trelleborg till Östersund.', filter: k => k.region === 'se', vy: [[55.2, 10.5], [66, 24.5]] },
  ];
  const rekordNyckel = id => `hemma-${id}`;

  // Märkena hämtas från Wikimedia Commons, eller från engelska Wikipedia ("en:filnamn") för skyddade märken
  // som inte finns som fria bilder. Båda skalar bilden till den bredd man ber om.
  const loggaKalla = fil => fil.startsWith('en:')
    ? ['https://en.wikipedia.org', fil.slice(3)]
    : ['https://commons.wikimedia.org', fil];
  const loggaUrl = (fil, bredd) => { const [vard, namn] = loggaKalla(fil); return `${vard}/wiki/Special:FilePath/${encodeURIComponent(namn)}?width=${bredd}`; };
  const loggaSida = fil => { const [vard, namn] = loggaKalla(fil); return `${vard}/wiki/File:${encodeURIComponent(namn.replace(/ /g, '_'))}`; };
  const loggaKallnamn = fil => fil.startsWith('en:') ? 'Wikipedia' : 'Wikimedia Commons';
  const trasiga = new Set();   // märken som inte gick att ladda den här gången

  // ---------- Startskärmen ----------
  function byggFlik() {
    const val = las('vilse.hemmaVal', {});
    const rekord = las('vilse.rekord', {});
    const valt = URVAL.some(u => u.id === val.urval) ? val.urval : 'stor';
    const valdTid = TIDER.some(t => t.s === val.tid) ? val.tid : 0;

    $('hemmaUrval').innerHTML = URVAL.map(u => {
      const antal = K.filter(u.filter).length;
      const r = rekord[rekordNyckel(u.id)];
      const best = r ? `rekord <b>${nf.format(r)}</b>` : `<b>&nbsp;</b>`;
      return `<label class="kartrad">
        <input type="radio" name="hemmaurval" value="${u.id}" ${u.id === valt ? 'checked' : ''}>
        <span class="ring" aria-hidden="true"></span>
        <span class="kartrad-namn">${u.namn}</span>
        <span class="kartrad-info">${best}${antal} klubbar</span>
        <span class="kartrad-text">${u.text}</span>
      </label>`;
    }).join('');

    $('hemmaTid').innerHTML = TIDER.map(t => `<label>
        <input type="radio" name="hemmatid" value="${t.s}" ${t.s === valdTid ? 'checked' : ''}>
        <span>${t.namn}</span>
      </label>`).join('');
  }

  // ---------- Omgången ----------
  // Klubbar du inte har fått nyligen kommer först, och aldrig två klubbar med samma arena i en omgång
  function valjKlubbar(pool) {
    const senast = new Set(las('vilse.hemmaSenast', []));
    const ordning = [...blanda(pool.filter(k => !senast.has(k.namn))), ...blanda(pool.filter(k => senast.has(k.namn)))];
    const valda = [], arenor = new Set();
    for (const k of ordning) {
      if (valda.length === RUNDOR) break;
      if (arenor.has(k.arena)) continue;
      valda.push(k);
      arenor.add(k.arena);
    }
    return valda;
  }

  function starta(urvalId, tid) {
    const urval = URVAL.find(u => u.id === urvalId) || URVAL[0];
    const pool = K.filter(urval.filter);
    const valda = valjKlubbar(pool);
    spara('vilse.hemmaVal', { urval: urval.id, tid });
    // Minns så många att samma klubb inte kommer igen förrän ungefär halva urvalet har visats
    const minns = [...valda.map(k => k.namn), ...las('vilse.hemmaSenast', []).filter(n => !valda.some(k => k.namn === n))];
    spara('vilse.hemmaSenast', minns.slice(0, 150));
    V.startaHemma({
      id: rekordNyckel(urval.id),
      namn: urval.namn,
      vy: urval.vy,
      tid,
      rundor: valda.map(k => ({ plats: [k.lat, k.lng, k.arena, k.land], klubb: k, namnVisat: false })),
    });
  }

  // ---------- Klubbpanelen ----------
  // Finns inget fritt märke (eller går det inte att ladda) visas klubbens namn i en sköld i stället
  function visaSkold(k) {
    $('klubbLogga').innerHTML = `<div class="skold">
        <svg viewBox="0 0 100 120" aria-hidden="true"><path d="M5 5h90v58c0 30-22 45-45 53C27 108 5 93 5 63z"/></svg>
        <span>${esc(k.namn)}</span>
      </div>`;
    $('klubbNamn').hidden = true;
    $('klubbVisaNamn').hidden = true;
    $('klubbInfo').textContent = 'Klubbens märke gick inte att visa, så du får namnet i stället.';
  }

  function visaKlubb(runda, nasta) {
    const k = runda.klubb;
    $('klubbLogga').replaceChildren();
    $('klubbNamn').textContent = k.namn;
    $('klubbNamn').hidden = true;
    $('klubbInfo').textContent = '';
    if (k.logga && !trasiga.has(k.logga)) {
      const bild = new Image();
      bild.alt = 'Klubbmärke';   // namnet ska inte avslöjas för den som använder skärmläsare heller
      bild.referrerPolicy = 'no-referrer';
      bild.onerror = () => {
        trasiga.add(k.logga);
        if (S.hemma && S.rundor[S.nr] === runda && S.lage === 'spel') visaSkold(k);
      };
      bild.src = loggaUrl(k.logga, 480);
      $('klubbLogga').appendChild(bild);
      $('klubbVisaNamn').hidden = false;
    } else {
      visaSkold(k);
    }
    // Nästa märke hämtas i förväg, så att det visas direkt i nästa runda
    if (nasta && nasta.klubb.logga) new Image().src = loggaUrl(nasta.klubb.logga, 480);
  }

  function visaNamn() {
    const runda = S.rundor[S.nr];
    if (!S.hemma || S.lage !== 'spel' || !runda || runda.namnVisat) return;
    runda.namnVisat = true;
    $('klubbNamn').hidden = false;
    $('klubbVisaNamn').hidden = true;
    $('klubbInfo').textContent = 'Namnet visat: du får halva poängen den här rundan.';
  }

  // Klubbens märke och namn på resultatkortet, med länk till bildens sida (där upphovsperson och licens står)
  function fyllKlubbrad(runda, el) {
    const k = runda.klubb;
    const harBild = k.logga && !trasiga.has(k.logga);
    el.innerHTML = `${harBild ? `<img src="${esc(loggaUrl(k.logga, 96))}" alt="">` : ''}
      <strong>${esc(k.namn)}</strong>
      ${harBild ? `<a href="${esc(loggaSida(k.logga))}" target="_blank" rel="noopener">Märke: ${loggaKallnamn(k.logga)}</a>` : ''}`;
    const bild = el.querySelector('img');
    if (bild) bild.onerror = () => bild.remove();
  }

  // ---------- Händelser ----------
  const valtUrval = () => document.querySelector('input[name="hemmaurval"]:checked')?.value || 'stor';
  const valdTid = () => +(document.querySelector('input[name="hemmatid"]:checked')?.value || 0);

  $('hemmaStart').addEventListener('click', () => starta(valtUrval(), valdTid()));
  $('klubbVisaNamn').addEventListener('click', visaNamn);
  document.addEventListener('vilse:meny', byggFlik);   // rekorden kan ha ändrats

  Object.assign(V, {
    visaKlubb,
    fyllKlubbrad,
    hemmaIgen: () => starta(S.karta.id.replace(/^hemma-/, ''), S.tid),
  });

  byggFlik();
})();
