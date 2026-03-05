# Elektros Objektai

Mobiliesiems pritaikyta React aplikacija elektrikams, skirta registruoti darbo objektus ir naudojamas medžiagas.

## Funkcijos
- Objektų pridėjimas / redagavimas / šalinimas
- Kiekvienam objektui galima pridėti medžiagas (pavadinimas, kiekis, vienetas, kaina)
- Automatinis medžiagų kainos skaičiavimas
- Objekto statusai: Naujas, Vykdomas, Užbaigtas
- Kliento kontaktai (vardas, telefonas su skambinimo nuoroda)
- Duomenys saugomi naršyklės localStorage

## Technologijos
- React 19
- Vite (dev server, port 5000)
- localStorage duomenų saugojimui
- Mobiliam dizainui pritaikytas (max-width: 480px)

## Failų struktūra
- `index.html` — pagrindinis HTML failas
- `src/main.jsx` — React entry point
- `src/App.jsx` — pagrindinė App logika ir navigacija
- `src/index.css` — visi stiliai
- `src/utils.js` — pagalbinės funkcijos (formatDate, formatCurrency, generateId)
- `src/hooks/useLocalStorage.js` — localStorage hook
- `src/components/ObjectsList.jsx` — objektų sąrašo komponentas
- `src/components/ObjectForm.jsx` — objekto kūrimo/redagavimo forma
- `src/components/ObjectDetail.jsx` — objekto detalės ir medžiagų sąrašas
- `src/components/MaterialForm.jsx` — medžiagos pridėjimo forma
- `src/components/ConfirmModal.jsx` — patvirtinimo modalas
- `vite.config.js` — Vite + React konfigūracija
