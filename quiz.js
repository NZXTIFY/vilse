// Quizlägena: en fråga visas (ett märke eller en text), och spelaren sätter nålen på rätt plats på kartan.
// Hemmaplan: klubbmärke → hemmaarena. Bilmärken och Företag: märke → huvudkontor. Historia: händelse → plats.
// Landmärken: sevärdhet → plats. Huvudstäder: land → huvudstad.
// Rundor, karta, timer och resultat sköts av spel.js. Här finns lägena, urvalen och frågepanelen.
(() => {
  'use strict';
  const V = window.Vilse;
  const { S, $, nf, las, spara, blanda, RUNDOR, TIDER, esc } = V;

  // En fråga: namn (det som visas eller avslöjas), svar (platsens namn), var den ligger, och ibland märke eller årtal
  const KLUBBAR = window.KLUBBAR.map(k => ({
    namn: k[0], svar: k[1], lat: k[2], lng: k[3], land: k[4], region: k[5], logga: k[6], stor: !!k[7],
  }));
  const fragor = (nyckel, extra) => window.KUNSKAP[nyckel].map(r => ({
    namn: r[0], svar: r[1], lat: r[2], lng: r[3], land: r[4], [extra]: r[5],
  }));

  const OMDOME_FOTBOLL = [
    'Du hittar till varje hemmaplan i sömnen.',
    'Van bortasupporter. Nästan alla arenor prickade.',
    'Rätt stad för det mesta, men arenorna gäckade dig.',
    'Ett par rätta trakter. Resten blev bortaplan.',
    'Helt vilse på väg till matchen.',
  ];
  const OMDOME = [
    'Du kan din karta utan och innan.',
    'Stark allmänbildning. Nästan allt på rätt plats.',
    'Rätt trakt för det mesta. Några rejäla bommar.',
    'Ett par träffar. Resten var i dimma.',
    'Helt vilse den här gången.',
  ];

  // typ: 'marke' visar en bild (och namnet som ledtråd), 'text' visar frågan som text (och landet som ledtråd).
  // poang: mitt i prick inom `full` km, sedan halva poängen på en brant kurva (a km) och halva på en flack (b km).
  // zoom: hur nära resultatkartan visar rätt plats när ingen gissning gjordes.
  const LAGEN = [
    {
      id: 'hemma', namn: 'Hemmaplan', etikett: 'Hemmaplan', typ: 'marke',
      text: 'Du får se ett klubbmärke. Sätt nålen på klubbens hemmaarena, så nära mittcirkeln du kan.',
      poang: { full: 0.15, a: 15, b: 500 }, zoom: 14, omdomen: OMDOME_FOTBOLL,
      texter: { overrad: 'Vems hemmaplan?', fraga: 'Sätt nålen på klubbens hemmaarena', visa: 'Visa klubbens namn', fran: 'från arenan', svar: 'Hemmaplan:', karta: 'Var ligger arenan?' },
    },
    {
      id: 'bilar', namn: 'Bilmärken', typ: 'marke', pool: () => fragor('bilar', 'logga'),
      text: 'Du får se ett bil- eller motorcykelmärke. Sätt nålen på orten där märket har sitt huvudkontor.',
      poang: { full: 10, a: 80, b: 900 }, zoom: 9,
      texter: { overrad: 'Var hör märket hemma?', fraga: 'Sätt nålen på märkets huvudkontor', visa: 'Visa märkets namn', fran: 'från huvudkontoret', svar: 'Huvudkontor:', karta: 'Var ligger huvudkontoret?' },
    },
    {
      id: 'foretag', namn: 'Företag', typ: 'marke', pool: () => fragor('foretag', 'logga'),
      text: 'Du får se ett företags logga. Sätt nålen på orten där företaget har sitt huvudkontor.',
      poang: { full: 10, a: 80, b: 900 }, zoom: 9,
      texter: { overrad: 'Var hör företaget hemma?', fraga: 'Sätt nålen på företagets huvudkontor', visa: 'Visa företagets namn', fran: 'från huvudkontoret', svar: 'Huvudkontor:', karta: 'Var ligger huvudkontoret?' },
    },
    {
      id: 'historia', namn: 'Historia', typ: 'text', ledtrad: true, pool: () => fragor('historia', 'ar'),
      text: 'Du får en historisk händelse. Sätt nålen där den ägde rum.',
      poang: { full: 10, a: 120, b: 1200 }, zoom: 8,
      texter: { overrad: 'Var hände det?', fraga: 'Sätt nålen där det hände', visa: 'Visa landet', fran: 'från platsen', svar: 'Platsen:', karta: 'Var hände det?' },
    },
    {
      id: 'landmarken', namn: 'Landmärken', typ: 'text', ledtrad: true, pool: () => fragor('landmarken', 'ar'),
      text: 'Du får en känd byggnad eller naturplats. Sätt nålen där den ligger.',
      poang: { full: 1, a: 25, b: 700 }, zoom: 12,
      texter: { overrad: 'Var ligger det?', fraga: 'Sätt nålen på sevärdheten', visa: 'Visa landet', fran: 'från sevärdheten', svar: 'Platsen:', karta: 'Var ligger det?' },
    },
    {
      id: 'huvudstader', namn: 'Huvudstäder', typ: 'text', pool: () => fragor('huvudstader', 'ar'),
      text: 'Du får ett land. Sätt nålen på landets huvudstad.',
      poang: { full: 10, a: 120, b: 1200 }, zoom: 8,
      texter: { overrad: 'Vilken är huvudstaden?', fraga: 'Sätt nålen på landets huvudstad', fran: 'från huvudstaden', svar: 'Huvudstad:', karta: 'Var ligger huvudstaden?' },
    },
  ];

  // Hemmaplans urval. vy: kartans startutsnitt, där 'varlden' visar hela den bebodda världen.
  const URVAL = [
    { id: 'stor', namn: 'Storklubbar', text: 'Från Anfield till La Bombonera.', filter: k => k.stor, vy: 'varlden' },
    { id: 'alla', namn: 'Hela världen', text: 'Alla klubbar, stora som små.', filter: () => true, vy: 'varlden' },
    { id: 'norden', namn: 'Norden', text: 'Sex länder, från Malmö till Tromsø.', filter: k => k.region === 'se' || k.region === 'nd', vy: [[54.5, -24], [70, 31]] },
    { id: 'sverige', namn: 'Sverige', text: 'Från Trelleborg till Östersund.', filter: k => k.region === 'se', vy: [[55.2, 10.5], [66, 24.5]] },
  ];
  const rekordNyckel = (lage, urval) => lage.id === 'hemma' ? `hemma-${urval.id}` : `quiz-${lage.id}`;

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
  const valtLage = () => LAGEN.find(l => l.id === document.querySelector('input[name="quizlage"]:checked')?.value) || LAGEN[0];
  const valtUrval = () => URVAL.find(u => u.id === document.querySelector('input[name="hemmaurval"]:checked')?.value) || URVAL[0];
  const valdTid = () => +(document.querySelector('input[name="hemmatid"]:checked')?.value || 0);

  function byggFlik() {
    const val = las('vilse.hemmaVal', {});
    const rekord = las('vilse.rekord', {});
    const lage = LAGEN.some(l => l.id === val.lage) ? val.lage : 'hemma';
    const urval = URVAL.some(u => u.id === val.urval) ? val.urval : 'stor';
    const tid = TIDER.some(t => t.s === val.tid) ? val.tid : 0;

    $('quizLage').innerHTML = LAGEN.map(l => `<label class="chip">
        <input type="radio" name="quizlage" value="${l.id}" ${l.id === lage ? 'checked' : ''}>
        <span>${l.namn}</span>
      </label>`).join('');

    $('hemmaUrval').innerHTML = URVAL.map(u => {
      const antal = KLUBBAR.filter(u.filter).length;
      const r = rekord[`hemma-${u.id}`];
      const best = r ? `rekord <b>${nf.format(r)}</b>` : `<b>&nbsp;</b>`;
      return `<label class="kartrad">
        <input type="radio" name="hemmaurval" value="${u.id}" ${u.id === urval ? 'checked' : ''}>
        <span class="ring" aria-hidden="true"></span>
        <span class="kartrad-namn">${u.namn}</span>
        <span class="kartrad-info">${best}${antal} klubbar</span>
        <span class="kartrad-text">${u.text}</span>
      </label>`;
    }).join('');

    $('hemmaTid').innerHTML = TIDER.map(t => `<label>
        <input type="radio" name="hemmatid" value="${t.s}" ${t.s === tid ? 'checked' : ''}>
        <span>${t.namn}</span>
      </label>`).join('');
    visaLagesinfo();
  }

  // Lägets beskrivning, antal frågor och rekord. Klubburvalet visas bara för Hemmaplan.
  function visaLagesinfo() {
    const lage = valtLage();
    const hemma = lage.id === 'hemma';
    $('quizText').textContent = lage.text;
    $('hemmaKlubbar').hidden = !hemma;
    const r = las('vilse.rekord', {})[`quiz-${lage.id}`];
    $('quizInfo').hidden = hemma;
    if (!hemma) $('quizInfo').innerHTML = `${lage.pool().length} frågor${r ? ` · rekord <b>${nf.format(r)}</b>` : ''}`;
  }

  // ---------- Omgången ----------
  // Frågor du inte har fått nyligen kommer först, och aldrig två med samma svar i en omgång
  function valjFragor(lage, pool) {
    const minne = las('vilse.quizSenast', {});
    const senast = new Set(minne[lage.id] || []);
    const ordning = [...blanda(pool.filter(k => !senast.has(k.namn))), ...blanda(pool.filter(k => senast.has(k.namn)))];
    const valda = [], svar = new Set();
    for (const k of ordning) {
      if (valda.length === RUNDOR) break;
      if (svar.has(k.svar)) continue;
      valda.push(k);
      svar.add(k.svar);
    }
    // Minns så många att samma fråga inte kommer igen förrän ungefär halva urvalet har visats
    minne[lage.id] = [...valda.map(k => k.namn), ...(minne[lage.id] || []).filter(n => !valda.some(k => k.namn === n))]
      .slice(0, Math.max(RUNDOR, Math.floor(pool.length / 2)));
    spara('vilse.quizSenast', minne);
    return valda;
  }

  let senasteStart = null;
  function starta(lage, urval, tid) {
    const hemma = lage.id === 'hemma';
    const pool = hemma ? KLUBBAR.filter(urval.filter) : lage.pool();
    const valda = valjFragor(lage, pool);
    senasteStart = [lage, urval, tid];
    spara('vilse.hemmaVal', { lage: lage.id, urval: urval.id, tid });
    V.startaHemma({
      id: rekordNyckel(lage, urval),
      namn: hemma ? urval.namn : lage.namn,
      vy: hemma ? urval.vy : 'varlden',
      tid,
      quiz: { lage, etikett: lage.etikett || 'Quiz', poang: lage.poang, zoom: lage.zoom, omdomen: lage.omdomen || OMDOME, ...lage.texter },
      rundor: valda.map(k => ({ plats: [k.lat, k.lng, k.svar, k.land], klubb: k, namnVisat: false })),
    });
  }

  // ---------- Frågepanelen ----------
  // Finns inget märke (eller går det inte att ladda) visas namnet i en sköld i stället
  function visaSkold(k) {
    $('klubbLogga').innerHTML = `<div class="skold">
        <svg viewBox="0 0 100 120" aria-hidden="true"><path d="M5 5h90v58c0 30-22 45-45 53C27 108 5 93 5 63z"/></svg>
        <span>${esc(k.namn)}</span>
      </div>`;
    $('klubbNamn').hidden = true;
    $('klubbVisaNamn').hidden = true;
    $('klubbInfo').textContent = 'Märket gick inte att visa, så du får namnet i stället.';
  }

  function visaKlubb(runda, nasta) {
    const k = runda.klubb;
    const q = S.karta.quiz, lage = q.lage;
    $('klubbOverrad').textContent = q.overrad;
    $('klubbFraga').textContent = q.fraga;
    $('klubbLogga').replaceChildren();
    $('klubbLogga').classList.toggle('klubb-text', lage.typ === 'text');
    $('klubbNamn').hidden = true;
    $('klubbInfo').textContent = '';
    $('klubbVisaNamn').textContent = `${q.visa || ''} (halva poängen)`;

    if (lage.typ === 'text') {
      $('klubbLogga').innerHTML = `<div class="fragekort"><strong>${esc(k.namn)}</strong>${k.ar ? `<span>${esc(k.ar)}</span>` : ''}</div>`;
      $('klubbNamn').textContent = `Ligger i: ${k.land}`;
      $('klubbVisaNamn').hidden = !lage.ledtrad;
      return;
    }
    $('klubbNamn').textContent = k.namn;
    if (k.logga && !trasiga.has(k.logga)) {
      const bild = new Image();
      bild.alt = 'Märke';   // namnet ska inte avslöjas för den som använder skärmläsare heller
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

  function visaLedtrad() {
    const runda = S.rundor[S.nr];
    if (!S.hemma || S.lage !== 'spel' || !runda || runda.namnVisat || $('klubbVisaNamn').hidden) return;
    runda.namnVisat = true;
    $('klubbNamn').hidden = false;
    $('klubbVisaNamn').hidden = true;
    $('klubbInfo').textContent = 'Ledtråd använd: du får halva poängen den här rundan.';
  }

  // Frågan på resultatkortet: märke och namn, med länk till bildens sida (där upphovsperson och licens står)
  function fyllKlubbrad(runda, el) {
    const k = runda.klubb;
    const harBild = k.logga && !trasiga.has(k.logga);
    el.innerHTML = `${harBild ? `<img src="${esc(loggaUrl(k.logga, 96))}" alt="">` : ''}
      <strong>${esc(k.namn)}${k.ar ? ` <small>${esc(k.ar)}</small>` : ''}</strong>
      ${harBild ? `<a href="${esc(loggaSida(k.logga))}" target="_blank" rel="noopener">Märke: ${loggaKallnamn(k.logga)}</a>` : ''}`;
    const bild = el.querySelector('img');
    if (bild) bild.onerror = () => bild.remove();
  }

  // ---------- Händelser ----------
  $('hemmaStart').addEventListener('click', () => starta(valtLage(), valtUrval(), valdTid()));
  $('quizLage').addEventListener('change', visaLagesinfo);
  $('klubbVisaNamn').addEventListener('click', visaLedtrad);
  document.addEventListener('vilse:meny', byggFlik);   // rekorden kan ha ändrats

  Object.assign(V, {
    visaKlubb,
    fyllKlubbrad,
    hemmaIgen: () => { if (senasteStart) starta(...senasteStart); },
  });

  byggFlik();
})();
