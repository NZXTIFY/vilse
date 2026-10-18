// Ledtrådar för träningsläget, ett land i taget.
//
// Källa: Plonk It, https://www.plonkit.net/guide (CC BY-NC-SA 4.0).
// Texterna är korta sammanfattningar på svenska av guidens första steg ("Identifying the country").
// De delas under samma licens, CC BY-NC-SA 4.0: ange Plonk It som källa och använd dem inte kommersiellt.
//
// Fält:
//   plonkit  adressen till landets sida på plonkit.net
//   del      världsdel (eu, am, as, af, oc), används som ledtråd
//   trafik   'höger' eller 'vänster'
//   liknar   länder som lätt förväxlas, används som felalternativ på svår nivå
//   unikt    något som (nästan) bara det här landet har; texten nämner inte landet, så den kan visas som ledtråd
//   tips     [kategori, text]
//   skilj    hur landet skiljer sig från ett land man lätt blandar ihop det med
window.LEDTRADAR = {
  'Sverige': {
    plonkit: 'sweden', del: 'eu', trafik: 'höger',
    liknar: ['Norge', 'Finland', 'Danmark', 'Estland'],
    unikt: "Kurvpilarna är gula pilar på blå botten, något inget annat land i Europa har.",
    tips: [
      ['Skyltar', 'Varningsskyltar har gul botten och röd kant. Kurvpilarna (chevroner) är gula pilar på blå botten, något inget annat land i Europa har.'],
      ['Väglinjer', 'Bara vita linjer. Mindre vägar har korta, täta streck som kantlinje.'],
      ['Kantstolpar', 'Svartvita med grå reflex, och orange reflex vid korsningar.'],
      ['Vägvisare', 'Blå med vit text och en tunn pil. Små orter står på gula skyltar med röd kant. Skyltstolpar har ofta ränder i blått och vitt eller rött och gult.'],
      ['Hus och bilar', 'Falu röda trähus på landsbygden och väldigt många Volvo.'],
      ['Språk', 'Å, Ä och Ö. Gatunamn slutar på -vägen eller -gatan, ofta förkortat v. och g.'],
    ],
    skilj: {
      'Norge': 'Norge har gula mittlinjer med orange ton, vit botten på skyltarna och gula vägvisare. Sverige har bara vita linjer och gul botten på skyltarna.',
      'Finland': 'Finland har alltid heldragna kantlinjer, en tunn gul rand utanför den röda kanten på skyltarna och svarta chevroner. Finska ord är långa med dubbla vokaler.',
      'Danmark': 'Danmark är platt med rött tegel. Kantlinjerna består av små vita rutor och vägvisarna är låga och inramade av rör.',
      'Estland': 'Estland har röda chevroner med vita pilar och vit botten på skyltarna. Estniska har Õ och Ü.',
    },
  },

  'Norge': {
    plonkit: 'norway', del: 'eu', trafik: 'höger',
    liknar: ['Sverige', 'Finland', 'Island', 'Färöarna'],
    unikt: "Skåpbilar och andra företagsbilar har ofta gröna nummerskyltar.",
    tips: [
      ['Landskap', 'Berg och fjordar, nästan överallt längs kusten.'],
      ['Väglinjer', 'Större vägar har gula mittlinjer med tydlig orange ton. Mindre vägar har långa vita streck som kantlinje.'],
      ['Skyltar', 'Vit botten med röd kant. Vägvisare är gula med svart kant och vägnummer i en grön eller vit ruta.'],
      ['Kantstolpar', 'Smala och böjda, med reflexen i ett svart parallellogram.'],
      ['Hus', 'Trähus i vitt, rött eller svart, med fler vita och svarta hus än i Sverige.'],
      ['Språk och bilar', 'Æ, Ø och Å. Gatunamn slutar på -veien eller -gata. Skåpbilar har ofta gröna nummerskyltar.'],
    ],
    skilj: {
      'Sverige': 'Sverige har gul botten på skyltarna, bara vita linjer och blå vägvisare.',
      'Finland': 'Finland har gul botten på skyltarna, heldragna kantlinjer och blå vägvisare med ifyllda pilar.',
      'Island': 'Island är nästan helt trädlöst, har gula kantstolpar och gul botten på skyltarna.',
      'Färöarna': 'Färöarna saknar nästan träd, har gräs på taken och små gula trästickor som kantstolpar.',
    },
  },

  'Svalbard': {
    plonkit: 'svalbard', del: 'eu', trafik: 'höger',
    liknar: ['Island', 'Grönland', 'Färöarna', 'Norge'],
    unikt: "Nummerskyltarna är svarta med gul text.",
    tips: [
      ['Landskap', 'Kala, trädlösa berg med mossa och gräs. Himlen är ofta mulen och grå.'],
      ['Nummerskyltar', 'Svarta med gul text.'],
      ['Språk', 'Norska, och ibland ryska på skyltar.'],
      ['Bebyggelse', 'Longyearbyen har enkla, lådformade hus. Täckningen finns nästan bara i och kring orterna.'],
    ],
    skilj: {
      'Island': 'Island har gula kantstolpar, mörk vulkanisk mark och vita nummerskyltar med blå text.',
      'Grönland': 'Grönland har färgglada trähus utspridda på klipporna och grönländska ord på skyltarna.',
    },
  },

  'Finland': {
    plonkit: 'finland', del: 'eu', trafik: 'höger',
    liknar: ['Sverige', 'Estland', 'Norge'],
    unikt: "Skyltar med röd kant har en tunn gul rand allra ytterst, något inget annat nordiskt land har.",
    tips: [
      ['Väglinjer', 'Kantlinjerna är alltid heldragna och vita. Mittlinjen kan vara vit eller gul.'],
      ['Skyltar', 'Gul botten, och skyltar med röd kant har en tunn gul rand allra ytterst. Chevroner är svarta med gula pilar.'],
      ['Vägvisare', 'Blå med vit kant och ifyllda vita pilar.'],
      ['Snöpinnar', 'Orange med en tunn vit rand högt upp.'],
      ['Nummerskyltar', 'Vita med EU-remsa, men kortare än i resten av Europa.'],
      ['Språk', 'Långa ord med dubbla vokaler och Ä och Ö. Gatunamn slutar på -tie eller -katu. Skyltar står ofta på både finska och svenska.'],
    ],
    skilj: {
      'Sverige': 'Sverige har streckade kantlinjer, blå chevroner med gula pilar och tunna pilar på vägvisarna.',
      'Estland': 'Estland har röda chevroner med vita pilar och vit botten på skyltarna. Estniska har Õ och Ü, som finskan saknar.',
      'Norge': 'Norge har vit botten på skyltarna, gula vägvisare och mittlinjer med orange ton.',
    },
  },

  'Danmark': {
    plonkit: 'denmark', del: 'eu', trafik: 'höger',
    liknar: ['Sverige', 'Nederländerna', 'Tyskland', 'Norge'],
    unikt: "Vita kantstolpar med gul reflex och en mörkorange rand, och låga vägvisare inramade av rör.",
    tips: [
      ['Landskap', 'Platt med öppna åkrar. Rött tegel och tegeltak, ibland halmtak.'],
      ['Väglinjer', 'Bara vita linjer. Dubbla mittlinjer är vanliga, och kantlinjen består ofta av små vita rutor.'],
      ['Vägvisare', 'Låga skyltar inramade av rör, rödvita eller blåvita med pilen inbyggd i bakgrunden.'],
      ['Kantstolpar', 'Vita med gul reflex och en mörkorange rand. De finns bara i Danmark.'],
      ['Nummerskyltar', 'Långa och vita. Vissa har ett gult fält längst till vänster.'],
      ['Språk', 'Æ, Ø och Å. Gatunamn slutar på -vej, och gatuskyltarna är blå.'],
    ],
    skilj: {
      'Sverige': 'Sverige har mer skog, röda trähus, gul botten på skyltarna och streckade kantlinjer.',
      'Nederländerna': 'Nederländerna har gula nummerskyltar, röda cykelbanor och mycket kanaler.',
      'Tyskland': 'Tyskland har vita kantstolpar med svart rand och gula ortsskyltar.',
    },
  },

  'Island': {
    plonkit: 'iceland', del: 'eu', trafik: 'höger',
    liknar: ['Färöarna', 'Norge', 'Svalbard', 'Grönland'],
    unikt: "Gula kantstolpar längs nästan varje landsväg, och nummerskyltar helt utan EU-remsa.",
    tips: [
      ['Landskap', 'Kalt och nästan trädlöst, med mörk vulkanisk mark, lavafält och berg.'],
      ['Kantstolpar', 'Gula med vit reflex, längs nästan alla landsvägar.'],
      ['Nummerskyltar', 'Helt vita med blå text och utan EU-remsa.'],
      ['Skyltar', 'Gul botten. Vägvisare är gula med vägnummer i en vit ruta. Chevroner är svarta med gula pilar.'],
      ['Väglinjer', 'Bara vita linjer.'],
      ['Språk', 'Ð, Þ och Æ samt accenter som á, é och ó.'],
    ],
    skilj: {
      'Färöarna': 'Färöarna har grönare och brantare berg som stupar rakt ned i fjordarna, gräs på taken och små gula trästickor som kantstolpar.',
      'Norge': 'Norge har skog, gula mittlinjer och vit botten på skyltarna.',
      'Svalbard': 'Svalbard har svarta nummerskyltar med gul text och nästan ingen växtlighet alls.',
    },
  },

  'Färöarna': {
    plonkit: 'faroe-islands', del: 'eu', trafik: 'höger',
    liknar: ['Island', 'Norge', 'Storbritannien'],
    unikt: "Kantstolparna är små gula trästickor, och vägräckena har gula reflexer.",
    tips: [
      ['Landskap', 'Gröna, branta berg som reser sig direkt ur breda fjordar. Nästan inga träd.'],
      ['Hus', 'Trähus på en målad stensockel, ofta med gräs eller plåt på taket.'],
      ['Kantstolpar', 'Små gula trästickor, ibland med röd topp. Vägräcken har gula reflexer.'],
      ['Vägvisare', 'Gula med tunn svart kant, nästan som på Island.'],
      ['Språk', 'Á, Ð, Í, Ó, Ú, Ý, Æ och Ø. Har Ø men inte Þ, till skillnad från isländskan.'],
    ],
    skilj: {
      'Island': 'Island har gula kantstolpar i plast, mörk lavamark och Þ i språket.',
      'Norge': 'Norge har skog och vit botten på skyltarna.',
    },
  },

  'Estland': {
    plonkit: 'estonia', del: 'eu', trafik: 'höger',
    liknar: ['Lettland', 'Litauen', 'Finland', 'Ryssland'],
    unikt: "Röda kurvpilar med vita pilar, och blå kilometerskyltar som står vinkelrätt mot vägen.",
    tips: [
      ['Kantstolpar', 'Runda och batongliknande, med en rektangulär reflex fram och två runda bak.'],
      ['Chevroner', 'Röda med vita pilar, till skillnad från Lettland och Litauen.'],
      ['Skyltar', 'Tunn röd kant som går ända ut till kanten, utan vit ytterkant.'],
      ['Stolpar', 'Blandat: runda trästolpar, ofta med en liten metallhatt, och fyrkantiga betongstolpar. Skyltstolpar har ofta blåvita ränder.'],
      ['Kilometerskyltar', 'Blå, vinkelräta mot vägen med siffror på båda sidor.'],
      ['Språk', 'Ä, Ö, Ü och Õ. Gata heter tänav och väg heter tee.'],
    ],
    skilj: {
      'Lettland': 'Lettland har vita chevroner med röda pilar, tjock röd kant med vit ytterkant på skyltarna och ordet iela på gatuskyltarna.',
      'Litauen': 'Litauen har kilformade kantstolpar med orange reflex och fyrkantiga betongstolpar.',
      'Finland': 'Finland har gul botten på skyltarna och saknar Õ och Ü.',
    },
  },

  'Lettland': {
    plonkit: 'latvia', del: 'eu', trafik: 'höger',
    liknar: ['Litauen', 'Estland', 'Polen', 'Ryssland'],
    unikt: "Övergångsställeskylten har fem ränder och en gående med ovanligt långa ben.",
    tips: [
      ['Kantstolpar', 'Smala och lätt böjda, ofta med nummer under reflexen.'],
      ['Stolpar', 'Isolatorer formade som krokar, placerade växelvis åt vänster och höger.'],
      ['Skyltar', 'Tjock röd kant med en tunn vit kant utanför. Chevroner är vita med röda pilar.'],
      ['Övergångsställen', 'Skylten har fem ränder och en gående med långa ben, unikt i Baltikum.'],
      ['Kilometerskyltar', 'Blå skylt som står parallellt med vägen.'],
      ['Språk', 'Streck över vokaler (Ā, Ē, Ī) och krokar under konsonanter (Ģ, Ķ, Ļ, Ņ). Gata heter iela.'],
    ],
    skilj: {
      'Litauen': 'Litauen har kilformade kantstolpar med orange reflex, Ą, Ę och Ė i språket och gatunamn med g. (gatvė).',
      'Estland': 'Estland har röda chevroner med vita pilar och Õ och Ü i språket.',
    },
  },

  'Litauen': {
    plonkit: 'lithuania', del: 'eu', trafik: 'höger',
    liknar: ['Lettland', 'Estland', 'Polen'],
    unikt: "Blå kilometerskyltar som är L-formade och står snett, i 45 graders vinkel mot vägen.",
    tips: [
      ['Kantstolpar', 'Kilformade med orange reflex fram och vit reflex bak.'],
      ['Stolpar', 'Fyrkantiga betongstolpar, ofta med ett snett stöd.'],
      ['Kilometerskyltar', 'Blå och L-formade, i 45 graders vinkel mot vägen.'],
      ['Skyltar', 'Tunn röd kant med vit ytterkant. Vägräcken har orange reflexer.'],
      ['Språk', 'Ą, Ę, Į, Ų och Ė. Gata heter gatvė, förkortat g. Många ortnamn slutar på -ai.'],
    ],
    skilj: {
      'Lettland': 'Lettland har smala, böjda kantstolpar, fem ränder på övergångsställeskylten och ordet iela.',
      'Polen': 'Polen har kantstolpar med ett rött band runt om, gula varningsskyltar och gröna vägvisare.',
    },
  },

  'Polen': {
    plonkit: 'poland', del: 'eu', trafik: 'höger',
    liknar: ['Tjeckien', 'Litauen', 'Tyskland', 'Slovakien'],
    unikt: "Övergångsställeskylten visar ett enda vågrätt streck i stället för zebraränder.",
    tips: [
      ['Kantstolpar', 'Ett rött band runt hela stolpen, med röd reflex fram.'],
      ['Stolpar', 'Smala betongstolpar med genomgående hål.'],
      ['Väglinjer', 'Bara vita linjer, ofta dubbla mittlinjer.'],
      ['Skyltar', 'Varningsskyltar har gul botten och tunn röd kant, unikt i Europa. Övergångsställen visas med ett enda vågrätt streck.'],
      ['Vägvisare', 'Grön botten och ett eget, tydligt typsnitt.'],
      ['Språk', 'Ł, Ż, Ń, Ą och Ę, och många W, Z och C. Polskan använder inte V.'],
    ],
    skilj: {
      'Tjeckien': 'Tjeckien har kantstolpar med dubbla orange reflexer, röda gatuskyltar och Ř, Ě och Ů i språket.',
      'Tyskland': 'Tyskland har vita kantstolpar med svart rand och gula vägvisare och ortsskyltar.',
      'Litauen': 'Litauen har kilformade kantstolpar med orange reflex och vit botten på varningsskyltarna.',
    },
  },

  'Tjeckien': {
    plonkit: 'czechia', del: 'eu', trafik: 'höger',
    liknar: ['Slovakien', 'Polen', 'Österrike', 'Ungern'],
    unikt: "Pilformade vägvisare med ifylld spets som syns även bakifrån, och klarröda gatuskyltar.",
    tips: [
      ['Kantstolpar', 'Dubbla orange reflexer fram och en vit bak, samma som i Slovakien.'],
      ['Stolpar', 'Breda, runda betongstolpar, ofta två och två.'],
      ['Vägvisare', 'Pilformade skyltar med ifylld spets som syns även bakifrån.'],
      ['Gatuskyltar', 'Klarröda gatuskyltar, och husnummer på blå eller röda skyltar.'],
      ['Hus', 'Välskötta panelhus i glada färger och tak med rutformade plattor.'],
      ['Språk', 'Ř, Ě och Ů finns bara i tjeckiskan.'],
    ],
    skilj: {
      'Slovakien': 'Slovakien har vita gatuskyltar med röd kant, fetare typsnitt på skyltarna och bokstäverna Ľ, Ô och Ä.',
      'Polen': 'Polen har kantstolpar med ett rött band runt om, hålstolpar och gula varningsskyltar.',
      'Österrike': 'Österrike har vita kantstolpar med svart rand och tyska på skyltarna.',
    },
  },

  'Slovakien': {
    plonkit: 'slovakia', del: 'eu', trafik: 'höger',
    liknar: ['Tjeckien', 'Ungern', 'Polen', 'Österrike'],
    unikt: "Bokstäverna Ľ, Ô och Ŕ, som inte finns i något annat språk i Street View.",
    tips: [
      ['Kantstolpar', 'Dubbla orange reflexer fram och en vit bak, samma som i Tjeckien.'],
      ['Vägvisare', 'Blå med små vita pilar.'],
      ['Gatuskyltar', 'Vita med blå text och tunn röd kant. Gata heter ulica.'],
      ['Skyltar', 'Den röda kanten går ända ut till skyltens kant, och typsnittet är fetare än i Tjeckien.'],
      ['Landskap', 'Växlar mellan höga berg och helt platta slätter.'],
      ['Språk', 'Ľ, Ô, Ä, Ŕ och Ĺ finns bara i slovakiskan.'],
    ],
    skilj: {
      'Tjeckien': 'Tjeckien har röda gatuskyltar, pilformade vägvisare med ifylld spets och bokstäverna Ř, Ě och Ů.',
      'Ungern': 'Ungern har kilformade kantstolpar med röd reflex, gröna vägvisare och ord som utca.',
      'Polen': 'Polen har kantstolpar med ett rött band runt om och gula varningsskyltar.',
    },
  },

  'Ungern': {
    plonkit: 'hungary', del: 'eu', trafik: 'höger',
    liknar: ['Slovakien', 'Rumänien', 'Kroatien', 'Österrike'],
    unikt: "Bokstäverna Ő och Ű med dubbla accenter, och gubben på övergångsställeskylten har bältet långt ned.",
    tips: [
      ['Kantstolpar', 'Svartvita och kilformade, med röd reflex fram och vit bak.'],
      ['Stolpar', 'Betongstolpar med hål som går ända ned till marken.'],
      ['Chevroner', 'Vita pilar på röd botten.'],
      ['Vägvisare', 'Gröna med vit innerkant. Motorvägar (M) har blå skyltar. Kilometerskyltarna är gröna.'],
      ['Skyltar', 'Sitter ovanligt högt och är fästa med fyra bultar. Gubben på övergångsställeskylten har bältet långt ned.'],
      ['Språk', 'Massor av accenter, långa ord och de unika bokstäverna Ő och Ű. Gata heter utca, väg heter út.'],
    ],
    skilj: {
      'Slovakien': 'Slovakien har kantstolpar med dubbla orange reflexer och slaviskt språk med Ľ och Ô.',
      'Rumänien': 'Rumänien har bokstäverna Ă, Ș och Ț och hålstolpar med bredare hål.',
      'Kroatien': 'Kroatien har tunnare kantstolpar med reflexen högre upp och slaviska ord som ulica.',
      'Österrike': 'Österrike har vita kantstolpar med svart topp, vita vägvisare med blå kant och tyska på skyltarna.',
    },
  },

  'Österrike': {
    plonkit: 'austria', del: 'eu', trafik: 'höger',
    liknar: ['Tyskland', 'Schweiz', 'Slovenien', 'Tjeckien'],
    unikt: "Övergångsställeskylten har två streckade vågräta linjer, och vägvisarna är vita med blå kant.",
    tips: [
      ['Kantstolpar', 'Vita med svart topp och mörkröd eller grå reflex, ofta med en liten svart knopp överst.'],
      ['Chevroner', 'Vita pilar på rött eller röda pilar på gult.'],
      ['Vägvisare', 'Vit botten med blå kant och ett eget typsnitt. Ortsskyltarna ser likadana ut.'],
      ['Övergångsställen', 'Skylten har två streckade vågräta linjer i stället för zebraränder.'],
      ['Landskap', 'Berg och skog. Alpina hus med ljusa väggar, träbalkonger och utskjutande tak.'],
      ['Språk', 'Tyska, med Ä, Ö, Ü och ß.'],
    ],
    skilj: {
      'Tyskland': 'Tyskland har gula ortsskyltar, svartvita kantstolpar med grå reflex och väldigt många kantstolpar.',
      'Schweiz': 'Schweiz har låg kamera (stor suddig bil i nederkant), gula streckade linjer och nummerskyltar utan EU-remsa.',
      'Slovenien': 'Slovenien har likadana kantstolpar men med klarröd reflex, och slovenska med Č, Š och Ž.',
    },
  },

  'Tyskland': {
    plonkit: 'germany', del: 'eu', trafik: 'höger',
    liknar: ['Österrike', 'Schweiz', 'Luxemburg', 'Nederländerna', 'Danmark'],
    unikt: "Gula ortsskyltar med metallram, och baksidan av skyltarna har en dekal med en röd upp-och-nedvänd triangel.",
    tips: [
      ['Kantstolpar', 'Svartvita med vit eller ljusgrå reflex, orange vid korsningar. De står ungefär var 50:e meter.'],
      ['Ortsskyltar', 'Gula med svart text och metallram.'],
      ['Skyltar', 'Baksidan är ofta svart eller mörkgrå, med en dekal med en röd upp-och-nedvänd triangel.'],
      ['Gatubild', 'Busshållplatser har ett grönt H i en gul cirkel, och brevlådorna är klargula.'],
      ['Stolpar', 'Trästolpar har ofta en vit rektangulär dekal.'],
      ['Språk', 'Tyska, med Ä, Ö, Ü och ß. Ord som Straße och Einbahnstraße.'],
    ],
    skilj: {
      'Österrike': 'Österrike har vita vägvisare och ortsskyltar med blå kant och vita kantstolpar med svart topp.',
      'Luxemburg': 'Luxemburg har gula nummerskyltar, franska på skyltarna och svarta chevroner med gula pilar.',
      'Nederländerna': 'Nederländerna har gula nummerskyltar, är helt platt och har nästan inga elstolpar.',
    },
  },

  'Schweiz': {
    plonkit: 'switzerland', del: 'eu', trafik: 'höger',
    liknar: ['Österrike', 'Tyskland', 'Frankrike', 'Italien'],
    unikt: "Övergångsställen målade i gult och en skylt med sju ränder på en hög blå rektangel.",
    tips: [
      ['Kamera', 'Låg kamera överallt. Den suddiga Google-bilen i nederkant ser mycket större ut än vanligt.'],
      ['Nummerskyltar', 'Helt vita utan EU-remsa. Skylten fram är mycket kort.'],
      ['Väglinjer', 'Långa gula streck, och övergångsställen målade i gult.'],
      ['Vägvisare', 'Blå på huvudvägar och vita på mindre vägar, ofta med en rundad grå metallkant.'],
      ['Övergångsställen', 'Skylten är en hög blå rektangel med sju ränder.'],
      ['Språk', 'Tyska, franska eller italienska beroende på region.'],
    ],
    skilj: {
      'Österrike': 'Österrike har vanlig kamerahöjd, EU-remsa på nummerskyltarna och vita väglinjer.',
      'Italien': 'Italien har nummerskyltar med blå remsa på båda sidor och vanlig kamerahöjd.',
      'Frankrike': 'Frankrike har vita väglinjer, vita kantstolpar med svart band och EU-remsa på nummerskyltarna.',
    },
  },

  'Nederländerna': {
    plonkit: 'netherlands', del: 'eu', trafik: 'höger',
    liknar: ['Belgien', 'Danmark', 'Tyskland', 'Luxemburg'],
    unikt: "Gula nummerskyltar både fram och bak, och nästan inga elstolpar alls.",
    tips: [
      ['Nummerskyltar', 'Långa och gula med EU-remsa, både fram och bak.'],
      ['Landskap', 'Extremt platt med kanaler, diken och vallar längs vägarna.'],
      ['Cyklar', 'Rödrosa cykelbanor och cyklister överallt. Gator är ofta lagda med tegel.'],
      ['Stolpar', 'Nästan inga elstolpar längs gatorna.'],
      ['Kantstolpar', 'Enkla vita stolpar med röd reflex.'],
      ['Språk', 'Många dubbla vokaler och kombinationer som ij, oe och ieuw.'],
    ],
    skilj: {
      'Belgien': 'Belgien har vita nummerskyltar med röd text, orange skyltstolpar, elstolpar och vägar av betongplattor.',
      'Danmark': 'Danmark har vita nummerskyltar och kantlinjer av små vita rutor.',
      'Tyskland': 'Tyskland har vita nummerskyltar, gula ortsskyltar och är mer kuperat.',
    },
  },

  'Belgien': {
    plonkit: 'belgium', del: 'eu', trafik: 'höger',
    liknar: ['Nederländerna', 'Frankrike', 'Luxemburg', 'Tyskland'],
    unikt: "Nummerskyltar med röd text och orangemålade skyltstolpar.",
    tips: [
      ['Nummerskyltar', 'Röd text, som syns även genom suddningen.'],
      ['Kantstolpar', 'Vita med gul rektangulär reflex. Vägräckena har också gula reflexer.'],
      ['Skyltstolpar', 'Ofta orange, vilket bara finns i Belgien. Små tilläggsskyltar under vägmärkena är blå.'],
      ['Vägar', 'Många landsvägar är gjorda av betongplattor. Cykelbanor är vanliga.'],
      ['Hus', 'Rött tegel i norr och väst, grå sten i söder.'],
      ['Språk', 'Nederländska i norr och franska i söder.'],
    ],
    skilj: {
      'Nederländerna': 'Nederländerna har gula nummerskyltar, nästan inga elstolpar och är helt platt.',
      'Frankrike': 'Frankrike har vita kantstolpar med svart band och nummerskyltar med blå remsa på båda sidor.',
      'Luxemburg': 'Luxemburg har gula nummerskyltar och gula vägvisare med ram.',
    },
  },

  'Luxemburg': {
    plonkit: 'luxembourg', del: 'eu', trafik: 'höger',
    liknar: ['Tyskland', 'Belgien', 'Nederländerna', 'Frankrike'],
    unikt: "Gula vägvisare med spetsig ände som är helt inramade, och svarta kurvpilar med gula pilar.",
    tips: [
      ['Nummerskyltar', 'Långa och gula med EU-remsa.'],
      ['Chevroner', 'Svarta med gula pilar, som inget grannland har.'],
      ['Vägvisare', 'Gula med tunn svart kant, versaler och spetsig ände, helt inramade. Ortsskyltarna är också gula med ram.'],
      ['Kantstolpar', 'Nästan som de tyska, men reflexen sitter fast med tre bultar i stället för två.'],
      ['Språk', 'Mest franska på skyltarna, ibland tyska och luxemburgiska.'],
    ],
    skilj: {
      'Tyskland': 'Tyskland har vita nummerskyltar, tyska på skyltarna och röda chevroner.',
      'Nederländerna': 'Nederländerna är platt med kanaler och cykelbanor överallt.',
      'Belgien': 'Belgien har vita nummerskyltar med röd text och orange skyltstolpar.',
    },
  },

  'Frankrike': {
    plonkit: 'france', del: 'eu', trafik: 'höger',
    liknar: ['Belgien', 'Spanien', 'Italien', 'Schweiz', 'Luxemburg'],
    unikt: "Runda vita kantstolpar med spetsig topp, och små blå plåtar på elstolparna.",
    tips: [
      ['Nummerskyltar', 'Vita med blå remsa på båda sidor, där den vänstra syns tydligast.'],
      ['Kantstolpar', 'Runda vita stolpar med spetsig topp och ett grått eller rött reflexband runt om. De syns nästan överallt.'],
      ['Stolpar', 'Betongstolpar med trappliknande urtag, smala åttkantiga metallstolpar och små blå plåtar på stolparna.'],
      ['Chevroner', 'Blå med vita pilar.'],
      ['Språk', 'Accenter som é, è, ê, à och ç. Gata heter rue.'],
    ],
    skilj: {
      'Belgien': 'Belgien har nummerskyltar med röd text, orange skyltstolpar och vita kantstolpar med gul reflex.',
      'Spanien': 'Spanien har kantstolpar med gul-orange reflex, åtta ränder på övergångsställeskylten och Ñ i språket.',
      'Italien': 'Italien har korta främre nummerskyltar och kantstolpar med svart topp och röd reflex.',
    },
  },

  'Storbritannien': {
    plonkit: 'united-kingdom', del: 'eu', trafik: 'vänster',
    liknar: ['Irland', 'Malta', 'Nya Zeeland', 'Australien'],
    unikt: "Vit nummerskylt fram och gul bak, och väjningsskylten säger GIVE WAY.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Vit fram och gul bak, oftast utan EU-remsa.'],
      ['Väglinjer', 'Dubbla gula kantlinjer i städer. Mittlinjer med långa streck och reflexer (kattögon) emellan.'],
      ['Kantstolpar', 'Rundade med svart topp och bas, vitt fält i mitten, röd reflex fram och vit bak.'],
      ['Skyltar', 'Vita varningstrianglar med röd kant. Svarta chevroner med vita pilar. Väjningsskylten säger GIVE WAY.'],
      ['Gatuskyltar', 'Vita med svart text, lågt ned på två små stolpar. Trästolpar har ofta stegpinnar.'],
    ],
    skilj: {
      'Irland': 'Irland har vita nummerskyltar både fram och bak, gula romboida varningsskyltar, gula streckade kantlinjer och tvåspråkiga skyltar.',
      'Malta': 'Malta är torrt med kalkstenshus i gult och mycket äldre bilar.',
      'Nya Zeeland': 'Nya Zeeland har vita nummerskyltar, gula romboida varningsskyltar och helt annan växtlighet.',
    },
  },

  'Irland': {
    plonkit: 'ireland', del: 'eu', trafik: 'vänster',
    liknar: ['Storbritannien', 'Nya Zeeland', 'Malta'],
    unikt: "Gula, romboida varningsskyltar, som inget annat land i Europa har.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Långa och vita både fram och bak, med EU-remsa.'],
      ['Skyltar', 'Gula, romboida varningsskyltar som inget annat land i Europa har. Chevroner är gula pilar på svart.'],
      ['Väglinjer', 'Gula streckade kantlinjer är mycket vanliga.'],
      ['Språk', 'Tvåspråkiga skyltar där iriska står i kursiv stil. Väjningsskylten säger YIELD.'],
      ['Landskap', 'Gröna fält, gräsrand i mitten av små vägar och gräddvita hus med svarta tak.'],
    ],
    skilj: {
      'Storbritannien': 'Storbritannien har gula bakre nummerskyltar, vita varningstrianglar, vita chevronpilar och GIVE WAY.',
      'Nya Zeeland': 'Nya Zeeland har nummerskyltar utan EU-remsa, palmer och ormbunkar och annan växtlighet.',
    },
  },

  'Spanien': {
    plonkit: 'spain', del: 'eu', trafik: 'höger',
    liknar: ['Portugal', 'Frankrike', 'Italien', 'Andorra'],
    unikt: "Övergångsställeskylten har åtta ränder, flest i Europa.",
    tips: [
      ['Kantstolpar', 'Gul-orange reflex fram och två vita prickar (eller inget) bak. Ofta ihåliga.'],
      ['Vägräcken', 'Gula reflexer på räckena.'],
      ['Skyltar', 'Den röda kanten går ända ut till kanten. Övergångsställeskylten har åtta ränder och stoppskylten litet typsnitt.'],
      ['Vägmarkörer', 'Små skyltar med färgad kant som visar vägnumret. Jaktskyltar med texten coto ... caza.'],
      ['Stolpar', 'Betongstolpar med trappsteg och trästolpar på landet. Mycket kraftledningar.'],
      ['Språk', 'Ñ och ¿ ¡. Gata heter calle.'],
    ],
    skilj: {
      'Portugal': 'Portugal har gul remsa till höger på nummerskyltarna, svarta chevroner med gula pilar, eukalyptus och ord med Ã och Õ.',
      'Italien': 'Italien har korta nummerskyltar med blå remsa på båda sidor och röda reflexer på räckena.',
      'Frankrike': 'Frankrike har runda vita kantstolpar med spetsig topp och blå chevroner.',
    },
  },

  'Portugal': {
    plonkit: 'portugal', del: 'eu', trafik: 'höger',
    liknar: ['Spanien', 'Italien', 'Madeira', 'Brasilien'],
    unikt: "En gul remsa längst till höger på nummerskyltarna.",
    tips: [
      ['Nummerskyltar', 'Blå remsa till vänster och oftast en gul remsa till höger, vilket bara finns i Portugal.'],
      ['Chevroner', 'Svarta med gula pilar, som inget annat Medelhavsland har.'],
      ['Vägvisare', 'Vita med svarta pilar som inte når kanten.'],
      ['Natur', 'Mycket eukalyptus.'],
      ['Skyltar', 'Jaktskyltar i rött och vitt. Stoppskylten har stort typsnitt.'],
      ['Språk', 'Ç, Ã, Õ, Â och Ê, men inget Ñ. Gata heter rua.'],
    ],
    skilj: {
      'Spanien': 'Spanien har bara blå remsa på nummerskyltarna, gul-orange reflex på kantstolparna, åtta ränder på övergångsställeskylten och Ñ.',
      'Brasilien': 'Brasilien har vita nummerskyltar med blå rand upptill, röd jord och tropisk växtlighet.',
    },
  },

  'Madeira': {
    plonkit: 'madeira', del: 'eu', trafik: 'höger',
    liknar: ['Portugal', 'Spanien', 'Italien'],
    unikt: "Små kantstolpar av sten med röd reflex, på branta bergssluttningar med terrassodlingar.",
    tips: [
      ['Landskap', 'Mycket bergig, halvtropisk ö med terrassodlingar, ormbunkar och låga moln.'],
      ['Växter', 'Eukalyptus och blå eller vita afrikanska liljor (agapanthus) längs vägarna.'],
      ['Hus', 'Vita, grå eller pastellfärgade hus med röda tegeltak i gott skick.'],
      ['Vägar', 'Små kantstolpar av sten med röd reflex och vita betongbarriärer.'],
      ['Infrastruktur', 'I övrigt portugisisk: samma nummerskyltar och chevroner.'],
    ],
    skilj: {
      'Portugal': 'Fastlandsportugal är flackare och torrare, utan de branta terrasserna och molnen.',
    },
  },

  'Italien': {
    plonkit: 'italy', del: 'eu', trafik: 'höger',
    liknar: ['Spanien', 'Frankrike', 'Grekland', 'Kroatien', 'Schweiz'],
    unikt: "Den främre nummerskylten är kort och har blå remsa på båda sidor.",
    tips: [
      ['Nummerskyltar', 'Blå remsa på båda sidor, och den främre skylten är kort.'],
      ['Kantstolpar', 'Trekantiga, vita med svart topp, röd reflex fram och vit bak.'],
      ['Väglinjer', 'Ofta vita heldragna kantlinjer utan mittlinje.'],
      ['Skyltar', 'Baksidorna är ofta svarta eller mörkgrå. Vägvisare är blå med versaler, motorvägar gröna.'],
      ['Vägräcken', 'Ofta dubbla räcken med röda reflexer.'],
      ['Språk', 'Många dubbelkonsonanter och i:n, ord slutar på vokal. Gata heter via.'],
    ],
    skilj: {
      'Spanien': 'Spanien har gula reflexer på räckena, gul-orange reflex på kantstolparna och Ñ.',
      'Grekland': 'Grekland har grekiska bokstäver, gula varningsskyltar och höga mörkbruna trästolpar.',
      'Frankrike': 'Frankrike har runda vita kantstolpar med spetsig topp och långa nummerskyltar.',
      'Kroatien': 'Kroatien har gula vägvisare och slaviska ord med Č, Š och Ž.',
    },
  },

  'Grekland': {
    plonkit: 'greece', del: 'eu', trafik: 'höger',
    liknar: ['Bulgarien', 'Nordmakedonien', 'Italien', 'Albanien', 'Turkiet'],
    unikt: "Små miniatyrkyrkor på piedestaler längs vägkanten.",
    tips: [
      ['Språk', 'Grekiska alfabetet. Orter står på grekiska i gult och på engelska i vitt på vägvisarna.'],
      ['Skyltar', 'Varningsskyltar har gul botten och röd kant. Vägvisarna är blå och pilformade.'],
      ['Stolpar', 'Höga, mörkbruna trästolpar, ofta med en harpformad metallram överst.'],
      ['Väglinjer', 'Ofta blekta dubbla vita mittlinjer, och gula linjer är vanligare än i resten av Sydeuropa.'],
      ['Vägkanten', 'Små miniatyrkyrkor på piedestal längs vägarna. Kantstolparna är kilformade med nästan kvadratisk röd reflex.'],
      ['Hus', 'Vita och pastellfärgade stenhus med orange tegeltak.'],
    ],
    skilj: {
      'Bulgarien': 'Bulgarien använder kyrilliska bokstäver och har mer östeuropeiska panelhus.',
      'Nordmakedonien': 'Nordmakedonien använder kyrilliska och har gula vägvisare med text på både kyrilliska och latinska bokstäver.',
      'Italien': 'Italien har latinska bokstäver, runda betongstolpar och vita varningsskyltar.',
    },
  },

  'Bulgarien': {
    plonkit: 'bulgaria', del: 'eu', trafik: 'höger',
    liknar: ['Rumänien', 'Serbien', 'Nordmakedonien', 'Grekland', 'Ryssland'],
    unikt: "Elstolpar med tre stora, uppåtböjda krokar som isolatorer.",
    tips: [
      ['Språk', 'Kyrilliska bokstäver, ofta med latinska bredvid. Ъ är vanligt och finns annars nästan bara i ryskan. Gata heter улица (ул.).'],
      ['Stolpar', 'Runda betongstolpar med små krokformade isolatorer som sitter växelvis. Tre stora uppåtböjda krokar är typiskt bulgariskt.'],
      ['Chevroner', 'Röda pilar på vit botten.'],
      ['Vägvisare', 'Blå och pilformade.'],
      ['Årstid', 'Mycket av den äldre täckningen är tagen i mars och april, så naturen ser kal och vintrig ut.'],
    ],
    skilj: {
      'Grekland': 'Grekland har grekiska bokstäver, gula varningsskyltar och höga mörkbruna trästolpar.',
      'Rumänien': 'Rumänien använder latinska bokstäver med Ă, Ș och Ț och har betongstolpar med hål.',
      'Ryssland': 'Ryssland har helt vita nummerskyltar utan EU-remsa och bokstäverna Ы och Э.',
      'Nordmakedonien': 'Nordmakedonien har gula vägvisare och bokstäverna Ѓ och Ќ.',
      'Serbien': 'Serbien har svarta pilar på vita chevroner och bokstäverna Ђ och Ћ.',
    },
  },

  'Rumänien': {
    plonkit: 'romania', del: 'eu', trafik: 'höger',
    liknar: ['Ungern', 'Bulgarien', 'Serbien', 'Ukraina'],
    unikt: "Jättestora gula dekaler med ortnamnet på elstolparna.",
    tips: [
      ['Språk', 'Latinska bokstäver med Ă, Ș, Ț, Â och Î.'],
      ['Stolpar', 'Betongstolpar med breda eller höga hål ända ned, ofta med en stor gul dekal med ortnamnet.'],
      ['Vägkanten', 'Träd och stolpar är ofta vitmålade nedtill. Stora vägstenar med röd eller blå ram är vanliga.'],
      ['Väglinjer', 'Kantlinjer med korta streck och smala mellanrum. Mittlinjerna är tjockare än vanligt.'],
      ['Vägvisare', 'Blå och pilformade med vit kant och vägnummer i rött eller blått.'],
      ['Ortsskyltar', 'En gul skylt med hastighet och stadssiluett, och en vit skylt med ortnamnet under.'],
    ],
    skilj: {
      'Ungern': 'Ungern har gröna vägvisare, kilformade kantstolpar och ett språk med Ő och Ű.',
      'Bulgarien': 'Bulgarien använder kyrilliska bokstäver och har tunnare väglinjer.',
      'Ukraina': 'Ukraina använder kyrilliska och har nummerskyltar med blå-gul remsa.',
    },
  },

  'Serbien': {
    plonkit: 'serbia', del: 'eu', trafik: 'höger',
    liknar: ['Kroatien', 'Bulgarien', 'Nordmakedonien', 'Montenegro', 'Ungern'],
    unikt: "De kyrilliska bokstäverna Ђ och Ћ, och platta kantstolpar där reflexen sitter förskjuten åt sidan.",
    tips: [
      ['Kantstolpar', 'Platta kantstolpar där reflexen sitter förskjuten åt sidan.'],
      ['Vägräcken', 'Bara fyrkantiga räcken (B-typ).'],
      ['Chevroner', 'Svart pil på vit botten.'],
      ['Nummerskyltar', 'Vita med blå remsa. Traktorer har gröna skyltar.'],
      ['Språk', 'Både kyrilliska och latinska bokstäver. Ђ och Ћ finns bara i serbiskan.'],
      ['Kamera', 'Den äldre täckningen är oftast tagen av en bil utan antenn.'],
    ],
    skilj: {
      'Kroatien': 'Kroatien skriver bara med latinska bokstäver, ofta med ije i orden, och nummerskyltarna saknar ofta blå remsa.',
      'Nordmakedonien': 'Nordmakedonien har vanliga rundade räcken med röda reflexer, ett rött fält på nummerskyltarna och bokstäverna Ѓ och Ќ.',
      'Bulgarien': 'Bulgarien har röda pilar på chevronerna och bokstaven Ъ.',
    },
  },

  'Kroatien': {
    plonkit: 'croatia', del: 'eu', trafik: 'höger',
    liknar: ['Slovenien', 'Serbien', 'Montenegro', 'Ungern', 'Italien'],
    unikt: "I den äldre täckningen syns ofta bilens backspeglar i suddningen, och träden har höstfärger.",
    tips: [
      ['Kantstolpar', 'Vita med svart rektangel och röd eller vit reflex. Sedda ovanifrån är de trekantiga med skarpa kanter.'],
      ['Nummerskyltar', 'Långa och vita, ofta utan blå remsa, särskilt i äldre täckning.'],
      ['Chevroner', 'Röd pil på gul eller vit botten.'],
      ['Vägar', 'Fyrkantiga vägräcken (B-typ) och gula vägvisare med svart kant.'],
      ['Språk', 'Bara latinska bokstäver, med Č, Ć, Đ, Š och Ž. Kombinationen ije är vanlig.'],
      ['Årstid', 'Mycket av den äldre täckningen är tagen på hösten, med gula och orange träd.'],
    ],
    skilj: {
      'Serbien': 'Serbien blandar kyrilliska och latinska bokstäver och skriver e där kroatiskan skriver ije.',
      'Slovenien': 'Slovenien har kantstolpar med svart topp och klarröd reflex och saknar Ć och Đ.',
      'Italien': 'Italien har nummerskyltar med blå remsa på båda sidor och blå vägvisare.',
    },
  },

  'Slovenien': {
    plonkit: 'slovenia', del: 'eu', trafik: 'höger',
    liknar: ['Österrike', 'Kroatien', 'Tjeckien', 'Slovakien'],
    unikt: "Kilometerskyltar med vägnumret i en gul ruta uppe till vänster och ett svart streck över mitten.",
    tips: [
      ['Landskap', 'Kuperat och skogigt, med mycket täckning på små skogsvägar.'],
      ['Hus', 'Alpin stil med ljusa väggar, mörka trädetaljer och halvvalmade tak.'],
      ['Kantstolpar', 'Vita med svart topp och klarröd reflex fram.'],
      ['Vägvisare', 'Gula med svart kant.'],
      ['Väglinjer', 'Långa streckade kantlinjer, vilket grannländerna sällan har.'],
      ['Språk', 'Č, Š och Ž, men inte Ć och Đ.'],
    ],
    skilj: {
      'Österrike': 'Österrike har vita vägvisare med blå kant, mörkröd reflex på kantstolparna och tyska på skyltarna.',
      'Kroatien': 'Kroatien har Ć och Đ i språket, kilformade kantstolpar och fyrkantiga räcken.',
    },
  },

  'Montenegro': {
    plonkit: 'montenegro', del: 'eu', trafik: 'höger',
    liknar: ['Albanien', 'Kroatien', 'Serbien', 'Slovenien'],
    unikt: "Nummerskylten har en röd cirkel med statsvapnet, som syns även genom suddningen.",
    tips: [
      ['Nummerskyltar', 'Blå remsa och en röd cirkel med statsvapnet, som syns även genom suddningen.'],
      ['Landskap', 'Litet och bergigt. Gröna berg inåt landet och ljusa, kala klippor vid kusten. Smala vägar.'],
      ['Kantstolpar', 'Vita med svart topp, röd reflex fram och vit bak.'],
      ['Chevroner', 'Svart pil på vitt eller röd pil på gult.'],
      ['Vägräcken', 'Ofta rostiga, och både rundade och fyrkantiga typer förekommer.'],
    ],
    skilj: {
      'Albanien': 'Albanien har vita pilar på svarta chevroner, nummerskyltar med röd remsa eller blå remsa på båda sidor och albanska med Ë.',
      'Kroatien': 'Kroatien har kilformade kantstolpar och nummerskyltar utan den röda cirkeln.',
    },
  },

  'Nordmakedonien': {
    plonkit: 'north-macedonia', del: 'eu', trafik: 'höger',
    liknar: ['Serbien', 'Bulgarien', 'Albanien', 'Grekland'],
    unikt: "Google-bilen har aldrig antenn, och nummerskylten har ett rött fält till vänster.",
    tips: [
      ['Nummerskyltar', 'Vita, ibland med blå remsa, och ett tydligt rött fält till vänster.'],
      ['Vägvisare', 'Gula med ortnamnen på både kyrilliska och latinska bokstäver.'],
      ['Språk', 'Kyrilliska. Ѓ och Ќ finns bara i makedonskan.'],
      ['Landskap', 'Torra gräsmarker, låga kullar och utspridda träd.'],
      ['Kamera', 'Google-bilen har aldrig antenn i den äldre täckningen.'],
    ],
    skilj: {
      'Serbien': 'Serbien har fyrkantiga räcken, bokstäverna Ђ och Ћ och nästan alltid blå remsa på nummerskyltarna.',
      'Bulgarien': 'Bulgarien har blå pilformade vägvisare och bokstaven Ъ.',
      'Grekland': 'Grekland har grekiska bokstäver och blå vägvisare.',
    },
  },

  'Albanien': {
    plonkit: 'albania', del: 'eu', trafik: 'höger',
    liknar: ['Montenegro', 'Grekland', 'Nordmakedonien', 'Italien'],
    unikt: "Nummerskyltar med en röd remsa till vänster, vilket inget annat land i Europa har.",
    tips: [
      ['Nummerskyltar', 'Blå remsa på båda sidor, eller en röd remsa till vänster, vilket inget annat land i Europa har.'],
      ['Kantstolpar', 'Svart topp, röd och grå reflex och vit nederdel, som i Italien.'],
      ['Stolpar', 'Stolptoppar formade som en upp-och-nedvänd triangel eller med vågräta stänger.'],
      ['Skyltar', 'Vita pilar på svarta chevroner, och baksidorna är ofta svartmålade.'],
      ['Språk', 'Albanska, med mycket Ë och Ç. Gata heter rruga.'],
    ],
    skilj: {
      'Montenegro': 'Montenegro har chevroner med svart pil på vitt och en röd cirkel på nummerskyltarna.',
      'Italien': 'Italien har korta främre nummerskyltar, italienska ord som slutar på vokal och bättre vägar.',
      'Grekland': 'Grekland har grekiska bokstäver och gula varningsskyltar.',
    },
  },

  'Turkiet': {
    plonkit: 'turkey', del: 'eu', trafik: 'höger',
    liknar: ['Grekland', 'Bulgarien', 'Rumänien', 'Israel'],
    unikt: "Stoppskylten säger DUR.",
    tips: [
      ['Språk', 'Ç, Ş, Ö, Ü, Ğ och prickfritt ı, som nästan bara finns i turkiskan. Stoppskylten säger DUR.'],
      ['Kantstolpar', 'Enkla vita rektanglar med röd reflex, smala från sidan.'],
      ['Väglinjer', 'Oftast vita men gula linjer förekommer. Asfalten har ofta en grovkornig, prickig yta.'],
      ['Vägar', 'Väldigt många fyrfiliga vägar med mittremsa.'],
      ['Chevroner', 'Röda pilar på vitt. I korsningar svartgula skyltar med flera uppåtpilar.'],
      ['Vägvisare', 'Ett typsnitt med ovanligt stora mellanrum mellan bokstäverna.'],
    ],
    skilj: {
      'Grekland': 'Grekland har grekiska bokstäver, mörkbruna trästolpar och gula varningsskyltar.',
      'Bulgarien': 'Bulgarien använder kyrilliska bokstäver och har blå pilformade vägvisare.',
    },
  },

  'Ukraina': {
    plonkit: 'ukraine', del: 'eu', trafik: 'höger',
    liknar: ['Ryssland', 'Polen', 'Rumänien', 'Bulgarien'],
    unikt: "Nummerskyltar med blå-gul remsa, och nästan all täckning är tagen av en röd Google-bil.",
    tips: [
      ['Nummerskyltar', 'Vita med en blå-gul remsa till vänster.'],
      ['Kamera', 'Bara äldre täckning (generation 3), oftast tagen med en röd Google-bil.'],
      ['Vägar', 'Ofta i mycket dåligt skick med gropar, sprickor och lappad asfalt.'],
      ['Färger', 'Staket och annat längs vägen är ofta målat i blått och gult.'],
      ['Språk', 'Kyrilliska med Є, Ґ, І och Ї. Gata heter вулиця (вул.).'],
    ],
    skilj: {
      'Ryssland': 'Ryssland har helt vita nummerskyltar utan remsa, bokstäverna Ы och Э och bättre vägar. Nyare kamera (generation 4) finns bara i Ryssland.',
      'Polen': 'Polen använder latinska bokstäver och har kantstolpar med rött band runt om.',
    },
  },

  'Ryssland': {
    plonkit: 'russia', del: 'eu', trafik: 'höger',
    liknar: ['Ukraina', 'Kazakstan', 'Bulgarien', 'Estland'],
    unikt: "Helt vita nummerskyltar utan remsa, och korsningar fulla av kantstolpar.",
    tips: [
      ['Nummerskyltar', 'Helt vita med svart text och ingen EU-remsa.'],
      ['Språk', 'Kyrilliska med Ы, Э, Ё och Ъ. Gata heter улица (ул.), stad heter город (г.).'],
      ['Korsningar', 'Ovanligt breda, med väldigt många kantstolpar.'],
      ['Stolpar', 'Fyrkantiga betongstolpar. Skyltstolpar är ofta svartmålade nedtill.'],
      ['Övergångsställen', 'Ränderna är omväxlande vita och gula, och skylten har gul kant.'],
      ['Vägkanten', 'Räcken och trottoarkanter är ofta randiga i svart och vitt.'],
    ],
    skilj: {
      'Ukraina': 'Ukraina har blå-gul remsa på nummerskyltarna, bokstäverna І, Ї och Є och sämre vägar.',
      'Bulgarien': 'Bulgarien har nummerskyltar med blå EU-remsa och ofta latinska bokstäver bredvid de kyrilliska.',
      'Kazakstan': 'Kazakstan har kazakiska bokstäver utöver de ryska och mer platt stäpp.',
    },
  },

  'Malta': {
    plonkit: 'malta', del: 'eu', trafik: 'vänster',
    liknar: ['Storbritannien', 'Italien', 'Grekland', 'Irland'],
    unikt: "Murar av kalksten överallt och färgglada, inbyggda träbalkonger på husen.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Landskap', 'Torrt och lätt kuperat med kaktusar och buskar. Murar av kalksten överallt.'],
      ['Hus', 'Låga hus i vitt till beige, och färgglada inbyggda balkonger.'],
      ['Väglinjer', 'Dubbla gula linjer vid kanten, som i Storbritannien.'],
      ['Språk', 'Engelska och maltesiska, med Ċ, Ġ, Ħ och Ż. Gata heter triq.'],
    ],
    skilj: {
      'Storbritannien': 'Storbritannien är grönt med tegelhus och gula bakre nummerskyltar.',
      'Italien': 'Italien har högertrafik.',
      'Grekland': 'Grekland har högertrafik och grekiska bokstäver.',
    },
  },

  'Andorra': {
    plonkit: 'andorra', del: 'eu', trafik: 'höger',
    liknar: ['Spanien', 'Frankrike', 'Schweiz', 'Österrike'],
    unikt: "Nummerskylten har en orange prick till vänster.",
    tips: [
      ['Nummerskyltar', 'En orange prick till vänster, vilket bara finns i Andorra.'],
      ['Landskap', 'Branta dalar i Pyrenéerna med hus av natursten. Täckningen är tagen i oktober, med höstfärger.'],
      ['Språk', 'Katalanska: i i stället för y, och gata heter carrer.'],
      ['Vägar', 'Kilometerskyltar med CG och CS, gula reflexer på räckena och snöpinnar av trä.'],
    ],
    skilj: {
      'Spanien': 'Spanien har spanska ord (y, calle) och vanliga nummerskyltar med blå remsa.',
      'Frankrike': 'Frankrike har runda vita kantstolpar med spetsig topp och franska på skyltarna.',
    },
  },

  'Monaco': {
    plonkit: 'monaco', del: 'eu', trafik: 'höger',
    liknar: ['Frankrike', 'Italien', 'Spanien'],
    unikt: "En tät, lyxig stadsstat vid havet utan landsbygd, med mycket täckning inne i tunnlar.",
    tips: [
      ['Stad', 'Tät och rik stadsstat med lyxiga hus i pastell, palmer och rader av mopeder.'],
      ['Terräng', 'Brant och kuperad, och mycket av täckningen går genom tunnlar.'],
      ['Nummerskyltar', 'Korta och utan blå remsa, men många franska bilar syns också.'],
      ['Språk', 'Franska.'],
    ],
    skilj: {
      'Frankrike': 'Frankrike har landsbygd och långa nummerskyltar med blå remsor.',
      'Italien': 'Italien har italienska på skyltarna och korta nummerskyltar med blå remsa på båda sidor.',
    },
  },

  'USA': {
    plonkit: 'united-states', del: 'am', trafik: 'höger',
    liknar: ['Kanada', 'Mexiko', 'Australien', 'Puerto Rico'],
    unikt: "Gula trekantiga skyltar med texten NO PASSING ZONE.",
    tips: [
      ['Skyltar', 'Hastighetsskyltar säger SPEED LIMIT och anger miles. Skyltarna har ofta mycket text, som RAILROAD CROSSING och YIELD. Varningsskyltar är gula romber.'],
      ['Väglinjer', 'Gula mittlinjer, oftast dubbla, och vita kantlinjer.'],
      ['Nummerskyltar', 'Korta, med olika utseende i varje delstat. Många bilar saknar främre skylt.'],
      ['Stolpar', 'Trästolpar med stora cylindriska transformatorer i metall.'],
      ['Gatubild', 'Trafikljus på långa stänger över korsningen, brevlådor på stolpe och höga vattentorn med ortnamnet.'],
      ['Språk', 'Amerikansk stavning (center, color) och mått i miles och feet.'],
    ],
    skilj: {
      'Kanada': 'Kanada har MAXIMUM och km/h på hastighetsskyltarna, brittisk stavning (centre), romboida T-korsningsskyltar och oftare en enkel gul mittlinje.',
      'Mexiko': 'Mexiko har åttkantiga betongstolpar, ALTO på stoppskylten och spanska.',
      'Australien': 'Australien har vänstertrafik och vita mittlinjer.',
    },
  },

  'Alaska': {
    plonkit: 'alaska', del: 'am', trafik: 'höger',
    liknar: ['Kanada', 'USA', 'Norge'],
    unikt: "Vägsköldarna har stjärnbilden Karlavagnen nere till vänster.",
    tips: [
      ['Nummerskyltar', 'Helt gula, ibland med en stor orange cirkel. Främre skylt krävs.'],
      ['Natur', 'Tunna barrträd och låga lövträd, och ofta höga snöklädda berg i bakgrunden.'],
      ['Vägskyltar', 'Vägsköldarna har Karlavagnen nere till vänster.'],
      ['Annars som USA', 'Gula mittlinjer, SPEED LIMIT och miles.'],
    ],
    skilj: {
      'Kanada': 'Kanada har MAXIMUM på hastighetsskyltarna och avstånd i kilometer.',
      'USA': 'Resten av USA har sällan helt gula nummerskyltar och sällan så glesa, låga skogar.',
    },
  },

  'Hawaii': {
    plonkit: 'hawaii', del: 'am', trafik: 'höger',
    liknar: ['Puerto Rico', 'USA', 'Filippinerna'],
    unikt: "Nummerskyltarna har en regnbåge i bågform över mitten.",
    tips: [
      ['Nummerskyltar', 'Vita med en regnbåge i bågform över mitten.'],
      ['Språk', 'Hawaiiska ortnamn med många vokaler och bara åtta konsonanter: H, K, L, M, N, P, W och apostrofen ʻokina. Alla ord slutar på vokal.'],
      ['Natur', 'Frodig tropisk växtlighet, ormbunkar, vulkaner och branta klippor.'],
      ['Annars som USA', 'SPEED LIMIT, gula mittlinjer och amerikanska butiker.'],
    ],
    skilj: {
      'Puerto Rico': 'Puerto Rico har spanska på skyltarna och PARE på stoppskylten.',
      'Filippinerna': 'Filippinerna har vägar av betongplattor, tricykel-taxi och gula och vita mittlinjer bredvid varandra.',
    },
  },

  'Kanada': {
    plonkit: 'canada', del: 'am', trafik: 'höger',
    liknar: ['USA', 'Alaska'],
    unikt: "Romboida skyltar för T-korsningar, och hastighetsskyltar med ordet MAXIMUM.",
    tips: [
      ['Skyltar', 'Hastighetsskyltar säger MAXIMUM och anger km/h. Skyltarna har mindre text än i USA, och väjningsskylten saknar text.'],
      ['T-korsningar', 'Romboida skyltar för T-korsningar, som bara finns i Kanada.'],
      ['Språk', 'Brittisk stavning (centre, colour). Franska i Québec.'],
      ['Väglinjer', 'Oftast en enkel gul mittlinje.'],
      ['Kamera', 'Mer äldre täckning (generation 2 och 3) än i USA.'],
      ['Gatubild', 'Gemensamma postlådor för flera hus. Canada Post har röd logga.'],
    ],
    skilj: {
      'USA': 'USA har SPEED LIMIT, miles, amerikansk stavning och oftare dubbla gula mittlinjer.',
    },
  },

  'Grönland': {
    plonkit: 'greenland', del: 'am', trafik: 'höger',
    liknar: ['Island', 'Svalbard', 'Färöarna', 'Norge'],
    unikt: "All täckning är tagen från udda fordon som traktorer, snöskotrar och båtar.",
    tips: [
      ['Landskap', 'Kalt utan träd, ofta snö, och berg och fjordar vid kusten.'],
      ['Hus', 'Små färgglada trähus som står glest utspridda.'],
      ['Kamera', 'All täckning är trekker-kamera, ofta på udda fordon som traktorer, snöskotrar och båtar.'],
      ['Språk', 'Grönländska och danska.'],
    ],
    skilj: {
      'Island': 'Island har vägar med gula kantstolpar och vanlig bilkamera.',
      'Svalbard': 'Svalbard har svarta nummerskyltar med gul text och mer enhetliga, lådformade hus.',
    },
  },

  'Mexiko': {
    plonkit: 'mexico', del: 'am', trafik: 'höger',
    liknar: ['Guatemala', 'USA', 'Colombia', 'Peru'],
    unikt: "Små runda vita kantstolpar med svart fot.",
    tips: [
      ['Stolpar', 'Åttkantiga betongstolpar, ofta med ingraverad text.'],
      ['Väglinjer', 'Vita kantlinjer och en heldragen gul mittlinje.'],
      ['Kantstolpar', 'Små runda vita stolpar med svart fot, som bara finns i Mexiko.'],
      ['Skyltar', 'ALTO på stoppskylten, mycket tjocka pilar och stora versaler på vägvisarna.'],
      ['Gatubild', 'Svarta eller vita vattentankar på taken, kaktusar, OXXO-butiker, Pemex-macker och många pickuper.'],
      ['Språk', 'Spanska. Ortnamn från nahuatl med x och tl, som -tlan och -ec.'],
    ],
    skilj: {
      'Guatemala': 'Guatemala har tunnare väglinjer, rosa eller gröna stolpar och en grå Google-bil med takräcke.',
      'USA': 'USA har engelska och trästolpar.',
      'Colombia': 'Colombia har PARE på stoppskylten och gula nummerskyltar.',
    },
  },

  'Guatemala': {
    plonkit: 'guatemala', del: 'am', trafik: 'höger',
    liknar: ['Mexiko', 'Dominikanska republiken', 'Colombia', 'Ecuador'],
    unikt: "Elstolpar målade i rosa, grönt eller båda.",
    tips: [
      ['Kamera', 'En grå Google-bil med synligt takräcke och backspeglar.'],
      ['Nummerskyltar', 'Korta, med blå ton eller ett grönt fält till vänster.'],
      ['Hus', 'Pastellmålade stenhus med rostiga plåttak, ibland vitt tegel.'],
      ['Stolpar', 'Ofta målade i rosa, grönt eller båda.'],
      ['Vägar', 'Vita kantlinjer och gul mittlinje, tunnare än i Mexiko. ALTO på stoppskylten.'],
      ['Natur', 'Tropisk regnskog, och berg i mitten av landet.'],
    ],
    skilj: {
      'Mexiko': 'Mexiko har tjockare väglinjer, åttkantiga betongstolpar och kaktusar.',
      'Dominikanska republiken': 'Dominikanska republiken har en Google-bil med svartrandiga takstänger och PARE på stoppskylten.',
    },
  },

  'Puerto Rico': {
    plonkit: 'puerto-rico', del: 'am', trafik: 'höger',
    liknar: ['Dominikanska republiken', 'USA', 'Hawaii', 'Colombia'],
    unikt: "Amerikanska skyltformer men med spanska, och telefonnummer som börjar på (787).",
    tips: [
      ['Språk', 'Spanska på skyltarna och PARE på stoppskylten.'],
      ['Gatubild', 'Amerikanska kedjor som Walmart och skyltar formade som i USA.'],
      ['Telefon', 'Riktnummer (787) eller (939).'],
      ['Nummerskyltar', 'De flesta bilar saknar främre skylt.'],
      ['Vägar', 'Mycket täckning på stora motorvägar, med egna vägsköldar.'],
    ],
    skilj: {
      'Dominikanska republiken': 'Dominikanska republiken har en Google-bil med svartrandiga takstänger och blekgula nummerskyltar.',
      'USA': 'Resten av USA har engelska på skyltarna och STOP på stoppskylten.',
    },
  },

  'Dominikanska republiken': {
    plonkit: 'dominican-republic', del: 'am', trafik: 'höger',
    liknar: ['Puerto Rico', 'Guatemala', 'Colombia', 'Curaçao'],
    unikt: "Google-bilen har två metallstänger med tjocka svarta ränder.",
    tips: [
      ['Kamera', 'En unik Google-bil med två metallstänger med tjocka svarta ränder och vit motorhuv.'],
      ['Stolpar', 'Fyrkantiga betongstolpar med en L-formad topp.'],
      ['Nummerskyltar', 'Blekgula upptill och vita nedtill. Främre skylt krävs inte.'],
      ['Vägar', 'Slät och ovanligt mörk asfalt. Skyltar sitter på gula stolpar. PARE på stoppskylten.'],
      ['Täckning', 'Bara Santo Domingo och Santiago de los Caballeros.'],
    ],
    skilj: {
      'Puerto Rico': 'Puerto Rico har amerikanska kedjor, amerikanska skyltformer och en vanlig Google-bil.',
      'Guatemala': 'Guatemala har en grå Google-bil utan svarta ränder och ALTO på stoppskylten.',
    },
  },

  'Curaçao': {
    plonkit: 'curacao', del: 'am', trafik: 'höger',
    liknar: ['Dominikanska republiken', 'Puerto Rico', 'Mexiko'],
    unikt: "Kvadratiska, helt vita nummerskyltar och en svart Google-bil med takräcke.",
    tips: [
      ['Kamera', 'En svart Google-bil med takräcke, som bara finns här.'],
      ['Nummerskyltar', 'Kvadratiska och helt vita.'],
      ['Landskap', 'Halvtorrt med kaktusar och låga, gröna men torra kullar.'],
      ['Hus', 'Envåningshus i pastell, och plåttak på mindre skjul.'],
      ['Skyltar', 'Blå gatuskyltar på gula stolpar. Skyltkantens färg fortsätter på baksidan.'],
    ],
    skilj: {
      'Dominikanska republiken': 'Dominikanska republiken har en Google-bil med svartrandiga takstänger och blekgula nummerskyltar.',
    },
  },

  'Colombia': {
    plonkit: 'colombia', del: 'am', trafik: 'höger',
    liknar: ['Ecuador', 'Peru', 'Mexiko', 'Guatemala'],
    unikt: "Gula nummerskyltar, och vita skyltstolpar som bildar ett kors på baksidan av skylten.",
    tips: [
      ['Nummerskyltar', 'Gula, vilket nästan bara finns i Colombia i Sydamerika.'],
      ['Skyltstolpar', 'Vita metallstolpar som bildar ett kors på baksidan av skylten.'],
      ['Stolpar', 'Betongstolpar, ofta med svart-gula eller svart-orange ränder. Åttkantiga stolpar förekommer.'],
      ['Kilometerskyltar', 'Höga gröna skyltar med PR upptill, eller stenar med svart text.'],
      ['Gatubild', 'Trästaket, pastellgula taxibilar och rödaktiga plattor på trottoarerna.'],
      ['Språk', 'Spanska, och PARE på stoppskylten.'],
    ],
    skilj: {
      'Ecuador': 'Ecuador har vita nummerskyltar i blandade längder, kantstolpar med röda ränder och ofta en suddig, brunaktig kamera.',
      'Peru': 'Peru har svartvitt randiga skyltstolpar och oftast vita nummerskyltar.',
      'Mexiko': 'Mexiko har ALTO på stoppskylten, korta nummerskyltar i många färger och små runda kantstolpar.',
    },
  },

  'Ecuador': {
    plonkit: 'ecuador', del: 'am', trafik: 'höger',
    liknar: ['Colombia', 'Peru', 'Bolivia'],
    unikt: "Korta och långa nummerskyltar om vartannat, något inget annat land i Latinamerika har.",
    tips: [
      ['Nummerskyltar', 'Vita, och både korta och långa skyltar syns om vartannat. Taxi och bussar har orange skyltar.'],
      ['Kamera', 'Ofta en kamera med låg kvalitet, brunaktiga färger och stor rund suddning. Nyare täckning är tagen från en vit pickup utan antenn.'],
      ['Kantstolpar', 'Vanliga, till skillnad från grannländerna: runda med två röda ränder eller platta med två röda reflexer på svart.'],
      ['Stolpar', 'Runda betongstolpar, och ibland stolpar med många små urtag som en stege.'],
      ['Vägar', 'Betongvägar och dubbla vägräcken är vanliga.'],
    ],
    skilj: {
      'Colombia': 'Colombia har gula nummerskyltar och ett kors på baksidan av skyltarna.',
      'Peru': 'Peru har svartvitt randiga skyltstolpar och svart-gula vägräcken.',
    },
  },

  'Peru': {
    plonkit: 'peru', del: 'am', trafik: 'höger',
    liknar: ['Bolivia', 'Ecuador', 'Chile', 'Colombia'],
    unikt: "Svartvitt randiga skyltstolpar.",
    tips: [
      ['Skyltstolpar', 'Svartvitt randiga, ibland svart-gula, vilket bara finns i Peru i Sydamerika.'],
      ['Väglinjer', 'Alltid vita kantlinjer. Bergsvägar saknar ofta mittlinje.'],
      ['Vägräcken', 'Svart-gula ränder, med svart ytterst.'],
      ['Kantstolpar', 'Trekantiga betongklossar målade röda eller gula.'],
      ['Nummerskyltar', 'Oftast vita, ibland gula. Taxi har skyltar som är gula upptill och vita nedtill.'],
      ['Landskap', 'Öken vid kusten, Anderna och regnskog i öster.'],
    ],
    skilj: {
      'Bolivia': 'Bolivia har grova vita skyltstolpar, bara äldre kamera och vägräcken där gult är ytterst.',
      'Ecuador': 'Ecuador har kantstolpar med röda ränder och skyltstolpar utan ränder.',
      'Chile': 'Chile har väglinjer i bara en färg och gula chevroner med svarta pilar.',
    },
  },

  'Bolivia': {
    plonkit: 'bolivia', del: 'am', trafik: 'höger',
    liknar: ['Peru', 'Chile', 'Argentina', 'Ecuador'],
    unikt: "Mycket krokiga elstolpar gjorda av lokala trädstammar.",
    tips: [
      ['Nummerskyltar', 'Korta och vita med blå text.'],
      ['Kamera', 'Bara äldre täckning (generation 3), tagen med en helvit Google-bil utan antenn.'],
      ['Hus', 'Stora röda tegelstenar, och många hus ser ofärdiga ut.'],
      ['Väglinjer', 'Vita kantlinjer. Mittlinjen kan vara gul, vit eller båda.'],
      ['Skyltar', 'Grova, vita och fyrkantiga skyltstolpar. Vägräckena har gula ränder ytterst.'],
      ['Vägar', 'Betongplattor och kullersten med raka rader av sten emellan. Trästolparna är ofta krokiga.'],
    ],
    skilj: {
      'Peru': 'Peru har svartvitt randiga skyltstolpar och även nyare kamera.',
      'Chile': 'Chile har väglinjer i bara en färg och gula chevroner med svarta pilar.',
    },
  },

  'Chile': {
    plonkit: 'chile', del: 'am', trafik: 'höger',
    liknar: ['Argentina', 'Peru', 'Bolivia', 'Uruguay'],
    unikt: "Helt gula väglinjer, både i mitten och vid kanten.",
    tips: [
      ['Väglinjer', 'Antingen helt vita eller helt gula, nästan aldrig blandat.'],
      ['Kamera', 'Äldre täckning är tagen med en vit bil utan antenn, ibland med ett svart parti. Nyare med en blå bil.'],
      ['Stolpar', 'Fyrkantiga betongstolpar med urtag på två sidor och små hål upptill.'],
      ['Chevroner', 'Gul botten med svarta pilar.'],
      ['Nummerskyltar', 'Vita, och orange för taxi och företagsbilar.'],
      ['Broar', 'Räckesstolparna på broar är ofta rödmålade.'],
    ],
    skilj: {
      'Argentina': 'Argentina har vita chevroner med röda pilar, svarta nummerskyltar eller vita med blå rand, och gula och vita linjer blandat.',
      'Peru': 'Peru har svartvitt randiga skyltstolpar.',
    },
  },

  'Argentina': {
    plonkit: 'argentina', del: 'am', trafik: 'höger',
    liknar: ['Chile', 'Uruguay', 'Brasilien', 'Bolivia'],
    unikt: "Svarta nummerskyltar som syns som en svart prick mitt på skylten, och vita kurvpilar med röda pilar.",
    tips: [
      ['Nummerskyltar', 'Svarta (syns som en svart prick mitt på skylten genom suddningen) eller vita med blå rand upptill.'],
      ['Kamera', 'En svart Google-bil i den äldre täckningen.'],
      ['Stolpar', 'Runda betongstolpar med tre ledningar i växelvis mönster, ofta två stolpar ihop. A-formade trästolpar.'],
      ['Chevroner', 'Vita med röda pilar, som inget annat land i Amerika har.'],
      ['Väglinjer', 'Streckade vita, dubbla gula eller en blandning.'],
      ['Landskap', 'Stora delar är platta, trädlösa och glest befolkade.'],
    ],
    skilj: {
      'Chile': 'Chile har gula chevroner med svarta pilar och väglinjer i bara en färg.',
      'Uruguay': 'Uruguay har helt vita nummerskyltar, mittlinjer med gul, vit och gul linje och gröna kullar.',
      'Brasilien': 'Brasilien har portugisiska, röd jord och gula pilar på svarta chevroner.',
    },
  },

  'Uruguay': {
    plonkit: 'uruguay', del: 'am', trafik: 'höger',
    liknar: ['Argentina', 'Brasilien', 'Chile'],
    unikt: "Dubbla gula mittlinjer med en vit streckad linje emellan.",
    tips: [
      ['Landskap', 'Öppet gräsland med låga kullar, ofta i mulet väder.'],
      ['Nummerskyltar', 'Helt vita med svart text.'],
      ['Kamera', 'Bara äldre täckning, tagen med en svart bil utan antenn. Bilden är ofta lite grumlig.'],
      ['Väglinjer', 'Dubbla gula mittlinjer med vita streck emellan, vilket inte finns någon annanstans i Amerika.'],
      ['Skyltstolpar', 'Grova, vitmålade trästolpar med urtag på baksidan.'],
      ['Stolpar', 'Stolpar med tre isolatorer som pekar uppåt, och fyrkantiga betongstolpar.'],
    ],
    skilj: {
      'Argentina': 'Argentina har svarta nummerskyltar eller vita med blå rand, och plattare, ödsligare landskap.',
      'Brasilien': 'Brasilien har röd jord, dubbla gula mittlinjer och portugisiska.',
    },
  },

  'Brasilien': {
    plonkit: 'brazil', del: 'am', trafik: 'höger',
    liknar: ['Argentina', 'Uruguay', 'Portugal', 'Colombia'],
    unikt: "Genomskinliga parabolantenner på husen och tydligt röd jord.",
    tips: [
      ['Nummerskyltar', 'Vita med blå rand upptill (äldre är helt vita). Företagsbilar har röda skyltar.'],
      ['Språk', 'Portugisiska, med -ão, -lh och -nh i stället för spanskans -ón, -ll och -ñ.'],
      ['Jord', 'Tydligt röd i stora delar av landet.'],
      ['Stolpar', 'Rektangulära betongstolpar med stegliknande nederdel och små hål upptill.'],
      ['Skyltar', 'Baksidorna är svartmålade. Chevroner har gula pilar på svart.'],
      ['Vägar', 'Dubbla gula mittlinjer, vita kantlinjer och vitmålade trottoarkanter. Orange tegeltak och blå vattentankar på taken.'],
    ],
    skilj: {
      'Portugal': 'Portugal har EU-nummerskyltar med blå och gul remsa, eukalyptus och ingen röd jord.',
      'Argentina': 'Argentina har spanska och vita chevroner med röda pilar.',
      'Uruguay': 'Uruguay har helt vita nummerskyltar och mittlinjer med gul, vit och gul linje.',
    },
  },

  'Japan': {
    plonkit: 'japan', del: 'as', trafik: 'vänster',
    liknar: ['Taiwan', 'Sydkorea', 'Hongkong'],
    unikt: "Gula nummerskyltar på små, lådformade bilar (kei-bilar).",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Kamera', 'Låg kamera överallt, så den suddiga Google-bilen ser stor ut och vägen ser bred ut.'],
      ['Skrift', 'Kanji blandat med hiragana (mjuka tecken med öglor) och katakana (kantiga, enkla tecken).'],
      ['Nummerskyltar', 'Korta och vita med grön text, eller gula för små kei-bilar.'],
      ['Stolpar', 'Runda betongstolpar med pinnar att klättra på, och korta randiga reflexer i gult eller vitt.'],
    ],
    skilj: {
      'Taiwan': 'Taiwan har högertrafik, bara kinesiska tecken och svart-gula ränder ända ned på stolparna.',
      'Sydkorea': 'Sydkorea har högertrafik och koreansk skrift med många små cirklar.',
      'Hongkong': 'Hongkong har tvåspråkiga skyltar på engelska och kinesiska och extremt höga bostadshus.',
    },
  },

  'Sydkorea': {
    plonkit: 'south-korea', del: 'as', trafik: 'höger',
    liknar: ['Japan', 'Taiwan'],
    unikt: "En skrift där många tecken innehåller små cirklar.",
    tips: [
      ['Skrift', 'Hangul, där många tecken innehåller små cirklar.'],
      ['Väglinjer', 'Högertrafik med gula mittlinjer och vita kantlinjer.'],
      ['Stolpar', 'Svart-gula diagonala ränder nertill som inte når ända ned, och en spets överst.'],
      ['Skyltar', 'Varningsskyltar har gul botten. Vägvisarna är gröna med vit text, och gatuskyltar är blå och pilformade.'],
      ['Nummerskyltar', 'Vita, gula för företagsbilar. Äldre skyltar är korta och gröna.'],
      ['Kamera', 'Nästan bara äldre täckning, där bilens bakdel ofta syns. Mycket är taget på hösten och vintern.'],
    ],
    skilj: {
      'Japan': 'Japan har vänstertrafik, låg kamera och japanska tecken.',
      'Taiwan': 'Taiwan har kinesiska tecken och ränder ända ned till marken på stolparna.',
    },
  },

  'Taiwan': {
    plonkit: 'taiwan', del: 'as', trafik: 'höger',
    liknar: ['Japan', 'Sydkorea', 'Hongkong', 'Filippinerna'],
    unikt: "Röda kantlinjer längs gatorna, som visar parkeringsförbud.",
    tips: [
      ['Skrift', 'Traditionell kinesiska med mycket invecklade tecken.'],
      ['Trafik', 'Högertrafik.'],
      ['Stolpar', 'Svart-gula diagonala ränder som går ända ned till marken.'],
      ['Väglinjer', 'Dubbla gula mittlinjer. Röda kantlinjer (parkeringsförbud) finns nästan bara här.'],
      ['Vägkanten', 'Speglar med orange huv i korsningar, chevroner med svarta pilar på gult och betongdiken.'],
      ['Hus', 'Lådformade flervåningshus.'],
    ],
    skilj: {
      'Japan': 'Japan har vänstertrafik, låg kamera och hiragana.',
      'Sydkorea': 'Sydkorea har hangul och kortare ränder på stolparna.',
      'Hongkong': 'Hongkong har vänstertrafik, engelska på skyltarna och mycket högre hus.',
    },
  },

  'Hongkong': {
    plonkit: 'hong-kong', del: 'as', trafik: 'vänster',
    liknar: ['Singapore', 'Taiwan', 'Japan', 'Malaysia'],
    unikt: "Extremt höga bostadshus, och vissa bilar har en extra svart nummerskylt från fastlandet.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Vit fram och gul bak. Vissa bilar har en extra svart kinesisk skylt.'],
      ['Stad', 'Extremt höga bostadshus, luftkonditionering på fasaderna och täta, livliga gator.'],
      ['Språk', 'Tvåspråkiga skyltar på engelska och traditionell kinesiska.'],
      ['Landskap', 'Bergigt och grönt utanför staden.'],
    ],
    skilj: {
      'Singapore': 'Singapore är platt och har svarta nummerskyltar och gröna gatuskyltar.',
      'Taiwan': 'Taiwan har högertrafik och sällan engelska på skyltarna.',
    },
  },

  'Thailand': {
    plonkit: 'thailand', del: 'as', trafik: 'vänster',
    liknar: ['Kambodja', 'Malaysia', 'Indonesien', 'Vietnam'],
    unikt: "Långa, tunna lyktstolpar som hänger ut över vägen, och gula nummerskyltar på företagsbilar.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Skrift', 'Thailändsk skrift, kompakt med små cirklar i de flesta bokstäverna.'],
      ['Nummerskyltar', 'Stora och vita, gula på företagsbilar.'],
      ['Kantstolpar', 'Fyrkantiga och svartvitt randiga med spetsig topp.'],
      ['Stolpar', 'Fyrkantiga betongstolpar med rader av små hål ända ned. Skyltstolpar är grova och vita med svart nederdel.'],
      ['Vägar', 'Gula mittlinjer och betongvägar. Långa, tunna lyktstolpar som hänger ut över vägen.'],
    ],
    skilj: {
      'Kambodja': 'Kambodja har högertrafik, khmerskrift med fler krumelurer och betongstolpar med urtag som en stege.',
      'Malaysia': 'Malaysia har latinska bokstäver, svarta nummerskyltar och bara vita linjer.',
    },
  },

  'Malaysia': {
    plonkit: 'malaysia', del: 'as', trafik: 'vänster',
    liknar: ['Indonesien', 'Singapore', 'Thailand', 'Filippinerna'],
    unikt: "Stoppskylten säger BERHENTI, och vägsköldarna är gula sexhörningar.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Svarta med två vita fält.'],
      ['Väglinjer', 'Bara vita linjer, ofta dubbla mittlinjer. Tjocka gula streck vid vägkanten.'],
      ['Skyltar', 'BERHENTI på stoppskylten och BERI LALUAN på väjningsskylten. Gula sexkantiga vägsköldar.'],
      ['Vägkanten', 'Svartvitt randiga skyltstolpar och svartvita trottoarkanter.'],
      ['Språk', 'Malajiska med latinska bokstäver, och ofta kinesiska tecken.'],
    ],
    skilj: {
      'Indonesien': 'Indonesien har nummerskyltar med tre vita fält, ibland gula mittlinjer och sällan kinesiska tecken.',
      'Thailand': 'Thailand har thailändsk skrift och gula mittlinjer.',
      'Singapore': 'Singapore har svarta nummerskyltar i ett enda fält och gröna gatuskyltar.',
    },
  },

  'Singapore': {
    plonkit: 'singapore', del: 'as', trafik: 'vänster',
    liknar: ['Malaysia', 'Hongkong', 'Indonesien'],
    unikt: "Vägmärkena sitter alltid på en vit kvadratisk bakgrund.",
    tips: [
      ['Stad', 'Ren och välordnad stadsstat med höga bostadshus och breda vägar kantade av träd.'],
      ['Trafik', 'Vänstertrafik.'],
      ['Gatuskyltar', 'Gröna med rundade hörn och vit text. Vägvisarna är också gröna, på engelska.'],
      ['Skyltar', 'Vägmärken sitter alltid på en vit kvadratisk bakgrund.'],
      ['Nummerskyltar', 'Svarta med vit text i ett enda fält.'],
      ['Vägar', 'Dubbla gula kantlinjer, svartvita trottoarkanter och text på vägen som HUMP AHEAD. Limegröna bussar.'],
    ],
    skilj: {
      'Malaysia': 'Malaysia har nummerskyltar med två fält, malajiska på skyltarna och mer landsbygd.',
      'Hongkong': 'Hongkong är bergigt, har mycket högre hus och kinesiska på skyltarna.',
    },
  },

  'Indonesien': {
    plonkit: 'indonesia', del: 'as', trafik: 'vänster',
    liknar: ['Malaysia', 'Filippinerna', 'Thailand'],
    unikt: "Gula vägstenar som lutar mot vägen med en urtagning upptill, och rader av röda och vita vimplar.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Svarta med tre vita fält, gula på företagsbilar. Nyare skyltar kan vara vita.'],
      ['Väglinjer', 'Vita kantlinjer. Mittlinjen är vit eller gul.'],
      ['Stolpar', 'Runda stål- eller betongstolpar, ofta svartmålade med flaggans rött och vitt.'],
      ['Vägkanten', 'Gula vägstenar vinklade mot vägen med en urtagning upptill. Rader av röda och vita vimplar.'],
      ['Språk', 'Indonesiska med latinska bokstäver, med stavning som påverkats av nederländskan (televisi).'],
    ],
    skilj: {
      'Malaysia': 'Malaysia har nummerskyltar med två fält, bara vita linjer och ofta kinesiska tecken.',
      'Filippinerna': 'Filippinerna har högertrafik och mycket engelska på skyltarna.',
    },
  },

  'Filippinerna': {
    plonkit: 'philippines', del: 'as', trafik: 'höger',
    liknar: ['Indonesien', 'Thailand', 'Malaysia', 'Kambodja'],
    unikt: "Höga, fyrkantiga gula vägstenar, och tricykel-taxi överallt.",
    tips: [
      ['Trafik', 'Högertrafik.'],
      ['Vägar', 'Vägar av betongplattor är extremt vanliga.'],
      ['Väglinjer', 'Gula och vita mittlinjer bredvid varandra är vanligt. Gula linjer har en orange ton.'],
      ['Stolpar', 'Åttkantiga metallstolpar och en isolator på en stång vid sidan av stolpen.'],
      ['Gatubild', 'Tricykel-taxi överallt, skyltstolpar målade i rött, orange eller gult och höga gula vägstenar.'],
      ['Språk', 'Mycket engelska på skyltarna, även filippinska.'],
    ],
    skilj: {
      'Thailand': 'Thailand har vänstertrafik och thailändsk skrift.',
      'Indonesien': 'Indonesien har vänstertrafik och svarta nummerskyltar.',
    },
  },

  'Kambodja': {
    plonkit: 'cambodia', del: 'as', trafik: 'höger',
    liknar: ['Thailand', 'Vietnam', 'Bangladesh'],
    unikt: "En vit Google-bil med en vit rand till vänster och en gul till höger.",
    tips: [
      ['Trafik', 'Högertrafik.'],
      ['Skrift', 'Khmer, med invecklade och slingrande bokstäver.'],
      ['Nummerskyltar', 'Vita med blå text, gröna för myndigheter.'],
      ['Stolpar', 'Betongstolpar med urtag som en stege, eller runda med små hål.'],
      ['Kamera', 'En bil med kort antenn med tre åsar, eller en vit bil med en vit och en gul rand.'],
    ],
    skilj: {
      'Thailand': 'Thailand har vänstertrafik, enklare skrift och fyrkantiga stolpar med hål ända ned.',
      'Vietnam': 'Vietnam har latinska bokstäver med många accenter och gul-orange botten på vägmärkena.',
    },
  },

  'Vietnam': {
    plonkit: 'vietnam', del: 'as', trafik: 'höger',
    liknar: ['Kambodja', 'Thailand', 'Filippinerna'],
    unikt: "Vägmärken med gul-orange botten, unikt i Sydostasien.",
    tips: [
      ['Trafik', 'Högertrafik.'],
      ['Språk', 'Latinska bokstäver med väldigt många accenter, och korta ord.'],
      ['Skyltar', 'Vägmärken har gul-orange botten, unikt i Sydostasien. Skyltstolpar är randiga i rött och vitt.'],
      ['Kantstolpar', 'Små fyrkantiga betongklossar, vita med röd topp.'],
      ['Väglinjer', 'Ovanligt korta gula mittstreck.'],
      ['Vägar', 'Mindre vägar av betongblock.'],
    ],
    skilj: {
      'Kambodja': 'Kambodja har khmerskrift och vita vägmärken.',
      'Thailand': 'Thailand har vänstertrafik och thailändsk skrift.',
    },
  },

  'Indien': {
    plonkit: 'india', del: 'as', trafik: 'vänster',
    liknar: ['Bangladesh', 'Sri Lanka', 'Bhutan'],
    unikt: "Mest en suddig kamera med brunaktiga färger, och skrift med ett vågrätt streck över orden.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Kamera', 'Mest en kamera med låg kvalitet, brunaktiga färger och stor rund suddning.'],
      ['Skrift', 'Många olika skrifter, oftast devanagari (hindi) med ett vågrätt streck över orden. Mycket engelska.'],
      ['Nummerskyltar', 'Långa och vita, gula på företagsbilar och gröna på elbilar.'],
      ['Stolpar', 'Fyrkantiga betongstolpar med treuddig topp. Nästan aldrig trästolpar. Skyltstolpar är svartvitt randiga.'],
    ],
    skilj: {
      'Bangladesh': 'Bangladesh har bengalisk skrift med trekantiga former, gröna rickshaws och turkosa nummerskyltar.',
      'Sri Lanka': 'Sri Lanka har singalesisk skrift med runda bokstäver och gula bakre nummerskyltar.',
    },
  },

  'Sri Lanka': {
    plonkit: 'sri-lanka', del: 'as', trafik: 'vänster',
    liknar: ['Indien', 'Bangladesh', 'Thailand'],
    unikt: "I äldre täckning syns bilens front i blått, vitt och rött, nästan som en fransk flagga.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Lång vit skylt fram och kort gul bak.'],
      ['Skrift', 'Singalesiska med mycket runda bokstäver, ibland tamil och engelska.'],
      ['Kamera', 'I äldre täckning syns bilens front i blått, vitt och rött. Nyare täckning är tagen med låg kamera.'],
      ['Stolpar', 'Fyrkantiga betongstolpar med små hål upptill, eller stolpar med stora hål nedtill, som bara finns här.'],
    ],
    skilj: {
      'Indien': 'Indien har devanagari-skrift, ofta en suddig, brunaktig kamera och vita bakre nummerskyltar.',
      'Thailand': 'Thailand har thailändsk skrift och hål ända ned på stolparna.',
    },
  },

  'Bangladesh': {
    plonkit: 'bangladesh', del: 'as', trafik: 'vänster',
    liknar: ['Indien', 'Sri Lanka', 'Kambodja'],
    unikt: "Turkosa nummerskyltar.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Vita, svarta eller turkosa. Turkosa finns bara här.'],
      ['Skrift', 'Bengali, med ett vågrätt streck överst och många trekantiga former.'],
      ['Gatubild', 'Gröna motorrickshaws överallt, träd med vitmålade stammar och plåttak.'],
      ['Vägkanten', 'Röd-vita betongkantstolpar och svartvitt randiga skyltstolpar.'],
      ['Landskap', 'Platt med vattendrag och åkrar längs vägarna.'],
    ],
    skilj: {
      'Indien': 'Indien har oftast devanagari-skrift och vita eller gula nummerskyltar.',
    },
  },

  'Bhutan': {
    plonkit: 'bhutan', del: 'as', trafik: 'vänster',
    liknar: ['Indien', 'Bangladesh', 'Sri Lanka'],
    unikt: "Helt röda nummerskyltar, och stenblock i stället för vägräcken.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Nästan alltid röda.'],
      ['Kamera', 'En grå Google-bil utan antenn.'],
      ['Vägar', 'Slingrande bergsvägar med stenblock i stället för vägräcken.'],
      ['Hus', 'Traditionell arkitektur med målade träramar och plåttak.'],
      ['Språk', 'Dzongkha, med bokstäver som inte syns någon annanstans. Böneflaggor längs vägarna.'],
    ],
    skilj: {
      'Indien': 'Indien har vita nummerskyltar och ofta en suddig, brunaktig kamera.',
    },
  },

  'Mongoliet': {
    plonkit: 'mongolia', del: 'as', trafik: 'höger',
    liknar: ['Kazakstan', 'Kirgizistan', 'Ryssland'],
    unikt: "Vita kantstolpar formade som bowlingkäglor med två röda ränder, och jurtor.",
    tips: [
      ['Landskap', 'Trädlös stäpp och öken med kullar, floder och sjöar.'],
      ['Kamera', 'Allt är taget från en stor pickup som ofta syns, ibland med tält på taket, röda backspeglar eller snorkel.'],
      ['Språk', 'Kyrilliska med Ө och Ү och många dubbla vokaler. Stoppskylten säger ЗОГС.'],
      ['Nummerskyltar', 'Vita med lite rött till vänster.'],
      ['Kantstolpar', 'Vita och formade som bowlingkäglor, med två röda ränder upptill.'],
      ['Gatubild', 'Jurtor, stora djurhjordar, stenrösen och grusgränder med plank.'],
    ],
    skilj: {
      'Kirgizistan': 'Kirgizistan har en silverfärgad bil med fyra takstänger, nummerskyltar med röd remsa och vintriga berg.',
      'Kazakstan': 'Kazakstan har både kyrilliska och latinska bokstäver och en vit pickup.',
      'Ryssland': 'Ryssland har mer skog och helt vita nummerskyltar.',
    },
  },

  'Kirgizistan': {
    plonkit: 'kyrgyzstan', del: 'as', trafik: 'höger',
    liknar: ['Kazakstan', 'Mongoliet', 'Ryssland'],
    unikt: "Kilometerskyltar med röd-vitt triangelmönster, och en silverfärgad Google-bil med fyra takstänger.",
    tips: [
      ['Kamera', 'En silverfärgad bil med fyra synliga takstänger. Bara äldre täckning.'],
      ['Årstid', 'Allt är fotat på vintern, med kala träd och ofta snö.'],
      ['Nummerskyltar', 'Har en röd remsa.'],
      ['Språk', 'Kyrilliska med Ө, Ү och Ң.'],
      ['Vägkanten', 'Vitmålade trädstammar och stolpar, vita kantstolpar med ett snett svart streck och kilometerskyltar med röd-vita trianglar.'],
    ],
    skilj: {
      'Kazakstan': 'Kazakstan har en vit pickup, bokstäverna Ә och Қ och ofta platt, öppet landskap.',
      'Mongoliet': 'Mongoliet har en stor pickup, jurtor och trädlös stäpp.',
    },
  },

  'Kazakstan': {
    plonkit: 'kazakhstan', del: 'as', trafik: 'höger',
    liknar: ['Ryssland', 'Kirgizistan', 'Mongoliet'],
    unikt: "Kantstolpar som ser ut som två tunna stolpar ihopsatta i rät vinkel.",
    tips: [
      ['Språk', 'Kyrilliska och latinska bokstäver. Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ och І finns i kazakiskan men inte i ryskan.'],
      ['Nummerskyltar', 'Vita med lite blått till vänster.'],
      ['Kamera', 'En vit pickup, ofta helt suddad.'],
      ['Landskap', 'Väldigt öppet och platt på landsbygden: stäpp, öken eller björkskog.'],
      ['Infrastruktur', 'Mycket som i Ryssland. Övergångsställen är randiga i gult och vitt med vita streck vid sidorna.'],
      ['Chevroner', 'Gula och svarta.'],
    ],
    skilj: {
      'Ryssland': 'Ryssland har helt vita nummerskyltar och bara ryska bokstäver.',
      'Kirgizistan': 'Kirgizistan har en silverfärgad bil med takstänger och bara vinterbilder.',
    },
  },

  'Israel': {
    plonkit: 'israel-west-bank', del: 'as', trafik: 'höger',
    liknar: ['Jordanien', 'Förenade Arabemiraten', 'Turkiet'],
    unikt: "Stoppskylten har en målad hand i stället för text.",
    tips: [
      ['Nummerskyltar', 'Gula med blå remsa.'],
      ['Språk', 'Hebreiska, och arabiska på många håll.'],
      ['Väglinjer', 'Gula kantlinjer och vita mittlinjer.'],
      ['Vägkanten', 'Randiga trottoarkanter i rött och vitt eller svart och vitt. Stolpar är ofta svartvitt randiga nedtill.'],
      ['Skyltar', 'Stoppskylten har en hand i stället för text. Chevroner har vita pilar på svart.'],
      ['Hus', 'Ljusa, ofta lådformade stenhus.'],
    ],
    skilj: {
      'Jordanien': 'Jordanien har vita nummerskyltar, bara arabiska och vita chevroner med röda pilar.',
      'Förenade Arabemiraten': 'Förenade Arabemiraten har vita nummerskyltar, platt öken och engelska bredvid arabiskan.',
    },
  },

  'Jordanien': {
    plonkit: 'jordan', del: 'as', trafik: 'höger',
    liknar: ['Israel', 'Förenade Arabemiraten', 'Qatar', 'Tunisien'],
    unikt: "Taxibilar har en grön remsa till vänster på nummerskylten.",
    tips: [
      ['Kamera', 'En svart Google-bil utan antenn och utan röd bromslampa.'],
      ['Nummerskyltar', 'Vita, långa eller korta. Taxibilar har en grön remsa till vänster.'],
      ['Språk', 'Arabiska, sällan engelska på butiksskyltar.'],
      ['Väglinjer', 'Gula kantlinjer och vita mittlinjer.'],
      ['Chevroner', 'Vita med röda pilar.'],
      ['Landskap', 'Mycket torrt, och hus av ljus sandsten med platta tak.'],
    ],
    skilj: {
      'Israel': 'Israel har gula nummerskyltar, hebreiska och svarta chevroner med vita pilar.',
      'Förenade Arabemiraten': 'Förenade Arabemiraten har engelska bredvid arabiskan och randiga skyltstolpar.',
    },
  },

  'Förenade Arabemiraten': {
    plonkit: 'united-arab-emirates', del: 'as', trafik: 'höger',
    liknar: ['Qatar', 'Jordanien', 'Israel'],
    unikt: "En vit Google-bil med svart takräcke, den enda vita Google-bilen i Mellanöstern.",
    tips: [
      ['Landskap', 'Platt öken.'],
      ['Väglinjer', 'Gula kantlinjer och vita eller gula mittlinjer.'],
      ['Språk', 'Arabiska med engelska bredvid.'],
      ['Vägkanten', 'Svartvitt randiga skyltstolpar och randiga trottoarkanter. Många rondeller och delade vägar.'],
      ['Stolpar', 'Mörkbruna trästolpar med tre isolatorer på en vågrät stång.'],
      ['Kamera', 'En vit bil med svart takräcke, eller en vit pickup.'],
    ],
    skilj: {
      'Qatar': 'Qatar har nummerskyltar med vinröd remsa och vita kantlinjer.',
      'Jordanien': 'Jordanien är bergigare och har sällan engelska på skyltarna.',
    },
  },

  'Qatar': {
    plonkit: 'qatar', del: 'as', trafik: 'höger',
    liknar: ['Förenade Arabemiraten', 'Jordanien'],
    unikt: "Gubben på övergångsställeskylten bär lång dräkt, och nummerskyltarna har en vinröd remsa.",
    tips: [
      ['Nummerskyltar', 'Långa och vita med vinröd remsa till vänster.'],
      ['Kamera', 'En vit pickup, oftast suddad, där antennen syns till vänster.'],
      ['Landskap', 'Platt sandöken med nästan ingen grönska.'],
      ['Väglinjer', 'Vita kantlinjer och vita eller gula mittlinjer.'],
      ['Skyltar', 'Chevroner med vita pilar på rött eller blått. Gubben på övergångsställeskylten bär lång dräkt.'],
    ],
    skilj: {
      'Förenade Arabemiraten': 'Förenade Arabemiraten har gula kantlinjer och nummerskyltar utan vinröd remsa.',
    },
  },

  'Sydafrika': {
    plonkit: 'south-africa', del: 'af', trafik: 'vänster',
    liknar: ['Botswana', 'Lesotho', 'Eswatini', 'Australien'],
    unikt: "Elstolpar med rader av små vita isolatorer som sitter som fåglar på en gren.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Väglinjer', 'Gula kantlinjer och vita mittlinjer, ibland tre mittlinjer bredvid varandra.'],
      ['Stolpar', 'Stolpar med en till fem vågräta stänger där små vita isolatorer sitter som fåglar i rad.'],
      ['Språk', 'Mest engelska, och afrikaans i ortnamn som slutar på -fontein, -kraal, -dorp och -burg.'],
      ['Kamera', 'Äldre täckning (generation 2) är vanlig, med stor rund suddning.'],
      ['Vägvisare', 'Gröna med vägnummer i gult.'],
    ],
    skilj: {
      'Australien': 'Australien har vita kantlinjer och eukalyptus överallt.',
      'Botswana': 'Botswana har gula bakre nummerskyltar, svart-gula skyltstolpar och nästan ingen afrikaans.',
      'Lesotho': 'Lesotho har kala berg med platta toppar och runda hyddor.',
    },
  },

  'Botswana': {
    plonkit: 'botswana', del: 'af', trafik: 'vänster',
    liknar: ['Sydafrika', 'Lesotho', 'Eswatini', 'Kenya'],
    unikt: "Svart-gult randiga skyltstolpar, unikt i södra Afrika.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Nummerskyltar', 'Vit fram och gul bak.'],
      ['Landskap', 'Torrt och mest platt, med buskar, låga träd och sandjord.'],
      ['Väglinjer', 'Gula kantlinjer och vita mittlinjer.'],
      ['Skyltstolpar', 'Svart-gula ränder, vilket bara finns i Botswana i södra Afrika.'],
      ['Språk', 'Engelska på skyltarna, och ortnamn på inhemska språk.'],
    ],
    skilj: {
      'Sydafrika': 'Sydafrika har ortnamn på afrikaans och vita bakre nummerskyltar.',
    },
  },

  'Lesotho': {
    plonkit: 'lesotho', del: 'af', trafik: 'vänster',
    liknar: ['Sydafrika', 'Eswatini', 'Botswana'],
    unikt: "Kala berg med platta toppar och vågräta klippband, och runda hyddor med halmtak.",
    tips: [
      ['Landskap', 'Kala, trädlösa berg med platta toppar och vågräta klippband.'],
      ['Hus', 'Runda hyddor med halmtak på landsbygden, och agaveväxter.'],
      ['Nummerskyltar', 'Långa och vita med blå text.'],
      ['Väglinjer', 'Gula kantlinjer, vita mittlinjer och ibland tre mittlinjer.'],
      ['Kamera', 'Bakdelen av en vit Google-bil utan antenn syns nästan alltid.'],
    ],
    skilj: {
      'Eswatini': 'Eswatini har gröna, skogiga kullar och högt gyllene gräs.',
      'Sydafrika': 'Sydafrika har mer varierat landskap och ortnamn på afrikaans.',
    },
  },

  'Eswatini': {
    plonkit: 'eswatini', del: 'af', trafik: 'vänster',
    liknar: ['Sydafrika', 'Lesotho', 'Botswana'],
    unikt: "Vägnummer som börjar med MR.",
    tips: [
      ['Landskap', 'Gröna, skogiga kullar och högt gyllene gräs.'],
      ['Stolpar', 'Enkla mörkbruna trästolpar med isolatorerna på sidan.'],
      ['Vägar', 'Vägnummer som börjar med MR finns bara här. Gula kantlinjer.'],
      ['Nummerskyltar', 'Långa, med grönt nedtill.'],
      ['Gatubild', 'Busskurer av betong är vanliga.'],
    ],
    skilj: {
      'Lesotho': 'Lesotho har kala berg med platta toppar och sällan högt gräs.',
    },
  },

  'Kenya': {
    plonkit: 'kenya', del: 'af', trafik: 'vänster',
    liknar: ['Uganda', 'Rwanda', 'Botswana', 'Sydafrika'],
    unikt: "En grå Toyota följer ofta efter Google-bilen.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Kamera', 'Mest en pickup som ofta är suddad, ibland med snorkel. En grå Toyota följer ofta efter.'],
      ['Väglinjer', 'Vita kantlinjer och gul mittlinje.'],
      ['Nummerskyltar', 'Lång vit skylt fram och kvadratisk gul bak.'],
      ['Gatubild', 'Safaricom-butiker, dekorerade minibussar och eukalyptus.'],
      ['Vägvisare', 'Gröna med vit kant.'],
    ],
    skilj: {
      'Uganda': 'Uganda har täckning mest i Kampala, röd jord och en vit, kantig Google-bil.',
      'Sydafrika': 'Sydafrika har gula kantlinjer och vita mittlinjer.',
    },
  },

  'Uganda': {
    plonkit: 'uganda', del: 'af', trafik: 'vänster',
    liknar: ['Kenya', 'Rwanda', 'Ghana'],
    unikt: "En vit, kantig Google-bil med fyrkantiga backspeglar.",
    tips: [
      ['Trafik', 'Vänstertrafik.'],
      ['Täckning', 'Mest Kampala och Entebbe, plus några nationalparker.'],
      ['Kamera', 'I Kampala syns en vit, kantig Google-bil med fyrkantiga backspeglar.'],
      ['Jord', 'Röd, och även asfalten får en rödaktig ton.'],
      ['Gatubild', 'Kuperat, smala grusvägar, små hus bakom höga murar och minibussar med blått rutmönster.'],
      ['Nummerskyltar', 'Vit fram och gul bak.'],
    ],
    skilj: {
      'Kenya': 'Kenya har mer täckning på landsvägar och gula mittlinjer.',
      'Rwanda': 'Rwanda har högertrafik, mycket rena gator och en disig bild.',
    },
  },

  'Rwanda': {
    plonkit: 'rwanda', del: 'af', trafik: 'höger',
    liknar: ['Uganda', 'Kenya', 'Ghana'],
    unikt: "Alla motorcyklister bär röda västar.",
    tips: [
      ['Trafik', 'Högertrafik.'],
      ['Kamera', 'Oftast en helt suddad pickup. Bilden har en disig ton, särskilt himlen.'],
      ['Landskap', 'Kuperat med röd jord, eukalyptus och bananplantor.'],
      ['Hus', 'Tegel och betong med ventilationstegel, och höga murar.'],
      ['Gatubild', 'Väldigt rena gator, svartvita trottoarkanter och motorcyklister i röda västar.'],
      ['Nummerskyltar', 'Vit fram och gul bak.'],
    ],
    skilj: {
      'Uganda': 'Uganda har vänstertrafik.',
      'Kenya': 'Kenya har vänstertrafik och gula mittlinjer.',
    },
  },

  'Nigeria': {
    plonkit: 'nigeria', del: 'af', trafik: 'höger',
    liknar: ['Ghana', 'Senegal', 'Kenya'],
    unikt: "En polisbil följer nästan alltid efter Google-bilen.",
    tips: [
      ['Kamera', 'En pickup där hytt och flak syns, ofta med en polisbil efter.'],
      ['Nummerskyltar', 'Korta, med en grön ton genom suddningen.'],
      ['Stolpar', 'Betongstolpar med urtag men utan hål.'],
      ['Vägar', 'Ofta dåliga, utan linjer och med gropar.'],
      ['Hus', 'Envåningshus med branta plåttak och murar av betongblock.'],
    ],
    skilj: {
      'Ghana': 'Ghana har en unik Google-bil med takräcke och svart tejp, och taxibilar med gul-orange skärmar.',
    },
  },

  'Ghana': {
    plonkit: 'ghana', del: 'af', trafik: 'höger',
    liknar: ['Nigeria', 'Senegal', 'Uganda'],
    unikt: "Google-bilens takräcke har en svart tejpbit på främre stången, och taxibilar har gul-orange skärmar.",
    tips: [
      ['Kamera', 'En unik Google-bil med takräcke och en svart tejpbit på främre stången. Motorhuven syns ofta.'],
      ['Nummerskyltar', 'Vita och gula om vartannat.'],
      ['Landskap', 'Mest platt med röd jord, tropisk växtlighet och palmer.'],
      ['Gatubild', 'Taxibilar med gul-orange skärmar, och saker målade i flaggans rött, gult och grönt.'],
      ['Väglinjer', 'Alltid vita, eller inga alls.'],
    ],
    skilj: {
      'Nigeria': 'Nigeria har nummerskyltar med grön ton, en pickup med polisbil efter och sämre vägar.',
    },
  },

  'Senegal': {
    plonkit: 'senegal', del: 'af', trafik: 'höger',
    liknar: ['Ghana', 'Nigeria', 'Tunisien'],
    unikt: "Helt blå nummerskyltar, unikt i Afrika.",
    tips: [
      ['Nummerskyltar', 'Helt blå, unikt i Afrika. Nyare skyltar ser ut som EU-skyltar.'],
      ['Språk', 'Franska.'],
      ['Infrastruktur', 'Fransk stil på kantstolpar, stolpar, skyltar och väglinjer.'],
      ['Kilometerskyltar', 'Vita med röd topp.'],
      ['Kamera', 'En silverfärgad eller vit lastbilshytt syns, och bilden är ofta disig.'],
    ],
    skilj: {
      'Ghana': 'Ghana har engelska på skyltarna och en Google-bil med takräcke.',
      'Tunisien': 'Tunisien har arabiska bredvid franskan och svarta nummerskyltar.',
    },
  },

  'Tunisien': {
    plonkit: 'tunisia', del: 'af', trafik: 'höger',
    liknar: ['Jordanien', 'Senegal', 'Turkiet'],
    unikt: "Google-bilen eskorteras nästan alltid av en följebil.",
    tips: [
      ['Nummerskyltar', 'Svarta med vit text.'],
      ['Kamera', 'En svart Google-bil med tunn antenn, nästan alltid med en följebil.'],
      ['Landskap', 'Medelhavsklimat till halvöken, med raka rader av olivträd på krattad jord.'],
      ['Språk', 'Arabiska och franska, ofta på samma skylt. Vägvisarna är vita.'],
      ['Hus', 'Dörrar och fönster målade i en speciell blå nyans.'],
    ],
    skilj: {
      'Jordanien': 'Jordanien har vita nummerskyltar, gula kantlinjer och nästan ingen franska.',
    },
  },

  'Australien': {
    plonkit: 'australia', del: 'oc', trafik: 'vänster',
    liknar: ['Nya Zeeland', 'Sydafrika', 'USA'],
    unikt: "Hastighetsskyltar sitter på en stor vit rektangel, och kantstolparnas röda reflex slutar mitt på.",
    tips: [
      ['Natur', 'Eukalyptus med ljus bark och glesa lövruskor nästan överallt.'],
      ['Trafik', 'Vänstertrafik.'],
      ['Väglinjer', 'Nästan bara vita linjer.'],
      ['Kantstolpar', 'Vita med röd reflex fram och grå bak.'],
      ['Skyltar', 'Väjningsskylten har svart text. Hastighetsskylten sitter på en vit rektangel. Chevroner är vita på svart eller svarta på gult.'],
      ['Vägvisare', 'Gröna, med vägnummer som A2 och C222.'],
    ],
    skilj: {
      'Nya Zeeland': 'Nya Zeeland har kantstolpar med rött band runt toppen, röd text på väjningsskylten, dubbla gula mittlinjer och vägnummer i en röd sköld.',
      'Sydafrika': 'Sydafrika har gula kantlinjer.',
    },
  },

  'Nya Zeeland': {
    plonkit: 'new-zealand', del: 'oc', trafik: 'vänster',
    liknar: ['Australien', 'Storbritannien', 'Irland'],
    unikt: "Kantstolpar med ett rött band runt toppen, och små silverfärgade skydd mot pungrävar på stolparna.",
    tips: [
      ['Kantstolpar', 'Ett rött band runt toppen som går hela vägen runt, vilket bara finns här.'],
      ['Väglinjer', 'Vita kantlinjer. Mittlinjen är vit och streckad eller dubbel och gul.'],
      ['Skyltar', 'Väjningsskylten har röd text. Varningsskyltarna är gula romber på vita stolpar.'],
      ['Gatuskyltar', 'Oftast blå med vit text.'],
      ['Stolpar', 'Betongstolpar med ett långt urtag och små silverfärgade skydd mot pungrävar.'],
      ['Trafik', 'Vänstertrafik. Vägnummer står i en röd sköld.'],
    ],
    skilj: {
      'Australien': 'Australien har eukalyptus överallt, svart text på väjningsskylten och nästan bara vita linjer.',
      'Storbritannien': 'Storbritannien har gula bakre nummerskyltar och vita varningstrianglar.',
    },
  },
};
