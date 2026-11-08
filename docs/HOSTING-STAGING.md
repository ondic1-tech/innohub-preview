# Záloha živého webu a nasazení testovací kopie — 8. 11. 2026

Zadavatel výslovně odložil řešení formuláře a požádal pokračovat v nasazování;
následně upřednostnil zálohu aktuálně nasazené verze. Formulář není označen za funkční.

## Záloha skutečně nasazené verze

- Zdroj: současný webový prostor stávajícího hostingu, nikoli GitHub.
- Staženo všech **139 souborů, 3 975 319 bajtů**, včetně `.htaccess`, CZ/EN,
  obrázků, fontů, skriptů, stylů, sitemap a robots.txt.
- Souborové seznamy, velikosti a časové údaje před a po stažení shodné.
- ZIP obsahuje `web/`, SHA-256 manifest, inventář a návod k obnovení. Všech
  139 položek bylo znovu otevřeno přímo ze ZIPu a ověřeno proti SHA-256 manifestu.
- Archiv: `innohub-live-backup-20261108T200100Z.zip` (3 646 288 bajtů), místně
  v pracovních výstupech. Obsah živého webu ani přístupové údaje se nezveřejňují v GitHubu.
- SHA-256 archivu: `F93346B8A7ED018369796905D42A6029BD8F0411E3386A7E26DF8A52F11C6F81`.
- Záloha neobsahuje DNS, certifikáty ani nastavení administrace hostingu mimo webroot.
  Obnovení do ostrého prostoru nebylo zkoušeno přepisem živého webu.

## Testovací nasazení

Adresa: **https://innohub.cz/prelaunch-7797261/**.
Zdrojový commit: `779726152e9fbad9340710eb980d46532c570d85`.

Nasazeno **145 souborů**, samostatný adresář vedle původního obsahu. Původní
hlavní web ani DNS nebyly přepsány. Přenos byl šifrovaný a ověření přenosového
certifikátu zůstalo zapnuté; použito správné jméno přenosového serveru hostingu.

Balíček vychází z odděleného preview sestavení a má pouze dvě adaptační změny:
base chybové stránky odpovídá testovací cestě a místní `.htaccess` nastavuje
adresářový index, vlastní chybovou stránku a testovací bezpečnostní hlavičky.

- Všechny HTML včetně aliasů a 404 mají `noindex,follow`.
- Na serveru přítomno `X-Robots-Tag: noindex, follow`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, omezení kamery/mikrofonu/polohy
  a `X-Frame-Options: DENY`.
- CSP je **Report-Only**, nikoli vynucená. Obsahuje výjimku pro aktuální inline
  skript 404 pomocí hashe a cíle FormSubmit. HSTS na doméně se tímto nemění.
- 143 veřejných souborů porovnáno přes HTTPS s manifestem SHA-256: bez rozdílů.
  `.htaccess` ověřen stažením přes zabezpečený přenos; nulová velikost markeru
  `.nojekyll` ověřena na serveru. Celkem ověřeno všech 145 souborů.
- Neexistující vnořená adresa vrací skutečný **404**, noindex a správnou základní
  cestu; její navigace vede do testovací kopie.
- V prohlížeči ověřen CZ úvod, přechod na služby, výběr validace a přepnutí na EN
  se zachováním služby, zobrazení 404 a návrat z ní. Neodesílán formulář.
- V zachycených konzolových záznamech byly pouze zprávy rozšíření Chrome;
  nebyla pozorována chyba webové aplikace v těchto kontrolovaných scénářích.
- Po nasazení znovu ověřeno: **všech 139 původních souborů beze změny** a kontrolní
  součet ostrého úvodu odpovídá záloze.

Podrobnosti měření: [hosting-staging-verification.json](hosting-staging-verification.json).
Testovací verze je veřejná dle dřívějšího souhlasu, ale indexace je zakázaná.
Nejde o ostré spuštění. Kandidátní Lighthouse, další prohlížeče, úplná přístupnost,
vynucení ověřené CSP a skutečný provozní rollback mají ještě navazující kontroly.
