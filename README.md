# Vilse

Ett geografispel i stil med GeoGuessr. Du hamnar på en slumpad plats i Google Street View, ser dig omkring och sätter ut en nål på kartan där du tror att du är. Fem rundor, högst 5 000 poäng per runda.

Fliken **Quiz** har sex lägen där du får en fråga och sätter nålen på rätt plats: Hemmaplan (klubbmärke → arena), Bilmärken, Företag, Historia, Landmärken och Huvudstäder. Fliken **Träna** lär dig känna igen länder med ledtrådar från [Plonk It](https://www.plonkit.net/guide).

**Spela: https://nzxtify.github.io/vilse/**

## Starta

Starta en lokal server i mappen och öppna http://localhost:5178:

```bash
python -m http.server 5178
```

Det går oftast också att dubbelklicka på `index.html`.

## Så funkar det

- **Gatuvyn** är Googles inbäddade Street View (ingen API-nyckel behövs). Iframen är förskjuten uppåt så att Googles adressruta inte syns.
- **Kartorna** använder Leaflet med Esris gatukarta (World Street Map), som har ortnamn med latinska bokstäver i hela världen.
- **Förladdning:** nästa plats laddas i en osynlig ram medan du tittar på förra resultatet (och runda 1 redan på startskärmen), så att rundan inte börjar med en svart skärm. I rum med vänner skickar värden nästa plats i förväg till alla.
- **Poäng** räknas som i GeoGuessr: `5000 · e^(−10 · avstånd / kartans diagonal)`.
- **Platserna** finns i `platser.js` (634 st i 95 länder och områden). Varje punkt ligger på en bilväg och är kontrollerad med `verktyg/agare.html`, så att Googles egna gatubilder visas i stället för användarnas flygbilder och inomhusfoton.
- Rekord, träningsstatistik och senast spelade platser sparas i webbläsarens `localStorage`.

## Quiz

Sex lägen med samma upplägg: en fråga till vänster, en stor karta till höger, fem rundor. Koden finns i `quiz.js`.

| Läge | Du får se | Du ska hitta | Full poäng inom |
|---|---|---|---|
| Hemmaplan | ett klubbmärke | klubbens hemmaarena | 150 m |
| Bilmärken | ett bil- eller motorcykelmärke | orten med huvudkontoret | 10 km |
| Företag | ett företags logga | orten med huvudkontoret | 10 km |
| Historia | en händelse och ett årtal | platsen där det hände | 10 km |
| Landmärken | namnet på en sevärdhet | sevärdheten | 1 km |
| Huvudstäder | ett land | landets huvudstad | 10 km |

- **Poäng:** hälften för rätt trakt och hälften för att pricka platsen, `5000 · (0,5 · e^(−km/a) + 0,5 · e^(−km/b))`. Måtten `a` och `b` är olika för varje läge (15 och 500 km i Hemmaplan, 80 och 900 km för huvudkontor) och står i `LAGEN` i `quiz.js`.
- **Ledtråd:** i lägena med märken kan du visa namnet, och i Historia och Landmärken landet. Det halverar rundans poäng.
- Hemmaplan har fyra urval: Storklubbar (77 handplockade), Hela världen, Norden och Sverige. Rekord sparas per läge och urval.
- **Klubbarna** finns i `klubbar.js` (308 st): `[klubb, hemmaarena, lat, lng, land, region, logga, stor]`. Klubbar, arenor och koordinater kommer från [Wikidata](https://www.wikidata.org/) (CC0).
- **Övriga frågor** finns i `kunskap.js`: `[fråga, svar, lat, lng, land, extra]`, där extra är märkets bild eller händelsens årtal. Koordinaterna kommer från artiklarna på engelska Wikipedia, huvudstäderna från Wikidata.
- **Märkena** hämtas direkt från [Wikimedia Commons](https://commons.wikimedia.org/) när de finns där som fria bilder. Skyddade märken (de flesta klubbmärken och några bilmärken) hämtas från artikeln på engelska Wikipedia, där de används som lågupplösta bilder ("fair use"). Resultatkortet länkar till bildens sida. Går ett märke inte att ladda visas namnet i en sköld i stället.
- Lägg till en fråga genom att skriva en ny rad i `klubbar.js` eller `kunskap.js`. En bild anges som filnamnet på Commons (utan `File:`), `en:filnamn` för en bild på engelska Wikipedia, eller tomt.

## Träningsläget

- **Vilket land?** Välj bland fyra länder (tangent 1–4). På nivån *Lättförväxlade* är felalternativen länder som ofta blandas ihop med det rätta. **Ledtråd** visar först världsdel, sedan körriktning, sedan något som är unikt för landet, och tar till sist bort två fel svar. **Jämför länderna** visar ledtrådarna för alla fyra sida vid sida. Efter svaret ser du vad du skulle ha letat efter, och vid fel svar hur länderna skiljer sig åt.
- **Var exakt?** Vanlig gissning på kartan utan tidsgräns, med landets ledtrådar efter varje plats.
- **Mina svaga länder** visar oftare de länder du missar.
- **Ledtrådsbibliotek** listar alla länder med ledtrådar, filter och länkar till Plonk It.
- **Din statistik** visar träffprocent per land och vilka länder du blandar ihop.

Varje land väljs lika ofta, oavsett hur många platser det har. Hongkong, Svalbard, Madeira, Alaska och Hawaii räknas som egna länder, precis som hos Plonk It.

## Med vänner

- Fliken **Med vänner** skapar ett rum med en fyrteckenskod, till exempel `K7Q2`. Andra går med genom koden eller via länken `…/vilse/?rum=K7Q2`. Ingen inloggning behövs, bara ett namn.
- Upp till 8 spelare. Värden väljer spelläge, karta och tid per runda (1–3 minuter) och startar omgången.
- Spelläget är antingen **Gatuvy** (vanligt spel på en karta) eller ett av quizlägena (Hemmaplan med valfritt urval av klubbar, Bilmärken, Företag, Historia, Landmärken eller Huvudstäder). I quizlägena räknas poängen som när man spelar ensam, och den som tar en ledtråd får halva poängen för rundan. Bara frågan skickas till de andra, svaret först med resultatet.
- Alla får samma 5 platser (eller frågor) samtidigt, med samma startriktning i gatuvyn. Rundan slutar när alla har gissat eller tiden är ute.
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

- `verktyg/agare.html?from=0&n=21&h=70` visar vem som äger gatubilden på varje plats. Längst ned i varje ruta ska det stå "© Google". Står det ett namn eller bara "Kartdata" är bilden uppladdad av en användare (ofta en flygbild eller ett inomhusfoto), och då ska platsen flyttas. `?punkter=lat,lng,Namn;lat,lng,Namn` provar fria punkter innan du flyttar dit.
- `verktyg/loggor.html` visar alla klubbmärken i Hemmaplan, och `?utan=1` klubbarna som saknar märke. `?quiz=bilar` och `?quiz=foretag` visar märkena i de lägena.
- `verktyg/kontroll.html?from=0&n=15` visar 15 platser i ett rutnät så att du kan se vilka som saknar bild. `?orter=Umeå,Falun` visar bara de namngivna, och `?idx=12,40` platserna med de numren.
- `node verktyg/lagg-till.mjs nya.json` lägger till nya platser och flyttar dem till närmaste väg. Formatet är `[lat, lng, "Ort", "Land", "region"]`, med ett valfritt sjätte fält för träningsland (till exempel `"Hongkong"`).
- `node verktyg/flytta.mjs "Umeå=63.83,20.24"` ger en plats ny startpunkt och flyttar den till närmaste väg. `"Ort=bort"` tar bort platsen.
- `node verktyg/snappa.mjs` flyttar alla platser till närmaste väg (OSRM).

Om en plats visar svart bild i spelet: tryck **Byt plats**. Användare laddar hela tiden upp nya bilder till Google Maps, så en plats som var bra kan senare börja visa någon annans foto. Kör då `verktyg/agare.html` igen.
