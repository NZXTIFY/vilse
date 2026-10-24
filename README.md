# Vilse

Ett geografispel i stil med GeoGuessr. Du hamnar på en slumpad plats i Google Street View, ser dig omkring och sätter ut en nål på kartan där du tror att du är. Fem rundor, högst 5 000 poäng per runda.

Fliken **Träna** på startskärmen lär dig känna igen länder med ledtrådar från [Plonk It](https://www.plonkit.net/guide).

**Spela: https://nzxtify.github.io/vilse/**

## Starta

Starta en lokal server i mappen och öppna http://localhost:5178:

```bash
python -m http.server 5178
```

Det går oftast också att dubbelklicka på `index.html`.

## Så funkar det

- **Gatuvyn** är Googles inbäddade Street View (ingen API-nyckel behövs). Iframen är förskjuten uppåt så att Googles adressruta inte syns.
- **Kartorna** använder Leaflet med OpenStreetMap-bilder.
- **Poäng** räknas som i GeoGuessr: `5000 · e^(−10 · avstånd / kartans diagonal)`.
- **Platserna** finns i `platser.js` (638 st i 95 länder och områden). Varje punkt ligger på en bilväg så att Googles egna gatubilder visas i stället för användarnas inomhusfoton.
- Rekord, träningsstatistik och senast spelade platser sparas i webbläsarens `localStorage`.

## Träningsläget

- **Vilket land?** Välj bland fyra länder (tangent 1–4). På nivån *Lättförväxlade* är felalternativen länder som ofta blandas ihop med det rätta. **Ledtråd** visar först världsdel, sedan körriktning, sedan något som är unikt för landet, och tar till sist bort två fel svar. **Jämför länderna** visar ledtrådarna för alla fyra sida vid sida. Efter svaret ser du vad du skulle ha letat efter, och vid fel svar hur länderna skiljer sig åt.
- **Var exakt?** Vanlig gissning på kartan utan tidsgräns, med landets ledtrådar efter varje plats.
- **Mina svaga länder** visar oftare de länder du missar.
- **Ledtrådsbibliotek** listar alla länder med ledtrådar, filter och länkar till Plonk It.
- **Din statistik** visar träffprocent per land och vilka länder du blandar ihop.

Varje land väljs lika ofta, oavsett hur många platser det har. Hongkong, Svalbard, Madeira, Alaska och Hawaii räknas som egna länder, precis som hos Plonk It.

## Med vänner

- Fliken **Med vänner** skapar ett rum med en fyrteckenskod, till exempel `K7Q2`. Andra går med genom koden eller via länken `…/vilse/?rum=K7Q2`. Ingen inloggning behövs, bara ett namn.
- Upp till 8 spelare. Värden väljer karta och tid per runda (1–3 minuter) och startar omgången.
- Alla får samma 5 platser med samma startriktning samtidigt. Rundan slutar när alla har gissat eller tiden är ute.
- Efter varje runda visas allas gissningar på kartan i var sin färg, med poänglista. Efter 5 rundor visas slutresultatet och värden kan starta en ny omgång.

Tekniskt: värdens webbläsare håller i omgången, och de andra ansluter direkt till den med WebRTC via [PeerJS](https://peerjs.com/). PeerJS gratis kopplingsserver används bara för att webbläsarna ska hitta varandra, och dess reservservrar (TURN) hjälper när en direktanslutning inte går, till exempel på vissa mobilnät. Därför behöver värden ha spelet öppet tills omgången är slut. Koden finns i `multi.js`.

## Ledtrådarna och licensen

`ledtradar.js` innehåller korta sammanfattningar på svenska av första steget ("Identifying the country") i Plonk Its guide för varje land. Plonk It är licensierat under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.sv), och därför gäller samma licens för `ledtradar.js`:

- ange Plonk It som källa (det står i spelet och i filen)
- använd inte texterna kommersiellt
- dela ändrade versioner under samma licens

Plonk Its bilder används inte. Varje land länkar i stället till sin sida på plonkit.net.

## Kortkommandon

- **Mellanslag / Enter**: gissa (när en nål är utsatt)
- **Mellanslag**: nästa runda
- **1–4**: svara i Vilket land?
- **Enter**: nästa plats efter svaret
- **Esc**: stäng kartan på mobil, jämförelsen eller biblioteket

## Verktyg

- `verktyg/kontroll.html?from=0&n=15` visar 15 platser i ett rutnät så att du kan se vilka som saknar bild. `?orter=Umeå,Falun` visar bara de namngivna, och `?idx=12,40` platserna med de numren.
- `node verktyg/lagg-till.mjs nya.json` lägger till nya platser och flyttar dem till närmaste väg. Formatet är `[lat, lng, "Ort", "Land", "region"]`, med ett valfritt sjätte fält för träningsland (till exempel `"Hongkong"`).
- `node verktyg/flytta.mjs "Umeå=63.83,20.24"` ger en plats ny startpunkt och flyttar den till närmaste väg. `"Ort=bort"` tar bort platsen.
- `node verktyg/snappa.mjs` flyttar alla platser till närmaste väg (OSRM).

Om en plats visar svart bild i spelet: tryck **Byt plats**.
