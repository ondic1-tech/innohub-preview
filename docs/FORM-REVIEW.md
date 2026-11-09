# Kontaktní formulář: průběžné ověření

Stav 8. 11. 2026. Formulář podle potvrzení zadavatele zůstává v CZ i EN.

**Aktualizace živého ověření:** jeden výslovně schválený technický pokus potvrdil
neprovedenou aktivaci u poskytovatele. Viz [diagnóza](FORM-ACTIVATION-DIAGNOSIS.md).
Aktivace a skutečné doručení zůstávají otevřené.

## Ověřeno v kódu a izolovaných testech

- Obě stránky posílají na FormSubmit pro innohub@tc.cz; JavaScript používá AJAX
  endpoint stejného poskytovatele. Povinné jsou jméno, příjmení, e-mail a zpráva;
  telefon je nepovinný. Jméno/příjmení/e-mail/telefon mají limit 150 znaků,
  zpráva 5 000 znaků. Pole mají popisky a formulář přímý e-mailový kontakt.
- 22 offline testů aplikace (11 pro každý jazyk) prošlo: přijetí úspěšné odpovědi,
  neplatný vstup, honeypot, dvojité odeslání, chyba HTTP, zamítnutí poskytovatelem,
  požadavek aktivace včetně skutečného formátu odpovědi, neplatné JSON, výpadek sítě a timeout.
- Chyby zachovají vstup, obnoví tlačítko a zruší stav aria-busy. Oprava přesune
  focus na stavovou zprávu také při chybě. Výsledek od služby se nevkládá jako HTML.
- Při odeslání se neposílá query string aktuální stránky (ověřeno testem).
  Kód neukládá formulář do localStorage/sessionStorage ani nevypisuje obsah do konzole.
- Honeypot je pouze pomocná ochrana; neprokazuje serverové omezení frekvence ani
  odolnost vůči přímému odesílání na cizí endpoint.
- Při vypnutém JavaScriptu nynější noscript styl skryje vstupní pole a tlačítko;
  přímé e-mailové a telefonní kontakty jsou v HTML zachovány. Nejde o plnohodnotné
  odeslání formuláře bez JavaScriptu; tuto podobu ještě prakticky ověřit v prohlížeči.

Testy používají simulované odpovědi, nic neodesílají poskytovateli a **neprokazují
aktivaci cílové schránky, antispam poskytovatele ani skutečné doručení e-mailu**.

## Podklady pro odpovědnou osobu

Zpracovávají se jméno, příjmení, e-mail, případně telefon a obsah zprávy. Data při
odeslání přecházejí přes FormSubmit do cílové schránky. Ve zkontrolovaném HTML
nejsou externě vložené obrázky, skripty ani iframe; externí servis je využit při odeslání.

Oficiální [zásady FormSubmit](https://formsubmit.co/privacy.pdf), označené datem
účinnosti 17. 1. 2019, popisují zpracování informací za účelem poskytnutí služby.
Z tohoto dokumentu nelze potvrdit konkrétní umístění zpracování, dobu uchování,
zpracovatelskou smlouvu nebo všechny podmínky přenosů. Právní/smluvní vhodnost
pro instituci musí potvrdit její odpovědná osoba; samotný technický test ji neuzavírá.

Před ostrým spuštěním vyřešit schválení poskytovatele a informační povinnost,
včetně odpovídajícího textu nebo odkazu u formuláře. Schválené institucionální
informace nebyly dodány, proto je kód nenahrazuje vymyšlenými zásadami.

## Zbývající praktické ověření

1. Potvrdit vhodnost poskytovatele; případně zachovat stejný formulář a napojit
   schválené řešení na hostingu (samostatné rozhodnutí, dosud neprovedeno).
2. Po schválení služby odeslat jednoznačně označenou testovací zprávu z CZ i EN
   a ověřit skutečný příjem v innohub@tc.cz, případnou aktivaci, spam a odpověď.
3. Ověřit skutečné chování při blokaci služby, výpadku a bez JavaScriptu v prohlížeči.
4. Potvrdit serverové limity, antispam, přístup k logům a nezapisování obsahu zpráv
   do analytiky; honeypot a klientské maxlength tyto body nenahrazují.

Podklady: [dokumentace AJAX](https://formsubmit.co/ajax-documentation),
[aktivace schránky](https://formsubmit.co/), [zásady](https://formsubmit.co/privacy.pdf).
