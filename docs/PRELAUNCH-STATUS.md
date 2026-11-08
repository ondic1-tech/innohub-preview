# Stav předprodukčních oprav — 8. 11. 2026

Výchozí SHA: `df789cc0b0be72ac37a507a0ad532ad858fd64b8`.
Pracovní větev: `prelaunch-audit-fixes`. Produkční vydání není schváleno.
Tento záznam rozlišuje provedenou práci od zbývajících podmínek původního plánu.

Další provedené kontroly a omezení: [druhý průchod](PRELAUNCH-SECOND-PASS.md).
Konkrétní úkoly k předání: [správce hostingu](HOSTING-TASKS.md).
Testy a zbývající ověření formuláře: [formulář](FORM-REVIEW.md).
Dokončené výchozí měření 20 profilů a navazující opravy: [PageSpeed](PAGESPEED-BASELINE.md).
Záloha aktuálního webu a testovací nasazení: [hosting](HOSTING-STAGING.md).

## Rozhodnutí a první etapa

- [x] 0.1 Čistá pracovní kopie ověřena proti aktuálnímu main a vytvořena samostatná větev.
- [x] 0.2 Zadavatel výslovně potvrdil **ponechat kontaktní formulář v CZ i EN**.
  Informace o dřívějším požadavku na odstranění v původním checklistu je chybná.
- [x] 0.3 Provozní podklady k současnému hostingu a DNS načteny. Zadavatel potvrdil,
  že **DNS a HTTPS spravuje správce hostingu**. **Ostré spuštění schvaluje Ondřej Šimek**.
  Pro přípravu se vychází ze zachování nynějšího hostingu, bez migrace DNS.
  Zadání v HOSTING-TASKS.md zahrnuje zálohu a návrat; skutečný nácvik je otevřen v 4.5.
  Přístupové údaje ani
  interní provozní podklady se nekopírují do veřejného repozitáře.
- [x] 0.4 Zadavatel schválil veřejný GitHub náhled; autentizace není požadována.
  Náhled funguje a noindex zůstává. Shoda testovací kopie na cílovém hostingu
  s produkční konfigurací zbývá ověřit v etapě 5.
- [x] 1.1 Varianta B: stávající formulář zachován v obou jazycích.
- [ ] 1.2–1.4 Posouzení poskytovatele FormSubmit a osobních údajů, skutečné doručení,
  aktivace schránky, výpadky, antispam a limity nejsou dosud uzavřeny.
  **Zadavatel nyní výslovně odložil formulář a požádal pokračovat v nasazování.**
  Formulář se nemaže; tato výjimka neznamená potvrzení funkčnosti.
  Jeden schválený živý pokus potvrdil blokaci neprovedenou aktivací; příjemce
  musí potvrdit aktivační e-mail. Viz FORM-ACTIVATION-DIAGNOSIS.md.
- [x] 1.5 Staticky prověřeno 67 HTML souborů, 83 obrázků a 1 073 místních odkazů
  a zdrojů včetně kotev, ID a verzovaných CSS/JS. Žádné chyby po opravě cache klíčů.
- [x] 1.6 Zkontrolováno všech 20 jedinečných externích HTTP(S) odkazů: 19 bez chyby,
  LinkedIn vrací automatickému klientu 403, ale firemní stránka je ověřena v prohlížeči
  s přihlášenou relací. Výjimka zdokumentována; bezpečné rel atributy prošly staticky.
- [ ] 1.7–1.8 Předchozí browserové testy jsou v PERFORMANCE-REVIEW.md; úplný protokol
  kandidátního vydání včetně schválení obsahu a všech požadovaných scénářů zbývá.

**Rozhodnutí G1 pro pokračování v přípravě jsou uzavřena.** Formulář zůstává,
správce DNS/HTTPS a schvalovatel jsou určeni, veřejný náhled je výslovně schválený.
To nepotvrzuje technickou připravenost cílového serveru ani souhlas s ostrým vydáním.

## Provedené technické opravy

- Oddělený `tools/build_release.cjs` vytváří nový balíček mimo checkout bez regenerace
  obrázků a redakčních metadat. Výchozí režim zachovává noindex ve všech 67 HTML.
- Produkční režim vyžaduje potvrzení domény, ověří 34 unikátních kanonických stránek
  v sitemapě a zapne indexaci pouze u nich; 32 aliasů a 404 zůstávají noindex.
  Tento režim byl pouze místně nacvičen, nikam nenasazen.
- Balíček neobsahuje údržbové nástroje, README, pracovní zprávy, Git data ani site.config.json.
  Obsahuje 144 webových souborů; manifest SHA-256 je mimo nasazovaný adresář.
- Normalizace CSS/JS na LF a odpovídající cache klíče odstraňují závislost na tom,
  zda se příprava spouští ve Windows či jiném systému. Opraveny dvě adresy stylu
  `aturno-reference.css` v českých a anglických referencích a údržbová funkce digest.
- 5 automatických testů ověřuje náhled, produkční blokaci bez potvrzení, přesný
  rozsah změn při místním nácviku, ochranu před přepisem a odmítnutí chybného režimu.

## HTTP měření současného veřejného náhledu

Ověřován GitHub Pages main, nikoliv produkční kandidát nebo stávající web na innohub.cz.
Protokoly: `prelaunch-static-validation.json`, `prelaunch-http-validation.json`.

- Všech 34 obsahových URL vrací 200 a obsahuje noindex.
- Neexistující vnořená URL vrací skutečný 404 a HTML má noindex (2.5 pro tento náhled).
- Úvodní HTML je přenášeno gzip, cache-control max-age=600, přítomno HSTS hostingu.
- CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy a X-Frame-Options
  v měřených odpovědích nejsou přítomny. Bod 2.2 je otevřený; požadované HTTP
  hlavičky musí být nastaveny a ověřeny na cílovém serveru, ne pouze v HTML.

## Zbývající podmínky

- [ ] 2.1–2.4 Úplné HTTPS/TLS přesměrování nového kandidáta, hlavičky, schválení závislostí
  a bezpečnostní audit. Předběžná kontrola main.js/news.js nenašla použití
  innerHTML/eval pro URL nebo uživatelský vstup; nejde o úplný dynamický bezpečnostní audit.
- [ ] 3.1 Výchozí Lighthouse audit veřejného main dokončen pro 5 šablon CZ/EN,
  každou na mobilu i PC (20 výsledků). Výsledky, konfigurace a reportové URL uloženy.
  Všechny mají výkon 100; opravený kandidát čeká na opakování po nasazení na staging.
- [ ] 3.2 Laboratorní LCP výchozího náhledu 0,2–1,5 s, CLS 0, TBT 0–10 ms.
  PSI nevrací reálná data, INP a 75. percentil CWV nového webu nejsou ověřeny.
- [ ] 3.3 Doba cache a obrázková doporučení jsou evidována v reportu a zadání
  hostingu. Definitivní ověření přenosů a cache cílového serveru zbývá.
- [ ] 3.4–3.5 Opravené kontrasty a pořadí nadpisů prověřeny v Chromium ve 36
  kombinacích stránky/šířky, 354 textových kontrol bez chyby. Bez vodorovného
  přetečení na kontrolovaných šířkách 320–1275 CSS px. To nenahrazuje Firefox,
  WebKit, skutečný zoom, čtečku obrazovky ani úplný audit WCAG.
- [x] 4.1 Oddělený produkční krok připraven a otestován; náhled i main mají dále noindex.
- [ ] 4.2–4.3 Místní sitemap/canonical/hreflang a strukturovaná data ověřeny;
  indexovatelnost skutečné produkce, úplná kontrola metadat a sdílení zbývají.
- [x] 4.4 README a robots komentář odpovídají náhledovému režimu.
- [ ] 4.5 DNS ponecháno, aktuální živý web plně zálohován a ZIP součty ověřeny.
  Skutečný provozní návrat na ostrém hostingu se dosud necvičil.
- [x] 5.1 Kandidát 7797261 nasazen na https://innohub.cz/prelaunch-7797261/ na
  stejném hostingu, samostatná testovací konfigurace, zakázaná indexace.
- [ ] 5.2–5.4 Všech 145 souborů kandidáta, hlavičky, 404 a základní CZ/EN scénáře
  ověřeny; úplný testovací protokol, kandidátní Lighthouse, přístupnost a schválení
  G2/G3 zbývají. Původní soubory a hlavní web zůstaly beze změny.
- [ ] Etapy 6–7 Ostré spuštění, G4 a následné provozní kontroly nebyly provedeny.

Před jakýmkoli produkčním přepisem uložit stávající web a konfiguraci mimo webroot,
ověřit obnovitelnost zálohy, zaznamenat schválené release SHA a kontrolní součty.
Nasazovat pouze obsah ověřeného balíčku; rollback musí obnovit web i dotčenou
konfiguraci a zneplatnit cache. Konkrétní provedení a nácvik naváže na potvrzený hosting.
