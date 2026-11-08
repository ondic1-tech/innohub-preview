# Potvrzená překážka odesílání: neaktivovaný FormSubmit

8. 11. 2026 zadavatel nahlásil chybu odesílání na veřejném GitHub náhledu.
Po jeho výslovném souhlasu byl proveden **právě jeden skutečný technický POST**
na aktuální AJAX endpoint FormSubmit pro innohub@tc.cz. Použity smyšlené testovací
údaje bez telefonu; původní vyplněný formulář uživatele zůstal beze změny.

## Výsledek

- HTTP 200, ale aplikační výsledek `success: "false"`.
- Zpráva služby začíná `This form needs Activation.` a oznamuje odeslání
  e-mailu s odkazem **Activate Form** příjemci.
- Odpověď obsahuje Access-Control-Allow-Origin `*`. Test proběhl přímým API
  požadavkem s kontextem náhledu; není to důkaz úspěšného CORS průchodu v každém
  konkrétním prohlížeči. Neprovedená aktivace je však potvrzená překážka na straně služby.
- Nebyla potvrzena aktivace, přijetí aktivačního e-mailu ani doručení běžné zprávy.
  Služba pouze oznámila, že aktivační e-mail poslala. V připojené schránce
  simek@tc.cz nebyla aktivační zpráva při cíleném hledání nalezena; to nevypovídá
  o obsahu samostatné schránky innohub@tc.cz.

## Potřebný krok příjemce

Ve schránce **innohub@tc.cz** zkontrolovat doručenou poštu, spam a případnou
karanténu; u odpovídající zprávy FormSubmit potvrdit **Activate Form** pro tento
náhled. Poté prakticky ověřit úspěšné odeslání a přijetí ve schránce. Při nasazení
na jinou doménu ověřit aktivaci i pro produkční formulář.

Podle [oficiální nápovědy](https://formsubmit.co/help) je aktivace nutná a její
neprovedení může vyvolávat další aktivační e-maily. Diagnostický pokus nebyl opakován.
Aktivační odkazy a tokeny se neukládají do veřejného repozitáře.

## Oprava diagnostiky v kódu

Starý kód kontroloval `success` dříve než zprávu o aktivaci. Skutečná odpověď se
tak vždy změnila na obecné selhání. Nový kód rozlišuje neprovedenou aktivaci před
obecnou validací výsledku a zobrazí lokalizovaný text, že formulář ještě není
zprovozněný, včetně přímého kontaktu. Vstup zůstává zachován a chyba je zaměřena.

Přidány dva testy skutečného formátu odpovědi (CZ/EN); celkem prošlo 27 offline
testů formuláře a sestavení. Tyto testy **nenahrazují skutečnou aktivaci a doručení**.
Oprava je součástí pracovní větve; veřejný main se tímto sám nemění.
