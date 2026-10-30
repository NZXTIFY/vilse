// Spel med vänner i realtid.
// En spelare är värd: värdens webbläsare håller i omgången (platser, tid och poäng) och de andra
// ansluter direkt till den via WebRTC med PeerJS. Ingen inloggning och ingen egen server behövs;
// PeerJS gratis kopplingsserver används bara för att webbläsarna ska hitta varandra.
//
// Meddelanden från gäst till värd:  hej, gissning, puls, hejda
// Meddelanden från värd till gäst:  valkommen, lobby, forladda, runda, gissat, resultat, slut, puls, fel, stangt
//
// forladda skickar nästa rundas plats i förväg (i lobbyn och medan resultatet visas), så att alla
// hinner ladda gatuvyn i bakgrunden och rundan inte börjar med en svart skärm.
(() => {
  'use strict';

  const V = window.Vilse;
  const { $, nf, las, spara } = V;

  const PREFIX = 'vilse-rum-';
  const KODTECKEN = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // utan 0/O och 1/I som är lätta att blanda ihop
  const MAX_SPELARE = 8;
  const FARGER = ['#A3237A', '#1F6FB2', '#2B7A4B', '#D9822B', '#6B4FBB', '#0E8A8A', '#B63A2B', '#8A6D1F'];
  const TIDER = [{ s: 60, namn: '1 min' }, { s: 120, namn: '2 min' }, { s: 180, namn: '3 min' }];
  const PULS_MS = 4000;       // hur ofta värd och gäster hör av sig
  const TYST_MS = 16000;      // så länge utan livstecken innan någon räknas som borta
  const MARGINAL_MS = 1500;   // extra tid för gissningar som är på väg när tiden tar slut

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kartnamn = id => (V.KARTOR.find(k => k.id === id) || V.KARTOR[0]).namn;
  const tidnamn = s => (TIDER.find(t => t.s === s) || TIDER[1]).namn;
  const lank = kod => `${location.origin}${location.pathname}?rum=${kod}`;

  const M = {
    roll: null,              // 'vard' eller 'gast'
    peer: null,
    kod: '',
    jag: '',                 // mitt id; värdens id är rummets id
    lage: 'lobby',           // lobby, runda, resultat, slut
    spelare: [],             // [{ id, namn, farg }]
    installningar: { karta: 'varlden', tid: 120 },
    nr: 0,
    pulsTimer: 0,
    // Bara hos värden
    anslutningar: new Map(), // id -> anslutning
    senastHord: new Map(),   // id -> tidpunkt för senaste meddelandet
    rundor: [],              // [{ plats, riktning }]
    forberedd: null,         // kartan som rundor valdes för i lobbyn
    gissningar: new Map(),   // id -> { lat, lng } eller null (ingen gissning)
    total: {},               // id -> poäng hittills
    skala: 1,
    deadline: 0,
    rundTimer: 0,
    senaste: null,           // senaste resultat- eller slutmeddelandet, till den som ansluter sent
    // Bara hos gästen
    vard: null,
    senastFranVard: 0,
  };

  // ---------- Hjälpfunktioner ----------
  function visaStatus(text, fel = false) {
    const el = $('multiStatus');
    el.textContent = text;
    el.hidden = !text;
    el.classList.toggle('fel', fel);
  }

  function lasNamn() {
    const namn = $('multiNamn').value.trim().replace(/\s+/g, ' ').slice(0, 16);
    if (!namn) {
      visaStatus('Skriv ditt namn först, så vet de andra vem du är.', true);
      $('multiNamn').focus();
      return '';
    }
    spara('vilse.namn', namn);
    return namn;
  }

  function nyKod() {
    let kod = '';
    for (let i = 0; i < 4; i++) kod += KODTECKEN[Math.floor(Math.random() * KODTECKEN.length)];
    return kod;
  }

  function skicka(anslutning, meddelande) {
    if (anslutning && anslutning.open) {
      try { anslutning.send(meddelande); } catch { /* anslutningen stängs strax */ }
    }
  }
  function skickaTillAlla(meddelande) {
    for (const anslutning of M.anslutningar.values()) skicka(anslutning, meddelande);
  }

  function peerFel(err) {
    switch (err.type) {
      case 'browser-incompatible': return 'Den här webbläsaren stöder inte direktanslutningar. Prova Chrome, Safari, Firefox eller Edge.';
      case 'network':
      case 'server-error':
      case 'socket-error':
      case 'socket-closed': return 'Kunde inte nå kopplingsservern. Kontrollera internetanslutningen och försök igen.';
      default: return `Anslutningen fungerade inte (${err.type}). Försök igen.`;
    }
  }

  // Stänger anslutningarna och nollställer allt
  function stang() {
    clearInterval(M.pulsTimer);
    clearTimeout(M.rundTimer);
    if (M.peer && !M.peer.destroyed) M.peer.destroy();
    Object.assign(M, {
      roll: null, peer: null, kod: '', jag: '', lage: 'lobby', spelare: [], nr: 0, pulsTimer: 0,
      anslutningar: new Map(), senastHord: new Map(), rundor: [], forberedd: null, gissningar: new Map(), total: {},
      deadline: 0, rundTimer: 0, senaste: null, vard: null, senastFranVard: 0,
    });
  }

  // Tillbaka till startskärmen med ett meddelande på fliken Med vänner
  function tillbaka(text, fel = false) {
    stang();
    V.tillMeny();
    if (V.visaFlik) V.visaFlik('multi');
    visaStatus(text, fel);
  }

  // ---------- Värd ----------
  function skapaRum() {
    const namn = lasNamn();
    if (!namn) return;
    if (!window.Peer) { visaStatus('Kunde inte ladda anslutningen. Kontrollera internetanslutningen och ladda om sidan.', true); return; }
    stang();
    M.roll = 'vard';
    M.kod = nyKod();
    M.installningar = las('vilse.rumVal', M.installningar);
    visaStatus('Skapar rum…');

    const peer = new Peer(PREFIX + M.kod, { debug: 1 });
    M.peer = peer;
    peer.on('open', id => {
      M.jag = id;
      M.spelare = [{ id, namn, farg: FARGER[0] }];
      M.total = { [id]: 0 };
      M.pulsTimer = setInterval(vardPuls, PULS_MS);
      visaStatus('');
      visaLobby();
      forberedOmgang();
    });
    peer.on('connection', taEmotGast);
    // Förlorad kontakt med kopplingsservern påverkar inte redan anslutna spelare, men nya kan inte ansluta
    peer.on('disconnected', () => { if (M.peer === peer && !peer.destroyed) peer.reconnect(); });
    peer.on('error', err => {
      if (M.peer !== peer) return;
      if (err.type === 'unavailable-id') { stang(); skapaRum(); return; }   // koden var upptagen
      if (err.type === 'peer-unavailable') return;
      tillbaka(peerFel(err), true);
    });
  }

  function taEmotGast(anslutning) {
    anslutning.on('data', meddelande => vardTarEmot(anslutning, meddelande));
    anslutning.on('close', () => tappaSpelare(anslutning.peer));
    anslutning.on('error', () => tappaSpelare(anslutning.peer));
  }

  function vardTarEmot(anslutning, m) {
    if (!m || typeof m !== 'object') return;
    const id = anslutning.peer;
    M.senastHord.set(id, Date.now());
    switch (m.t) {
      case 'hej': {
        let spelare = M.spelare.find(s => s.id === id);
        if (!spelare && M.spelare.length >= MAX_SPELARE) {
          skicka(anslutning, { t: 'fel', text: `Rummet är fullt. Högst ${MAX_SPELARE} spelare får vara med.` });
          setTimeout(() => anslutning.close(), 800);
          return;
        }
        M.anslutningar.set(id, anslutning);
        if (!spelare) {
          spelare = { id, namn: unikt(String(m.namn || 'Spelare').slice(0, 16)), farg: ledigFarg() };
          M.spelare.push(spelare);
          M.total[id] = 0;
        }
        skicka(anslutning, { t: 'valkommen', du: id, kod: M.kod });
        skickaLobby();
        // Den som kommer in mitt i en omgång hoppar in där omgången är
        if (M.lage === 'runda') skicka(anslutning, rundMeddelande(id));
        else if (M.senaste && M.lage !== 'lobby') skicka(anslutning, M.senaste);
        // och får nästa runda att förladda
        const nasta = M.lage === 'lobby' ? 0 : M.lage === 'resultat' ? M.nr + 1 : -1;
        if (nasta >= 0 && M.rundor[nasta]) skicka(anslutning, forladdaMeddelande(nasta));
        break;
      }
      case 'gissning': vardGissning(id, m); break;
      case 'hejda': tappaSpelare(id); break;
      default: break;
    }
  }

  function unikt(namn) {
    const ren = namn.trim() || 'Spelare';
    let kandidat = ren, n = 2;
    while (M.spelare.some(s => s.namn.toLowerCase() === kandidat.toLowerCase())) kandidat = `${ren} ${n++}`;
    return kandidat;
  }
  function ledigFarg() {
    return FARGER.find(f => !M.spelare.some(s => s.farg === f)) || FARGER[M.spelare.length % FARGER.length];
  }

  function tappaSpelare(id) {
    const anslutning = M.anslutningar.get(id);
    M.anslutningar.delete(id);
    M.senastHord.delete(id);
    if (anslutning && anslutning.open) anslutning.close();
    if (!M.spelare.some(s => s.id === id)) return;
    M.spelare = M.spelare.filter(s => s.id !== id);
    M.gissningar.delete(id);
    skickaLobby();
    if (M.lage === 'runda') {
      const status = gissatStatus();
      skickaTillAlla(status);
      visaGissat(status);
      kontrolleraAllaGissat();
    }
  }

  function vardPuls() {
    skickaTillAlla({ t: 'puls' });
    const nu = Date.now();
    for (const [id, tid] of M.senastHord) if (nu - tid > TYST_MS) tappaSpelare(id);
  }

  function lobbyMeddelande() {
    return { t: 'lobby', spelare: M.spelare, installningar: M.installningar, lage: M.lage };
  }
  function skickaLobby() {
    const m = lobbyMeddelande();
    skickaTillAlla(m);
    visaLobbyMeddelande(m);
  }

  // Väljer omgångens platser redan i lobbyn och låter alla börja ladda den första
  function forberedOmgang() {
    if (M.roll !== 'vard') return;
    M.rundor = V.valjPlatser(M.installningar.karta, V.RUNDOR).map(plats => ({ plats, riktning: Math.floor(Math.random() * 360) }));
    M.forberedd = M.installningar.karta;
    skickaForladda(0);
  }

  function forladdaMeddelande(nr) {
    const r = M.rundor[nr];
    return { t: 'forladda', plats: [r.plats[0], r.plats[1]], riktning: r.riktning };
  }
  function skickaForladda(nr) {
    if (!M.rundor[nr]) return;
    const m = forladdaMeddelande(nr);
    skickaTillAlla(m);
    V.forladda(m.plats, m.riktning);
  }

  function startaOmgang() {
    if (M.roll !== 'vard') return;
    if (!M.rundor.length || M.forberedd !== M.installningar.karta) forberedOmgang();
    M.forberedd = null;
    M.skala = V.skalaForKarta(M.installningar.karta);
    M.total = Object.fromEntries(M.spelare.map(s => [s.id, 0]));
    M.nr = 0;
    nyRunda();
  }

  function nyRunda() {
    M.lage = 'runda';
    M.gissningar = new Map();
    M.deadline = Date.now() + M.installningar.tid * 1000;
    clearTimeout(M.rundTimer);
    M.rundTimer = setTimeout(avslutaRunda, M.installningar.tid * 1000 + MARGINAL_MS);
    for (const s of M.spelare) if (s.id !== M.jag) skicka(M.anslutningar.get(s.id), rundMeddelande(s.id));
    visaRunda(rundMeddelande(M.jag));
  }

  // Platsens namn skickas först med resultatet, så att det inte går att fuska fram
  function rundMeddelande(id) {
    const r = M.rundor[M.nr];
    return {
      t: 'runda', nr: M.nr, antal: M.rundor.length, karta: M.installningar.karta,
      plats: [r.plats[0], r.plats[1]], riktning: r.riktning,
      kvarMs: Math.max(0, M.deadline - Date.now()), total: M.total[id] || 0,
      gissat: M.gissningar.size, av: M.spelare.length,
    };
  }

  function gissatStatus() {
    return { t: 'gissat', antal: M.spelare.filter(s => M.gissningar.has(s.id)).length, av: M.spelare.length };
  }

  function vardGissning(id, m) {
    if (M.lage !== 'runda' || m.nr !== M.nr || M.gissningar.has(id)) return;
    const giltig = Number.isFinite(m.lat) && Number.isFinite(m.lng);
    M.gissningar.set(id, giltig ? { lat: m.lat, lng: m.lng } : null);
    const status = gissatStatus();
    skickaTillAlla(status);
    visaGissat(status);
    kontrolleraAllaGissat();
  }

  function kontrolleraAllaGissat() {
    if (M.lage === 'runda' && M.spelare.every(s => M.gissningar.has(s.id))) avslutaRunda();
  }

  function avslutaRunda() {
    if (M.lage !== 'runda') return;
    clearTimeout(M.rundTimer);
    const r = M.rundor[M.nr];
    const [lat, lng, ort, land] = r.plats;
    const rader = M.spelare.map(s => {
      const g = M.gissningar.get(s.id);
      const km = g ? V.avstandKm(g.lat, g.lng, lat, lng) : null;
      const poang = g ? V.poangFor(km, M.skala) : 0;
      M.total[s.id] = (M.total[s.id] || 0) + poang;
      return { id: s.id, namn: s.namn, farg: s.farg, lat: g ? g.lat : null, lng: g ? g.lng : null, km, poang, total: M.total[s.id] };
    }).sort((a, b) => b.poang - a.poang || b.total - a.total);
    M.lage = 'resultat';
    M.senaste = { t: 'resultat', nr: M.nr, antal: M.rundor.length, plats: [lat, lng, ort, land], rader };
    skickaTillAlla(M.senaste);
    visaResultat(M.senaste);
    skickaForladda(M.nr + 1);
  }

  function vardNasta() {
    if (M.roll !== 'vard' || M.lage !== 'resultat') return;
    if (M.nr + 1 < M.rundor.length) {
      M.nr++;
      nyRunda();
      return;
    }
    M.lage = 'slut';
    const rader = M.spelare
      .map(s => ({ id: s.id, namn: s.namn, farg: s.farg, total: M.total[s.id] || 0 }))
      .sort((a, b) => b.total - a.total);
    M.senaste = { t: 'slut', platser: M.rundor.map(r => [r.plats[0], r.plats[1], r.plats[2], r.plats[3]]), rader };
    skickaTillAlla(M.senaste);
    visaSlut(M.senaste);
  }

  function tillLobbyn() {
    if (M.roll !== 'vard') return;
    clearTimeout(M.rundTimer);
    M.lage = 'lobby';
    M.senaste = null;
    skickaLobby();
    forberedOmgang();
  }

  // ---------- Gäst ----------
  function gaMed(kodIn) {
    const namn = lasNamn();
    if (!namn) return;
    const kod = String(kodIn || $('multiKod').value).trim().toUpperCase();
    if (!/^[A-Z0-9]{4}$/.test(kod)) {
      visaStatus('Rumskoden har fyra tecken, till exempel K7Q2.', true);
      $('multiKod').focus();
      return;
    }
    if (!window.Peer) { visaStatus('Kunde inte ladda anslutningen. Kontrollera internetanslutningen och ladda om sidan.', true); return; }
    stang();
    M.roll = 'gast';
    M.kod = kod;
    visaStatus(`Ansluter till rum ${kod}…`);

    const peer = new Peer({ debug: 1 });
    M.peer = peer;
    let oppen = false;
    const vantan = setTimeout(() => {
      if (!oppen && M.peer === peer) tillbaka(`Fick ingen kontakt med rum ${kod}. Kontrollera koden och att värden har spelet öppet.`, true);
    }, 15000);

    peer.on('open', () => {
      const anslutning = peer.connect(PREFIX + kod, { reliable: true, serialization: 'json' });
      M.vard = anslutning;
      anslutning.on('open', () => {
        oppen = true;
        clearTimeout(vantan);
        M.senastFranVard = Date.now();
        skicka(anslutning, { t: 'hej', namn });
        M.pulsTimer = setInterval(gastPuls, PULS_MS);
      });
      anslutning.on('data', m => { M.senastFranVard = Date.now(); gastTarEmot(m); });
      anslutning.on('close', () => { if (M.vard === anslutning) tillbaka('Värden lämnade rummet.'); });
      anslutning.on('error', () => { if (M.vard === anslutning) tillbaka('Anslutningen till värden bröts.', true); });
    });
    peer.on('error', err => {
      if (M.peer !== peer) return;
      clearTimeout(vantan);
      if (err.type === 'peer-unavailable') tillbaka(`Hittade inget rum med koden ${kod}. Kontrollera koden och att värden har rummet öppet.`, true);
      else tillbaka(peerFel(err), true);
    });
  }

  function gastPuls() {
    skicka(M.vard, { t: 'puls' });
    if (Date.now() - M.senastFranVard > TYST_MS) tillbaka('Tappade kontakten med värden.', true);
  }

  function gastTarEmot(m) {
    if (!m || typeof m !== 'object') return;
    switch (m.t) {
      case 'valkommen': M.jag = m.du; visaStatus(''); break;
      case 'lobby': visaLobbyMeddelande(m); break;
      case 'forladda': if (Array.isArray(m.plats)) V.forladda(m.plats, m.riktning); break;
      case 'runda': visaRunda(m); break;
      case 'gissat': visaGissat(m); break;
      case 'resultat': visaResultat(m); break;
      case 'slut': visaSlut(m); break;
      case 'fel': tillbaka(m.text, true); break;
      case 'stangt': tillbaka('Värden stängde rummet.'); break;
      default: break;
    }
  }

  // ---------- Visa (samma för värd och gäst) ----------
  function visaLobbyMeddelande(m) {
    M.spelare = m.spelare;
    M.installningar = m.installningar;
    if (m.lage === 'lobby') {
      M.lage = 'lobby';
      visaLobby();
    } else {
      M.lage = m.lage;
    }
  }

  function visaLobby() {
    if (V.S.lage !== 'lobby') {
      V.S.multi = false;
      V.visaLage('lobby');
    }
    const vard = M.roll === 'vard';
    $('lobbyKod').textContent = M.kod;
    $('lobbyLank').textContent = lank(M.kod).replace(/^https?:\/\//, '');
    $('lobbySpelareRubrik').textContent = `Spelare (${M.spelare.length} av ${MAX_SPELARE})`;
    $('lobbySpelare').innerHTML = M.spelare.map((s, i) => `<li>
        <span class="prick" style="background:${s.farg}" aria-hidden="true"></span>
        <span class="spelarnamn">${esc(s.namn)}</span>
        ${i === 0 ? '<span class="tagg">värd</span>' : ''}
        ${s.id === M.jag ? '<span class="tagg tagg-du">du</span>' : ''}
      </li>`).join('');

    $('lobbyVard').hidden = !vard;
    $('lobbyGast').hidden = vard;
    if (vard) {
      $('lobbyKarta').innerHTML = V.KARTOR.map(k => `<label class="chip">
          <input type="radio" name="rumKarta" value="${k.id}" ${k.id === M.installningar.karta ? 'checked' : ''}><span>${k.namn}</span>
        </label>`).join('');
      $('lobbyTid').innerHTML = TIDER.map(t => `<label>
          <input type="radio" name="rumTid" value="${t.s}" ${t.s === M.installningar.tid ? 'checked' : ''}><span>${t.namn}</span>
        </label>`).join('');
      $('lobbyStart').textContent = M.spelare.length > 1 ? 'Starta spelet' : 'Starta ensam';
    } else {
      $('lobbyGast').innerHTML = `<b>${esc(kartnamn(M.installningar.karta))}</b> · ${tidnamn(M.installningar.tid)} per runda<br>Väntar på att värden startar spelet…`;
    }
  }

  function visaRunda(m) {
    M.lage = 'runda';
    M.nr = m.nr;
    V.startaMultiRunda({ kartId: m.karta, nr: m.nr, antal: m.antal, plats: m.plats, riktning: m.riktning, kvarMs: m.kvarMs, total: m.total });
    visaGissat({ antal: m.gissat, av: m.av });
  }

  function visaGissat(m) {
    $('hudGissat').textContent = `${m.antal} / ${m.av}`;
    if (V.S.multiGissat && V.S.lage === 'spel') $('gissaKnapp').textContent = `Väntar på de andra (${m.antal} av ${m.av} klara)`;
  }

  function visaResultat(m) {
    M.lage = 'resultat';
    const [lat, lng, ort, land] = m.plats;
    const vard = M.roll === 'vard';
    $('multiRundNr').textContent = `Runda ${m.nr + 1} av ${m.antal}`;
    $('multiPlats').textContent = `${ort}, ${land}`;
    $('multiLista').innerHTML = m.rader.map((r, i) => `<li class="${r.id === M.jag ? 'jag' : ''}">
        <span class="placering">${i + 1}</span>
        <span class="prick" style="background:${r.farg}" aria-hidden="true"></span>
        <span class="spelarnamn">${esc(r.namn)}<small>${r.km == null ? 'ingen gissning' : `${V.fmtAvstand(r.km)} bort`}</small></span>
        <span class="poang">+${nf.format(r.poang)}<small>totalt ${nf.format(r.total)}</small></span>
      </li>`).join('');
    $('multiNasta').hidden = !vard;
    $('multiNasta').textContent = m.nr + 1 < m.antal ? 'Nästa runda' : 'Se slutresultat';
    $('multiVantar').hidden = vard;
    const jag = m.rader.find(r => r.id === M.jag);
    if (jag) V.S.multiTotal = jag.total;
    V.visaMultiResultat([lat, lng], m.rader);
    if (vard) $('multiNasta').focus({ preventScroll: true });
  }

  function visaSlut(m) {
    M.lage = 'slut';
    const vard = M.roll === 'vard';
    const [forsta, andra] = m.rader;
    $('multiVinnare').textContent = m.rader.length === 1
      ? `Du fick ${nf.format(forsta.total)} poäng.`
      : andra && andra.total === forsta.total
        ? `Delad seger med ${nf.format(forsta.total)} poäng!`
        : `${forsta.namn} vinner med ${nf.format(forsta.total)} poäng!`;
    $('multiSlutLista').innerHTML = m.rader.map((r, i) => `<li class="${r.id === M.jag ? 'jag' : ''}">
        <span class="placering">${i + 1}</span>
        <span class="prick" style="background:${r.farg}" aria-hidden="true"></span>
        <span class="spelarnamn">${esc(r.namn)}</span>
        <span class="poang">${nf.format(r.total)}</span>
      </li>`).join('');
    $('multiIgen').hidden = !vard;
    $('multiSlutVantar').hidden = vard;
    V.visaMultiSlut(m.platser);
  }

  // ---------- Lämna ----------
  function lamna() {
    if (M.roll === 'vard') {
      skickaTillAlla({ t: 'stangt' });
      // Ge meddelandet en chans att gå iväg innan anslutningarna stängs
      setTimeout(() => tillbaka(''), 300);
    } else {
      skicka(M.vard, { t: 'hejda' });
      tillbaka('');
    }
  }

  async function delaLank() {
    const url = lank(M.kod);
    if (navigator.share && V.mobil.matches) {
      try { await navigator.share({ title: 'Vilse', text: `Spela Vilse med mig! Rumskod ${M.kod}`, url }); return; } catch { /* avbrutet */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      $('delaRum').textContent = 'Länken är kopierad';
      setTimeout(() => { $('delaRum').textContent = 'Dela länk'; }, 2200);
    } catch {
      const urval = document.createRange();
      urval.selectNodeContents($('lobbyLank'));
      getSelection().removeAllRanges();
      getSelection().addRange(urval);
    }
  }

  // ---------- Kopplingar till spel.js ----------
  V.multiGissa = gissning => {
    const m = { t: 'gissning', nr: M.nr, lat: gissning ? gissning.lat : null, lng: gissning ? gissning.lng : null };
    if (M.roll === 'vard') vardGissning(M.jag, m);
    else skicka(M.vard, m);
  };
  V.multiNasta = vardNasta;
  V.multiLamna = lamna;

  // ---------- Händelser ----------
  $('multiNamn').value = las('vilse.namn', '');
  $('skapaRum').addEventListener('click', skapaRum);
  $('gaMed').addEventListener('click', () => gaMed());
  $('multiKod').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
  $('multiKod').addEventListener('keydown', e => { if (e.key === 'Enter') gaMed(); });
  $('multiNamn').addEventListener('keydown', e => { if (e.key === 'Enter') ($('multiKod').value ? gaMed() : skapaRum()); });

  $('lobby').addEventListener('change', e => {
    if (M.roll !== 'vard') return;
    if (e.target.name === 'rumKarta') M.installningar = { ...M.installningar, karta: e.target.value };
    if (e.target.name === 'rumTid') M.installningar = { ...M.installningar, tid: Number(e.target.value) };
    spara('vilse.rumVal', M.installningar);
    skickaLobby();
    if (e.target.name === 'rumKarta') forberedOmgang();   // ny karta, nya platser att förladda
  });
  $('lobbyStart').addEventListener('click', startaOmgang);
  $('lobbyLamna').addEventListener('click', lamna);
  $('delaRum').addEventListener('click', delaLank);
  $('multiNasta').addEventListener('click', vardNasta);
  $('multiIgen').addEventListener('click', tillLobbyn);
  $('multiLamnaSlut').addEventListener('click', lamna);

  // Säg till de andra när fliken stängs, så att de inte behöver vänta på att anslutningen tystnar
  window.addEventListener('pagehide', () => {
    if (M.roll === 'vard') skickaTillAlla({ t: 'stangt' });
    else if (M.roll === 'gast') skicka(M.vard, { t: 'hejda' });
  });

  // En inbjudningslänk (?rum=K7Q2) öppnar fliken Med vänner med koden ifylld
  const inbjudan = new URLSearchParams(location.search).get('rum');
  if (inbjudan && /^[A-Za-z0-9]{4}$/.test(inbjudan)) {
    if (V.visaFlik) V.visaFlik('multi');
    $('multiKod').value = inbjudan.toUpperCase();
    visaStatus(`Du är inbjuden till rum ${inbjudan.toUpperCase()}. Skriv ditt namn och tryck Gå med.`);
    ($('multiNamn').value ? $('gaMed') : $('multiNamn')).focus({ preventScroll: true });
  }
})();
