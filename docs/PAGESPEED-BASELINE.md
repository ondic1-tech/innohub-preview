# PageSpeed / Lighthouse: výchozí měření a opravy

Měření 8. 11. 2026 přes veřejné webové PageSpeed Insights. Měřen **veřejný main
df789cc**, nikoli pracovní větev ani web na produkčním hostingu innohub.cz.
API i při opakovaném pokusu vracelo 429; webové rozhraní měření úspěšně dokončilo.
Celkem 10 stránek × 2 profily = **20 výsledků**. Jde o jeden běh na profil,
nikoli statistiku opakovaných běhů nebo reálných návštěvníků.

## Výsledky před opravami této větve

| Stránka | Profil | Výkon | Přístupnost | LCP | TBT | CLS | Zdroj |
|---|---|---:|---:|---:|---:|---:|---|
| / | Mobil | 100 | 96 | 0,9 s | 10 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview/cd23iiri52?form_factor=mobile) |
| / | PC | 100 | 95 | 0,3 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview/cd23iiri52?form_factor=desktop) |
| sluzby/ | Mobil | 100 | 97 | 0,9 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-sluzby/ik9a8vjdks?form_factor=mobile) |
| sluzby/ | PC | 100 | 95 | 0,2 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-sluzby/ik9a8vjdks?form_factor=desktop) |
| kontakt/ | Mobil | 100 | 100 | 1,4 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-kontakt/tzxvlv77dm?form_factor=mobile) |
| kontakt/ | PC | 100 | 97 | 0,3 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-kontakt/tzxvlv77dm?form_factor=desktop) |
| reference/ | Mobil | 100 | 95 | 1,5 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-reference/trgdju6hcv?form_factor=mobile) |
| reference/ | PC | 100 | 95 | 0,4 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-reference/trgdju6hcv?form_factor=desktop) |
| reference/psp/ | Mobil | 100 | 95 | 0,9 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-reference-psp/rlf10p9bdc?form_factor=mobile) |
| reference/psp/ | PC | 100 | 95 | 0,3 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-reference-psp/rlf10p9bdc?form_factor=desktop) |
| en/ | Mobil | 100 | 96 | 0,9 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en/km91mq8hhq?form_factor=mobile) |
| en/ | PC | 100 | 95 | 0,3 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en/km91mq8hhq?form_factor=desktop) |
| en/services/ | Mobil | 100 | 97 | 0,9 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-services/0lsyho8jbg?form_factor=mobile) |
| en/services/ | PC | 100 | 95 | 0,2 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-services/0lsyho8jbg?form_factor=desktop) |
| en/contact/ | Mobil | 100 | 100 | 1,0 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-contact/7n0yqempl9?form_factor=mobile) |
| en/contact/ | PC | 100 | 97 | 0,2 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-contact/7n0yqempl9?form_factor=desktop) |
| en/case-studies/ | Mobil | 100 | 95 | 1,5 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-case-studies/xt4b2c2z3p?form_factor=mobile) |
| en/case-studies/ | PC | 100 | 95 | 0,4 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-case-studies/xt4b2c2z3p?form_factor=desktop) |
| en/case-studies/psp/ | Mobil | 100 | 95 | 0,9 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-case-studies-psp/iu7aj3p5tu?form_factor=mobile) |
| en/case-studies/psp/ | PC | 100 | 95 | 0,3 s | 0 ms | 0 | [report](https://pagespeed.web.dev/analysis/https-ondic1-tech-github-io-innohub-preview-en-case-studies-psp/iu7aj3p5tu?form_factor=desktop) |

Ve všech profilech jsou Doporučené postupy 100 a SEO 66. Jedinou neúspěšnou
bodovanou SEO kontrolou je záměrné noindex náhledu. Neodstraňuje se kvůli skóre.
Reálná data PSI nevrátilo; **INP a 75. percentil Core Web Vitals nejsou ověřeny**.
TBT není náhradou za měření INP.

## Konfigurace a uchování výsledků

Lighthouse 13.6.0, HeadlessChromium 157.0.8103.38, první načtení jediné stránky,
prohlížeč v Evropě. Mobilní profil používá emulaci Moto G Power, 412 × 823,
DPR 1,75 a simulované pomalé 4G (150 ms TCP RTT, 1 638,4 kb/s). Desktop
1350 × 940, DPR 1, vlastní síťové omezení 40 ms / 10 240 kb/s.
Konkrétní procesorový faktor a další parametry každého běhu jsou uchované
v [pagespeed-baseline.json](pagespeed-baseline.json). Hodnoty byly získány
z vykreslených reportů webové služby, nikoliv exportem kompletního LHR JSON
nebo síťového trasování. Odkazy výše vedou na původní reporty.

## Opravy podle nálezů

- Kontrast čísel služeb a kroků, kategorií referencí a malých nadtitulků:
  tmavší textová modrá #006DA4. Barva modrého pruhu zůstává **#008CD2**,
  barevná loga ani velký slogan se nemění.
- Menu: čitelnější světlý text #EAF6FC (aktivní bílý), 700 při 1,2 rem
  (výchozí 19,2 px), včetně dříve menších přechodových šířek. Kontrast
  nejméně 3,35 : 1 vyhovuje prahu 3 : 1 pro tento velký tučný text.
  Aktivní položku nadále rozlišuje podtržení.
- Na CZ/EN službách vedlejší nadpis H3 změněn na H2, aby po H1 nedocházelo
  k přeskočení úrovně. Původní vzhled nadpisu zachovává cílený styl.
- Obnoveny revize CSS ve všech 35 plných stránkách.

## Ověření opraveného kandidáta

Místní prohlížeč Chromium: **36 kombinací stránky a šířky, 354 cílených
kontrol textového kontrastu**, žádná chyba v kontrolovaných kombinacích barev,
žádné přeskočení úrovně zobrazených nadpisů, vodorovné přetečení nebo překrytí
hlavičky tlačítkem LinkedIn. Zahrnuty šířky 320, 390, 801, 950, 1024 a 1275
CSS px; v mobilním menu kontrolován také rozbalený stav.
Podrobnosti: [cílené kontroly](a11y-contrast-validation.json).
Tyto kontroly nejsou nový Lighthouse běh kandidáta ani úplný audit WCAG,
skutečný zoom 200–400 % nebo test čtečkou obrazovky.

Statická kontrola 67 HTML a 1 073 místních referencí i 25 aplikačních testů
formuláře/sestavení prošly. Po publikaci kandidáta na schváleném stagingu
je potřeba Lighthouse zopakovat; nelze předem tvrdit nové skóre přístupnosti 100.

## Zbývající výkonová doporučení

Lighthouse uvádí i nehodnocená doporučení k době cache, blokující společné CSS
a velikosti obrázků referencí. CSS je malé a všechny běhy dosáhly výkonu 100;
nebyla proto nahrazena stabilní sdílená cache rozsáhlým inline CSS. Delší dobu
cache musí nastavit hosting podle HOSTING-TASKS.md. Obrázky již mají místní WebP
zdroje a velikostní varianty; další změny je vhodné ověřit na cílovém serveru
a různých hustotách displeje. Doporučení k lazy načtení konkrétního LCP obrázku
referencí zůstává evidováno pro kandidátní měření; naměřené desktopové LCP je 0,4 s.

Pravidla kontrastu: [W3C — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
