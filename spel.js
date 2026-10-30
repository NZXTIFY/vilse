(() => {
  'use strict';

  const RUNDOR = 5;
  const MAXPOANG = 5000;

  const KARTOR = [
    { id: 'varlden', namn: 'Hela världen', text: 'Sex kontinenter, från Tromsø till Ushuaia.', filter: () => true },
    // vy: kartans startutsnitt, när ytterpunkterna (Svalbard, Teneriffa) annars skulle visa nästan hela världen
    { id: 'europa', namn: 'Europa', text: 'Från Svalbard till Teneriffa.', filter: p => p[4] === 'eu' || p[4] === 'se', vy: [[35, -11], [66, 40]] },
    { id: 'sverige', namn: 'Sverige', text: 'Från Ystad till Kiruna.', filter: p => p[4] === 'se' },
    { id: 'amerika', namn: 'Amerika', text: 'Från Alaska till Eldslandet.', filter: p => p[4] === 'am' },
  ];
  const TIDER = [
    { s: 0, namn: 'Ingen' },
    { s: 120, namn: '2 min' },
    { s: 60, namn: '1 min' },
    { s: 30, namn: '30 s' },
  ];

  const $ = id => document.getElementById(id);
  const nf = new Intl.NumberFormat('sv-SE');
  const reduceraRorelse = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobil = matchMedia('(max-width: 720px)');

  // ---------- Lagring (kan saknas i privata fönster) ----------
  function las(nyckel, standard) {
    try { const v = localStorage.getItem(nyckel); return v === null ? standard : JSON.parse(v); } catch { return standard; }
  }
  function spara(nyckel, varde) {
    try { localStorage.setItem(nyckel, JSON.stringify(varde)); } catch { /* ignoreras */ }
  }

  // ---------- Geografi och poäng ----------
  function avstandKm(lat1, lng1, lat2, lng2) {
    const r = Math.PI / 180;
    const dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  // Samma kurva som GeoGuessr: 5000 · e^(−10 · avstånd / kartans diagonal)
  function skalaFor(karta, pool) {
    if (karta.id === 'varlden') return 1492.7;
    const lat = pool.map(p => p[0]), lng = pool.map(p => p[1]);
    return avstandKm(Math.min(...lat), Math.min(...lng), Math.max(...lat), Math.max(...lng)) / 10;
  }
  function poangFor(km, skala) {
    if (km <= 0.025) return MAXPOANG;
    return Math.round(MAXPOANG * Math.exp(-km / skala));
  }

  function fmtAvstand(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    if (km < 10) return `${km.toFixed(1).replace('.', ',')} km`;
    return `${nf.format(Math.round(km))} km`;
  }
  const fmtTid = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const nyckelFor = p => `${p[2]}|${p[3]}`;

  function blanda(lista) {
    const a = [...lista];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Platser du inte sett nyligen först, och helst olika länder i samma omgång
  function ordnaPlatser(pool, karta) {
    const senast = new Set(las('vilse.senast', []));
    const ordning = [...blanda(pool.filter(p => !senast.has(nyckelFor(p)))), ...blanda(pool.filter(p => senast.has(nyckelFor(p))))];
    if (karta.id === 'sverige') return ordning;
    const valda = [], senare = [], lander = new Set();
    for (const p of ordning) {
      if (valda.length < RUNDOR && !lander.has(p[3])) { valda.push(p); lander.add(p[3]); } else senare.push(p);
    }
    return [...valda, ...senare];
  }

  // ---------- Tillstånd ----------
  const api = window.Vilse = {};
  const S = {
    karta: null,
    tid: 0,
    skala: 1,
    rundor: [],
    reserv: [],
    nr: 0,
    lage: 'start',
    gissning: null,
    vyUrl: '',
    vantarStartvy: false,
    timer: 0,
    slutTid: 0,
    traning: false,      // fri träning (Var exakt?): inga rundor att räkna, ny plats efter varje gissning
    valjNasta: null,     // ger nästa plats i fri träning
    multi: false,        // spel med vänner: rundorna styrs av värden via multi.js
    multiGissat: false,  // har skickat sin gissning och väntar på de andra
    multiAntal: 0,
    multiTotal: 0,
    forberett: null,     // { kartId, ordning }: platserna till nästa omgång, valda i förväg för förladdning
    nastaPlats: null,    // nästa plats i fri träning, vald i förväg för förladdning
  };

  // ---------- Gatuvyn ----------
  // Googles inbäddning laddar panoramat först efter att ramen har laddat, och det kan ta många sekunder.
  // Därför förladdas nästa plats i en osynlig ram medan spelaren tittar på resultatet,
  // så att vyn kan visas direkt när rundan börjar.
  let vyLaddning = 0;
  let forladdad = null;   // { url, nyckel, riktning, ram }
  const slumpRiktning = () => Math.floor(Math.random() * 360);
  const platsNyckel = plats => `${plats[0]},${plats[1]}`;
  const vyUrlFor = (plats, riktning) =>
    `https://maps.google.com/maps?layer=c&cbll=${plats[0]},${plats[1]}&cbp=12,${riktning},0,0,0&output=svembed`;

  function skapaRam(url) {
    const ram = document.createElement('iframe');
    ram.src = url;
    ram.title = 'Gatuvy';
    ram.setAttribute('allow', 'fullscreen');
    return ram;
  }

  // Tar bort alla ramar utom den som ska visas och den som förladdas
  function stadaRamar(behall) {
    for (const ram of [...$('vyRam').children]) {
      if (ram !== behall && ram !== (forladdad && forladdad.ram)) ram.remove();
    }
  }

  function laddaVy(onLaddad) {
    const mitt = ++vyLaddning;
    if (forladdad && forladdad.url === S.vyUrl) {
      // Vyn har laddat i bakgrunden, så den kan visas direkt
      const ram = forladdad.ram;
      forladdad = null;
      ram.classList.remove('forladdad');
      ram.removeAttribute('tabindex');
      ram.removeAttribute('aria-hidden');
      stadaRamar(ram);
      $('vyLaddar').hidden = true;
      if (onLaddad) onLaddad();
      return;
    }
    const ram = skapaRam(S.vyUrl);
    $('vyLaddar').hidden = false;
    let klar = false;
    const fardig = () => {
      if (klar || mitt !== vyLaddning) return;
      klar = true;
      $('vyLaddar').hidden = true;
      if (onLaddad) onLaddad();
    };
    ram.addEventListener('load', () => setTimeout(fardig, 400));
    setTimeout(fardig, 8000);
    $('vyRam').appendChild(ram);
    stadaRamar(ram);
  }

  // Börjar ladda en plats i en osynlig ram under den som visas
  function forladda(plats, riktning = slumpRiktning()) {
    if (!plats) return;
    const url = vyUrlFor(plats, riktning);
    if (forladdad && forladdad.url === url) return;
    if (forladdad) forladdad.ram.remove();
    const ram = skapaRam(url);
    ram.classList.add('forladdad');
    ram.setAttribute('tabindex', '-1');
    ram.setAttribute('aria-hidden', 'true');
    $('vyRam').prepend(ram);
    forladdad = { url, nyckel: platsNyckel(plats), riktning, ram };
  }

  // En förladdad plats behåller sin startriktning, annars blir adressen en annan och ramen kan inte användas
  function satVy(plats, riktning) {
    if (riktning == null) {
      riktning = forladdad && forladdad.nyckel === platsNyckel(plats) ? forladdad.riktning : slumpRiktning();
    }
    S.vyUrl = vyUrlFor(plats, riktning);
  }

  // ---------- Kartor ----------
  // Esris gatukarta har ortnamn med latinska bokstäver i hela världen (OpenStreetMap visar dem på
  // landets eget språk och skrift, till exempel kinesiska tecken).
  function kartlager() {
    return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      maxNativeZoom: 18,
      attribution: 'Karta &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a>, HERE, Garmin, USGS, NGCC, &copy; OpenStreetMap-bidragsgivare m.fl.',
    });
  }
  const ikonGissning = L.divIcon({ className: 'markor-gissning', iconSize: [26, 26], iconAnchor: [13, 13] });
  const ikonFacit = L.divIcon({ className: 'markor-facit', iconSize: [20, 20], iconAnchor: [10, 10] });
  const numreradIkon = (klass, storlek, nr) => L.divIcon({
    className: klass, iconSize: [storlek, storlek], iconAnchor: [storlek / 2, storlek / 2],
    html: `<span class="markor-nr">${nr}</span>`,
  });
  const banfarg = () => getComputedStyle(document.documentElement).getPropertyValue('--bana').trim() || '#A3237A';

  let gissKarta = null, gissMarkor = null;
  function initGissKarta() {
    if (gissKarta) return;
    gissKarta = L.map('gissKarta', { worldCopyJump: true, zoomSnap: 0.5, minZoom: 1 });
    kartlager().addTo(gissKarta);
    gissKarta.on('click', e => satGissning(e.latlng));
    new ResizeObserver(() => gissKarta.invalidateSize({ animate: false })).observe($('gissKarta'));
  }
  // En dold karta (mobilens hopfällda läge) har ingen storlek, så startvyn sätts när den öppnas
  function startvyGissKarta() {
    if (!$('gissKarta').offsetWidth) { S.vantarStartvy = true; return; }
    S.vantarStartvy = false;
    if (S.karta.id === 'varlden') {
      gissKarta.setView([25, 10], 1);
    } else if (S.karta.vy) {
      gissKarta.fitBounds(S.karta.vy, { padding: [10, 10] });
    } else {
      gissKarta.fitBounds(L.latLngBounds(S.karta.pool.map(p => [p[0], p[1]])), { padding: [10, 10] });
    }
  }
  function satGissning(latlng) {
    if (S.lage !== 'spel' || S.multiGissat) return;
    const ll = latlng.wrap();
    S.gissning = ll;
    if (gissMarkor) gissMarkor.setLatLng(latlng);
    else gissMarkor = L.marker(latlng, { icon: ikonGissning, keyboard: false }).addTo(gissKarta);
    const knapp = $('gissaKnapp');
    knapp.disabled = false;
    knapp.textContent = 'Gissa';
  }
  function rensaGissning() {
    S.gissning = null;
    if (gissMarkor) { gissMarkor.remove(); gissMarkor = null; }
    const knapp = $('gissaKnapp');
    knapp.disabled = true;
    knapp.textContent = 'Klicka på kartan för att gissa';
  }

  let resKarta = null, resLager = null;
  function initResKarta() {
    if (resKarta) { resKarta.invalidateSize({ animate: false }); return; }
    resKarta = L.map('resultatKarta', { zoomSnap: 0.25 });
    kartlager().addTo(resKarta);
    resLager = L.layerGroup().addTo(resKarta);
  }

  // Ritar banlinjen från gissningen till rätt plats, som en sträcka på en orienteringsbana
  function ritaSträcka(fran, till, animera, farg = banfarg()) {
    const linje = L.polyline([fran, till], { color: farg, weight: 3.5, opacity: 1, interactive: false }).addTo(resLager);
    if (!animera || reduceraRorelse) return;
    const p = linje.getElement();
    if (!p || !p.getTotalLength) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    p.getBoundingClientRect();
    p.style.transition = 'stroke-dashoffset .9s cubic-bezier(.3,.6,.2,1) .15s';
    p.style.strokeDashoffset = '0';
    p.addEventListener('transitionend', () => {
      p.style.transition = p.style.strokeDasharray = p.style.strokeDashoffset = '';
    }, { once: true });
  }

  // Lägg rätt plats på samma världskopia som gissningen så att linjen tar kortaste vägen
  function narmasteLng(lng, ref) {
    while (lng - ref > 180) lng -= 360;
    while (ref - lng > 180) lng += 360;
    return lng;
  }

  // ---------- Skärmlägen ----------
  // Lägen: start, lobby (rum med vänner), spel (gissa på kartan), resultat, slut och land (träningen Vilket land?)
  function visaLage(lage) {
    S.lage = lage;
    document.body.dataset.lage = lage;
    const spel = lage === 'spel', land = lage === 'land';
    $('start').hidden = lage !== 'start';
    $('lobby').hidden = lage !== 'lobby';
    $('hud').hidden = !(spel || land);
    $('hudSpel').hidden = land;
    $('hudTraning').hidden = !land;
    $('hudGissatRad').hidden = !S.multi;
    $('verktyg').hidden = !(spel || land);
    $('bytPlats').hidden = S.multi;   // alla i rummet ska se samma plats
    $('giss').hidden = !spel;
    $('oppnaKarta').hidden = !spel;
    $('landPanel').hidden = !land;
    $('jamfor').hidden = true;
    $('resultat').hidden = lage !== 'resultat' && lage !== 'slut';
    $('rundKort').hidden = lage !== 'resultat' || S.multi;
    $('rundKort').classList.toggle('sido', S.traning);
    $('multiKort').hidden = lage !== 'resultat' || !S.multi;
    $('slutKort').hidden = lage !== 'slut' || S.multi;
    $('multiSlut').hidden = lage !== 'slut' || !S.multi;
    $('bekrafta').hidden = true;
    $('giss').classList.remove('oppen', 'har-fokus');
  }

  // ---------- Start ----------
  function byggStart() {
    const val = las('vilse.val', {});
    const rekord = las('vilse.rekord', {});
    const valdKarta = KARTOR.some(k => k.id === val.karta) ? val.karta : 'varlden';
    const valdTid = TIDER.some(t => t.s === val.tid) ? val.tid : 0;

    $('kartval').innerHTML = KARTOR.map(k => {
      const antal = window.PLATSER.filter(k.filter).length;
      const best = rekord[k.id] ? `rekord <b>${nf.format(rekord[k.id])}</b>` : `<b>&nbsp;</b>`;
      return `<label class="kartrad">
        <input type="radio" name="karta" id="karta-${k.id}" value="${k.id}" ${k.id === valdKarta ? 'checked' : ''}>
        <span class="ring" aria-hidden="true"></span>
        <span class="kartrad-namn">${k.namn}</span>
        <span class="kartrad-info">${best}${antal} platser</span>
        <span class="kartrad-text">${k.text}</span>
      </label>`;
    }).join('');

    $('tidval').innerHTML = TIDER.map(t => `<label>
        <input type="radio" name="tid" id="tid-${t.s}" value="${t.s}" ${t.s === valdTid ? 'checked' : ''}>
        <span>${t.namn}</span>
      </label>`).join('');
  }

  function bakgrundsvy() {
    const p = window.PLATSER[Math.floor(Math.random() * window.PLATSER.length)];
    satVy(p);
    laddaVy();
  }

  // Väljer platserna till nästa omgång redan på startskärmen och förladdar den första,
  // så att runda 1 inte börjar med en svart skärm
  let forberedTimer = 0;
  function forberedSpel(kartId) {
    const karta = KARTOR.find(k => k.id === kartId) || KARTOR[0];
    const ordning = ordnaPlatser(window.PLATSER.filter(karta.filter), karta);
    S.forberett = { kartId: karta.id, ordning };
    clearTimeout(forberedTimer);
    // Vänta lite så att bakgrundsvyn hinner ladda först. Har spelaren hunnit gå vidare
    // (till exempel in i ett rum med vänner) ska det rummets förladdning inte skrivas över.
    forberedTimer = setTimeout(() => {
      if ((S.lage === 'start' || S.lage === 'slut') && !S.multi && S.forberett && S.forberett.ordning === ordning) forladda(ordning[0]);
    }, 2500);
  }

  // Nästa plats börjar laddas en stund in i rundan, när den aktuella vyn har hunnit ladda klart
  let nastaTimer = 0;
  function forladdaNasta() {
    clearTimeout(nastaTimer);
    nastaTimer = setTimeout(() => {
      if (S.multi || (S.lage !== 'spel' && S.lage !== 'resultat')) return;
      if (S.traning) {
        if (!S.nastaPlats) S.nastaPlats = S.valjNasta();
        forladda(S.nastaPlats);
      } else if (S.rundor[S.nr + 1]) {
        forladda(S.rundor[S.nr + 1].plats);
      }
    }, 3000);
  }

  function startaSpel(kartId, tid) {
    const karta = KARTOR.find(k => k.id === kartId);
    const pool = window.PLATSER.filter(karta.filter);
    S.traning = false;
    S.multi = false;
    S.karta = { ...karta, pool };
    S.tid = tid;
    S.skala = skalaFor(karta, pool);
    const ordning = S.forberett && S.forberett.kartId === kartId ? S.forberett.ordning : ordnaPlatser(pool, karta);
    S.forberett = null;
    clearTimeout(forberedTimer);
    S.rundor = ordning.slice(0, RUNDOR).map(plats => ({ plats, gissning: null, km: null, poang: 0 }));
    S.reserv = ordning.slice(RUNDOR);
    S.nr = 0;
    spara('vilse.val', { karta: kartId, tid });
    spara('vilse.senast', [...S.rundor.map(r => nyckelFor(r.plats)), ...las('vilse.senast', [])].slice(0, 150));

    visaLage('spel');
    initGissKarta();
    gissKarta.invalidateSize({ animate: false });
    startaRunda();
  }

  // Fri träning: samma gissning på kartan, men utan tidsgräns och med en ny plats efter varje runda.
  // valjNasta() väljer platsen, så att träningen kan styra vilka länder som kommer.
  function startaFriTraning({ id, namn, pool, valjNasta }) {
    S.traning = true;
    S.multi = false;
    S.karta = { id, namn, pool };
    S.tid = 0;
    S.skala = id === 'varlden' ? 1492.7 : skalaFor({ id }, pool);
    S.valjNasta = valjNasta;
    S.nastaPlats = null;
    S.rundor = [{ plats: valjNasta(), gissning: null, km: null, poang: 0 }];
    S.nr = 0;
    visaLage('spel');
    initGissKarta();
    gissKarta.invalidateSize({ animate: false });
    startaRunda();
  }

  // En runda i ett rum med vänner. Värden bestämmer plats, startriktning och hur lång tid som är kvar,
  // så att alla ser samma sak samtidigt. Gissningen skickas till värden i stället för att räknas här.
  function startaMultiRunda({ kartId, nr, antal, plats, riktning, kvarMs, total }) {
    const karta = KARTOR.find(k => k.id === kartId) || KARTOR[0];
    const pool = window.PLATSER.filter(karta.filter);
    S.multi = true;
    S.traning = false;
    S.karta = { ...karta, pool };
    S.nr = nr;
    S.multiAntal = antal;
    S.multiTotal = total;
    S.multiGissat = false;
    S.tid = kvarMs ? Math.ceil(kvarMs / 1000) : 0;
    visaLage('spel');
    initGissKarta();
    gissKarta.invalidateSize({ animate: false });
    rensaGissning();
    startvyGissKarta();
    uppdateraHud();
    stoppaTimer();
    $('hudTidRad').hidden = !kvarMs;
    satVy(plats, riktning);
    laddaVy();
    if (kvarMs) startaTimer(kvarMs);
  }

  function startaRunda() {
    visaLage('spel');
    rensaGissning();
    startvyGissKarta();
    uppdateraHud();
    stoppaTimer();
    $('hudTidRad').hidden = !S.tid;
    if (S.tid) $('hudTid').textContent = fmtTid(S.tid);
    satVy(S.rundor[S.nr].plats);
    laddaVy(() => { startaTimer(); forladdaNasta(); });
  }

  function uppdateraHud() {
    $('hudKarta').textContent = S.karta.namn;
    $('hudRundaEtikett').textContent = S.traning ? 'Plats' : 'Runda';
    $('hudRunda').textContent = S.traning ? `${S.nr + 1}` : `${S.nr + 1} / ${S.multi ? S.multiAntal : RUNDOR}`;
    $('hudPoang').textContent = nf.format(S.multi ? S.multiTotal : S.rundor.reduce((s, r) => s + r.poang, 0));
  }

  // ---------- Timer ----------
  function startaTimer(ms = S.tid * 1000) {
    stoppaTimer();
    if (!S.tid || S.lage !== 'spel') return;
    S.slutTid = performance.now() + ms;
    const tick = () => {
      const kvar = Math.max(0, S.slutTid - performance.now());
      $('hudTid').textContent = fmtTid(Math.ceil(kvar / 1000));
      $('hudTidRad').classList.toggle('bratt', kvar <= 10000);
      if (kvar <= 0) { stoppaTimer(); gissa(); }
    };
    tick();
    S.timer = setInterval(tick, 200);
  }
  function stoppaTimer() {
    clearInterval(S.timer);
    S.timer = 0;
    $('hudTidRad').classList.remove('bratt');
  }

  // ---------- Gissning och resultat ----------
  function gissa() {
    if (S.lage !== 'spel') return;
    if (S.multi) {
      if (S.multiGissat) return;
      S.multiGissat = true;
      stoppaTimer();
      const knapp = $('gissaKnapp');
      knapp.disabled = true;
      knapp.textContent = 'Väntar på de andra…';
      $('giss').classList.remove('oppen');
      if (api.multiGissa) api.multiGissa(S.gissning ? { lat: S.gissning.lat, lng: S.gissning.lng } : null);
      return;
    }
    stoppaTimer();
    const runda = S.rundor[S.nr];
    const [lat, lng] = runda.plats;
    if (S.gissning) {
      runda.gissning = { lat: S.gissning.lat, lng: S.gissning.lng };
      runda.km = avstandKm(S.gissning.lat, S.gissning.lng, lat, lng);
      runda.poang = poangFor(runda.km, S.skala);
    }
    visaRundresultat(runda);
  }

  function visaRundresultat(runda) {
    visaLage('resultat');
    initResKarta();
    resLager.clearLayers();
    const [lat, lng] = runda.plats;

    // Fyll kortet först, så att kartan kan lämna plats för det
    $('rundNr').textContent = S.traning ? `Träning · plats ${S.nr + 1}` : `Runda ${S.nr + 1} av ${RUNDOR}`;
    if (runda.gissning) {
      $('rundAvstand').textContent = fmtAvstand(runda.km);
      $('rundAvstandText').textContent = 'från rätt plats';
    } else {
      $('rundAvstand').textContent = 'Ingen gissning';
      $('rundAvstandText').textContent = 'Tiden tog slut innan du gissade';
    }
    $('rundPlats').textContent = `${runda.plats[2]}, ${runda.plats[3]}`;
    $('rundLedtradar').hidden = !S.traning;
    if (S.traning && api.ledtradarFor) api.ledtradarFor(runda.plats, $('rundLedtradar'));
    raknaUpp($('rundPoang'), runda.poang);
    fyllStapel($('rundStapel'), runda.poang / MAXPOANG);
    $('nastaKnapp').textContent = S.traning ? 'Nästa plats' : S.nr + 1 < RUNDOR ? 'Nästa runda' : 'Se slutresultat';

    if (runda.gissning) {
      const g = [runda.gissning.lat, runda.gissning.lng];
      const f = [lat, narmasteLng(lng, runda.gissning.lng)];
      // Lämna plats för kortet: nere till vänster i spelet, till höger i träningen (längst ned på mobil)
      const kort = $('rundKort');
      const hoger = S.traning && !mobil.matches ? kort.offsetWidth + 60 : 60;
      resKarta.fitBounds(L.latLngBounds([g, f]), {
        paddingTopLeft: [60, 70],
        paddingBottomRight: [hoger, hoger > 60 ? 70 : kort.offsetHeight + 70],
        maxZoom: 16,
        animate: false,
      });
      ritaSträcka(g, f, true);
      L.marker(g, { icon: ikonGissning, keyboard: false, interactive: false }).addTo(resLager);
      L.marker(f, { icon: ikonFacit, keyboard: false, interactive: false }).addTo(resLager);
    } else {
      resKarta.setView([lat, lng], 5, { animate: false });
      L.marker([lat, lng], { icon: ikonFacit, keyboard: false, interactive: false }).addTo(resLager);
    }
    $('nastaKnapp').focus({ preventScroll: true });
  }

  // Resultat i ett rum: rätt plats och allas gissningar, var och en i sin färg.
  // multi.js fyller kortet innan det här anropas, så att kartan kan lämna plats för det.
  function visaMultiResultat(plats, rader) {
    visaLage('resultat');
    initResKarta();
    resLager.clearLayers();
    const facit = [plats[0], plats[1]];
    const punkter = [facit];
    for (const r of rader) {
      if (r.lat == null) continue;
      const g = [r.lat, r.lng];
      const f = [plats[0], narmasteLng(plats[1], r.lng)];
      ritaSträcka(g, f, true, r.farg);
      L.marker(g, { icon: spelarIkon(r), keyboard: false, interactive: false }).addTo(resLager);
      punkter.push(g, f);
    }
    L.marker(facit, { icon: ikonFacit, keyboard: false, interactive: false }).addTo(resLager);
    passaIn(punkter, $('multiKort'), 16);
  }

  // Slutresultat i ett rum: de fem platserna, numrerade
  function visaMultiSlut(platser) {
    visaLage('slut');
    initResKarta();
    resLager.clearLayers();
    platser.forEach((p, i) => L.marker([p[0], p[1]], { icon: numreradIkon('markor-facit', 20, i + 1), keyboard: false, interactive: false }).addTo(resLager));
    passaIn(platser.map(p => [p[0], p[1]]), $('multiSlut'), 8);
  }

  // Zooma in punkterna och lämna plats för kortet: till höger på dator, längst ned på mobil
  function passaIn(punkter, kort, maxZoom) {
    if (punkter.length === 1) { resKarta.setView(punkter[0], 5, { animate: false }); return; }
    resKarta.fitBounds(L.latLngBounds(punkter), {
      paddingTopLeft: [50, 60],
      paddingBottomRight: mobil.matches ? [50, kort.offsetHeight + 40] : [kort.offsetWidth + 60, 60],
      maxZoom,
      animate: false,
    });
  }

  const spelarIkon = r => L.divIcon({
    className: 'markor-spelare', iconSize: [28, 28], iconAnchor: [14, 14],
    html: `<span style="border-color:${r.farg};color:${r.farg}">${r.namn.trim().charAt(0).toUpperCase() || '?'}</span>`,
  });

  function nasta() {
    if (S.lage !== 'resultat') return;
    if (S.multi) { if (api.multiNasta) api.multiNasta(); return; }
    S.nr++;
    if (S.traning) {
      S.rundor.push({ plats: S.nastaPlats || S.valjNasta(), gissning: null, km: null, poang: 0 });
      S.nastaPlats = null;
      startaRunda();
    } else if (S.nr < RUNDOR) {
      startaRunda();
    } else {
      visaSlut();
    }
  }

  function visaSlut() {
    visaLage('slut');
    initResKarta();
    resLager.clearLayers();

    const summa = S.rundor.reduce((s, r) => s + r.poang, 0);
    const punkter = [];
    S.rundor.forEach((r, i) => {
      const [lat, lng] = r.plats;
      if (r.gissning) {
        const g = [r.gissning.lat, r.gissning.lng];
        const f = [lat, narmasteLng(lng, r.gissning.lng)];
        ritaSträcka(g, f, false);
        L.marker(g, { icon: ikonGissning, keyboard: false, interactive: false }).addTo(resLager);
        L.marker(f, { icon: numreradIkon('markor-facit', 20, i + 1), keyboard: false, interactive: false }).addTo(resLager);
        punkter.push(g, f);
      } else {
        L.marker([lat, lng], { icon: numreradIkon('markor-facit', 20, i + 1), keyboard: false, interactive: false }).addTo(resLager);
        punkter.push([lat, lng]);
      }
    });
    const tid = TIDER.find(t => t.s === S.tid);
    $('slutKarta').textContent = `${S.karta.namn} · ${tid.s ? `${tid.namn} per runda` : 'utan tidsgräns'}`;
    raknaUpp($('slutPoang'), summa, 1300);
    fyllStapel($('slutStapel'), summa / (MAXPOANG * RUNDOR));
    $('slutOmdome').textContent = omdome(summa);

    const rekord = las('vilse.rekord', {});
    const tidigare = rekord[S.karta.id] || 0;
    if (summa > tidigare) {
      rekord[S.karta.id] = summa;
      spara('vilse.rekord', rekord);
      $('slutRekord').innerHTML = tidigare
        ? `<span class="nytt">Nytt rekord</span>Förra rekordet var ${nf.format(tidigare)}.`
        : `<span class="nytt">Nytt rekord</span>Första omgången på den här kartan.`;
    } else {
      $('slutRekord').textContent = `Ditt rekord på den här kartan: ${nf.format(tidigare)}`;
    }

    $('slutLista').innerHTML = S.rundor.map((r, i) => `<li>
        <span class="nr">${i + 1}</span>
        <span class="ort">${r.plats[2]} <small>${r.plats[3]}</small></span>
        <span class="km">${r.gissning ? fmtAvstand(r.km) + ' bort' : 'ingen gissning'}</span>
        <span class="p">${nf.format(r.poang)}</span>
      </li>`).join('');

    // Slutkortet ligger till höger på dator och längst ned på mobil
    const kort = $('slutKort');
    resKarta.fitBounds(L.latLngBounds(punkter), {
      paddingTopLeft: [50, 50],
      paddingBottomRight: mobil.matches ? [50, kort.offsetHeight + 40] : [kort.offsetWidth + 60, 50],
      maxZoom: 12,
      animate: false,
    });
    $('igenKnapp').focus({ preventScroll: true });
    forberedSpel(S.karta.id);   // så att Spela igen börjar utan väntan
  }

  function omdome(summa) {
    const andel = summa / (MAXPOANG * RUNDOR);
    if (andel >= 0.92) return 'Du hittar hem från var som helst.';
    if (andel >= 0.75) return 'Stark kartläsning. Nästan alla kontroller tagna.';
    if (andel >= 0.5) return 'Rätt världsdel för det mesta. Några felvägval.';
    if (andel >= 0.25) return 'Du hittade ett par kontroller. Resten var i dimma.';
    return 'Helt vilse den här gången.';
  }

  function raknaUpp(el, mal, ms = 900) {
    if (reduceraRorelse || mal === 0) { el.textContent = nf.format(mal); return; }
    const t0 = performance.now();
    const steg = t => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = nf.format(Math.round(mal * (1 - (1 - k) ** 3)));
      if (k < 1) requestAnimationFrame(steg);
    };
    el.textContent = '0';
    requestAnimationFrame(steg);
  }

  function fyllStapel(el, andel) {
    el.style.transition = 'none';
    el.style.width = '0';
    el.getBoundingClientRect();
    el.style.transition = '';
    el.style.width = `${Math.max(0, Math.min(1, andel)) * 100}%`;
  }

  // ---------- Verktyg under spelet ----------
  function bytPlats() {
    if (S.lage === 'land') { if (api.bytLandPlats) api.bytLandPlats(); return; }
    if (S.lage !== 'spel') return;
    if (S.traning) S.rundor[S.nr].plats = S.valjNasta();
    else if (S.reserv.length) S.rundor[S.nr].plats = S.reserv.shift();
    else return;
    rensaGissning();
    stoppaTimer();
    if (S.tid) $('hudTid').textContent = fmtTid(S.tid);
    satVy(S.rundor[S.nr].plats);
    laddaVy(startaTimer);
  }

  function tillStart() {
    if (S.lage !== 'spel' && S.lage !== 'land') return;
    laddaVy();
  }

  function tillMeny() {
    stoppaTimer();
    S.traning = false;
    S.multi = false;
    S.multiGissat = false;
    visaLage('start');
    byggStart();
    bakgrundsvy();
    forberedSpel(valdKartaPaStart());
    document.dispatchEvent(new Event('vilse:meny'));
  }

  const valdKartaPaStart = () => document.querySelector('input[name="karta"]:checked')?.value || 'varlden';

  // ---------- Händelser ----------
  $('startKnapp').addEventListener('click', () => {
    const karta = document.querySelector('input[name="karta"]:checked')?.value || 'varlden';
    const tid = +(document.querySelector('input[name="tid"]:checked')?.value || 0);
    startaSpel(karta, tid);
  });
  $('gissaKnapp').addEventListener('click', gissa);
  $('nastaKnapp').addEventListener('click', nasta);
  $('igenKnapp').addEventListener('click', () => startaSpel(S.karta.id, S.tid));
  $('menyKnapp').addEventListener('click', tillMeny);
  $('tillStart').addEventListener('click', tillStart);
  $('bytPlats').addEventListener('click', bytPlats);
  // Träning sparas efter varje svar, så där behövs ingen bekräftelse
  $('avsluta').addEventListener('click', () => {
    if (S.traning || S.lage === 'land') { tillMeny(); return; }
    $('bekraftaText').textContent = S.multi
      ? 'Lämna rummet? Du kan gå med igen med samma kod så länge värden är kvar.'
      : 'Avsluta spelet? Poängen från den här omgången sparas inte.';
    $('bekraftaJa').textContent = S.multi ? 'Lämna' : 'Avsluta';
    $('bekrafta').hidden = !$('bekrafta').hidden;
  });
  $('bekraftaNej').addEventListener('click', () => { $('bekrafta').hidden = true; });
  $('bekraftaJa').addEventListener('click', () => {
    if (S.multi && api.multiLamna) api.multiLamna();
    else tillMeny();
  });

  $('oppnaKarta').addEventListener('click', () => {
    $('giss').classList.add('oppen');
    gissKarta.invalidateSize({ animate: false });
    if (S.vantarStartvy) startvyGissKarta();
  });
  $('stangKarta').addEventListener('click', () => $('giss').classList.remove('oppen'));

  // Kartan håller sig stor medan man använder tangentbordet i den
  $('giss').addEventListener('focusin', () => $('giss').classList.add('har-fokus'));
  $('giss').addEventListener('focusout', e => {
    if (!$('giss').contains(e.relatedTarget)) $('giss').classList.remove('har-fokus');
  });

  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const mellanslag = e.key === ' ' || e.code === 'Space';
    if (S.lage === 'spel' && (mellanslag || e.key === 'Enter') && S.gissning && !e.target.closest('button')) {
      e.preventDefault();
      gissa();
    } else if (S.lage === 'resultat' && mellanslag && !e.target.closest('button')) {
      e.preventDefault();
      nasta();
    } else if (e.key === 'Escape') {
      $('giss').classList.remove('oppen');
      $('bekrafta').hidden = true;
    }
  });

  // ---------- Det träningen (traning.js) och rummen (multi.js) använder ----------
  // Platserna till en omgång i ett rum, med samma urval som i vanligt spel
  function valjPlatser(kartId, antal) {
    const karta = KARTOR.find(k => k.id === kartId) || KARTOR[0];
    return ordnaPlatser(window.PLATSER.filter(karta.filter), karta).slice(0, antal);
  }
  function skalaForKarta(kartId) {
    const karta = KARTOR.find(k => k.id === kartId) || KARTOR[0];
    return skalaFor(karta, window.PLATSER.filter(karta.filter));
  }

  Object.assign(api, {
    S, $, nf, las, spara, blanda, avstandKm, fmtAvstand, reduceraRorelse, mobil,
    satVy, laddaVy, kartlager, ikonFacit, visaLage, tillMeny, startaFriTraning,
    KARTOR, RUNDOR, valjPlatser, skalaForKarta, poangFor, raknaUpp, forladda,
    startaMultiRunda, visaMultiResultat, visaMultiSlut, bakgrundsvy,
    // Sätts av multi.js:
    multiGissa: null,     // (gissning eller null) => skickar gissningen till värden
    multiNasta: null,     // värden går vidare till nästa runda
    multiLamna: null,     // lämnar rummet
    // Sätts av traning.js:
    ledtradarFor: null,   // (plats, element) => fyller i landets ledtrådar på resultatkortet
    bytLandPlats: null,   // byter plats i övningen Vilket land?
  });

  // ---------- Kör ----------
  byggStart();
  visaLage('start');
  bakgrundsvy();
  forberedSpel(valdKartaPaStart());
  $('kartval').addEventListener('change', e => { if (e.target.name === 'karta') forberedSpel(e.target.value); });
})();
