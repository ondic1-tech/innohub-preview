# INNOHUB – náhled webu

Návrh webových stránek TC Business Innovation Hub,
specializovaného pracoviště Technologického centra Praha.

Web obsahuje českou a anglickou verzi, prezentaci pěti služeb,
programy, reference, informace o INNOHUB a kontakt.

Tento repozitář slouží k publikování náhledu přes GitHub Pages.

Aktuální režim: **veřejný náhled, všechny HTML stránky mají `noindex,follow`**.
Zákaz indexace neomezuje přístup návštěvníků. Produkční doména je
`https://innohub.cz/`; nový web zatím není schválený k ostrému spuštění.
Kontaktní formulář zůstává v obou jazykových verzích podle potvrzení zadavatele.

Předprodukční opravy jsou oddělené ve větvi `prelaunch-audit-fixes`.
Postup a otevřené podmínky: [stav plánu](docs/PRELAUNCH-STATUS.md).

Samostatný balíček náhledu bez údržbových zdrojů připravíte příkazem:

```text
node tools/build_release.cjs --output-dir ../innohub-staging-NEW
node --test tools/build_release.test.cjs
```

Výstup musí být nový adresář mimo zdrojovou kopii. Skript nic nepublikuje,
nemění DNS a neaktivuje indexaci v repozitáři. Vedle výstupu uloží manifest
souborů s kontrolními součty. Produkční postup je v [SEO-README](SEO-README.md).
