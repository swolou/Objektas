# Elektros Objektai

Mobiliesiems pritaikyta aplikacija elektrikams, skirta registruoti darbo objektus ir naudojamas medžiagas.

## Funkcijos
- Objektų pridėjimas / redagavimas / šalinimas
- Kiekvienam objektui galima pridėti medžiagas (pavadinimas, kiekis, vienetas, kaina)
- Automatinis medžiagų kainos skaičiavimas
- Objekto statusai: Naujas, Vykdomas, Užbaigtas
- Kliento kontaktai (vardas, telefonas su skambinimo nuoroda)
- Duomenys saugomi naršyklės localStorage

## Technologijos
- Vanilla HTML/CSS/JS
- Vite (dev server, port 5000)
- localStorage duomenų saugojimui
- Mobiliam dizainui pritaikytas (max-width: 480px)

## Failų struktūra
- `index.html` — pagrindinis HTML failas
- `style.css` — stiliai (mobile-first)
- `script.js` — visa aplikacijos logika
- `vite.config.js` — Vite konfigūracija
