// Träningsläget: övningarna Vilket land? och Var exakt?, statistik och ledtrådsbibliotek.
// Ledtrådarna kommer från ledtradar.js (sammanfattat från Plonk It, CC BY-NC-SA 4.0).
(() => {
  'use strict';

  const V = window.Vilse;
  const { $, nf, las, spara, blanda } = V;
  const LT = window.LEDTRADAR;

  const DELAR = { eu: 'Europa', am: 'Amerika', as: 'Asien', af: 'Afrika', oc: 'Oceanien' };
  const OVNINGAR = [
    { id: 'land', namn: 'Vilket land?', text: 'Välj bland fyra länder. Efter svaret ser du vad du skulle ha letat efter.' },
    { id: 'exakt', namn: 'Var exakt?', text: 'Sätt ut en nål utan tidsgräns, och se landets ledtrådar efteråt.' },
  ];
  const OMRADEN = [
    { id: 'varlden', namn: 'Hela världen' },
    { id: 'eu', namn: 'Europa', delar: ['eu'] },
    { id: 'am', namn: 'Amerika', delar: ['am'] },
    { id: 'as', namn: 'Asien', delar: ['as'] },
    { id: 'af', namn: 'Afrika och Oceanien', delar: ['af', 'oc'] },
    { id: 'svaga', namn: 'Mina svaga länder' },
  ];
  const NIVAER = [
    { id: 'svar', namn: 'Lättförväxlade' },
    { id: 'latt', namn: 'Blandade' },
  ];
  const MAX_LEDTRADAR = 4;   // världsdel, körriktning, något unikt för landet, två fel svar borttagna

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const traningsland = p => p[5] || p[3];
  const plonkitUrl = land => `https://www.plonkit.net/${LT[land].plonkit}`;
  const trafikText = land => (LT[land].trafik === 'vänster' ? 'Vänstertrafik' : 'Högertrafik');

  // Platser per land (Hongkong, Svalbard m.fl. räknas som egna länder, som hos Plonk It)
  const platserPerLand = new Map();
  for (const p of window.PLATSER) {
    const land = traningsland(p);
    if (!LT[land]) continue;
    if (!platserPerLand.has(land)) platserPerLand.set(land, []);
    platserPerLand.get(land).push(p);
  }
  const spelbaraLander = [...platserPerLand.keys()];
  const sorteraSv = lista => [...lista].sort((a, b) => a.localeCompare(b, 'sv'));

  // ---------- Statistik ----------
  // vilse.traning = { lander: { Sverige: { ratt, fel } }, par: { 'Sverige>Norge': antal }, iRadBasta }
  function lasStat() {
    const s = las('vilse.traning', {});
    return { lander: s.lander || {}, par: s.par || {}, iRadBasta: s.iRadBasta || 0 };
  }
  function registrera(land, gissat, iRad) {
    const s = lasStat();
    const rad = s.lander[land] || { ratt: 0, fel: 0 };
    if (land === gissat) rad.ratt++;
    else {
      rad.fel++;
      const nyckel = `${land}>${gissat}`;
      s.par[nyckel] = (s.par[nyckel] || 0) + 1;
    }
    s.lander[land] = rad;
    s.iRadBasta = Math.max(s.iRadBasta, iRad);
    spara('vilse.traning', s);
  }
  // Andel fel med lite utjämning, så att ett enda svar inte väger för tungt. Osedda länder får 0,5.
  function felandel(land, stat) {
    const r = stat.lander[land];
    return r ? (r.fel + 1) / (r.ratt + r.fel + 2) : 0.5;
  }

  // ---------- Val på startskärmen ----------
  const T = {
    ovning: 'land',
    omrade: OMRADEN[0],
    niva: 'svar',
    egnaLander: null,     // satt när man tränar på ett land och dess förväxlingar från biblioteket
    nasta: null,          // { land, plats } för nästa runda, vald i förväg så att den kan förladdas
    land: null,
    plats: null,
    alternativ: [],
    ledtradar: 0,
    jamfort: false,
    svarat: false,
    nr: 0,
    ratt: 0,
    totalt: 0,
    iRad: 0,
    senaste: [],          // senast visade platser, för att undvika upprepningar
  };

  function byggTraningsval() {
    const val = las('vilse.traningVal', {});
    T.ovning = OVNINGAR.some(o => o.id === val.ovning) ? val.ovning : 'land';
    T.omrade = OMRADEN.find(o => o.id === val.omrade) || OMRADEN[0];
    T.niva = NIVAER.some(n => n.id === val.niva) ? val.niva : 'svar';
    const harStat = Object.keys(lasStat().lander).length > 0;
    if (T.omrade.id === 'svaga' && !harStat) T.omrade = OMRADEN[0];

    $('ovningVal').innerHTML = OVNINGAR.map(o => `<label class="kartrad">
        <input type="radio" name="ovning" id="ovning-${o.id}" value="${o.id}" ${o.id === T.ovning ? 'checked' : ''}>
        <span class="ring" aria-hidden="true"></span>
        <span class="kartrad-namn">${o.namn}</span>
        <span class="kartrad-text">${o.text}</span>
      </label>`).join('');

    $('omradeVal').innerHTML = OMRADEN.map(o => {
      const avst = o.id === 'svaga' && !harStat;
      return `<label class="chip${avst ? ' chip-av' : ''}" ${avst ? 'title="Svara på några platser först, så vet spelet vilka länder du missar"' : ''}>
        <input type="radio" name="omrade" id="omrade-${o.id}" value="${o.id}" ${o.id === T.omrade.id ? 'checked' : ''} ${avst ? 'disabled' : ''}>
        <span>${o.namn}</span>
      </label>`;
    }).join('');

    $('nivaVal').innerHTML = NIVAER.map(n => `<label>
        <input type="radio" name="niva" id="niva-${n.id}" value="${n.id}" ${n.id === T.niva ? 'checked' : ''}>
        <span>${n.namn}</span>
      </label>`).join('');
    $('nivaFalt').hidden = T.ovning !== 'land';
  }

  function lasVal() {
    T.ovning = document.querySelector('input[name="ovning"]:checked')?.value || 'land';
    T.omrade = OMRADEN.find(o => o.id === document.querySelector('input[name="omrade"]:checked')?.value) || OMRADEN[0];
    T.niva = document.querySelector('input[name="niva"]:checked')?.value || 'svar';
    spara('vilse.traningVal', { ovning: T.ovning, omrade: T.omrade.id, niva: T.niva });
  }

  const FLIKAR = { spela: ['flikSpela', 'flikKnappSpela'], trana: ['flikTrana', 'flikKnappTrana'], multi: ['flikMulti', 'flikKnappMulti'] };
  function visaFlik(namn) {
    if (!FLIKAR[namn]) namn = 'spela';
    for (const [flik, [panel, knapp]] of Object.entries(FLIKAR)) {
      $(panel).hidden = flik !== namn;
      $(knapp).setAttribute('aria-selected', String(flik === namn));
    }
    spara('vilse.flik', namn);
  }
  V.visaFlik = visaFlik;

  // ---------- Vilka länder och platser som kommer ----------
  function landPool() {
    if (T.egnaLander) return T.egnaLander;
    const { delar } = T.omrade;
    return delar ? spelbaraLander.filter(l => delar.includes(LT[l].del)) : spelbaraLander;
  }

  // Varje land är lika sannolikt (annars skulle Sverige med sina många platser dominera).
  // I läget Mina svaga länder väljs länder du ofta missar oftare.
  function valjLand() {
    let pool = landPool().filter(l => l !== T.land);
    if (!pool.length) pool = landPool();
    if (T.omrade.id !== 'svaga' || T.egnaLander) return pool[Math.floor(Math.random() * pool.length)];
    const stat = lasStat();
    const vikter = pool.map(l => felandel(l, stat) ** 2 + 0.02);
    let r = Math.random() * vikter.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { r -= vikter[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  function valjPlats(land) {
    const platser = platserPerLand.get(land);
    const osedda = platser.filter(p => !T.senaste.includes(p));
    const lista = osedda.length ? osedda : platser;
    const plats = lista[Math.floor(Math.random() * lista.length)];
    T.senaste = [plats, ...T.senaste].slice(0, 40);
    return plats;
  }

  // Tre felaktiga alternativ: lättförväxlade länder först, sedan samma världsdel, sedan vad som helst
  function skapaAlternativ(ratt) {
    const val = new Set([ratt]);
    const ovriga = blanda(Object.keys(LT).filter(l => l !== ratt));
    const ordning = T.niva === 'svar'
      ? [...blanda(LT[ratt].liknar), ...ovriga.filter(l => LT[l].del === LT[ratt].del), ...ovriga]
      : ovriga;
    for (const l of ordning) {
      if (val.size >= 4) break;
      if (LT[l]) val.add(l);
    }
    return blanda([...val]);
  }

  // ---------- Övningen Vilket land? ----------
  function startaLand() {
    Object.assign(T, { nr: 0, ratt: 0, totalt: 0, iRad: 0, land: null, nasta: null });
    V.visaLage('land');
    nyLandRunda();
  }

  function nyLandRunda() {
    // Nästa plats är oftast redan vald och förladdad medan förra svaret visades
    if (T.nasta) {
      T.land = T.nasta.land;
      T.plats = T.nasta.plats;
      T.nasta = null;
    } else {
      T.land = valjLand();
      T.plats = valjPlats(T.land);
    }
    T.alternativ = skapaAlternativ(T.land);
    T.ledtradar = 0;
    T.jamfort = false;
    T.svarat = false;
    T.nr++;

    $('landFraga').hidden = false;
    $('landSvar').hidden = true;
    $('landLedtrad').hidden = true;
    $('landLedtrad').innerHTML = '';
    $('jamfor').hidden = true;
    $('ledtradKnapp').disabled = false;
    $('ledtradKnapp').textContent = `Ledtråd (${MAX_LEDTRADAR} kvar)`;
    $('landVal').innerHTML = T.alternativ.map((l, i) => `<button class="land-alt" type="button" data-land="${esc(l)}">
        <span class="land-nr" aria-hidden="true">${i + 1}</span><span>${esc(l)}</span>
      </button>`).join('');
    uppdateraTraningsHud();

    V.satVy(T.plats);
    V.laddaVy();
  }

  function bytLandPlats() {
    if (T.svarat) return;
    T.plats = valjPlats(T.land);
    V.satVy(T.plats);
    V.laddaVy();
  }

  function uppdateraTraningsHud() {
    $('hudOmrade').textContent = T.egnaLander ? T.egnaLander[0] : T.omrade.namn;
    $('hudPlatsNr').textContent = T.nr;
    $('hudIRad').textContent = T.iRad;
    $('hudTraff').textContent = T.totalt ? `${Math.round((T.ratt / T.totalt) * 100)} %` : '–';
  }

  function geLedtrad() {
    if (T.svarat || T.ledtradar >= MAX_LEDTRADAR) return;
    T.ledtradar++;
    const rader = [];
    if (T.ledtradar >= 1) rader.push(`Världsdel: <b>${DELAR[LT[T.land].del]}</b>`);
    if (T.ledtradar >= 2) rader.push(`Trafik: <b>${trafikText(T.land).toLowerCase()}</b>`);
    if (T.ledtradar >= 3) rader.push(`Unikt för landet: ${esc(LT[T.land].unikt)}`);
    if (T.ledtradar >= 4) {
      // Ta bort två felaktiga alternativ
      const fel = blanda([...$('landVal').querySelectorAll('.land-alt')].filter(b => b.dataset.land !== T.land)).slice(0, 2);
      fel.forEach(b => { b.disabled = true; b.classList.add('bort'); });
      rader.push('Två fel alternativ är borttagna.');
    }
    $('landLedtrad').innerHTML = rader.join('<br>');
    $('landLedtrad').hidden = false;
    const kvar = MAX_LEDTRADAR - T.ledtradar;
    $('ledtradKnapp').textContent = kvar ? `Ledtråd (${kvar} kvar)` : 'Inga ledtrådar kvar';
    $('ledtradKnapp').disabled = !kvar;
  }

  function oppnaJamfor() {
    T.jamfort = true;
    $('jamforLista').innerHTML = T.alternativ.map(l => `<article class="jamfor-kort">
        <h3>${esc(l)}</h3>
        <p class="landkort-meta">${DELAR[LT[l].del]} · ${trafikText(l).toLowerCase()}</p>
        ${uniktHtml(l)}
        ${tipsHtml(l)}
        ${T.svarat ? '' : `<button class="knapp knapp-bana knapp-liten" type="button" data-svara="${esc(l)}">Svara ${esc(l)}</button>`}
      </article>`).join('');
    $('jamfor').hidden = false;
    $('stangJamfor').focus({ preventScroll: true });
  }

  function svara(gissat) {
    if (T.svarat) return;
    T.svarat = true;
    const ratt = gissat === T.land;
    T.totalt++;
    if (ratt) {
      T.ratt++;
      if (!T.ledtradar && !T.jamfort) T.iRad++;   // hjälp bryter inte sviten, men ökar den inte heller
    } else {
      T.iRad = 0;
    }
    registrera(T.land, gissat, T.iRad);

    // Välj nästa plats nu och ladda den i bakgrunden medan svaret läses
    const nastaLand = valjLand();
    T.nasta = { land: nastaLand, plats: valjPlats(nastaLand) };
    V.forladda(T.nasta.plats);

    $('landVal').querySelectorAll('.land-alt').forEach(b => {
      b.disabled = true;
      if (b.dataset.land === T.land) b.classList.add('ratt');
      else if (b.dataset.land === gissat) b.classList.add('fel');
    });
    $('jamfor').hidden = true;
    uppdateraTraningsHud();
    visaSvar(gissat, ratt);
  }

  let svarKarta = null, svarMarkor = null;
  function visaSvar(gissat, ratt) {
    const land = T.land;
    $('svarRubrik').textContent = ratt ? 'Rätt' : `Fel, du svarade ${gissat}`;
    $('svarRubrik').classList.toggle('ar-ratt', ratt);
    $('svarRubrik').classList.toggle('ar-fel', !ratt);
    $('svarLand').textContent = land;
    $('svarPlats').textContent = `${T.plats[2]}${T.plats[3] !== land ? `, ${T.plats[3]}` : ''}`;

    // Vid fel svar: hur länderna skiljer sig åt, helst beskrivet från det gissade landets sida
    const skilj = !ratt && (LT[gissat]?.skilj?.[land] || LT[land].skilj?.[gissat]);
    $('svarSkilj').hidden = !skilj;
    if (skilj) $('svarSkilj').innerHTML = `<p class="skilj-rubrik">${esc(land)} eller ${esc(gissat)}?</p><p>${esc(skilj)}</p>`;

    $('svarTips').innerHTML = `${uniktHtml(land)}<p class="ledtradar-rubrik">Leta efter i ${esc(land)}</p>${tipsHtml(land)}`;
    $('svarPlonkit').href = plonkitUrl(land);
    $('svarPlonkit').textContent = `Mer om ${land} på Plonk It ↗`;
    $('landFraga').hidden = true;
    $('landSvar').hidden = false;
    $('landPanel').scrollTop = 0;

    if (!svarKarta) {
      svarKarta = L.map('svarKarta', { zoomControl: false, attributionControl: true, worldCopyJump: true });
      V.kartlager().addTo(svarKarta);
    }
    svarKarta.invalidateSize({ animate: false });
    svarKarta.setView([T.plats[0], T.plats[1]], 4, { animate: false });
    if (svarMarkor) svarMarkor.setLatLng([T.plats[0], T.plats[1]]);
    else svarMarkor = L.marker([T.plats[0], T.plats[1]], { icon: V.ikonFacit, keyboard: false, interactive: false }).addTo(svarKarta);

    $('landNasta').focus({ preventScroll: true });
  }

  // Det som är mest unikt för landet, framhävt ovanför de övriga ledtrådarna
  function uniktHtml(land) {
    return LT[land].unikt ? `<p class="unikt"><span>Unikt</span>${esc(LT[land].unikt)}</p>` : '';
  }

  function tipsHtml(land) {
    return `<dl class="tips">${LT[land].tips.map(([kat, text]) => `<dt>${esc(kat)}</dt><dd>${esc(text)}</dd>`).join('')}</dl>`;
  }

  // Resultatkortet i Var exakt? får landets ledtrådar
  V.ledtradarFor = (plats, el) => {
    const land = traningsland(plats);
    if (!LT[land]) { el.innerHTML = ''; return; }
    el.innerHTML = `${uniktHtml(land)}<p class="ledtradar-rubrik">Leta efter i ${esc(land)}</p>${tipsHtml(land)}
      <a class="lank-knapp" href="${plonkitUrl(land)}" target="_blank" rel="noopener">Mer om ${esc(land)} på Plonk It ↗</a>`;
  };
  V.bytLandPlats = bytLandPlats;

  // ---------- Starta träningen ----------
  function startaTraning(egnaLander = null) {
    lasVal();
    T.egnaLander = egnaLander;
    stangSidor();
    if (T.ovning === 'land' || egnaLander) {
      startaLand();
      return;
    }
    const lander = landPool();
    const pool = lander.flatMap(l => platserPerLand.get(l));
    T.land = null;
    V.startaFriTraning({
      id: T.omrade.id === 'varlden' || T.omrade.id === 'svaga' ? 'varlden' : T.omrade.id,
      namn: T.omrade.namn,
      pool,
      valjNasta: () => { T.land = valjLand(); return valjPlats(T.land); },
    });
  }

  // ---------- Ledtrådsbibliotek ----------
  const B = { sok: '', del: 'alla', trafik: 'alla' };

  function oppnaBibliotek(landAttVisa) {
    stangSidor();
    $('bibliotek').hidden = false;
    $('bibliotekDelar').innerHTML = [['alla', 'Alla världsdelar'], ...Object.entries(DELAR)].map(([id, namn]) => `<label class="chip">
        <input type="radio" name="bibDel" value="${id}" ${B.del === id ? 'checked' : ''}><span>${namn}</span>
      </label>`).join('');
    $('bibliotekTrafik').innerHTML = [['alla', 'All trafik'], ['höger', 'Högertrafik'], ['vänster', 'Vänstertrafik']].map(([id, namn]) => `<label class="chip">
        <input type="radio" name="bibTrafik" value="${id}" ${B.trafik === id ? 'checked' : ''}><span>${namn}</span>
      </label>`).join('');
    ritaBibliotek();
    $('bibliotek').scrollTop = 0;
    if (landAttVisa) visaLandkort(landAttVisa);
    else $('bibliotekSok').focus({ preventScroll: true });
  }

  function ritaBibliotek() {
    const stat = lasStat();
    const sok = B.sok.trim().toLowerCase();
    const lander = sorteraSv(Object.keys(LT)).filter(l =>
      (B.del === 'alla' || LT[l].del === B.del) &&
      (B.trafik === 'alla' || LT[l].trafik === B.trafik) &&
      (!sok || l.toLowerCase().includes(sok)));
    $('bibliotekAntal').textContent = `${lander.length} av ${Object.keys(LT).length} länder`;
    $('bibliotekLista').innerHTML = lander.length ? lander.map(l => {
      const r = stat.lander[l];
      const antal = platserPerLand.get(l)?.length || 0;
      return `<article class="landkort" id="landkort-${esc(LT[l].plonkit)}">
        <div class="landkort-topp">
          <h3>${esc(l)}</h3>
          ${r ? `<span class="traff-chip">${r.ratt} av ${r.ratt + r.fel} rätt</span>` : ''}
        </div>
        <p class="landkort-meta">${DELAR[LT[l].del]} · ${trafikText(l).toLowerCase()} · ${antal} ${antal === 1 ? 'plats' : 'platser'} i spelet</p>
        ${uniktHtml(l)}
        ${tipsHtml(l)}
        <p class="liknar">Blandas ihop med ${LT[l].liknar.map(x => `<button class="liknar-knapp" type="button" data-visa="${esc(x)}">${esc(x)}</button>`).join(' ')}</p>
        <div class="knapprad">
          ${antal ? `<button class="knapp knapp-bana knapp-liten" type="button" data-trana="${esc(l)}">Träna på ${esc(l)}</button>` : ''}
          <a class="knapp knapp-papper knapp-liten" href="${plonkitUrl(l)}" target="_blank" rel="noopener">Plonk It ↗</a>
        </div>
      </article>`;
    }).join('') : '<p class="tomt">Inga länder matchar sökningen.</p>';
  }

  function visaLandkort(land) {
    B.sok = ''; B.del = 'alla'; B.trafik = 'alla';
    $('bibliotekSok').value = '';
    document.querySelectorAll('input[name="bibDel"], input[name="bibTrafik"]').forEach(i => { i.checked = i.value === 'alla'; });
    ritaBibliotek();
    const kort = document.getElementById(`landkort-${LT[land].plonkit}`);
    if (!kort) return;
    kort.scrollIntoView({ behavior: V.reduceraRorelse ? 'auto' : 'smooth', block: 'center' });
    kort.classList.remove('markerad');
    kort.getBoundingClientRect();
    kort.classList.add('markerad');
  }

  // Träna på ett land: landet själv och de länder det lätt förväxlas med
  function tranaPa(land) {
    const lander = [land, ...LT[land].liknar].filter(l => platserPerLand.has(l));
    T.niva = 'svar';
    startaTraning(lander);
  }

  // ---------- Statistik ----------
  function oppnaStatistik() {
    stangSidor();
    $('statistik').hidden = false;
    ritaStatistik();
    $('statistik').scrollTop = 0;
  }

  function ritaStatistik() {
    const stat = lasStat();
    const rader = Object.entries(stat.lander);
    if (!rader.length) {
      $('statistikInnehall').innerHTML = `<div class="tomt">
        <p>Ingen statistik ännu. Svara på några platser i övningen Vilket land?, så visar den här sidan vilka länder du missar och vilka du blandar ihop.</p>
        <button class="knapp knapp-bana" type="button" data-starta-land>Börja träna</button>
      </div>`;
      return;
    }
    const ratt = rader.reduce((s, [, r]) => s + r.ratt, 0);
    const totalt = rader.reduce((s, [, r]) => s + r.ratt + r.fel, 0);

    const svaga = rader
      .filter(([, r]) => r.fel > 0)
      .sort((a, b) => felandel(b[0], stat) - felandel(a[0], stat) || b[1].fel - a[1].fel)
      .slice(0, 10);
    const par = Object.entries(stat.par).sort((a, b) => b[1] - a[1]).slice(0, 8);

    $('statistikInnehall').innerHTML = `
      <div class="nyckeltal">
        <div><p class="stor-siffra">${nf.format(totalt)}</p><p class="etikett">svar</p></div>
        <div><p class="stor-siffra">${Math.round((ratt / totalt) * 100)} %</p><p class="etikett">rätt</p></div>
        <div><p class="stor-siffra">${stat.iRadBasta}</p><p class="etikett">bästa svit utan hjälp</p></div>
        <div><p class="stor-siffra">${rader.length}</p><p class="etikett">länder du mött</p></div>
      </div>

      <div class="stat-kolumner">
        <section>
          <h3>Länder du missar oftast</h3>
          ${svaga.length ? `<ol class="statlista">${svaga.map(([l, r]) => {
            const andel = r.ratt / (r.ratt + r.fel);
            return `<li>
              <button class="liknar-knapp" type="button" data-visa="${esc(l)}">${esc(l)}</button>
              <span class="statstapel" aria-hidden="true"><i style="width:${Math.round(andel * 100)}%"></i></span>
              <span class="statsiffra">${r.ratt} av ${r.ratt + r.fel}</span>
            </li>`;
          }).join('')}</ol>` : '<p class="etikett">Du har inte missat något land ännu.</p>'}
        </section>

        <section>
          <h3>Du blandar ihop</h3>
          ${par.length ? `<ol class="parlista">${par.map(([nyckel, antal]) => {
            const [land, gissat] = nyckel.split('>');
            return `<li>
              <span><b>${esc(land)}</b> <span class="etikett">svarade</span> ${esc(gissat)}</span>
              <span class="statsiffra">${antal} ${antal === 1 ? 'gång' : 'gånger'}</span>
              ${platserPerLand.has(land) ? `<button class="knapp knapp-papper knapp-liten" type="button" data-trana="${esc(land)}">Öva</button>` : ''}
            </li>`;
          }).join('')}</ol>` : '<p class="etikett">Inga förväxlingar ännu.</p>'}
        </section>
      </div>

      <div class="knapprad">
        <button class="knapp knapp-bana" type="button" data-starta-svaga>Öva på mina svaga länder</button>
        <button class="knapp knapp-papper" type="button" id="nollstall">Nollställ statistiken</button>
      </div>
      <div id="nollstallFraga" class="bekrafta-inline" hidden>
        <p>All träningsstatistik raderas från den här webbläsaren.</p>
        <div class="knapprad">
          <button class="knapp knapp-tryck" type="button" id="nollstallJa">Nollställ</button>
          <button class="knapp knapp-papper" type="button" id="nollstallNej">Avbryt</button>
        </div>
      </div>`;
  }

  function stangSidor() {
    $('bibliotek').hidden = true;
    $('statistik').hidden = true;
  }

  // ---------- Händelser ----------
  $('flikKnappSpela').addEventListener('click', () => visaFlik('spela'));
  $('flikKnappTrana').addEventListener('click', () => visaFlik('trana'));
  $('flikKnappMulti').addEventListener('click', () => visaFlik('multi'));
  $('flikTrana').addEventListener('change', e => {
    if (e.target.name === 'ovning') $('nivaFalt').hidden = e.target.value !== 'land';
  });
  $('traningStart').addEventListener('click', () => startaTraning());
  $('oppnaBibliotek').addEventListener('click', () => oppnaBibliotek());
  $('oppnaStatistik').addEventListener('click', oppnaStatistik);
  document.querySelectorAll('.stang-sida').forEach(b => b.addEventListener('click', () => {
    stangSidor();
    byggTraningsval();
  }));

  $('landVal').addEventListener('click', e => {
    const knapp = e.target.closest('.land-alt');
    if (knapp && !knapp.disabled) svara(knapp.dataset.land);
  });
  $('ledtradKnapp').addEventListener('click', geLedtrad);
  $('jamforKnapp').addEventListener('click', oppnaJamfor);
  $('stangJamfor').addEventListener('click', () => { $('jamfor').hidden = true; });
  $('jamforLista').addEventListener('click', e => {
    const knapp = e.target.closest('[data-svara]');
    if (knapp) svara(knapp.dataset.svara);
  });
  $('landNasta').addEventListener('click', nyLandRunda);

  $('bibliotekSok').addEventListener('input', e => { B.sok = e.target.value; ritaBibliotek(); });
  $('bibliotek').addEventListener('change', e => {
    if (e.target.name === 'bibDel') { B.del = e.target.value; ritaBibliotek(); }
    if (e.target.name === 'bibTrafik') { B.trafik = e.target.value; ritaBibliotek(); }
  });

  // Knappar i biblioteket och statistiken
  document.addEventListener('click', e => {
    const visa = e.target.closest('[data-visa]');
    if (visa) { oppnaBibliotek(visa.dataset.visa); return; }
    const trana = e.target.closest('[data-trana]');
    if (trana) { tranaPa(trana.dataset.trana); return; }
    if (e.target.closest('[data-starta-land]')) {
      document.getElementById('ovning-land').checked = true;
      startaTraning();
      return;
    }
    if (e.target.closest('[data-starta-svaga]')) {
      document.getElementById('ovning-land').checked = true;
      const svaga = document.getElementById('omrade-svaga');
      svaga.disabled = false;
      svaga.checked = true;
      startaTraning();
      return;
    }
    if (e.target.id === 'nollstall') $('nollstallFraga').hidden = false;
    if (e.target.id === 'nollstallNej') $('nollstallFraga').hidden = true;
    if (e.target.id === 'nollstallJa') {
      spara('vilse.traning', {});
      ritaStatistik();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!$('jamfor').hidden) { $('jamfor').hidden = true; return; }
      if (!$('bibliotek').hidden || !$('statistik').hidden) { stangSidor(); byggTraningsval(); }
      return;
    }
    if (V.S.lage !== 'land' || (e.target.closest && e.target.closest('input, textarea'))) return;
    const siffra = Number(e.key);
    if (!T.svarat && siffra >= 1 && siffra <= T.alternativ.length) {
      const knapp = $('landVal').querySelectorAll('.land-alt')[siffra - 1];
      if (knapp && !knapp.disabled) svara(knapp.dataset.land);
    } else if (T.svarat && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('button, a')) {
      e.preventDefault();
      nyLandRunda();
    }
  });

  document.addEventListener('vilse:meny', byggTraningsval);

  // ---------- Kör ----------
  byggTraningsval();
  visaFlik(las('vilse.flik', 'spela'));
})();
