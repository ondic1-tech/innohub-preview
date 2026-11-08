# Zadání pro správce hostingu: DNS, HTTPS a připravenost nového INNOHUB

Ostré nasazení schvaluje **Ondřej Šimek**. Správcem DNS a HTTPS je správce hostingu.
Toto je technické zadání k přípravě, nikoliv pokyn k okamžitému přepsání živého webu.
Kanonická adresa nového webu: **https://innohub.cz/**, bez www.

## Aktuálně ověřeno 8. 11. 2026

Měření se týká dosavadního webu, ne ještě nenasazeného nového kandidáta.

| Oblast | Výsledek |
|---|---|
| DNS A pro innohub.cz i www.innohub.cz | 37.9.175.165 |
| DNS AAAA pro obě varianty | 2a00:4b40:aaaa:2005::6 |
| Autoritativní NS | ns1.websupport.cz, ns2.websupport.cz, ns3.websupport.eu |
| HTTP a www | Kořenové adresy přesměrovávají 301 na https://innohub.cz/ |
| Certifikát | Důvěryhodný Let's Encrypt, pokrývá innohub.cz a *.innohub.cz |
| Platnost certifikátu | Do 31. 1. 2027 07:55:56 UTC; ověření obou názvů prošlo |
| TLS | V obou měřených spojeních vyjednáno TLS 1.3 |
| Hlavičky na HTTPS úvodu | Chybí HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy a X-Frame-Options |

## 1. DNS — zachovat, pokud zůstane stejný hosting

- Potvrdit, že nový statický web poběží na uvedeném IPv4 i IPv6 serveru. Pokud ano,
  **není důvod měnit A/AAAA ani nameservery pouze kvůli výměně webu**.
- Ověřit skutečné načtení nové verze přes IPv4 i IPv6, včetně certifikátu. Samotná
  existence AAAA záznamu funkčnost IPv6 nedokazuje. Pokud se cílový server mění,
  aktualizovat odpovídající A i AAAA současně podle skutečné konfigurace hostingu.
- Zachovat nastavení e-mailu: MX a související SPF, DKIM, DMARC, autodiscover,
  autoconfig a mailové subdomény. Webová změna je nemá přesměrovat na nový webroot.
- Zachovat funkční ACME/DNS ověřování certifikátu. Neměnit plošně wildcard DNS,
  mazat ověřovací TXT ani přidávat omezení CAA bez ověření dopadu na obnovování.
- Pokud je nutná změna DNS, dodat přesný seznam změn, původní hodnoty pro návrat,
  TTL a termín provedení ke schválení. Bez změny cíle není potřeba snižovat TTL.

## 2. HTTPS — potvrdit obnovování a zachovat přesměrování

- Potvrdit automatické obnovování certifikátu, funkční ověřovací mechanismus,
  dohled nad chybou obnovy a odpovědnou kontaktní osobu. Nynější certifikát je platný;
  není nutné kupovat nový jen kvůli změně obsahu.
- Zachovat platný certifikát i pro **www**, aby TLS proběhlo ještě před přesměrováním.
- Na obou adresách podporovat alespoň TLS 1.2/1.3; ověřit vypnutí TLS 1.0/1.1.
  Vyjednání TLS 1.3 při našem testu samo neprokazuje zákaz starších protokolů.
- Zachovat 301/308 přesměrování všech variant HTTP/www na HTTPS bez www,
  **se zachováním celé cesty a query stringu**, bez smyček a zbytečných mezikroků.
  Ověřit i například `/en/services/?test=1`, nejen úvod.
- Po ověření nového webu přidat na HTTPS odpovědi HSTS nejprve s krátkým
  `max-age=300`; po úspěšném ověření a domluvě zvýšit např. na `31536000`.
  Pro začátek **bez includeSubDomains a bez preload**: doména má další služby,
  jejichž HTTPS připravenost nebyla auditována.

## 3. Bezpečnostní HTTP hlavičky — doplnit na cílovém serveru

Použít konfiguraci odpovídající skutečnému webserveru/reverzní proxy; neaplikovat
naslepo Apache .htaccess na jiný server. Ověřit hlavičky i u skutečných chyb 404.

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
```

CSP připravit a nejprve ověřit v režimu `Content-Security-Policy-Report-Only`, poté
po bezchybném testu vynucovat. Má zahrnovat `object-src 'none'`, `base-uri 'self'`
a `frame-ancestors 'none'`; skripty, styly, obrázky a písma jsou místní.
**Formulář musí zůstat funkční**: aktuálně potřebuje `connect-src` pro
`https://formsubmit.co` a odpovídající `form-action`. Přímé odkazy na LinkedIn,
TC a jiné projekty nejsou vložené skripty či rámy a nevyžadují otevření těchto domén
pro všechny zdroje. U inline skriptu chybové stránky je potřeba odpovídající hash
nebo přesunutí do místního souboru; nespoléhat na plošné povolení inline JavaScriptu.
Podrobnou CSP otestovat také na službách, novinkách, formuláři a vnořené 404.

## 4. Nasazení a návrat

- Připravit testovací kopii na stejném hostingu se stejnými pravidly HTTPS,
  hlaviček a obsluhy URL; ponechat noindex. GitHub může zůstat veřejným náhledem,
  ale sám nepotvrdí konfiguraci produkčního serveru.
- Ověřit indexové soubory adresářů a skutečný HTTP status 404 pro neexistující cestu.
  Nepřesměrovávat všechny neexistující adresy na úvod s HTTP 200.
- Před přepisem zálohovat současný web i serverovou konfiguraci mimo veřejný webroot
  a nacvičit obnovu. Uchovat schválený release SHA a manifest kontrolních součtů.
- Nasazovat pouze schválený webový balíček. Indexaci 34 obsahových stránek zapnout
  až při schváleném ostrém spuštění; 404 a aliasy dále noindex. Ověřit, že produkce
  nemá blokující globální `X-Robots-Tag: noindex`.
- Ověřit gzip/Brotli a invalidaci cache. HTML nesmí po nasazení dlouhodobě ukazovat
  na starou verzi; u verzovaných CSS/JS musí cache rozlišovat query parametr `v`.

## Co prosíme vrátit

Potvrzení cílového hostingu, případných konkrétních změn DNS, automatické obnovy
certifikátu, testovací adresu, výsledné hlavičky, výsledky přesměrování a ověření
IPv4/IPv6 a postup obnovy. **Ostré nasazení provést až po schválení Ondřejem Šimkem.**

Technické podklady: [HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security),
[CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy),
[form-action](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action).
