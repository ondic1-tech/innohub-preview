# INNOHUB: technická příprava v1.0 pro innohub.cz

Primární budoucí adresa: **https://innohub.cz/**. Aktuálně je indexace vypnutá.
Záložní větve `v1.0` a `v1.1` na GitHubu se těmito technickými úpravami nemění.
Schválené viditelné texty v1.0 byly porovnány se zdrojovou verzí; jediným
doplněným nadpisem je skrytý nadpis Služby/Services pro čtečky obrazovky.

## Provedené úpravy

- 67 HTML souborů, 34 obsahových stránek v sitemapě; přesměrování a 404 do ní nepatří.
- Jednotné canonical, `hreflang` cs/en/x-default a adresy strukturovaných dat pro innohub.cz.
- Propojený graf Organization, WebSite, WebPage/ContactPage a BreadcrumbList.
- Metadata pro vyhledávání a sdílení (Open Graph, Twitter); sjednocené kontaktní popisy.
- Jeden hlavní H1 na každé obsahové stránce. U služeb mají jednotlivé části H2.
- Skutečné kotvy služeb, fungující přímé odkazy i při vypnutém JavaScriptu.
- Progresivně doplněné ARIA záložky: klávesnice, správný výběr, historie prohlížeče.
- 17 obrázků má WebP varianty; fotografie 360/720/1080 px dle původního rozlišení,
  bez zvětšování malých podkladů. PNG/JPEG zůstávají ve `<picture>` jako fallback.
- Součet největších WebP variant: 718 620 B místo 2 026 600 B původních souborů,
  přibližně o 65 % méně. Není to měření LCP ani celkového síťového přenosu stránky.
- Hlavní fotografie se načítá přednostně, ostatní postupně. Rozměry obrázků zůstávají
  vyhrazené v HTML. Popisy obrázků jsou konkrétní, nikoli seznam klíčových slov.
- Dekorativní loga s již popsaným odkazem mají správně prázdný alt.
- Loga CIH a TC Runway se načítají místně, bez závislosti na dostupnosti cizích serverů.
- Revize CSS/JS v adresách odráží obsah souboru a brání používání staré kopie z cache.
- 404 používá základní adresu, aby se styly a odkazy nerozbily na neexistující vnořené cestě.

## Indexace je nyní VYPNUTÁ

Všechny HTML stránky včetně aliasů obsahují `noindex,follow`. `robots.txt` povoluje
načtení stránky, aby robot mohl pravidlo noindex vůbec přečíst. Samotné `Disallow: /`
není spolehlivým zákazem zařazení URL do výsledků vyhledávání.
Viz [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

`sitemap.xml` je připravena pro innohub.cz. Nyní ji nepředkládat k indexaci.
Nebyly měněny DNS, nastavení vlastní domény v GitHub Pages ani Search Console.

## Spuštění na doméně — provést až po připojení innohub.cz

1. Ověřit vlastnictví domény. V GitHub Settings → Pages nastavit vlastní doménu,
   poté nastavit odpovídající DNS u registrátora a zapnout HTTPS, jakmile je dostupné.
   Použít jednu hlavní variantu `https://innohub.cz/`; www a HTTP mají na ni přesměrovat.
   Aktuální postup: [GitHub Pages – vlastní doména](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
2. Ověřit platný HTTPS certifikát, domovskou stránku, hlavní podstránky, obrázky,
   mobilní zobrazení, přesměrování starých cest a skutečný HTTP stav 404 u chybné cesty.
3. Ověřit, že canonical, jazykové alternativy a sitemap ukazují na funkční innohub.cz.
4. **Pouze v produkční kopii pro innohub.cz** spustit:

   ```text
   python tools/prepare_site.py --enable-indexing --confirm-live-domain innohub.cz
   python tools/check_site.py --indexing on
   ```

   Tyto příkazy samy nic nenahrávají. Výsledek je nutné nasadit do produkce.
   Samotné `--enable-indexing` bez potvrzení domény skončí chybou.
   404 a přesměrování zůstávají noindex i v produkci.
5. V živé odpovědi z innohub.cz zkontrolovat odstranění noindex z obsahových stránek
   a případnou nepřítomnost blokujícího `X-Robots-Tag` HTTP headeru od hostingu.
6. V Google Search Console ověřit doménovou službu, odeslat
   `https://innohub.cz/sitemap.xml` a použít kontrolu URL. Následně sledovat indexaci,
   chybné stránky a Core Web Vitals. Sitemap nezaručuje okamžité zaindexování.

**Náhled v Sites má zůstat noindex.** Po aktivaci na doméně nepřepsat produkci
náhledovým exportem bez opětovného provedení produkčního kroku výše.

## Běžná údržba

Po úpravě existujícího schváleného HTML nebo použití zaměřeného generátoru Novinek:

```text
python tools/prepare_site.py
python tools/check_site.py
```

Výchozí příprava vždy zachová noindex. Nespouštět starý `generate.py`: neobsahuje
pozdější schválené obsahové a grafické úpravy. Nástroje fungují v projektu s `dist/`
i v GitHub checkoutu s webem přímo v kořeni. Pro práci s obrázky je potřeba Python
a Pillow; prohlížeč webu nepotřebuje žádné nové JavaScriptové knihovny.

## Klíčová témata pro budoucí obsah

| Stránka | Hlavní téma | Související témata |
|---|---|---|
| Úvod | komercializace výzkumu, rozvoj inovací | transfer technologií, inovační podnikání |
| Služby | podpora inovací pro firmy a výzkumné týmy | analýza trhu, validace, financování, startupy |
| Naše projekty | technologická spolupráce | ESA Technology Broker, kosmické aplikace, ELIgnite, TC Runway |
| Reference | výsledky podpory inovací | aplikace technologií, akcelerace startupů, tržní potenciál |
| Novinky | projekty a příležitosti INNOHUB | akce, výzkum a podnikání |
| Tým | odborníci na transfer technologií | technologická a obchodní expertiza |
| Kontakt | kontakt TC Business Innovation Hub | konzultace inovací, INNOHUB Praha |

Témata používat přirozeně v titulcích, textu a popisech. Nepřidávat hromadný
seznam do altů. Google značku `meta keywords` nepoužívá:
[Podporované meta značky](https://developers.google.com/search/docs/crawling-indexing/special-tags).

## Ověření a praktická omezení

- Statická kontrola místních odkazů, kotev, ID, popisů a rozměrů všech 79 obrázků,
  canonical/hreflang, sitemap, H1 a JSON-LD.
- Kontrola JavaScriptu; v prohlížeči služby přes hash, klávesnici a historii,
  rozbalování a posun Novinek, fotografie Referencí a zobrazení bez JavaScriptu.
- Responzivní rozložení ověřeno i v testovacím rámu o šířce telefonu a tabletu.
- Spuštění indexace nacvičeno na oddělené místní kopii; živý náhled zůstal noindex.
- Schválené texty nebyly redakčně měněny. Nepřidány příběhy z neschválené v1.1.
- Skutečné doručení kontaktního formuláře nebylo testováno odesláním e-mailu.
  Před ostrým spuštěním provést kontrolní odeslání a ověřit příjem v innohub@tc.cz
  včetně případné aktivace služby FormSubmit.
- Nejde o měření reálných Core Web Vitals. LCP/INP/CLS a odezvu produkčního hostingu
  vyhodnotit po spuštění na konečné doméně, ideálně i na skutečném telefonu.

Pro optimalizaci obrázků byly použity původní podklady webu, bez změny jejich obsahu.
Místní loga převzata z oficiálních zdrojů MUNI/CIH a TC Runway, používaných již dříve.
