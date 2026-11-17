// Språk: svenska eller engelska. Laddas före allt annat.
// Spelets egna texter och data är på svenska. På engelska slås varje text upp i engelska.js (och
// ledtrådarna i ledtradar-en.js), med den svenska texten som nyckel. Saknas en översättning visas svenskan.
//   SPRAK.t('Runda {nr} av {antal}', { nr: 2, antal: 5 })   text i gränssnittet
//   SPRAK.d('Köpenhamn')                                     namn i datan: länder, orter, frågor, klubbar
// Valet sparas i webbläsaren. Första gången gäller webbläsarens språk: svenska om den är svensk,
// norsk eller dansk, annars engelska.
(() => {
  'use strict';
  let kod;
  try { kod = JSON.parse(localStorage.getItem('vilse.sprak')); } catch { /* ingen lagring */ }
  if (kod !== 'sv' && kod !== 'en') kod = /^(sv|nb|nn|no|da)\b/i.test(navigator.language || '') ? 'sv' : 'en';

  const S = window.SPRAK = {
    kod,
    en: kod === 'en',
    ord: {},       // gränssnittet: svensk text -> engelsk text (engelska.js)
    data: {},      // datan: svenskt namn -> engelskt namn (engelska.js)
    t(sv, varden) {
      let s = S.en && Object.prototype.hasOwnProperty.call(S.ord, sv) ? S.ord[sv] : sv;
      if (varden) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in varden ? varden[k] : m));
      return s;
    },
    d(sv) {
      if (!S.en || sv == null) return sv;
      return Object.prototype.hasOwnProperty.call(S.data, sv) ? S.data[sv] : sv;
    },
    // Talformat och sortering efter språket
    nf: new Intl.NumberFormat(kod === 'en' ? 'en-GB' : 'sv-SE'),
    locale: kod === 'en' ? 'en' : 'sv',
    byt(nytt) {
      try { localStorage.setItem('vilse.sprak', JSON.stringify(nytt)); } catch { /* ingen lagring */ }
      location.reload();
    },
  };

  if (S.en) {
    // Översättningarna laddas direkt, före spelets egna skript, med samma version som den här filen
    const v = (document.currentScript && document.currentScript.src.match(/\?v=[\w.]+/) || [''])[0];
    document.write(`<script src="engelska.js${v}"><\/script><script src="ledtradar-en.js${v}"><\/script>`);
    document.documentElement.lang = 'en';
  }

  // Sidans fasta texter: textnoder och några attribut vars svenska text finns i ordlistan
  function oversattSidan() {
    if (!S.en) return;
    const gang = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const noder = [];
    while (gang.nextNode()) noder.push(gang.currentNode);
    for (const n of noder) {
      const text = n.nodeValue.trim();
      if (text && Object.prototype.hasOwnProperty.call(S.ord, text)) n.nodeValue = n.nodeValue.replace(text, S.ord[text]);
    }
    for (const el of document.querySelectorAll('[placeholder], [title], [aria-label]')) {
      for (const attr of ['placeholder', 'title', 'aria-label']) {
        const varde = el.getAttribute(attr);
        if (varde && Object.prototype.hasOwnProperty.call(S.ord, varde)) el.setAttribute(attr, S.ord[varde]);
      }
    }
    const beskr = document.querySelector('meta[name="description"]');
    if (beskr) beskr.content = S.t(beskr.content);
  }

  // Knappen som byter språk ligger på startsidan
  function sprakknapp() {
    const knapp = document.getElementById('sprakKnapp');
    if (!knapp) return;
    knapp.textContent = S.en ? 'Svenska' : 'English';
    knapp.lang = S.en ? 'sv' : 'en';
    knapp.addEventListener('click', () => S.byt(S.en ? 'sv' : 'en'));
  }

  // Körs när sidan är inläst men före spelets skript (de ligger sist i body och laddas efter den här filen)
  S.oversattSidan = oversattSidan;
  document.addEventListener('DOMContentLoaded', sprakknapp);
})();
