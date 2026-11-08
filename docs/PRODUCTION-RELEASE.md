# Ostré vydání INNOHUB — 8. 11. 2026

**Nasazeno na https://innohub.cz/ dne 8. 11. 2026 ve 21:28:36 CET.**
Ondřej Šimek výslovně schválil ostré nasazení v této pracovní konverzaci.
Formulář předtím výslovně odložil; nejde o potvrzení jeho funkčnosti ani uzavření
všech původních kontrolních bodů. Původní web je bezpečně uložen pro návrat.

## Zdroj a provedení

- Zdroj sestavení: `8d5ad3a05ca5ece4b5083b753d5be7b806753b38`.
- Webový obsah shodný se schválenou testovací kopií z
  `779726152e9fbad9340710eb980d46532c570d85`; další commit doplnil pouze dokumentaci.
- Oddělený produkční balíček: **144 souborů, 4 115 246 bajtů**. Údržbové nástroje,
  Git data, provozní poznámky ani přístupové údaje nejsou součástí webrootu.
- Produkční odlišnosti: indexace 34 obsahových stránek, komentář robots.txt,
  základní cesta 404 a serverová konfigurace. Náhledový marker `.nojekyll` se na
  tomto hostingu nepoužívá. Design, texty, formulář a ostatní webové soubory zachovány.
- Všech 144 souborů ověřeno stažením přes šifrovaný přenos proti SHA-256 manifestu
  ještě před přepnutím. Certifikát přenosového serveru přísně ověřován.
- Nová verze připravena mimo živý web a následně přepnuta přejmenováním adresářů.
  Původní adresář ponechán mimo veřejný webroot pro okamžitý návrat.
- DNS, e-mailové záznamy a certifikáty nebyly měněny.
- GitHub zdroj a veřejný GitHub Pages náhled zůstávají s noindex. Produkční
  indexovatelný balíček není nahrán jako HTML do GitHub Pages.

## Záloha těsně před přepnutím

- Uloženo všech **139 souborů** původního webu včetně `.htaccess` a obou jazyků.
- Archiv: `innohub-before-production-20261108T202320Z.zip`, předán místně zadavateli.
- SHA-256: `9EC2AAFBE8560F4EE18F14A10751B73B3DC9136B4D0850A814C17BE38CB4C565`.
- Všech 139 souborů znovu přečteno přímo ze ZIPu: velikosti a SHA-256 souhlasí
  s manifestem. Nejde o zálohu DNS, certifikátů či účtu administrace hostingu.
- Původní obsah i konfigurace zůstávají také na serveru mimo webroot. Soukromý
  pracovní záznam obsahuje přesný název adresáře a postup přepnutí zpět.
- Skutečný návrat přepisem nově spuštěného webu nebyl nacvičen. Záloha a připravený
  postup obnovy nenahrazují takový provozní test.

## Ověření po spuštění

Výsledky: [production-verification.json](production-verification.json).

- **143 veřejných souborů přes HTTPS**, všechny HTTP 200 a přesná shoda SHA-256
  s vydáním; neveřejná `.htaccess` ověřena již při přenosu.
- **34 indexovatelných obsahových stránek**, všechny v sitemapě a bez globálního
  X-Robots-Tag noindex; **32 aliasů a 404 dále noindex**.
- HTTP, HTTP www i HTTPS www přesměrovávají 301 na HTTPS bez www se zachováním
  testované cesty `/en/services/` i query stringu. TLS certifikáty ověřeny běžným
  klientem bez vypnutí kontroly důvěryhodnosti.
- Vnořená neexistující adresa vrací skutečný **404**, správnou základní cestu `/`
  a noindex. Sitemap obsahuje 34 odpovídajících produkčních adres.
- HTML má `Cache-Control: no-cache`, nosniff, Referrer-Policy, Permissions-Policy,
  X-Frame-Options DENY, HSTS `max-age=300` a CSP **Report-Only**. CSP není vynucena;
  HSTS nemá includeSubDomains ani preload.
- Testovací kopie https://innohub.cz/prelaunch-7797261/ zachována včetně noindex
  v HTML a HTTP hlavičce.
- V Chrome ověřen CZ úvod → validace služby → EN se zachováním vybrané služby,
  anglické reference, načtení novinek, návrat logem na EN úvod a přepnutí na CZ.
  Nebyl odesílán formulář. U dříve otevřené CZ stránky se jednou objevila stará
  kopie z cache prohlížeče; obnovení načetlo nové vydání. Nové HTML používá no-cache.

## Následné úkoly a omezení

1. **Formulář zůstává neaktivovaný u FormSubmit**, skutečné doručení není ověřeno.
   Zadavatel výslovně požádal pokračovat bez jeho řešení. Veřejný alias je zachován;
   pokračovat podle [diagnostiky aktivace](FORM-ACTIVATION-DIAGNOSIS.md).
2. **Správce hostingu: vyprázdnit starou serverovou/proxy cache této domény.**
   U 10 původních adres obrázků/fontů vrací cache správný obsah, ale staré odpovědi
   bez nových bezpečnostních hlaviček. Po přidání nového query parametru jsou u všech
   10 souborů obsah i nové hlavičky správné. Zkontrolovat běžné adresy po vyprázdnění;
   bezpečnostní hlavičky aplikovat konzistentně i na cache odpovědi.
3. Správce hostingu dále potvrdí automatické obnovování certifikátu, starší TLS
   protokoly a skutečnou dostupnost obou IP rodin. Změna DNS nebyla potřebná.
4. Po provozním ověření domluvit prodloužení HSTS a vynucení otestované CSP;
   nynější reportovací režim sám o sobě obsah neblokuje.
5. Kandidátní Lighthouse na cílovém hostingu, úplný audit přístupnosti,
   Firefox/WebKit, reálný INP a provozní dohled nejsou tímto vydáním dokončeny.
   Dřívější laboratorní výsledky se nesmějí vydávat za měření ostré verze.

Ostré schválení a dokončené základní ověření po spuštění jsou zaznamenány;
otevřené položky původního plánu zůstávají otevřené v uvedeném rozsahu.
