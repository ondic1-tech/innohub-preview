# Další kontrola před spuštěním — 8. 11. 2026

Navazuje na pracovní větev `prelaunch-audit-fixes` a výchozí SHA `47dd125`.

## Provedeno

- Správce hostingu potvrzen jako správce DNS/HTTPS; ostré spuštění nadále schvaluje
  Ondřej Šimek. Veřejný GitHub náhled je schválený. Připraveno konkrétní zadání
  [pro hosting](HOSTING-TASKS.md); žádné nastavení hostingu ani DNS se neměnilo.
- Současné DNS A/AAAA, NS, přesměrování čtyř variant kořenové URL a certifikáty
  obou názvů změřeny. Certifikát je důvěryhodný a platný, přesměrování správná.
  Chybějící bezpečnostní hlavičky jsou úkol pro server. Není tím ještě ověřen nový
  kandidát na tomto hostingu, skutečná IPv6 cesta ani automatická obnova certifikátu.
- Zkontrolováno 20 jedinečných externích HTTP(S) odkazů v celém webu. 19 skončilo
  bez chyby HTTP. LinkedIn vrací automatickému klientu 403, ale běžný prohlížeč
  s existující přihlášenou relací otevřel správnou firemní stránku TC Business
  Innovation Hub. Anonymní přístup LinkedIn může omezovat; odkaz není odstraněn.
- Formulář: 20 izolovaných aplikačních testů prošlo a opraven focus po chybě.
  Podrobnosti a dosud nepotvrzené podmínky jsou v [revizi formuláře](FORM-REVIEW.md).
- Statická kontrola 67 HTML a webových skriptů: žádné externě vložené zdroje,
  inline události, javascript: URL, zkontrolované nebezpečné DOM vkládací operace
  ani chybějící CSS url cíle. Jediný inline spustitelný skript je úprava base pro
  GitHub 404; CSP s ním musí výslovně počítat. Nejde o penetrační test.
- Po změně skriptu obnoveny cache klíče na všech 35 plných stránkách; místní
  kontrola 1 073 odkazů/zdrojů a metadata opět prošla.

## Výkonové měření

Pokus o měření mobilního úvodu současného veřejného main přes oficiální PageSpeed
Insights API skončil HTTP 429 (vyčerpaná denní kvóta služby). Lighthouse zpráva
nebyla vrácena. Proto se neuvádí skóre, LCP, CLS, TBT ani výsledek přístupnosti.
Nešlo o měření nové pracovní větve a ani úspěšný výsledek by sám neuzavřel její
předprodukční měření. Reálná data INP nového webu nejsou k dispozici.

## Co zůstává před schválením

Skutečné doručení formuláře a schválení poskytovatele, plný browserový protokol,
Lighthouse, WCAG a další prohlížeče, kandidát na cílovém serveru s jeho hlavičkami,
nácvik zálohy/obnovy a finální schválení. Ostré nasazení nebylo provedeno.
